import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const router = express.Router();
router.use(cookieParser());

router.get("/login", function (req, res) {
  const scope =
    "user-read-private user-read-email user-library-read user-top-read";

  const clientId = process.env.SPOTIFY_WEBAPI_ID;

  if (!clientId) {
    throw new Error("Missing SPOTIFY_WEBAPI_ID");
  }

  const searchParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri:
      process.env.SPOTIFY_WEBAPI_REDIRECT_URI ||
      `http://127.0.0.1:${process.env.PORT || "5000"}/callback`,
  });

  console.log("Redirect URI is: ", process.env.SPOTIFY_WEBAPI_REDIRECT_URI);

  console.log("Search params are: ", searchParams.toString());

  res.redirect(
    `https://accounts.spotify.com/authorize?${searchParams.toString()}`,
  );
});

router.get("/user-profile", async function (req: express.Request, res: express.Response) {
  console.log("Cookies: ", req.cookies);
  const accessToken = req.cookies.spotify_access_token;

  if (!accessToken) {
    console.error("Error fetching user profile, access token missing.");
    return res.status(400).send();
  }

  try {
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ` + accessToken,
      },
    });

    const data = await profileResponse.json();
    console.log("Profile data is: ", data);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.get("/top-artists", async (req: express.Request, res: express.Response) => {
  try {
    const accessToken = req.cookies.spotify_access_token;
    const timeRange = req.query.timeRange || "long_term";

    if (!accessToken) {
      return res.status(400).json({ error: "Missing Spotify access token" });
    }

    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching top artists:", error);
    res.status(500).json({ error: "Failed to fetch top artists" });
  }
});

router.get("/top-songs", async (req, res) => {
  try {
    const accessToken = req.cookies.spotify_access_token;
    const timeRange = req.query.timeRange || "long_term";

    if (!accessToken) {
      return res.status(400).json({ error: "Missing Spotify access token" });
    }

    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching top songs:", error);
    res.status(500).json({ error: "Failed to fetch top songs" });
  }
});

export { router };