
import { getEntry } from '@/lib/data';
import { notFound } from 'next/navigation';
import { EditJournalForm } from '@/components/EditJournalForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { JournalEntry } from '@/lib/types';

// Server Component to fetch data
export default async function EditEntryPage({ params }: { params: { id: string } }) {
  // NOTE: This runs on the server.
  const entry = await getEntry('user-placeholder', params.id) as JournalEntry;

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
