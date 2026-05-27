import express from "express";
import {
  createForum,
  deleteForum,
  editForum,
  getForum,
  getForums,
} from "../db/forums.js";
import type { Forum } from "../../types/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const forums = (await getForums()) as Forum[];
    return res.status(200).json(forums);
  } catch (err) {
    console.error("Error attempting to get forums:", err);
    return res.status(500).json({
      error: "Server error getting forums",
    });
  }
});

router.get("/:forumId", async (req, res) => {
  const forumId = req.params.forumId ?? null;

  if (!forumId) {
    return res.status(400).json({
      error: "forumId required to fetch forum",
    });
  }

  try {
    const forum = await getForum(forumId);

    if (!forum) {
      return res.status(404).json({
        error: "Forum not found",
      });
    }

    return res.status(200).json(forum);
  } catch (err) {
    console.error("Error attempting to get forum:", err);
    return res.status(500).json({
      error: "Server error getting forum",
    });
  }
});

router.post("/", async (req, res) => {
  const { author, name } = req.body;

  if (!author || !name) {
    return res.status(400).json({
      error: "author and name are required",
    });
  }

  try {
    const newForum = await createForum(author, name);
    return res.status(201).json(newForum);
  } catch (err) {
    console.error("Error creating forum:", err);
    return res.status(500).json({
      error: "Server error creating forum",
    });
  }
});

router.patch("/:forumId", async (req, res) => {
  const forumId = req.params.forumId ?? null;
  const updates = req.body;

  if (!forumId) {
    return res.status(400).json({
      error: "forumId required to edit forum",
    });
  }

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({
      error: "At least one field is required to update forum",
    });
  }

  try {
    const updatedForum = await editForum(forumId, updates);
    return res.status(200).json(updatedForum);
  } catch (err) {
    console.error("Error editing forum:", err);
    return res.status(500).json({
      error: "Server error editing forum",
    });
  }
});

router.delete("/:forumId", async (req, res) => {
  const forumId = req.params.forumId ?? null;

  if (!forumId) {
    return res.status(400).json({
      error: "forumId required to delete forum",
    });
  }

  try {
    const deletedForum = await deleteForum(forumId);
    return res.status(200).json(deletedForum);
  } catch (err) {
    console.error("Error deleting forum:", err);
    return res.status(500).json({
      error: "Server error deleting forum",
    });
  }
});

export { router };
