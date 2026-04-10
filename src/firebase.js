import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration - uses environment variables
const getFirebaseConfig = () => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };
  
  // Validate that all required config values are present
  const missingKeys = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  
  if (missingKeys.length > 0) {
    if (import.meta.env.DEV) {
      console.warn(`Missing Firebase environment variables: ${missingKeys.join(', ')}. Some features may not work.`);
      // In development, we can use placeholder values but Firebase won't work properly
      return {
        apiKey: "dev-placeholder",
        authDomain: "dev-placeholder",
        projectId: "dev-placeholder", 
        storageBucket: "dev-placeholder",
        messagingSenderId: "dev-placeholder",
        appId: "dev-placeholder",
        measurementId: "dev-placeholder"
      };
    } else {
      throw new Error(`Firebase configuration missing: ${missingKeys.join(', ')}`);
    }
  }
  
  return config;
};

// Initialize Firebase
let app = null;
let analytics = null;
let db = null;
let auth = null;
let storage = null;

try {
  const firebaseConfig = getFirebaseConfig();
  app = initializeApp(firebaseConfig);

  // Initialize Services
  analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Failed to initialize Firebase:", error.message);
  // All values remain null
}

export { analytics, db, auth, storage };
export default app;
