import type { JournalEntry } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

const toneColorMap: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
  'positive': 'default',
  'joyful': 'default',
  'negative': 'destructive',
  'anxious': 'destructive',
  'neutral': 'secondary',
};

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const formattedDate = format(new Date(entry.date), 'MMMM d, yyyy');
  const toneVariant = toneColorMap[entry.tone?.toLowerCase() ?? 'neutral'] || 'secondary';

  return (
    <div className="relative">
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
        <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">{entry.title}</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground italic line-clamp-3">"{entry.summary}"</p>
          </CardContent>
          <CardFooter>
            {entry.tone && <Badge variant={toneVariant}>{entry.tone}</Badge>}
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
