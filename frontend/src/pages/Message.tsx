import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useLocation } from "react-router";
import axios from "axios";
import { AuthContext } from "../AuthContext";

type ChatMessage = {
  id: string;
  sender_id: string;
  conversation_id: string;
  content: string;
  sent_at: any;
};

export default function Message(): JSX.Element {
  const { conversationId } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const userName = (location.state as any)?.userName ?? "User";
  const userInitials = userName[0]?.toUpperCase() ?? "?";

  useEffect(() => {
    if (!conversationId) return;

    async function fetchMessages() {
      try {
        const { data } = await axios.get<ChatMessage[]>(
          `${import.meta.env.VITE_API_URL}/api/messages/${conversationId}`,
        );
        setMessages([...data].reverse());
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !conversationId || sending) return;

    setSending(true);
    try {
      const { data: newMessage } = await axios.post<ChatMessage>(
        `${import.meta.env.VITE_API_URL}/api/messages/${conversationId}`,
        { content: messageInput },
      );
      setMessages((prev) => [...prev, newMessage]);
      setMessageInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-6 border-b border-gray-200 bg-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-sm">
            {userInitials}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{userName}</h3>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && (
            <p className="text-center text-gray-400 text-sm">Loading...</p>
          )}
          {!loading && messages.length === 0 && (
            <p className="text-center text-gray-400 text-sm">
              No messages yet. Say hi!
            </p>
          )}
          {messages.map((message) => {
            const isMe = message.sender_id === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    isMe
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Message input */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              disabled={sending}
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !messageInput.trim()}
              className="text-gray-400 hover:text-green-500 text-xl disabled:opacity-30"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
