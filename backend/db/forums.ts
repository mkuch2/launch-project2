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
  serverTimestamp,
  where,
} from "firebase/firestore";
import type { Forum, PrivateUser } from "../../types";
import { deletePost } from "./posts.js";
// Forum {
//   id: string,
//   author: {
//     id: string,
//     displayName: string
//   }
//   name: string,
//   createdAt: Timestamp
// }

async function getForum(forumId: string) {
  if (!forumId) {
    throw new Error("forumId is required");
  }

  try {
    const forumRef = doc(db, "forums", forumId);
    const snap = await getDoc(forumRef);

    if (!snap.exists()) return null;

    const data = snap.data();
    return { id: forumId, ...data } as Forum;
  } catch (err) {
    throw new Error("Error fetching forum by id", { cause: err });
  }
}

async function getForums() {
  const forumsQuery = query(
    collection(db, "forums"),
    orderBy("createdAt", "desc"),
  );
  const forumsSnapshot = await getDocs(forumsQuery);

  return forumsSnapshot.docs.map((forumDoc) => ({
    id: forumDoc.id,
    ...forumDoc.data(),
  }));
}

async function createForum(author: PrivateUser, name: string) {
  if (!author || !name) throw new Error("author and name are required");

  const forumData = { author, name };
  const docRef = await addDoc(collection(db, "forums"), {
    ...forumData,
    createdAt: serverTimestamp(),
  });
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

  const forumPostsQuery = query(
    collection(db, "posts"),
    where("forumId", "==", forumId),
  );
  const forumPostsSnapshot = await getDocs(forumPostsQuery);

  await Promise.all(
    forumPostsSnapshot.docs.map((postDoc) => deletePost(postDoc.id)),
  );

  await deleteDoc(doc(db, "forums", forumId));
  return { id: forumId };
}

export { getForum, getForums, createForum, editForum, deleteForum };
