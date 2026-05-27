import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const router = express.Router();
router.use(cookieParser());

router.get("/login", function (req, res) {
  const scope =
    "user-read-private user-read-email user-library-read user-top-read";

  const searchParams = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_WEBAPI_ID,
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

router.get("/user-profile", async function (req, res) {
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

export { router };
