'use client';

import { JournalEntryCard } from '@/components/JournalEntryCard';
import { Button } from '@/components/ui/button';
import type { JournalEntry } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface JournalEntriesProps {
    entries: JournalEntry[];
    onEntriesChange: () => void;
}

export function JournalEntries({ entries }: JournalEntriesProps) {
  
  return (
    <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-headline">Recent Entries</h2>
        </div>
        {entries.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {entries.map(entry => (
                <JournalEntryCard key={entry.id} entry={entry} />
            ))}
            </div>
        ) : (
            <div className="text-center py-12 rounded-lg border-2 border-dashed border-muted-foreground/20">
                <p className="text-muted-foreground mb-4">You haven't written any entries yet.</p>
                <Button asChild>
                    <Link href="/new-entry">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Write your first entry
                    </Link>
                </Button>
            </div>
        )}
      </div>
  );
}
