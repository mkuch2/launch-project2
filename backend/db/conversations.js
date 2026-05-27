import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";

// Conversations have the form:
// { id: string,
//   participants: [string, string],
//   last_message: {
//     content: string,
//     read: bool,
//     sender_id: string,
//     sent_at: timestamp
//   }
// }

async function getConversations(userId) {
  if (!userId) {
    throw new Error("User id required to fetch conversations");
  }

  const conversationsQuery = query(
    collection(db, "conversations"),
    where("participants", "array-contains", userId),
    orderBy("last_message.sent_at", "desc"),
  );

  const conversationsSnapshot = await getDocs(conversationsQuery);

  return (
    conversationsSnapshot.docs
      .map((conversationDoc) => ({
        id: conversationDoc.id,
        ...conversationDoc.data(),
      }))
      // Sorts according to these rules:
      // 1) Unread messages come before all other messages
      // 2) Within unread messages, timestamp dictates order
      .sort((firstConversation, secondConversation) => {
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

        const firstSentAt = firstLastMessage.sent_at?.toMillis?.() ?? 0;
        const secondSentAt = secondLastMessage.sent_at?.toMillis?.() ?? 0;

        return secondSentAt - firstSentAt;
      })
  );
}

async function createConversation(
  senderId,
  recipientId,
  initialMessageContent,
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
    error.code = "CONVERSATION_ALREADY_EXISTS";
    throw error;
  }

  const participants = [senderId, recipientId];

  const newConversation = {
    participants,
    last_message: {
      content: initialMessageContent,
      read: false,
      sender_id: senderId,
      sent_at: serverTimestamp(),
    },
  };

  const docRef = await addDoc(collection(db, "conversations"), newConversation);
  const docSnap = await getDoc(docRef);
  const docData = docSnap.data();

  return {
    id: docRef.id,
    ...docData,
  };
}

export { createConversation, getConversations };
