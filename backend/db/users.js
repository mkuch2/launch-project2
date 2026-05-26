// User {
//   id: string,
//   username: string
// }

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase.js";

async function createNewUser(id, username) {
  if (!id || !username) {
    throw new Error("ID or Username missing from create new user");
  }

  const newUser = {
    username,
  };

  try {
    const userRef = doc(db, "users", id);
    await setDoc(userRef, newUser);

    return { ...newUser, id: id };
  } catch (err) {
    throw new Error(`Error creating new user: ${err?.message || err}`);
  }
}

export { createNewUser };
