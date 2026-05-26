import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/", async function (req, res) {
  const code = req.query.code || null;
  const error = req.query.error || null;
  const clientId = process.env.SPOTIFY_WEBAPI_ID;
  const clientSecret = process.env.SPOTIFY_WEBAPI_SECRET;
  const redirectUri =
    process.env.SPOTIFY_WEBAPI_REDIRECT_URI ||
    `http://127.0.0.1:${process.env.PORT || "5000"}/callback`;
  if (!code) {
    console.error("Authorization code not passed in query in callback");
    return res.status(400).send();
  }

  if (error) {
    console.error("Error in callback function: ", error);
    return res.status(401).send();
  }

  const authOptions = {
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  try {
    console.log("Auth options are: ", authOptions);
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: new URLSearchParams(authOptions),
      },
    );

    const tokenData = await tokenResponse.json();
    console.log("Spotify token data is: ", tokenData);

    res.cookie("spotify_access_token", tokenData.accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

    res.redirect("http://localhost:5173/");
  } catch (err) {
    console.error("Error getting access token: ", err);
    return res.status(500).send();
  }
});

export { router };
