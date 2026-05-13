import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import firebaseAppletConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId}-default-rtdb.firebaseio.com`
};

if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
  console.error("CRITICAL: Firebase API Key is missing or invalid! Check your environment variables.");
}

const app = initializeApp(firebaseConfig);

// Use the database ID from the config file explicitly
// If VITE_FIREBASE_FIRESTORE_DATABASE_ID is set, use it, otherwise fallback to config file
const dbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseAppletConfig.firestoreDatabaseId || undefined;

export const db = getFirestore(app, dbId); 
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
