'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addEntry, updateEntry as dbUpdateEntry, deleteEntry as dbDeleteEntry } from '@/lib/data';
import type { JournalEntry } from './types';

export async function createJournalEntry(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string; // This is encrypted
    const userId = formData.get('userId') as string;
    const type = formData.get('type') as JournalEntry['type'];

    if (!content || !userId || !type) {
        throw new Error("Missing required fields");
    }
    
    const newEntry = {
      date: new Date(),
      title: title || `Reflection - ${new Date().toLocaleDateString()}`, // Default title for reflections
      content,
      type,
    };

    await addEntry(userId, newEntry);

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: message };
  }
}

export async function updateJournalEntry(formData: FormData) {
    try {
        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const content = formData.get('content') as string; // This is encrypted
        const userId = formData.get('userId') as string;

        if (!id || !title || !content || !userId) {
            throw new Error("Missing required fields");
        }

        const updatedEntryData = {
            title,
            content,
        };

        await dbUpdateEntry(userId, id, updatedEntryData);

        revalidatePath(`/entry/${id}`);
        revalidatePath('/');
    } catch (error) {
        // Not redirecting here so we can show a toast on the client
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: message };
    }
    // Redirect must be called outside of try/catch
    redirect(`/entry/${id}`);
}


export async function deleteJournalEntry(id: string, userId: string) {
    try {
        if (!userId) {
            throw new Error("You must be logged in to delete an entry.");
        }
        await dbDeleteEntry(userId, id);
        revalidatePath('/');
    } catch(error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        // We can't handle this return value yet as it's not a form action
    }
    redirect('/');
}

export async function deleteMultipleEntries(formData: FormData) {
    try {
        const entryIds = formData.getAll('entryIds') as string[];
        const userId = formData.get('userId') as string;
        if (!userId) {
            throw new Error("You must be logged in to delete entries.");
        }
        if (entryIds.length === 0) {
            throw new Error("No entries selected.");
        }
        await Promise.all(entryIds.map(id => dbDeleteEntry(userId, id)));
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: message };
    }
}
