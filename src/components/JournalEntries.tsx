'use client';

import { useState, useTransition } from 'react';
import { getEntries } from '@/lib/data';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteMultipleEntries } from '@/lib/actions';

export function JournalEntries() {
  const [isPending, startTransition] = useTransition();
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const entries = getEntries();

  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const selected = formData.getAll('entryIds') as string[];
    setSelectedEntries(selected);
  };
  
  const hasSelectedEntries = selectedEntries.length > 0;

  return (
    <form onChange={handleFormChange} action={(formData) => {
        startTransition(async () => {
            await deleteMultipleEntries(formData);
            setSelectedEntries([]);
            // Reset checkboxes state visually by resetting the form
            const form = document.querySelector('form');
            form?.reset();
        })
    }}>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map(entry => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </form>
  );
}
