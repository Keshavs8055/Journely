
'use client';

import { getEntry } from '@/lib/data';
import { notFound } from 'next/navigation';
import { EditJournalForm } from '@/components/EditJournalForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from '@/components/SessionProvider';
import { Suspense } from 'react';
import type { JournalEntry } from '@/lib/types';

// This is a Server Component responsible for data fetching.
// It is NOT marked with 'use client'.
async function EditEntryView({ userId, entryId }: { userId: string, entryId: string }) {
  const entry = await getEntry(userId, entryId) as JournalEntry;

  if (!entry) {
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

// This remains a Client Component to handle session state.
export default function EditEntryPage({ params }: { params: { id: string } }) {
  const { user } = useSession();
  
  if (!user) {
    // Session loading or user not authenticated.
    // The AppLayout will handle the redirect.
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      {/* @ts-expect-error Server Component */}
      <EditEntryView userId={user.uid} entryId={params.id} />
    </Suspense>
  );
}
