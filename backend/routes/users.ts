import express from "express";
import { db } from "../firebase.js";
import { getUserById, createNewUser } from "../db/users.js";
import { collection, getDocs/*, query, where*/ } from "firebase/firestore";
import type { PrivateUser } from "../../types";

const router = express.Router();

// get api users
// return public user profiles
router.get("/", async (req, res) => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/:userId", async (req, res) => {
  const id = req.params.userId ?? null;

  if (!id) {
    return res.status(400).send({ error: "User id required to get user" });
  }

  try {
    const user: PrivateUser = (await getUserById(id)) as PrivateUser;

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    console.log("User is: ", user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  const { userId, displayName, images } = req.body;

  try {
    const newUser = await createNewUser(userId, displayName, images);

    res.status(201).json(newUser);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error creating user:", err);

      return res
        .status(500)
        .json({ error: err.message || "Failed to create user" });
    }

    return res.status(500).send({ error: "Unknown error occured" });
  }
});

export { router };
