import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  query,
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

export { createConversation };
