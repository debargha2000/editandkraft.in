// Client-side API Key (Public)
// Initialized with SDK configuration provided for the editandkraft.in project

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration - uses high-security environment variables
// Values match the provided Client-side API Key configuration
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
    .filter(([key, value]) => !value && key !== 'measurementId') // measurementId is optional
    .map(([key]) => key);
  
  if (missingKeys.length > 0) {
    if (import.meta.env.DEV) {
      console.warn(`Missing Firebase environment variables: ${missingKeys.join(', ')}. Some features may not work.`);
      // In development, we use placeholder values but Firebase won't work properly
      return {
        ...config,
        apiKey: config.apiKey || "dev-placeholder",
        authDomain: config.authDomain || "dev-placeholder",
        projectId: config.projectId || "dev-placeholder", 
        appId: config.appId || "dev-placeholder"
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
  // Analytics is only initialized if supported in the current environment
  isSupported().then(supported => {
    if (supported && typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
  }).catch(err => {
    console.warn("Analytics not supported in this environment:", err.message);
  });

  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Failed to initialize Firebase:", error.message);
}

export { analytics, db, auth, storage };
export default app;

