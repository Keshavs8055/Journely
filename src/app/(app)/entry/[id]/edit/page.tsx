'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getEntry } from '@/lib/data';
import type { JournalEntry } from '@/lib/types';
import { useSession } from '@/components/SessionProvider';
import { EditJournalForm } from '@/components/EditJournalForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EditEntryPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user, isLoading: isSessionLoading } = useSession();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user || !id) {
      return;
    }

    const fetchEntry = async () => {
      try {
        setIsLoading(true);
        const fetchedEntry = await getEntry(user.uid, id);
        if (fetchedEntry) {
          setEntry(fetchedEntry);
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Failed to fetch entry for editing:", e);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntry();
  }, [user, id]);

  if (isSessionLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !entry) {
    notFound();
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
