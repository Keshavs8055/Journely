import type { JournalEntry } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const formattedDate = format(new Date(entry.date), 'MMM d, yyyy');

  return (
    <Link href={`/entry/${entry.id}`} className="block group h-full">
      <Card className="hover:border-primary/80 transition-colors h-full flex flex-col justify-between">
        <CardHeader>
            <CardTitle className="font-headline font-bold text-lg line-clamp-2">{entry.title}</CardTitle>
        </CardHeader>
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground mt-auto pt-0">
            <span>{formattedDate}</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </CardFooter>
      </Card>
    </Link>
  );
}
