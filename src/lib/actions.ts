'use server';

import { summarizeJournalEntry } from '@/ai/flows/summarize-journal-entry';
import { detectEmotionalTone } from '@/ai/flows/detect-emotional-tone';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { addEntry, updateEntry as dbUpdateEntry, deleteEntry as dbDeleteEntry, getEntry } from '@/lib/data';

export async function createJournalEntry(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string; // This is now encrypted
  const userId = formData.get('userId') as string;

  if (!title || !content || !userId) {
    return;
  }
  
  // Note: AI flows will receive encrypted content. This is not ideal, as they won't be able to
  // understand it. A more advanced implementation would decrypt on the server, process, and re-encrypt,
  // but that requires more robust key management. For now, we accept this limitation.
  let summary = 'Could not generate summary from encrypted text.';
  let tone = 'Unknown';

  const newEntry = {
    date: new Date(),
    title,
    content,
    summary,
    tone,
  };

  await addEntry(userId, newEntry);

  revalidateTag(`entries-${userId}`);
  revalidatePath('/');
  redirect('/');
}

export async function updateJournalEntry(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string; // This is now encrypted
  const userId = formData.get('userId') as string;


  if (!id || !title || !content || !userId) {
    return;
  }
  
  const existingEntry = await getEntry(id);
  if (!existingEntry) {
    return;
  }

  const updatedEntryData = {
    title,
    content,
    summary: existingEntry.summary, // Keep existing summary as we can't re-generate it
    tone: existingEntry.tone,
  };

  await dbUpdateEntry(userId, id, updatedEntryData);

  revalidateTag(`entries-${userId}`);
  revalidateTag(`entry-${id}`);
  revalidatePath(`/entry/${id}`);
  redirect(`/entry/${id}`);
}

export async function deleteJournalEntry(id: string) {
    // This action needs the userId to revalidate the cache correctly.
    // For simplicity, we'll revalidate the general path. In a more complex app,
    // you would pass the userId to this function.
    await dbDeleteEntry(id);
    revalidatePath('/');
    redirect('/');
}

export async function deleteMultipleEntries(formData: FormData) {
    const entryIds = formData.getAll('entryIds') as string[];
    await Promise.all(entryIds.map(id => dbDeleteEntry(id)));
    revalidatePath('/');
}
