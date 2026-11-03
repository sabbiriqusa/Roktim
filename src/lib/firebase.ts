import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Production Firebase configuration for blood-bank-taherpur
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB9aLveFG6Kg_Vk0Fdip51BzfU0KpHLE6A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "blood-bank-taherpur.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "blood-bank-taherpur",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "blood-bank-taherpur.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "736756667722",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:736756667722:web:c0ea82ef56f63629d85db3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6DL76P1LSS"
};

// Initialize Firebase App instance safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore database
export const db = getFirestore(app);

// Initialize Cloud Storage
export const storage = getStorage(app);

// Initialize Google Analytics safely in browser
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Analytics not initialized in this environment:", err);
    });
}

export { signInWithPopup, signOut };
