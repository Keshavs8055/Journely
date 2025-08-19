import type { JournalEntry } from '@/lib/types';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const formattedDate = format(new Date(entry.date), 'MMMM d, yyyy');

  return (
    <div className="relative group">
       <div className="absolute top-4 left-4 z-10">
        <Checkbox
          id={`select-${entry.id}`}
          name="entryIds"
          value={entry.id}
          className="bg-background/80 backdrop-blur-sm"
          aria-label={`Select entry titled ${entry.title}`}
        />
      </div>
      <Link href={`/entry/${entry.id}`} className="block h-full">
        <Card className="hover:border-primary/80 transition-colors h-full flex flex-col justify-between p-2">
          <CardHeader className="flex-1">
            <CardTitle className="font-headline text-lg line-clamp-2">{entry.title}</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </CardHeader>
          <CardFooter>
            <div className="flex items-center text-sm text-primary/80 font-medium w-full justify-end">
                <span>View Entry</span>
                <ArrowRight size={16} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
