import type { JournalEntry } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline">{entry.title}</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground italic">"{entry.summary}"</p>
      </CardContent>
      <CardFooter>
        {entry.tone && <Badge variant={toneVariant}>{entry.tone}</Badge>}
      </CardFooter>
    </Card>
  );
}
