import { getEntry } from '@/lib/data';
import { notFound } from 'next/navigation';
import { JournalForm } from '@/components/JournalForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditEntryPage({ params }: { params: { id: string } }) {
  const entry = await getEntry(params.id);

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
          <JournalForm entry={entry} />
        </CardContent>
      </Card>
    </div>
  );
}
