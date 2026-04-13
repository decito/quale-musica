import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

auth.useDeviceLanguage();

const commentsCollection = collection(db, "comments");
const coversCollection = collection(db, "covers");
const usersCollection = collection(db, "users");
const songsCollection = collection(db, "songs");

export {
  auth,
  commentsCollection,
  coversCollection,
  createUserWithEmailAndPassword,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  songsCollection,
  storage,
  usersCollection,
};
