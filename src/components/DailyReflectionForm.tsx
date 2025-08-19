'use client';

import { createJournalEntry } from '@/lib/actions';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from './SubmitButton';
import { useSession } from './SessionProvider';
import { encryptContent } from '@/lib/crypto';
import { Label } from './ui/label';

interface DailyReflectionFormProps {
    prompt: string | null;
}

export function DailyReflectionForm({ prompt }: DailyReflectionFormProps) {
  const { user } = useSession();

  const createReflectionEntry = async (formData: FormData) => {
    if (!user) {
        console.error("No user found");
        return;
    }
    const content = formData.get('content') as string;

    if (!content.trim()) {
        // Simple validation to prevent empty submissions
        return;
    }

    const encryptedContent = await encryptContent(content, user.uid);
    
    formData.set('content', encryptedContent);
    formData.append('userId', user.uid);
    formData.append('type', 'reflection');
    
    await createJournalEntry(formData);

    // Reset the form after submission
    const form = document.getElementById('reflection-form') as HTMLFormElement;
    form?.reset();
  };
  
  return (
    <form id="reflection-form" action={createReflectionEntry} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">{prompt}</Label>
        <Textarea 
          id="content" 
          name="content" 
          placeholder="Write your reflection here..." 
          required 
          rows={5}
          className="text-base bg-background/50"
        />
         <p className="text-sm text-muted-foreground">
          Your reflection is end-to-end encrypted for your privacy.
        </p>
      </div>
      <SubmitButton />
    </form>
  );
}
