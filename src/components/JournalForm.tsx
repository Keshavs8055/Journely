import { createJournalEntry } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SubmitButton } from './SubmitButton';

export function JournalForm() {
  return (
    <form action={createJournalEntry} className="space-y-4">
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
