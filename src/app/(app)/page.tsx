import { JournalEntries } from '@/components/JournalEntries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { getEntries } from '@/lib/data';

// In a real app, this would use the GenAI flow `generateReflectionPrompt`.
// For simplicity, we'll use a static prompt here.
const dailyReflectionPrompt = "What was the most significant moment of your day, and why did it stand out to you?";

export default async function DashboardPage() {
  const entries = await getEntries();
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
      
      <JournalEntries entries={entries} />
    </div>
  );
}
