'use server';

import { summarizeJournalEntry } from '@/ai/flows/summarize-journal-entry';
import { detectEmotionalTone } from '@/ai/flows/detect-emotional-tone';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { addEntry, updateEntry as dbUpdateEntry, deleteEntry as dbDeleteEntry, getEntry } from '@/lib/data';
import { auth } from './firebase';

export async function createJournalEntry(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !content) {
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
  }

  const newEntry = {
    date: new Date(),
    title,
    content,
    summary,
    tone,
  };

  await addEntry(newEntry);

  revalidateTag('entries');
  revalidatePath('/');
  redirect('/');
}

export async function updateJournalEntry(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!id || !title || !content) {
    return;
  }
  
  const existingEntry = await getEntry(id);
  if (!existingEntry) {
    return;
  }

  let summary = existingEntry.summary;
  let tone = existingEntry.tone;

  if (content !== existingEntry.content) {
    try {
      const [summaryResult, toneResult] = await Promise.all([
        summarizeJournalEntry({ journalEntry: content }),
        detectEmotionalTone({ journalEntry: content }),
      ]);
      summary = summaryResult.summary;
      tone = toneResult.emotionalTone;
    } catch (error) {
      console.error('AI processing failed during update:', error);
    }
  }

  const updatedEntryData = {
    title,
    content,
    summary,
    tone,
  };

  await dbUpdateEntry(id, updatedEntryData);

  revalidateTag('entries');
  revalidateTag('entry');
  revalidatePath(`/entry/${id}`);
  redirect(`/entry/${id}`);
}

export async function deleteJournalEntry(id: string) {
    await dbDeleteEntry(id);
    revalidateTag('entries');
    revalidatePath('/');
    redirect('/');
}

export async function deleteMultipleEntries(formData: FormData) {
    const entryIds = formData.getAll('entryIds') as string[];
    await Promise.all(entryIds.map(id => dbDeleteEntry(id)));
    revalidateTag('entries');
    revalidatePath('/');
}
