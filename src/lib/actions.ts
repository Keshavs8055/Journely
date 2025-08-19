'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addEntry, updateEntry as dbUpdateEntry, deleteEntry as dbDeleteEntry } from '@/lib/data';
import type { JournalEntry } from './types';

export async function createJournalEntry(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string; // This is encrypted
  const userId = formData.get('userId') as string;
  const type = formData.get('type') as JournalEntry['type'];

  if (!content || !userId || !type) {
    // In a real app, handle this with an error message
    return;
  }
  
  const newEntry = {
    date: new Date(),
    title: title || `Reflection - ${new Date().toLocaleDateString()}`, // Default title for reflections
    content,
    type,
  };

  await addEntry(userId, newEntry);

  revalidatePath('/');
  redirect('/');
}

export async function updateJournalEntry(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string; // This is encrypted
  const userId = formData.get('userId') as string;

  if (!id || !title || !content || !userId) {
    return;
  }

  const updatedEntryData = {
    title,
    content,
  };

  await dbUpdateEntry(userId, id, updatedEntryData);

  revalidatePath(`/entry/${id}`);
  revalidatePath('/');
  redirect(`/entry/${id}`);
}

export async function deleteJournalEntry(id: string, userId: string) {
    if (!userId) {
        // Handle error: user not logged in
        return;
    }
    await dbDeleteEntry(userId, id);
    revalidatePath('/');
    redirect('/');
}

export async function deleteMultipleEntries(formData: FormData) {
    const entryIds = formData.getAll('entryIds') as string[];
    const userId = formData.get('userId') as string;
    if (!userId) {
        // Handle error: user not logged in
        return;
    }
    await Promise.all(entryIds.map(id => dbDeleteEntry(userId, id)));
    revalidatePath('/');
}
