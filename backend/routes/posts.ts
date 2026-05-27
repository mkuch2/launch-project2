import express, { type Request, type Response, type Router } from "express";
import { createPost, deletePost, editPost, getPosts } from "../db/posts.js";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  try {
    const posts = await getPosts();
    return res.status(200).json(posts);
  } catch (err) {
    console.error("Error attempting to get posts:", err);
    return res.status(500).json({ error: "Server error getting posts" });
  }
});

router.get("/user/:userId", async function (req: Request, res: Response) {
  const userId = req.params.userId ?? null;

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: "User ID missing" });
  }

  try {
    const posts = await getPosts({ userId });
    return res.status(200).json(posts);
  } catch (err) {
    console.error("Error attempting to get user posts:", err);
    return res.status(500).json({ error: "Server error getting user posts" });
  }
});

router.get("/forum/:forumId", async function (req: Request, res: Response) {
  const forumId = req.params.forumId ?? null;

  if (!forumId || Array.isArray(forumId)) {
    return res.status(400).json({ error: "Forum ID missing" });
  }

  try {
    const posts = await getPosts({ forumId });
    return res.status(200).json(posts);
  } catch (err) {
    console.error("Error attempting to get forum posts:", err);
    return res.status(500).json({ error: "Server error getting forum posts" });
  }
});

router.post("/", async function (req: Request, res: Response) {
  const { author, title, content, forumId } = req.body;

  if (!author || !title || !content || !forumId) {
    return res.status(400).json({
      error: "author, title, content, and forumId are required",
    });
  }

  try {
    const newPost = await createPost(author, title, content, forumId);
    return res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(500).json({ error: "Server error creating post" });
  }
});

router.patch("/:postId", async function (req: Request, res: Response) {
  const postId = req.params.postId ?? null;
  const updates = req.body;

  if (!postId || Array.isArray(postId)) {
    return res.status(400).json({ error: "Post ID missing" });
  }

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "At least one field is required" });
  }

  try {
    const updatedPost = await editPost(postId, updates);
    return res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error editing post:", err);
    return res.status(500).json({ error: "Server error editing post" });
  }
});

router.delete("/:postId", async function (req: Request, res: Response) {
  const postId = req.params.postId ?? null;

  if (!postId || Array.isArray(postId)) {
    return res.status(400).json({ error: "Post ID missing" });
  }

  try {
    const deletedPost = await deletePost(postId);
    return res.status(200).json(deletedPost);
  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ error: "Server error deleting post" });
  }
});

export { router };
