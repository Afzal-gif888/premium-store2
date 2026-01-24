import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Firebase Auth and attempt anonymous sign-in as a graceful fallback.
// This helps when Firestore rules require authenticated reads (but still allow public access
// for most collections). Anonymous auth gives the client an identity without exposing
// admin credentials.
export const auth = getAuth(app);

// Optional anonymous sign-in: only attempt if the environment explicitly opts in.
// Set VITE_FIREBASE_ALLOW_ANON=true in your local/.env or hosting environment to enable.
// This avoids unnecessary identitytoolkit 400 errors when the Firebase project has
// anonymous auth disabled (which would otherwise return a 400 admin-restricted-operation).
if (import.meta.env.VITE_FIREBASE_ALLOW_ANON === 'true') {
  // Try to sign in anonymously if not already signed in.
  // Note: this will be a no-op if the user is already signed in.
  signInAnonymously(auth).catch((err) => {
    // Log but don't throw — the app can still function for purely public reads if rules allow.
    console.warn('[Firebase] Anonymous sign-in failed:', err && err.message ? err.message : err);
  });
}

// Optional: log auth state changes for debugging in development only
if (import.meta.env.DEV) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.info('[Firebase] Auth state: signed in', user.uid, user.isAnonymous ? '(anonymous)' : '');
    } else {
      console.info('[Firebase] Auth state: signed out');
    }
  });
}
