
'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth as firebaseAuthInstance, firebaseInitializationError as globalFirebaseError } from '@/lib/firebase'; // Renamed import
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type Auth,
  type AuthError
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  authAvailable: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authAvailable, setAuthAvailable] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (globalFirebaseError) {
      setAuthError(`Firebase Initialization Error: ${globalFirebaseError.message}. This is critical. Please check your .env.local file (ensure all keys start with NEXT_PUBLIC_ and values are correct) and RESTART your development server.`);
      setIsLoading(false);
      setAuthAvailable(false);
      console.error("Auth Provider - Global Firebase Error:", globalFirebaseError.message);
      return;
    }

    if (firebaseAuthInstance) {
      setAuthAvailable(true);
      setAuthError(null);
      const unsubscribe = onAuthStateChanged(firebaseAuthInstance as Auth, (currentUser) => {
        setUser(currentUser);
        setIsLoading(false);
      }, (error: AuthError) => {
        console.error("Firebase onAuthStateChanged error:", error);
        setAuthError(error.message || "An error occurred with Firebase Authentication listener.");
        setIsLoading(false);
        setAuthAvailable(false); // Mark auth as unavailable if listener fails
      });
      return () => unsubscribe();
    } else {
      const errMsg = "Firebase Authentication service (firebaseAuthInstance) is null. This likely means Firebase core failed to initialize earlier. Check console logs from firebase.ts.";
      console.error(errMsg);
      setAuthError(errMsg + " Ensure your Firebase configuration (API key, etc.) is correctly set up in a '.env.local' file in your project root, and that you have RESTARTED your development server. All keys must start with 'NEXT_PUBLIC_'.");
      setIsLoading(false);
      setAuthAvailable(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (!firebaseAuthInstance) {
      console.error("Firebase Auth instance not available for signInWithGoogle.");
      setAuthError("Authentication service is not available. Cannot sign in.");
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuthInstance as Auth, provider);
      setAuthError(null); // Clear any previous errors on successful sign-in attempt
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      setAuthError(error.message || "Failed to sign in with Google.");
    }
  };

  const signOut = async () => {
    if (!firebaseAuthInstance) {
      console.error("Firebase Auth instance not available for signOut.");
      setAuthError("Authentication service is not available. Cannot sign out.");
      return;
    }
    try {
      await firebaseSignOut(firebaseAuthInstance as Auth);
      setAuthError(null); // Clear any previous errors
    } catch (error: any) {
      console.error("Error signing out:", error);
      setAuthError(error.message || "Failed to sign out.");
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!authAvailable && !isLoading) { // Error page if Firebase didn't initialize
     return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background">
        <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
        <h1 className="text-2xl md:text-3xl font-bold text-destructive mb-4">Authentication Service Unavailable</h1>
        <div className="max-w-2xl text-left space-y-3 text-muted-foreground border border-border p-6 rounded-lg bg-card shadow-md">
            <p>
                The Firebase Authentication service failed to initialize. This usually means the application
                could not find or use a valid Firebase API key.
            </p>
            <p className="font-semibold text-foreground">Please meticulously check the following in your local development environment:</p>
            <ol className="list-decimal list-inside space-y-2">
                <li>
                    <strong><code>.env.local</code> File:</strong> Ensure this file exists in the
                    <strong className="text-primary"> root directory</strong> of your project (the same level as <code>package.json</code>).
                </li>
                <li>
                    <strong>Key Prefixes:</strong> All Firebase-related keys in <code>.env.local</code>
                    <strong className="text-primary"> MUST</strong> start with <code>NEXT_PUBLIC_</code>.
                    For example: <code>NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_KEY_HERE"</code>.
                </li>
                <li>
                    <strong>Correct Values:</strong> Double-check that the API key and other configuration values are copied
                    <strong className="text-primary"> exactly</strong> from your Firebase project settings (Firebase Console → Project Settings → General → Your web app). Do not use placeholder values.
                </li>
                <li>
                    <strong>Server Restart:</strong> After creating or modifying the <code>.env.local</code> file, you
                    <strong className="text-destructive"> MUST completely stop and restart</strong> your Next.js development server.
                </li>
                 <li>
                    <strong>Firebase Project Setup:</strong> Ensure you have created a Firebase project, added a Web App, and enabled Google Sign-In as an authentication provider in the Firebase console.
                </li>
            </ol>
            {authError && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive break-words">
                    <strong>Error Detail:</strong> {authError}
                </div>
            )}
            <p className="text-xs mt-4 text-center">
                (Also check the browser console and server logs for more specific Firebase errors.)
            </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, signOut, authAvailable, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
