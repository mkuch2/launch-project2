import express from "express";
import { createConversation } from "../db/conversations.js";

const router = express.Router();

// Conversations have the form:
// { id: string,
//   participants: [string, string]
//  }

router.post("/", async (req, res) => {
  // TODO: get sender with auth middleware rather than body const senderId = req.user.id;
  const { senderId, recipientId } = req.body;

  if (!senderId) {
    return res.status(400).json({
      message: "senderId required to create a new conversation",
    });
  }

  if (!recipientId) {
    return res.status(400).json({
      message: "recipientId is required to create a new conversation",
    });
  }

  try {
    const newConversation = await createConversation(senderId, recipientId);
    return res.status(201).json(newConversation);
  } catch (err) {
    console.error("Error when attempting to create new conversation: ", err);
    return res.status(500).json({
      message: "Error occurred when creating conversation. Please try again.",
    });
  }
});

export { router };
