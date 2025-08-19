import { JournalEntries } from '@/components/JournalEntries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { getEntries } from '@/lib/data';
import { generateReflectionPrompt } from '@/ai/flows/generate-reflection-prompt';
import { unstable_noStore as noStore } from 'next/cache';

async function getDailyReflectionPrompt(entries: { title: string }[]) {
  noStore(); // Ensure this doesn't get cached statically
  if (entries.length === 0) {
    return "What are you grateful for today?";
  }
  try {
    const entryTitles = entries.map(e => e.title).join('\n');
    const result = await generateReflectionPrompt({ journalEntries: entryTitles });
    return result.reflectionPrompt;
  } catch (error) {
    console.error("Failed to generate reflection prompt:", error);
    return "What was the most significant moment of your day, and why did it stand out to you?";
  }
}

export default async function DashboardPage() {
  // This is a placeholder for getting the user ID. In a real app, you'd get this from the session.
  const entries = await getEntries("static-user-id"); 
  const dailyReflectionPrompt = await getDailyReflectionPrompt(entries);

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
