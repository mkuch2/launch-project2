import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

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

export { router };
