
'use client';

import type { JournalEntry } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { DeleteEntryButton } from '@/components/DeleteEntryButton';
import { DecryptedContent } from '@/components/DecryptedContent';

// This Client Component receives the entry data as a prop
// and handles all the interactive UI and client-side logic.
export function ClientView({ entry }: { entry: JournalEntry }) {
  const formattedDate = format(new Date(entry.date), 'MMMM d, yyyy');

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2 text-muted-foreground">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/entry/${entry.id}/edit`}>
              <Edit size={16} className="mr-2" />
              Edit
            </Link>
          </Button>
          <DeleteEntryButton id={entry.id} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{entry.title}</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            {/* DecryptedContent is a client component that needs the user session */}
            <DecryptedContent content={entry.content} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
