'use client';

import { updateJournalEntry } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SubmitButton } from './SubmitButton';
import type { JournalEntry } from '@/lib/types';
import { useSession } from './SessionProvider';
import { decryptContent, encryptContent } from '@/lib/crypto';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface EditJournalFormProps {
    entry: JournalEntry;
}

export function EditJournalForm({ entry }: EditJournalFormProps) {
  const { user } = useSession();
  const [decryptedContent, setDecryptedContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const decrypt = async () => {
      if (user && entry.content) {
        try {
          const text = await decryptContent(entry.content, user.uid);
          setDecryptedContent(text);
        } catch (error) {
          console.error("Failed to decrypt content for editing", error);
          setDecryptedContent("Error: Could not load content.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    decrypt();
  }, [entry.content, user]);
  
  const updateJournalEntryWithEncryption = async (formData: FormData) => {
    if (!user) {
        // Handle not logged in case
        return;
    }
    const content = formData.get('content') as string;
    const encryptedContent = await encryptContent(content, user.uid);
    formData.set('content', encryptedContent);
    formData.append('userId', user.uid);

    await updateJournalEntry(formData);
  };

  return (
    <form action={updateJournalEntryWithEncryption} className="space-y-4">
      <input type="hidden" name="id" value={entry.id} />
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          name="title" 
          placeholder="What's on your mind?" 
          required 
          className="text-lg"
          defaultValue={entry?.title}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Today's Entry</Label>
        {isLoading ? (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin" />
            </div>
        ) : (
            <Textarea 
                id="content" 
                name="content" 
                placeholder="Tell me about your day..." 
                required 
                rows={15}
                className="text-base"
                defaultValue={decryptedContent}
                key={decryptedContent} // Re-mount component when content is decrypted
            />
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
