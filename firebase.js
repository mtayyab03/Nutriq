// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcTN3DDT4dZId2hfxrUsk2yOYT2vqinZ8",
  authDomain: "rawe-489e6.firebaseapp.com",
  projectId: "rawe-489e6",
  storageBucket: "rawe-489e6.firebasestorage.app",
  messagingSenderId: "334025525194",
  appId: "1:334025525194:web:6db5102a2b494f0613f133",
  measurementId: "G-6LYXL5HEX0",
};

export const app = initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app); // For Authentication
export const db = getFirestore(app); // For Firestore Database
export const storage = getStorage(app);
