// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBG5R_qRg61PUkNHRWH4FhRXaS_ewv7SX4",
  authDomain: "blog-54442.firebaseapp.com",
  projectId: "blog-54442",
  storageBucket: "blog-54442.firebasestorage.app",
  messagingSenderId: "864187093833",
  appId: "1:864187093833:web:204199dc1b40c02cb38098",
  measurementId: "G-FZGFSZ6K5Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
