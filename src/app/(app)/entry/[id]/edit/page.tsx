'use client';

import { getEntry } from '@/lib/data';
import { notFound } from 'next/navigation';
import { EditJournalForm } from '@/components/EditJournalForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from '@/components/SessionProvider';
import { use } from 'react';
import type { JournalEntry } from '@/lib/types';


export default function EditEntryPage({ params }: { params: { id: string } }) {
  const { user } = useSession();
  const id = params.id;
  
  if (!user) {
    // Session loading or user not authenticated.
    // The AppLayout will handle the redirect.
    return null; 
  }

  const entry = use(getEntry(user.uid, id)) as JournalEntry;

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
