import { db } from "../firebase.js";
import { collection, addDoc } from "firebase/firestore";

// Conversations have the form:
// { id: string,
//   participants: [string, string]
//  }

async function createConversation(participantAId, participantBId) {
  if (!participantAId || !participantBId) {
    throw new Error("Both participant ids are required");
  }

  if (participantAId === participantBId) {
    throw new Error("Conversation participants must be different users");
  }

  const participants = [participantAId, participantBId];

  const docRef = await addDoc(collection(db, "conversations"), {
    participants,
  });

  return {
    id: docRef.id,
    participants,
  };
}

export { createConversation };
