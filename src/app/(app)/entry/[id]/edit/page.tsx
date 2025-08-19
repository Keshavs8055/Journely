'use client';

import { useEffect, useState } from 'react';
import { getEntry } from '@/lib/data';
import { notFound } from 'next/navigation';
import { EditJournalForm } from '@/components/EditJournalForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from '@/components/SessionProvider';
import type { JournalEntry } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function EditEntrySkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-40 w-full" />
                </div>
                 <Skeleton className="h-10 w-24" />
            </CardContent>
        </Card>
    )
}


export default function EditEntryPage({ params }: { params: { id: string } }) {
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
            <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center gap-2 text-muted-foreground">
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
            </Button>
        </div>
        <EditEntrySkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
        <div className="mb-4">
            <Button variant="ghost" asChild>
                <Link href={`/entry/${entry.id}`} className="flex items-center gap-2 text-muted-foreground">
                    <ArrowLeft size={16} />
                    Back to Entry
                </Link>
            </Button>
        </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Edit Journal Entry</CardTitle>
          <CardDescription>Make changes to your journal entry.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditJournalForm entry={entry} />
        </CardContent>
      </Card>
    </div>
  );
}
