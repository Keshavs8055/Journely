'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSession } from './SessionProvider';
import { encryptContent } from '@/lib/crypto';
import { useToast } from '@/hooks/use-toast';
import { addEntry } from '@/lib/data';
import { Loader2 } from 'lucide-react';

const DRAFT_KEY = 'journalDraft';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  content: z.string().min(1, 'Content cannot be empty.'),
});

type FormData = z.infer<typeof formSchema>;

export function JournalForm() {
  const { user } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const { title, content } = JSON.parse(savedDraft);
        form.reset({ title: title || '', content: content || '' });
      }
    } catch (error) {
      console.error("Could not load draft from localStorage", error);
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        const draft = JSON.stringify(value);
        localStorage.setItem(DRAFT_KEY, draft);
      } catch (error) {
        console.error("Could not save draft to localStorage", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create an entry.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const encryptedContent = await encryptContent(data.content, user.uid);
      const newEntry = {
        date: new Date(),
        title: data.title,
        content: encryptedContent,
        type: 'journal' as const,
      };

      await addEntry(user.uid, newEntry);
      
      localStorage.removeItem(DRAFT_KEY);
      toast({
        title: "Success!",
        description: "Your journal entry has been saved.",
      });
      router.push('/');
      router.refresh(); // Refresh server components
    } catch (error) {
      console.error("Failed to create entry:", error);
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="What's on your mind?" className="text-lg" {...field} />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                The title is not encrypted and will be used by our AI to generate personalized reflection prompts for you.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Today's Entry</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell me about your day..." rows={15} className="text-base" {...field} />
              </FormControl>
               <p className="text-sm text-muted-foreground">
                The content of your entry is end-to-end encrypted for your privacy.
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
            'Save Entry'
          )}
        </Button>
      </form>
    </Form>
  );
}
