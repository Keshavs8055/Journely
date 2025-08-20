import type { JournalEntry } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const formattedDate = format(new Date(entry.date), 'MMM d, yyyy');

  return (
    <div className="relative group h-full">
      <Card className="hover:border-primary/80 transition-colors h-full flex flex-col justify-between">
        <div className="p-4 flex justify-between items-start">
            <Checkbox
              id={`select-${entry.id}`}
              name="entryIds"
              value={entry.id}
              className="bg-background/80 backdrop-blur-sm"
              aria-label={`Select entry titled ${entry.title}`}
            />
            <Link href={`/entry/${entry.id}`} className="block" tabIndex={-1}>
              <ArrowRight size={20} className="text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
        <CardContent className="p-4 pt-0">
          <Link href={`/entry/${entry.id}`} className="block">
            <h3 className="font-headline font-bold text-lg line-clamp-2">{entry.title}</h3>
            <p className="text-xs text-muted-foreground text-right mt-2">{formattedDate}</p>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
