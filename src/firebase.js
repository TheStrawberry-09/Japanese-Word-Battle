import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import "firebase/firestore";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
