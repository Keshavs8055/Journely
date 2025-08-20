'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSession } from './SessionProvider';
import { decryptContent, encryptContent } from '@/lib/crypto';
import { useToast } from '@/hooks/use-toast';
import { updateEntry } from '@/lib/data';
import type { JournalEntry } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  content: z.string().min(1, 'Content cannot be empty.'),
});

type FormData = z.infer<typeof formSchema>;

interface EditJournalFormProps {
  entry: JournalEntry;
}

export function EditJournalForm({ entry }: EditJournalFormProps) {
  const { user } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: entry.title,
      content: '',
    },
  });

  useEffect(() => {
    const decrypt = async () => {
      if (user && entry.content) {
        try {
          setIsDecrypting(true);
          const text = await decryptContent(entry.content, user.uid);
          form.setValue('content', text);
        } catch (error) {
          console.error("Failed to decrypt content for editing", error);
          toast({
            title: "Decryption Error",
            description: "Could not load entry content.",
            variant: "destructive",
          });
          form.setValue('content', "Error: Could not load content.");
        } finally {
          setIsDecrypting(false);
        }
      }
    };
    decrypt();
  }, [entry.content, user, form, toast]);

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update an entry.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const encryptedContent = await encryptContent(data.content, user.uid);
      const updatedData = {
        title: data.title,
        content: encryptedContent,
      };

      await updateEntry(user.uid, entry.id, updatedData);
      
      toast({
        title: "Success!",
        description: "Your journal entry has been updated.",
      });
      router.push(`/entry/${entry.id}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to update entry:", error);
      toast({
        title: "Update Error",
        description: "Failed to save your changes. Please try again.",
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
                {isDecrypting ? (
                  <div className="flex items-center justify-center p-8 rounded-md border min-h-[300px]">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  <Textarea
                    placeholder="Tell me about your day..."
                    rows={15}
                    className="text-base"
                    {...field}
                  />
                )}
              </FormControl>
              <p className="text-sm text-muted-foreground">
                The content of your entry is end-to-end encrypted for your privacy.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || isDecrypting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>
    </Form>
  );
}
