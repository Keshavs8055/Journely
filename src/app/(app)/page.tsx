import { getEntries } from '@/lib/data';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Separator } from '@/components/ui/separator';

// In a real app, this would use the GenAI flow `generateReflectionPrompt`.
// For simplicity, we'll use a static prompt here.
const dailyReflectionPrompt = "What was the most significant moment of your day, and why did it stand out to you?";

export default function DashboardPage() {
  const entries = getEntries();

  return (
    <div className="space-y-8">
      <Header />

      <Card className="bg-primary/20 border-primary/40">
        <CardHeader>
          <CardTitle className="font-headline">Daily Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground/80">{dailyReflectionPrompt}</p>
        </CardContent>
      </Card>
      
      <Separator />

      <div>
        <h2 className="text-xl font-bold font-headline mb-4">Recent Entries</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map(entry => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}
