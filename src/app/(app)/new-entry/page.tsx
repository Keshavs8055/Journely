import { JournalForm } from '@/components/JournalForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewEntryPage() {
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
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">New Journal Entry</CardTitle>
          <CardDescription>Capture your thoughts, feelings, and experiences of the day.</CardDescription>
        </CardHeader>
        <CardContent>
          <JournalForm />
        </CardContent>
      </Card>
    </div>
  );
}
