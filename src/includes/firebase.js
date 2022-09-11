import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/app-check";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence().catch((error) =>
  console.error(`Firebase persistence error: ${error.code}`)
);

auth.useDeviceLanguage();

const appCheck = firebase.appCheck();
appCheck.activate(import.meta.env.VITE_RECAPTCHA_SITE_KEY, true);

const commentsCollection = db.collection("comments");
const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");

export {
  auth,
  db,
  storage,
  commentsCollection,
  songsCollection,
  usersCollection,
};
