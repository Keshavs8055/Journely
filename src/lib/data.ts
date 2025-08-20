
import { db } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import type { JournalEntry } from './types';

// This function can now be called from client components since it's used in useEffect
export async function getEntries(userId: string): Promise<JournalEntry[]> {
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
};


export async function getEntry(userId: string, id: string): Promise<JournalEntry | null> {
    if (!userId) {
        console.error("getEntry called without a userId.");
        return null;
    }
    
    const entryDocRef = doc(db, 'users', userId, 'entries', id);
    const docSnap = await getDoc(entryDocRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            date: (data.date as Timestamp).toDate().toISOString(),
        } as JournalEntry;
    }
    
    return null;
};

export const addEntry = async (userId: string, entry: Omit<JournalEntry, 'id' | 'date'> & { date: Date }) => {
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

export const updateEntry = async (userId: string, id: string, updatedEntryData: Partial<Omit<JournalEntry, 'id' | 'date'>>) => {
    if (!userId) {
        throw new Error('User not authenticated');
    }
    const entryDocRef = doc(db, 'users', userId, 'entries', id);
    await updateDoc(entryDocRef, updatedEntryData);
};

export const deleteEntry = async (userId: string, id: string) => {
    if (!userId) {
        throw new Error('User not authenticated');
    }
    const entryDocRef = doc(db, 'users', userId, 'entries', id);
    await deleteDoc(entryDocRef);
};
