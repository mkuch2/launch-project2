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

// Messages have the form:
// { id: string,
//   content: string
//   conversation_id: string
//   sender_id: string
//   sent_at: timestamp
// }

async function getMessages(conversationId) {
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
    throw new Error(err);
  }
}

async function sendNewMessage(userId, conversationId, content) {
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
    const docRef = await addDoc(collection(db, "messages"), newMessage);
    const docSnapshot = await getDoc(docRef);
    const docData = docSnapshot.data();

    return {
      id: docRef.id,
      ...newMessage,
      sent_at: docData.sent_at,
    };
  } catch (err) {
    throw new Error(`Error creating new message: ${err?.message || err}`);
  }
}

export { getMessages, sendNewMessage };
