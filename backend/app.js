import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router as spotifyRouter } from "./routes/spotify.js";
import { router as callbackRouter } from "./routes/callback.js";
import { router as conversationsRouter } from "./routes/conversations.js";
import { router as usersRouter } from "./routes/users.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5005;

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/spotify", spotifyRouter);
app.use("/callback", callbackRouter);
app.use("/conversations", conversationsRouter);
app.use("/api/users", usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
