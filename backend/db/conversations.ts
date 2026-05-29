import { db } from "../firebase.js";
import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";

import type { Conversation } from "../../types/index.js";

type TimestampLike = {
  toMillis: () => number;
};

function getSentAtMillis(sentAt: unknown) {
  if (!sentAt) {
    return 0;
  }

  if (typeof sentAt === "string") {
    const parsedSentAt = Date.parse(sentAt);
    return Number.isNaN(parsedSentAt) ? 0 : parsedSentAt;
  }

  if (
    typeof sentAt === "object" &&
    sentAt !== null &&
    "toMillis" in sentAt &&
    typeof (sentAt as TimestampLike).toMillis === "function"
  ) {
    return (sentAt as TimestampLike).toMillis();
  }

  return 0;
}

// Conversations have the form:
// { id: string,
//   participants: [string, string],
//   last_message: {
//     content: string,
//     read: bool,
//     sender_id: string,
//     sent_at: Timestamp
//   }
// }

async function getConversations(userId: string) {
  if (!userId) {
    throw new Error("User id required to fetch conversations");
  }

  const conversationsQuery = query(
    collection(db, "conversations"),
    where("participants", "array-contains", userId),
    orderBy("last_message.sent_at", "desc"),
  );

  const conversationsSnapshot = await getDocs(conversationsQuery);

  const conversations = conversationsSnapshot.docs.map((conversationDoc) => ({
    id: conversationDoc.id,
    ...conversationDoc.data(),
  })) as Conversation[];

  return conversations.sort(
    (firstConversation: Conversation, secondConversation: Conversation) => {
      const firstLastMessage = firstConversation.last_message ?? {};
      const secondLastMessage = secondConversation.last_message ?? {};

      const firstUnreadPriority =
        firstLastMessage.read === false &&
        firstLastMessage.sender_id !== userId;
      const secondUnreadPriority =
        secondLastMessage.read === false &&
        secondLastMessage.sender_id !== userId;

      if (firstUnreadPriority !== secondUnreadPriority) {
        return firstUnreadPriority ? -1 : 1;
      }

      const firstSentAt = getSentAtMillis(firstLastMessage.sent_at);
      const secondSentAt = getSentAtMillis(secondLastMessage.sent_at);

      return secondSentAt - firstSentAt;
    },
  );
}

async function createConversation(
  senderId: string,
  recipientId: string,
  initialMessageContent: string,
) {
  if (!senderId || !recipientId) {
    throw new Error("Both participant ids are required");
  }

  if (senderId === recipientId) {
    throw new Error("Conversation participants must be different users");
  }

  if (!initialMessageContent) {
    throw new Error("Initial message required to create conversation");
  }

  const existingConversationsQuery = query(
    collection(db, "conversations"),
    where("participants", "array-contains", senderId),
  );
  const existingConversationsSnapshot = await getDocs(
    existingConversationsQuery,
  );

  const conversationAlreadyExists = existingConversationsSnapshot.docs.some(
    (conversationDoc) => {
      const conversationData = conversationDoc.data();
      return conversationData.participants?.includes(recipientId);
    },
  );

  if (conversationAlreadyExists) {
    const error = new Error("Conversation already exists");
    throw error;
  }

  const participants = [senderId, recipientId];
  const timestamp = serverTimestamp();

  const conversationRef = doc(collection(db, "conversations"));
  const messageRef = doc(collection(db, "messages"));

  const newConversation = {
    participants,
    last_message: {
      content: initialMessageContent,
      read: false,
      sender_id: senderId,
      sent_at: timestamp,
    },
  };

  const initialMessage = {
    sender_id: senderId,
    conversation_id: conversationRef.id,
    content: initialMessageContent,
    sent_at: timestamp,
  };

  const batch = writeBatch(db);
  batch.set(conversationRef, newConversation);
  batch.set(messageRef, initialMessage);
  await batch.commit();

  const docSnap = await getDoc(conversationRef);
  const docData = docSnap.data();

  return {
    id: conversationRef.id,
    ...docData,
  };
}

async function markConversationRead(conversationId: string, userId: string) {
  const conversationRef = doc(db, "conversations", conversationId);
  const conversationSnap = await getDoc(conversationRef);

  if (!conversationSnap.exists()) {
    throw new Error("Conversation not found");
  }

  const data = conversationSnap.data();
  const lastMessage = data?.last_message;

  if (
    lastMessage &&
    lastMessage.read === false &&
    lastMessage.sender_id !== userId
  ) {
    await updateDoc(conversationRef, { "last_message.read": true });
  }
}

export { createConversation, getConversations, markConversationRead };
