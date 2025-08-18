'use server';

import { summarizeJournalEntry } from '@/ai/flows/summarize-journal-entry';
import { detectEmotionalTone } from '@/ai/flows/detect-emotional-tone';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addEntry } from '@/lib/data';

export async function createJournalEntry(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !content) {
    // In a real app, you'd want more robust error handling
    return;
  }

  let summary = 'Could not generate summary.';
  let tone = 'Neutral';

  try {
    const [summaryResult, toneResult] = await Promise.all([
      summarizeJournalEntry({ journalEntry: content }),
      detectEmotionalTone({ journalEntry: content }),
    ]);
    summary = summaryResult.summary;
    tone = toneResult.emotionalTone;
  } catch (error) {
    console.error('AI processing failed:', error);
    // Proceed to save the entry without AI insights
  }

  const newEntry = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    title,
    content,
    summary,
    tone,
  };

  addEntry(newEntry);

  revalidatePath('/');
  redirect('/');
}
