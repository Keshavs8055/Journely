import { db } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import type { JournalEntry } from './types';
import { auth } from './firebase';

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
    // On the server, auth.currentUser is null. We pass a placeholder and rely on security rules.
    // On the client, we should have the actual user ID.
    const currentUserId = userId === 'user-placeholder' ? auth.currentUser?.uid : userId;
    
    // If we're on the client and there's no user, we can't fetch.
    if (!currentUserId && userId !== 'user-placeholder') {
        return null;
    }
    
    // Use a placeholder for server-side calls, which will be replaced by security rules context.
    // Use the actual UID for client-side calls.
    const effectiveUserId = auth.currentUser?.uid || userId;

    if (!effectiveUserId || effectiveUserId === 'user-placeholder') {
        // This case is tricky. In a real-world server component scenario,
        // you would get the user from a server-side session library (e.g., NextAuth.js).
        // Since we are relying on client-side auth state, we can't reliably get the user ID here
        // when this function is called from a Server Component.
        // We will proceed with a "best-effort" user ID, and rely on Firestore security rules.
        // This is a limitation of using Firebase client SDK in Server Components.
        console.warn("Attempting to fetch entry from a server component without a server-side session. This will rely on Firestore security rules.");
    }


    const entryDocRef = doc(db, 'users', effectiveUserId, 'entries', id);
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
