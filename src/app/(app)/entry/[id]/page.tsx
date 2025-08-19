import { getEntry } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { DeleteEntryButton } from '@/components/DeleteEntryButton';

export default async function EntryPage({ params }: { params: { id: string } }) {
  const entry = await getEntry(params.id);

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
                <p className="whitespace-pre-wrap text-base">{entry.content}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
