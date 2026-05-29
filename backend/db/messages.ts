import { db } from "../firebase.js";
import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";

// Messages have the form:
// { id: string,
//   content: string
//   conversation_id: string
//   sender_id: string
//   sent_at: Timestamp
// }

async function getMessages(conversationId: string) {
  if (!conversationId) {
    throw new Error("Conversation id required to fetch messages");
  }

  const messagesQuery = query(
    collection(db, "messages"),
    where("conversation_id", "==", conversationId),
    orderBy("sent_at", "desc"),
  );

  try {
    const messagesSnapshot = await getDocs(messagesQuery);

    return messagesSnapshot.docs.map((messageDoc) => ({
      id: messageDoc.id,
      ...messageDoc.data(),
    }));
  } catch (err) {
    throw new Error("Error fetching messages for conversation", { cause: err });
  }
}

async function sendNewMessage(
  userId: string,
  conversationId: string,
  content: string,
) {
  if (!userId || !conversationId || !content) {
    throw new Error("userId, conversationId, and content are required");
  }

  const newMessage = {
    sender_id: userId,
    conversation_id: conversationId,
    content,
    sent_at: serverTimestamp(),
  };

  try {
    const batch = writeBatch(db);
    const messageRef = doc(collection(db, "messages"));
    const conversationRef = doc(db, "conversations", conversationId);

    batch.set(messageRef, newMessage);
    batch.update(conversationRef, {
      last_message: {
        content,
        read: false,
        sender_id: userId,
        sent_at: newMessage.sent_at,
      },
    });

    await batch.commit();

    const messageSnap = await getDoc(messageRef);
    const messageData = messageSnap.data();

    return {
      id: messageRef.id,
      ...newMessage,
      sent_at: messageData!.sent_at,
    };
  } catch (err) {
    throw new Error("Error creating new message", { cause: err });
  }
}

export { getMessages, sendNewMessage };
