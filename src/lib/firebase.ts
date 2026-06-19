import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Dynamic Firebase configuration supporting Vercel and production deployment overrides
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyARV7i5y3_KWy2ZCvmUry_T4RZZlCmQDuI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0168654258.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0168654258",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0168654258.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "830861650087",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:830861650087:web:e503cc678a98492d701382"
};

const dbId = import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-aaa98a45-bfb3-48c0-9484-ac0182cfb74b";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard provider settings
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore with custom databaseId
export const db = getFirestore(app, dbId);

export { signInWithPopup, signOut };
