import express from "express";
import { createConversation, getConversations } from "../db/conversations.js";

const router = express.Router();

// Conversations have the form:
// { id: string,
//   participants: [string, string],
//   last_message: {
//                   content: string,
//                   read: bool,
//                   sender_id: string,
//                   sent_at: timestamp
//                 }
//  }

router.get("/", async (req, res) => {
  const userId = req.user?.id ?? req.body.userId;

  if (!userId) {
    return res.status(400).json({
      message: "userId required to fetch conversations",
    });
  }

  try {
    const conversations = await getConversations(userId);
    return res.status(200).json(conversations);
  } catch (err) {
    console.error("Error when attempting to fetch conversations: ", err);
    return res.status(500).json({
      message: "Error occurred when fetching conversations. Please try again.",
    });
  }
});

router.post("/", async (req, res) => {
  const senderId = req.user?.id ?? req.body.senderId;
  const { recipientId, initialMessage } = req.body;

  if (!senderId) {
    return res.status(400).json({
      message: "senderId required to create a new conversation",
    });
  }

  if (!recipientId || !initialMessage) {
    return res.status(400).json({
      message:
        "recipientId and initialMessage are required to create a new conversation",
    });
  }

  try {
    const newConversation = await createConversation(
      senderId,
      recipientId,
      initialMessage,
    );
    return res.status(201).json(newConversation);
  } catch (err) {
    if (err.code === "CONVERSATION_ALREADY_EXISTS") {
      return res.status(409).json({
        message: "Conversation already exists between these users",
      });
    }

    console.error("Error when attempting to create new conversation: ", err);
    return res.status(500).json({
      message: "Error occurred when creating conversation. Please try again.",
    });
  }
});

export { router };
