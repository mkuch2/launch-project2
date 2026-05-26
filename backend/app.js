import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router as spotifyRouter } from "./routes/spotify.js";
import { router as callbackRouter } from "./routes/callback.js";
import { router as conversationsRouter } from "./routes/conversations.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/spotify", spotifyRouter);
app.use("/callback", callbackRouter);
app.use("/conversations", conversationsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
