import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyARV7i5y3_KWy2ZCvmUry_T4RZZlCmQDuI",
  authDomain: "gen-lang-client-0168654258.firebaseapp.com",
  projectId: "gen-lang-client-0168654258",
  storageBucket: "gen-lang-client-0168654258.firebasestorage.app",
  messagingSenderId: "830861650087",
  appId: "1:830861650087:web:e503cc678a98492d701382"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard provider settings
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore with the custom databaseId provided in config
export const db = getFirestore(app, "ai-studio-aaa98a45-bfb3-48c0-9484-ac0182cfb74b");


export { signInWithPopup, signOut };
