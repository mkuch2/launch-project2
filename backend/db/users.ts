// User {
//   id: string,
//   displayName: string
// }

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

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

export { createNewUser, getUserById };
