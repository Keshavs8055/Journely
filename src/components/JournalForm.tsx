'use client';

import { createJournalEntry } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SubmitButton } from './SubmitButton';
import { useSession } from './SessionProvider';
import { encryptContent } from '@/lib/crypto';

export function JournalForm() {
  const { user } = useSession();

  const createJournalEntryWithEncryption = async (formData: FormData) => {
    if (!user) {
        // In a real app, you'd want better error handling here.
        console.error("No user found");
        return;
    }
    const content = formData.get('content') as string;
    const encryptedContent = await encryptContent(content, user.uid);
    
    // Replace original content with encrypted content
    formData.set('content', encryptedContent);
    // Add userId to the form data
    formData.append('userId', user.uid);
    
    await createJournalEntry(formData);
  };
  
  return (
    <form action={createJournalEntryWithEncryption} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          name="title" 
          placeholder="What's on your mind?" 
          required 
          className="text-lg"
        />
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
        />
      </div>
      <SubmitButton />
    </form>
  );
}
