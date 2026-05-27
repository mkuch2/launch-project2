import { db } from "../firebase.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";

import type { PrivateUser, Post } from "../../types/index.js";

interface PostRecord {
  author: PrivateUser;
  title: string;
  content: string;
  likes: Number;
  createdAt?: string;
  forumId: string;
}

interface PostFilters {
  forumId?: string;
  conversationId?: string;
  userId?: string;
}

function buildPostQuery(filters: PostFilters = {}) {
  const constraints = [];

  if (filters.forumId) {
    constraints.push(where("forumId", "==", filters.forumId));
  }

  if (filters.userId) {
    constraints.push(where("author.id", "==", filters.userId));
  }

  constraints.push(orderBy("createdAt", "desc"));

  return query(collection(db, "posts"), ...constraints);
}

async function getPosts(filters: PostFilters = {}) {
  const postsQuery = buildPostQuery(filters);
  const postsSnapshot = await getDocs(postsQuery);

  return postsSnapshot.docs.map((postDoc) => ({
    id: postDoc.id,
    ...postDoc.data(),
  })) as Post[];
}

async function createPost(
  author: PrivateUser,
  title: string,
  content: string,
  forumId: string,
) {
  if (!author || !title || !content || !forumId) {
    throw new Error("author, title, content, and forumId are required");
  }

  const postData: PostRecord = {
    author,
    title,
    content,
    likes: 0,
    forumId,
  };

  const docRef = await addDoc(collection(db, "posts"), {
    ...postData,
    createdAt: serverTimestamp(),
  });
  const docSnap = await getDoc(docRef);
  const docData = docSnap.data() as PostRecord;

  return { id: docRef.id, ...docData } as Post;
}

async function editPost(
  postId: string,
  updates: {
    title?: string;
    content?: string;
    forumId?: string;
  },
) {
  if (!postId) {
    throw new Error("postId is required");
  }

  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, updates);
  const snap = await getDoc(postRef);

  return { id: postId, ...snap.data() } as Post;
}

async function deletePost(postId: string) {
  if (!postId) {
    throw new Error("postId is required");
  }

  await deleteDoc(doc(db, "posts", postId));
  return { id: postId };
}

export { createPost, deletePost, editPost, getPosts };
