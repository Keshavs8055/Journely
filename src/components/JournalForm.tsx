'use client';

import { createJournalEntry } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SubmitButton } from './SubmitButton';
import { useSession } from './SessionProvider';
import { encryptContent } from '@/lib/crypto';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const DRAFT_KEY = 'journalDraft';

export function JournalForm() {
  const { user } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const { title, content } = JSON.parse(savedDraft);
        setTitle(title || '');
        setContent(content || '');
      }
    } catch (error) {
      console.error("Could not load draft from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      const draft = JSON.stringify({ title, content });
      localStorage.setItem(DRAFT_KEY, draft);
    } catch (error) {
      console.error("Could not save draft to localStorage", error);
    }
  }, [title, content]);

  const createJournalEntryWithEncryption = async (formData: FormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an entry.",
        variant: "destructive"
      });
      return;
    }

    const currentContent = formData.get('content') as string;
    if (!currentContent.trim()) {
      toast({
        title: "Error",
        description: "Entry content cannot be empty.",
        variant: "destructive"
      });
      return;
    }
    
    const encryptedContent = await encryptContent(currentContent, user.uid);
    
    formData.set('content', encryptedContent);
    formData.append('userId', user.uid);
    formData.append('type', 'journal');
    
    const result = await createJournalEntry(formData);
    
    if (result.success) {
        // Clear draft on successful submission
        setTitle('');
        setContent('');
        formRef.current?.reset();
        localStorage.removeItem(DRAFT_KEY);
        toast({
            title: "Success!",
            description: "Your journal entry has been saved.",
        });
        router.push('/');
    } else {
        toast({
            title: "Error",
            description: result.error || "Failed to save your entry. Please try again.",
            variant: "destructive"
        });
    }
  };
  
  return (
    <form ref={formRef} action={createJournalEntryWithEncryption} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          name="title" 
          placeholder="What's on your mind?" 
          required 
          className="text-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          The title is not encrypted and will be used by our AI to generate personalized reflection prompts for you.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Today's Entry</Label>
        <Textarea 
          id="content" 
          name="content" 
          placeholder="Tell me about your day..." 
          required 
          rows={15}
          className="text-base"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          The content of your entry is end-to-end encrypted for your privacy.
        </p>
      </div>
      <SubmitButton />
    </form>
  );
}
