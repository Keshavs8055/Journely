import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: process.env.PROJECT_ID,
  appId: process.env.APPId,
  storageBucket: process.env.STORAGEBUCKET,
  apiKey: process.env.APIKEY,
  authDomain:process.env.AUTHDOMAIN ,
  messagingSenderId:process.env.MESSAGEID ,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
