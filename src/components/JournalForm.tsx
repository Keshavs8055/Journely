import { createJournalEntry, updateJournalEntry } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SubmitButton } from './SubmitButton';
import type { JournalEntry } from '@/lib/types';

interface JournalFormProps {
    entry?: JournalEntry;
}

export function JournalForm({ entry }: JournalFormProps) {
  const action = entry ? updateJournalEntry : createJournalEntry;
  return (
    <form action={action} className="space-y-4">
      {entry && <input type="hidden" name="id" value={entry.id} />}
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
        <Textarea 
          id="content" 
          name="content" 
          placeholder="Tell me about your day..." 
          required 
          rows={15}
          className="text-base"
          defaultValue={entry?.content}
        />
      </div>
      <SubmitButton />
    </form>
  );
}
