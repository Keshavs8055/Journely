'use client';

import { useEffect, useState } from 'react';
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
import type { JournalEntry } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function EntryPageSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </CardContent>
        </Card>
    );
}


export default function EntryPage({ params }: { params: { id: string } }) {
  const { user } = useSession();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEntry() {
      if (user) {
        setIsLoading(true);
        const fetchedEntry = await getEntry(user.uid, params.id);
        if (!fetchedEntry) {
          notFound();
        }
        setEntry(fetchedEntry);
        setIsLoading(false);
      }
    }
    fetchEntry();
  }, [user, params.id]);

  if (isLoading || !entry) {
    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex justify-between items-center">
                <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center gap-2 text-muted-foreground">
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
                </Button>
            </div>
            <EntryPageSkeleton />
        </div>
    );
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
