import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfpyCR9BjEDPLtiDrgap3PQGlwKl-nz00",
  authDomain: "analog-antler-413017.firebaseapp.com",
  projectId: "analog-antler-413017",
  storageBucket: "analog-antler-413017.firebasestorage.app",
  messagingSenderId: "269516326989",
  appId: "1:269516326989:web:2dd4e7649115849672b404",
  measurementId: "G-NTH0BH0SXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
