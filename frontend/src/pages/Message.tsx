import { useState, useMemo } from "react";
import { useParams, useLocation } from "react-router";

type ChatMessage = {
  id: string;
  sender: "user" | "other";
  content: string;
  timestamp?: string;
};

type Conversation = {
  id: string;
  userName: string;
  userInitials: string;
  lastMessage: string;
  messages: ChatMessage[];
};

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    userName: "Alex",
    userInitials: "A",
    lastMessage: "What's your favorite artist?",
    messages: [
      {
        id: "m1",
        sender: "other",
        content: "Hey! Have you checked out the new release from The Weeknd?",
      },
      {
        id: "m2",
        sender: "user",
        content: "Not yet! Is it good?",
      },
      {
        id: "m3",
        sender: "other",
        content: "Definitely! The production is insane. What's your favorite artist?",
      },
    ],
  },
  {
    id: "2",
    userName: "Jordan",
    userInitials: "J",
    lastMessage: "Let me know what you think...",
    messages: [
      {
        id: "m1",
        sender: "other",
        content: "I made a Spotify playlist combining indie and hip-hop",
      },
      {
        id: "m2",
        sender: "other",
        content: "Let me know what you think...",
      },
    ],
  },
  {
    id: "3",
    userName: "Sam",
    userInitials: "S",
    lastMessage: "See you at the concert!",
    messages: [
      {
        id: "m1",
        sender: "other",
        content: "Are you going to the Taylor Swift concert?",
      },
      {
        id: "m2",
        sender: "user",
        content: "Yes! So excited! Front row tickets",
      },
      {
        id: "m3",
        sender: "other",
        content: "See you at the concert!",
      },
    ],
  },
  {
    id: "4",
    userName: "Morgan",
    userInitials: "M",
    lastMessage: "Sounds great!",
    messages: [
      {
        id: "m1",
        sender: "user",
        content: "Just discovered this amazing jazz artist",
      },
      {
        id: "m2",
        sender: "other",
        content: "Sounds great! Send me the link?",
      },
    ],
  },
];

export default function Message(): JSX.Element {
  const { userId } = useParams();
  const location = useLocation();
  const [messageInput, setMessageInput] = useState("");

  const selectedConversation = useMemo(() => {
    return MOCK_CONVERSATIONS.find((c) => c.id === (userId || "1"));
  }, [userId]);

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedConversation) {
      console.log("Sending message:", messageInput, "to", selectedConversation.userName);
      setMessageInput("");
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Right side - Chat area (full width now) */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        {selectedConversation && (
          <div className="p-6 border-b border-gray-200 bg-white flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-sm">
              {selectedConversation.userInitials}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedConversation.userName}</h3>
              <p className="text-sm text-gray-500">Active now</p>
            </div>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {selectedConversation?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600 text-xl">📎</button>
            <button className="text-gray-400 hover:text-gray-600 text-xl">🎵</button>

            <input
              type="text"
              placeholder="Enter message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />

            <button
              onClick={handleSendMessage}
              className="text-gray-400 hover:text-green-500 text-xl"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
