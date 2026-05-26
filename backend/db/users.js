// User {
//   id: string,
//   username: string
// }

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

async function getUserById(id) {
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
    throw new Error(`Error fetching user by id: ${err?.message || err}`);
  }
}

async function createNewUser(id, username) {
  if (!id || !username) {
    throw new Error("ID or Username missing from create new user");
  }

  const newUser = {
    username,
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
    throw new Error(`Error creating new user: ${err?.message || err}`);
  }
}

export { createNewUser, getUserById };
