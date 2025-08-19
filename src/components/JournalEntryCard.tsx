import type { JournalEntry } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { FileText } from 'lucide-react';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const formattedDate = format(new Date(entry.date), 'MMMM d, yyyy');

  return (
    <div className="relative group">
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          id={`select-${entry.id}`}
          name="entryIds"
          value={entry.id}
          className="bg-background"
          aria-label={`Select entry titled ${entry.title}`}
        />
      </div>
      <Link href={`/entry/${entry.id}`} className="block h-full">
        <Card className="hover:shadow-md transition-shadow h-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="font-headline">{entry.title}</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-muted-foreground">
                <FileText className="mr-2" size={16} />
                <p>View Entry</p>
            </div>
          </CardContent>
          <CardFooter>
            {/* Footer can be used for other info later */}
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
