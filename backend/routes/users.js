import express from "express";
import { createNewUser, getUserById } from "../db/users.js";
const router = express.Router();

// get api users
// return public user profiles
router.get("/", async (req, res) => {
  try {
    //Todo: read real data from firebase
    const mockUsers = [
      {
        id: "1",
        displayName: "Sara Lewis",
        profilePic: "",
        topArtistAllTime: [{ name: "Taylor Swift" }],
        topArtistSixMonths: [],
        topArtistThisMonth: [],
        topSongAllTime: [],
        topSongSixMonths: [],
        topSongThisMonth: [],
        likedSongsCount: 87,
      },
      {
        id: "2",
        displayName: "Marcus River",
        profilePic: "",
        topArtistAllTime: [{ name: "Drake" }],
        topArtistSixMonths: [],
        topArtistThisMonth: [],
        topSongAllTime: [],
        topSongSixMonths: [],
        topSongThisMonth: [],
        likedSongsCount: 124,
      },
    ];
    res.json(mockUsers);
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
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    console.log("User is: ", user);
    res.status(200).json({ id: id, ...user });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  const { userId, username } = req.body;
  try {
    const newUser = await createNewUser(userId, username);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).json({ error: err.message || "Failed to create user" });
  }
});

export { router };
