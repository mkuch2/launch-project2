import express, { Router, Request, Response } from "express";
import { getMessages, sendNewMessage } from "../db/messages.js";
import type { RequestWithUser } from "../types/request.js";

const router: Router = express.Router();

router.get(
  "/:conversationId",
  async function (req: RequestWithUser, res: Response) {
    const conversationId = req.params.conversationId ?? null;

    if (!conversationId || Array.isArray(conversationId)) {
      return res.status(400).send({ error: "Conversation ID missing" });
    }

    try {
      const messages = await getMessages(conversationId);
      res.status(200).json(messages);
    } catch (err) {
      console.error("Error attempting to get messages: ", err);
      return res.status(500).send({ error: "Server error getting messages" });
    }
  },
);

router.post(
  "/:conversationId",
  async function (req: RequestWithUser, res: Response) {
    const conversationId = req.params.conversationId ?? null;

    const userId = req.user?.id;
    const content = req.body.content;

    console.log("User id is: ", userId);
    console.log("Content is: ", content);
    console.log("Conversation id is: ", conversationId);

    if (
      !conversationId ||
      Array.isArray(conversationId) ||
      !userId ||
      !content
    ) {
      return res.status(400).send({
        error: "Conversation ID, user ID, and content required for new message",
      });
    }

    try {
      const newMessage = await sendNewMessage(userId, conversationId, content);
      return res.status(200).json(newMessage);
    } catch (err) {
      return res
        .status(500)
        .send({ error: "Server error sending message to conversation" });
    }
  },
);

export { router };
