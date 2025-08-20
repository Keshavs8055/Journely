'use client';

import { getEntry } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { DeleteEntryButton } from '@/components/DeleteEntryButton';
import { DecryptedContent } from '@/components/DecryptedContent';
import { useSession } from '@/components/SessionProvider';
import { use } from 'react';
import type { JournalEntry } from '@/lib/types';


export default function EntryPage({ params }: { params: { id: string } }) {
  const { user } = useSession();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  if (!user) {
    // Session loading or user not authenticated.
    // The AppLayout will handle the redirect.
    return null;
  }

  const entry = use(getEntry(user.uid, id)) as JournalEntry;

  if (!entry) {
    notFound();
  }
  
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
                    <Edit size={16} className="mr-2"/>
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
                <DecryptedContent content={entry.content} />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
