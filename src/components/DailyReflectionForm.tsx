'use client';

import { createJournalEntry } from '@/lib/actions';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from './SubmitButton';
import { useSession } from './SessionProvider';
import { encryptContent } from '@/lib/crypto';
import { Label } from './ui/label';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

const DRAFT_KEY = 'reflectionDraft';

interface DailyReflectionFormProps {
    prompt: string | null;
    onReflectionSubmit: () => void;
}

export function DailyReflectionForm({ prompt, onReflectionSubmit }: DailyReflectionFormProps) {
  const { user } = useSession();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        setContent(JSON.parse(savedDraft));
      }
    } catch (error) {
      console.error("Could not load reflection draft", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(content));
    } catch (error) {
       console.error("Could not save reflection draft", error);
    }
  }, [content]);

  const createReflectionEntry = async (formData: FormData) => {
    if (!user) {
        toast({
            title: "Error",
            description: "You must be logged in to save a reflection.",
            variant: "destructive"
        });
        return;
    }
    const currentContent = formData.get('content') as string;

    if (!currentContent.trim()) {
        toast({
            title: "Error",
            description: "Reflection content cannot be empty.",
            variant: "destructive"
        });
        return;
    }

    const encryptedContent = await encryptContent(currentContent, user.uid);
    
    formData.set('content', encryptedContent);
    formData.append('userId', user.uid);
    formData.append('type', 'reflection');
    
    try {
        await createJournalEntry(formData);
        // Reset the form and clear draft after successful submission
        setContent('');
        formRef.current?.reset();
        localStorage.removeItem(DRAFT_KEY);
        onReflectionSubmit(); // Notify parent that submission was successful
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to save your reflection. Please try again.",
            variant: "destructive"
        });
    }
  };
  
  return (
    <form ref={formRef} id="reflection-form" action={createReflectionEntry} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">{prompt}</Label>
        <Textarea 
          id="content" 
          name="content" 
          placeholder="Write your reflection here..." 
          required 
          rows={5}
          className="text-base bg-background/50"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
         <p className="text-sm text-muted-foreground">
          Your reflection is end-to-end encrypted for your privacy.
        </p>
      </div>
      <SubmitButton />
    </form>
  );
}
