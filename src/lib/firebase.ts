import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "reflectai-civlp",
  appId: process.env.NEXT_PUBLIC_APP_ID || "1:182900398277:web:6d450404537f0286d9f8ac",
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || "reflectai-civlp.firebasestorage.app",
  apiKey: process.env.NEXT_PUBLIC_API_KEY || "AIzaSyDeUC8NO_R0hGVUKfCzcItFooa_ZZaQeaU",
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || "reflectai-civlp.firebaseapp.com",
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || "182900398277",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code == 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code == 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence.');
      }
    });
}

export { app, auth, db };
