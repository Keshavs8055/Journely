import 'server-only';
import { db, auth } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import type { JournalEntry } from './types';
import { unstable_cache as cache } from 'next/cache';

async function getUserId(): Promise<string | null> {
    // In a real app, you would get this from the auth state.
    // For this implementation, we'll assume a fixed user ID for simplicity
    // until proper user session management is in place server-side.
    // A better approach would involve passing the user token from the client
    // and verifying it on the server.
    return auth.currentUser?.uid || null;
}

const getEntriesCollection = async () => {
    const userId = await getUserId();
    if (!userId) {
        throw new Error('User not authenticated');
    }
    return collection(db, 'users', userId, 'entries');
};

export const getEntries = cache(async (): Promise<JournalEntry[]> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
  
    const entriesCollection = collection(db, 'users', userId, 'entries');
    const q = query(entriesCollection, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: (data.date as Timestamp).toDate().toISOString(),
        } as JournalEntry;
    });
}, ['journal-entries'], { revalidate: 60, tags: ['entries'] });

export const getEntry = cache(async (id: string): Promise<JournalEntry | null> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;

    const entryDocRef = doc(db, 'users', userId, 'entries', id);
    const docSnap = await getDoc(entryDocRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            date: (data.date as Timestamp).toDate().toISOString(),
        } as JournalEntry;
    } else {
        return null;
    }
}, ['journal-entry-by-id'], { revalidate: 60, tags: ['entry'] });

export const addEntry = async (entry: Omit<JournalEntry, 'id' | 'date'> & { date: Date }) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        throw new Error('User not authenticated');
    }
    const entriesCollection = collection(db, 'users', userId, 'entries');
    const docRef = await addDoc(entriesCollection, {
        ...entry,
        date: Timestamp.fromDate(entry.date),
    });
    return docRef.id;
};

export const updateEntry = async (id: string, updatedEntryData: Partial<JournalEntry>) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        throw new Error('User not authenticated');
    }
    const entryDocRef = doc(db, 'users', userId, 'entries', id);
    
    const updateData = { ...updatedEntryData };
    if (updatedEntryData.date) {
        updateData.date = Timestamp.fromDate(new Date(updatedEntryData.date));
    }

    await updateDoc(entryDocRef, updateData);
};

export const deleteEntry = async (id: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        throw new Error('User not authenticated');
    }
    const entryDocRef = doc(db, 'users', userId, 'entries', id);
    await deleteDoc(entryDocRef);
};
