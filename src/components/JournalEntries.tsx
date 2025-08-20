'use client';

import { useState, useTransition } from 'react';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteMultipleEntries } from '@/lib/actions';
import type { JournalEntry } from '@/lib/types';
import { useSession } from './SessionProvider';
import { useToast } from '@/hooks/use-toast';

interface JournalEntriesProps {
    entries: JournalEntry[];
    onEntriesChange: () => void;
}

export function JournalEntries({ entries, onEntriesChange }: JournalEntriesProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const { user } = useSession();
  const { toast } = useToast();
  
  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const selected = formData.getAll('entryIds') as string[];
    setSelectedEntries(selected);
  };
  
  const hasSelectedEntries = selectedEntries.length > 0;

  const handleSubmit = (formData: FormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete entries.",
        variant: "destructive"
      });
      return;
    }
    formData.append('userId', user.uid);
    startTransition(async () => {
        const result = await deleteMultipleEntries(formData);
        if (result.success) {
            onEntriesChange(); // Refresh entries on parent
            setSelectedEntries([]);
            // Reset checkboxes state visually by resetting the form
            const form = document.querySelector('form[name="journal-entries-form"]');
            if (form instanceof HTMLFormElement) {
                form.reset();
            }
            toast({
                title: "Success",
                description: `${selectedEntries.length} entries deleted.`,
            });
        } else {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive"
            });
        }
    })
  }

  return (
    <form name="journal-entries-form" onChange={handleFormChange} action={handleSubmit}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-headline">Recent Entries</h2>
            {hasSelectedEntries && (
                <Button variant="destructive" size="sm" type="submit" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 size={16} className="mr-2"/>
                    )}
                    Delete ({selectedEntries.length})
                </Button>
            )}
        </div>
        <Separator />
        {entries.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {entries.map(entry => (
                <JournalEntryCard key={entry.id} entry={entry} />
            ))}
            </div>
        ) : (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No journal entries yet.</p>
                <p className="text-muted-foreground">Why not write your first one?</p>
            </div>
        )}
      </div>
    </form>
  );
}
