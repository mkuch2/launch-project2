import express from "express";
import { createNewUser, getUserById } from "../db/users.js";
import type { PrivateUser } from "../../types/index.js";
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
    const newUser = await createNewUser(
      userId,
      displayName,
      images,
    );

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
