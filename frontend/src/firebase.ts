import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_MESSAGING_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase *only if not in test*
let app: ReturnType<typeof initializeApp> | undefined;
if (process.env.NODE_ENV !== "test") {
  app = initializeApp(firebaseConfig);
}

export const auth = app ? getAuth(app) : ({} as any);
export const provider = new GoogleAuthProvider();

export const loginWithGoogle = () =>
  process.env.NODE_ENV !== "test" ? signInWithPopup(auth, provider) : Promise.resolve();

export const logout = () =>
  process.env.NODE_ENV !== "test" ? signOut(auth) : Promise.resolve();
