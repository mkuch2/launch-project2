import { db } from "../firebase.js";
import {
  collection,
  /*deleteDoc,*/
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  increment,
  writeBatch,
  updateDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";

import type { PrivateUser, Post } from "../../types/index.js";
import { Timestamp, FieldValue } from "firebase/firestore";

interface PostRecord {
  author: PrivateUser;
  title: string;
  content: string;
  forumId: string;
}

interface LikesRecord {
  likes: number;
  createdAt?: Timestamp | FieldValue;
}

interface PostFilters {
  forumId?: string;
  conversationId?: string;
  userId?: string;
  viewerId?: string;
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

  const postsWithLikes = await Promise.all(
    postsSnapshot.docs.map(async (postDoc) => {
      const likesRef = doc(postDoc.ref, "likes", "metadata");
      const likesSnap = await getDoc(likesRef);
      const likesData = likesSnap.data() as LikesRecord | undefined;
      const likedByCurrentUser = filters.viewerId
        ? (await getDoc(doc(postDoc.ref, "likes", filters.viewerId))).exists()
        : false;
      const postData = postDoc.data() as Omit<Post, "id" | "likes"> & {
        likes?: number;
      };

      return {
        id: postDoc.id,
        ...postData,
        likes: likesData?.likes ?? postData.likes ?? 0,
        likedByCurrentUser,
      } as Post;
    }),
  );

  return postsWithLikes;
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
    forumId,
  };

  const postRef = doc(collection(db, "posts"));
  const likesRef = doc(collection(postRef, "likes"), "metadata");
  const batch = writeBatch(db);

  batch.set(postRef, {
    ...postData,
    createdAt: serverTimestamp(),
  });
  batch.set(likesRef, {
    likes: 0,
    createdAt: serverTimestamp(),
  });

  await batch.commit();

  const docSnap = await getDoc(postRef);
  const likesSnap = await getDoc(likesRef);
  const docData = docSnap.data() as Omit<Post, "id" | "likes"> & {
    createdAt?: Timestamp | FieldValue;
  };
  const likesData = likesSnap.data() as LikesRecord | undefined;

  return { id: postRef.id, ...docData, likes: likesData?.likes ?? 0 } as Post;
}

async function editPost(
  postId: string,
  updates: {
    title?: string;
    content?: string;
    forumId?: string;
    likes?: number;
  },
) {
  if (!postId) {
    throw new Error("postId is required");
  }

  const postRef = doc(db, "posts", postId);
  const likesRef = doc(postRef, "likes", "metadata");
  const { likes, ...postUpdates } = updates;

  if (Object.keys(postUpdates).length > 0) {
    await updateDoc(postRef, postUpdates);
  }

  if (likes !== undefined) {
    await updateDoc(likesRef, { likes });
  }

  const [snap, likesSnap] = await Promise.all([
    getDoc(postRef),
    getDoc(likesRef),
  ]);
  const snapData = snap.data() as Omit<Post, "id" | "likes">;
  const likesData = likesSnap.data() as LikesRecord | undefined;

  return {
    id: postId,
    ...snapData,
    likes: likesData?.likes ?? likes ?? 0,
  } as Post;
}

async function likePost(postId: string, user: PrivateUser) {
  if (!postId) {
    throw new Error("postId is required");
  }

  if (!user?.id) {
    throw new Error("user is required to like a post");
  }

  const postRef = doc(db, "posts", postId);
  const likesRef = doc(postRef, "likes", "metadata");
  const userLikeRef = doc(collection(postRef, "likes"), user.id);
  const existingLikeSnap = await getDoc(userLikeRef);
  const isLikedAfterToggle = !existingLikeSnap.exists();

  const batch = writeBatch(db);

  if (existingLikeSnap.exists()) {
    batch.delete(userLikeRef);
    batch.set(
      likesRef,
      {
        likes: increment(-1),
      },
      { merge: true },
    );
  } else {
    batch.set(userLikeRef, {
      createdAt: serverTimestamp(),
      user,
    });
    batch.set(
      likesRef,
      {
        likes: increment(1),
      },
      { merge: true },
    );
  }

  await batch.commit();

  const [postSnap, likesSnap] = await Promise.all([
    getDoc(postRef),
    getDoc(likesRef),
  ]);
  const postData = postSnap.data() as Omit<Post, "id" | "likes">;
  const likesData = likesSnap.data() as LikesRecord | undefined;

  return {
    id: postId,
    ...postData,
    likes: likesData?.likes ?? 0,
    likedByCurrentUser: isLikedAfterToggle,
  } as Post;
}

async function deletePost(postId: string) {
  if (!postId) {
    throw new Error("postId is required");
  }

  const postRef = doc(db, "posts", postId);
  const likesSnapshot = await getDocs(collection(postRef, "likes"));
  const batch = writeBatch(db);

  likesSnapshot.docs.forEach((likeDoc) => {
    batch.delete(likeDoc.ref);
  });

  batch.delete(postRef);
  await batch.commit();

  return { id: postId };
}

export { createPost, deletePost, editPost, getPosts, likePost };
