import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import "firebase/firestore";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyBKZ9qbKo4YRtjMwvK4LcCF54-m_ZMavSc",
  authDomain: "japanese-word-battle.firebaseapp.com",
  databaseURL:
    "https://japanese-word-battle-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "japanese-word-battle",
  storageBucket: "japanese-word-battle.appspot.com",
  messagingSenderId: "936660245889",
  appId: "1:936660245889:web:968a958904de9332609c80",
  measurementId: "G-DYTEZJ7XTH",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
