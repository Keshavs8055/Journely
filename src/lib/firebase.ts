import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'reflectai-civlp',
  appId: '1:182900398277:web:6d450404537f0286d9f8ac',
  storageBucket: 'reflectai-civlp.firebasestorage.app',
  apiKey: 'AIzaSyDeUC8NO_R0hGVUKfCzcItFooa_ZZaQeaU',
  authDomain: 'reflectai-civlp.firebaseapp.com',
  messagingSenderId: '182900398277',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
