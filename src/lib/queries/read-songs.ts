import { db, songsCollection } from "@/includes/firebase";
import type { Song } from "@/types";
import { doc, getDoc, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";

export const readSongsWithLimit = async (isFirstRequest: boolean, limitPerRequest: number) => {
  const docs: Song[] = [];
  const docsSnap = await getDocs(songsCollection);
  const lastDocId = await docsSnap.docs[docsSnap.docs.length - 1]?.data().docID;
  const lastDocRef = doc(db, "songs", lastDocId);
  const lastDocSnap = await getDoc(lastDocRef);
  if (isFirstRequest) {
    const q = query(songsCollection, orderBy("createdAt", "desc"), limit(limitPerRequest));
    const queried = await getDocs(q);
    queried.docs.forEach((doc) => docs.push(doc.data() as Song));
  } else {
    const q = query(
      songsCollection,
      orderBy("createdAt", "desc"),
      startAfter(lastDocSnap),
      limit(limitPerRequest)
    );
    const queried = await getDocs(q);
    queried.docs.forEach((doc) => docs.push(doc.data() as Song));
  }
  return docs;
};
