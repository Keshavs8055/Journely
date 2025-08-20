'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSession } from './SessionProvider';
import { encryptContent } from '@/lib/crypto';
import { useToast } from '@/hooks/use-toast';
import { addEntry } from '@/lib/data';
import { Loader2 } from 'lucide-react';

const DRAFT_KEY = 'reflectionDraft';

const formSchema = z.object({
  content: z.string().min(1, 'Reflection content cannot be empty.'),
});

type FormData = z.infer<typeof formSchema>;

interface DailyReflectionFormProps {
  prompt: string | null;
  onReflectionSubmit: () => void;
}

export function DailyReflectionForm({ prompt, onReflectionSubmit }: DailyReflectionFormProps) {
  const { user } = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        form.reset({ content: JSON.parse(savedDraft) });
      }
    } catch (error) {
      console.error("Could not load reflection draft", error);
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(value.content));
      } catch (error) {
        console.error("Could not save reflection draft", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save a reflection.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const encryptedContent = await encryptContent(data.content, user.uid);
      const newEntry = {
        date: new Date(),
        title: prompt || 'Daily Reflection',
        content: encryptedContent,
        type: 'reflection' as const,
      };

      await addEntry(user.uid, newEntry);
      
      localStorage.removeItem(DRAFT_KEY);
      form.reset({ content: '' });
      onReflectionSubmit();
    } catch (error) {
      console.error("Failed to save reflection:", error);
      toast({
        title: "Error",
        description: "Failed to save your reflection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{prompt || "What's on your mind today?"}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your reflection here..."
                  rows={5}
                  className="text-base bg-background/50"
                  {...field}
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                Your reflection is end-to-end encrypted for your privacy.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Reflection'
          )}
        </Button>
      </form>
    </Form>
  );
}
