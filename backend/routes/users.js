import express from "express";
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

export { router };