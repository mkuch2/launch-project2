import { db } from "../firebase.js";
import {
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import type { PrivateUser } from "../../types";
// Forum {
//   id: string,
//   author: {
//     id: string,
//     displayName: string
//   }
//   name: string,
// }

async function getForums() {
  const forumsQuery = query(collection(db, "forums"), orderBy("name", "asc"));
  const forumsSnapshot = await getDocs(forumsQuery);

  return forumsSnapshot.docs.map((forumDoc) => ({
    id: forumDoc.id,
    ...forumDoc.data(),
  }));
}

async function createForum(author: PrivateUser, name: string) {
  if (!author || !name) throw new Error("author and name are required");
  const forumData = { author, name };
  const docRef = await addDoc(collection(db, "forums"), forumData);
  return { id: docRef.id, ...forumData };
}

async function editForum(
  forumId: string,
  updates: {
    id?: string;
    name?: string;
    author?: PrivateUser;
  },
) {
  if (!forumId) throw new Error("forumId is required");
  const forumRef = doc(db, "forums", forumId);
  await updateDoc(forumRef, updates);
  const snap = await getDoc(forumRef);
  return { id: forumId, ...snap.data() };
}

async function deleteForum(forumId: string) {
  if (!forumId) throw new Error("forumId is required");
  await deleteDoc(doc(db, "forums", forumId));
  return { id: forumId };
}

export { getForums, createForum, editForum, deleteForum };
