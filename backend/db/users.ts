// User {
//   id: string,
//   displayName: string
// }

import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import type { Song, Artist } from "../../types";

async function getUserById(id: string) {
  if (!id) {
    throw new Error("ID missing from getUserById");
  }

  try {
    const userRef = doc(db, "users", id);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return null;

    const data = snap.data();
    return { id, ...data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Error fetching user by id: ${message || err}`);
  }
}

async function createNewUser(
  id: string,
  displayName: string,
  images: { url: string }[],
) {
  if (!id || !displayName) {
    throw new Error("ID or display name missing from create new user");
  }

  const newUser = {
  displayName,
  profilePic: images?.[0]?.url || "",

  isPublic: true,
  showTopSongs: false,
  showTopArtists: false,
  showLikedSongs: false,

  topSongAllTime: [],
  topArtistAllTime: [],
  likedSongs: [],
  likedSongsCount: 0,
};

  try {
    const userRef = doc(db, "users", id);

    const existingUserSnap = await getDoc(userRef);

    if (existingUserSnap.exists()) {
      return { id, ...existingUserSnap.data() };
    }

    await setDoc(userRef, newUser);

    return { id, ...newUser };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Error creating new user: ${message || err}`);
  }
}

async function updateUserById(id: string, updates: Partial<{
  displayName: string;
  profilePic: string;
  bio: string;
  isPublic: boolean;
  showTopSongs: boolean;
  showTopArtists: boolean;
  showLikedSongs: boolean;
  topSongAllTime: Song[];
  topArtistAllTime: Artist[];
  likedSongs: Song[];
  likedSongsCount: number;
}>) {
  if (!id) {
    throw new Error("ID missing from updateUserById");
  }

  try {
    const userRef = doc(db, "users", id);

    await updateDoc(userRef, updates);

    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return null;
    }

    return { id, ...snap.data() };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Error updating user by id: ${message || err}`);
  }
}

async function getUsersByIds(ids: string[]): Promise<Record<string, { id: string; displayName: string; profilePic?: string }>> {
  if (!ids?.length) return {};
  const snaps = await Promise.all(ids.map((id) => getDoc(doc(db, "users", id))));
  const result: Record<string, { id: string; displayName: string; profilePic?: string }> = {};
  snaps.forEach((snap, i) => {
    if (snap.exists()) result[ids[i]] = { id: ids[i], ...(snap.data() as any) };
  });
  return result;
}

export { createNewUser, getUserById, updateUserById, getUsersByIds };
