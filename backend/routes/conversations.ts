import express from "express";
import { createConversation, getConversations } from "../db/conversations.js";
import { getUsersByIds } from "../db/users.js";
import type { RequestWithUser } from "../types/request.js";
import { Conversation } from "../../types/index.js";

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

router.get("/", async (req: RequestWithUser, res) => {
  const userId = req.user?.id ?? req.body.userId;

  if (!userId) {
    return res.status(400).json({
      message: "userId required to fetch conversations",
    });
  }

  try {
    const conversations = await getConversations(userId);

    const otherUserIds = [
      ...new Set(
        conversations.flatMap((c: Conversation) =>
          (c.participants as string[]).filter((id) => id !== userId),
        ),
      ),
    ];
    const usersById = await getUsersByIds(otherUserIds);

    const enriched = conversations.map((c: Conversation) => {
      const otherUserId = (c.participants as string[]).find((id) => id !== userId);
      return {
        ...c,
        otherUser: otherUserId
          ? (usersById[otherUserId] ?? { id: otherUserId, displayName: "Unknown" })
          : { id: null, displayName: "Unknown" },
      };
    });

    return res.status(200).json(enriched);
  } catch (err) {
    console.error("Error when attempting to fetch conversations: ", err);
    return res.status(500).json({
      message: "Error occurred when fetching conversations. Please try again.",
    });
  }
});

router.post("/", async (req: RequestWithUser, res) => {
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
  } catch (_err) {
    return res.status(500).json({
      message: "Error occurred when creating conversation. Please try again.",
    });
  }
});

export { router };
