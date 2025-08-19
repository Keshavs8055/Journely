'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addEntry, updateEntry as dbUpdateEntry, deleteEntry as dbDeleteEntry, getEntry } from '@/lib/data';

export async function createJournalEntry(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string; // This is encrypted
  const userId = formData.get('userId') as string;

  if (!title || !content || !userId) {
    // In a real app, handle this with an error message
    return;
  }
  
  const newEntry = {
    date: new Date(),
    title,
    content,
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
  
  const existingEntry = await getEntry(id);
  if (!existingEntry) {
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

export async function deleteJournalEntry(id: string) {
    // This action needs the userId to revalidate the cache correctly.
    // A better implementation would get the userId from the session.
    await dbDeleteEntry("static-user-id", id);
    revalidatePath('/');
    redirect('/');
}

export async function deleteMultipleEntries(formData: FormData) {
    const entryIds = formData.getAll('entryIds') as string[];
    // A better implementation would get the userId from the session.
    await Promise.all(entryIds.map(id => dbDeleteEntry("static-user-id", id)));
    revalidatePath('/');
}
