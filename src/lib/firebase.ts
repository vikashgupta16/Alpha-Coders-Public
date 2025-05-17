
import { initializeApp, getApps, type FirebaseApp, FirebaseError } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let firebaseInitializationError: FirebaseError | null = null;

if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY_FROM_FIREBASE") {
  const errMsg = 'Firebase API Key is missing or using a placeholder value. Please check your .env.local file and ensure NEXT_PUBLIC_FIREBASE_API_KEY is set correctly and you have restarted the development server.';
  console.error(errMsg);
  firebaseInitializationError = new FirebaseError("auth/missing-api-key", errMsg);
} else {
  try {
    if (getApps().length) {
      app = getApps()[0];
    } else {
      app = initializeApp(firebaseConfig);
    }
    auth = getAuth(app);
    firestore = getFirestore(app);
  } catch (e) {
    console.error("Error initializing Firebase:", e);
    firebaseInitializationError = e instanceof FirebaseError ? e : new FirebaseError("initialization-failed", "Firebase core initialization failed.");
    // Nullify services if initialization fails
    app = null;
    auth = null;
    firestore = null;
  }
}

export { app, auth, firestore, firebaseInitializationError };
