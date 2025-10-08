import { db } from "@/includes/firebase";
import { doc, getDoc } from "firebase/firestore";

export const readCover = async (coverId: string) => {
  const docRef = doc(db, "covers", coverId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data();
};
