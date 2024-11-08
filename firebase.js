// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4DVbIQUzhNSczujsP27MwTE6NfifB8ew",
  authDomain: "promote-pro-8f9aa.firebaseapp.com",
  databaseURL: "https://promote-pro-8f9aa-default-rtdb.firebaseio.com",
  projectId: "promote-pro-8f9aa",
  storageBucket: "promote-pro-8f9aa.firebasestorage.app",
  messagingSenderId: "553030063178",
  appId: "1:553030063178:web:13e2b89fd5c6c628ccc2b3",
  measurementId: "G-KZ89FN869W"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
