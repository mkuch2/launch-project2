import { useMemo, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../AuthContext";

type Conversation = {
  id: string;
  participants: string[];
  last_message?: {
    content: string;
    read: boolean;
    sender_id: string;
    sent_at: any;
  };
  otherUser: {
    id: string;
    displayName: string;
    profilePic?: string;
  };
};

export default function Inbox(): JSX.Element {
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const { data } = await axios.get<Conversation[]>(
          `${import.meta.env.VITE_API_URL}/api/conversations`,
        );
        setConversations(data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, [user?.id]);

  const filtered = useMemo(() => {
    if (!query) return conversations;
    return conversations.filter((c) =>
      c.otherUser.displayName.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, conversations]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-semibold">Inbox</h2>
            <div className="text-2xl">📮</div>
          </div>

          <div className="relative w-80">
            <input
              type="text"
              className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="Search username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              aria-label="search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              🔍
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">Loading...</p>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((c) => (
              <div
                key={c.id}
                onClick={() =>
                  navigate(`/message/${c.id}`, {
                    state: { userName: c.otherUser.displayName },
                  })
                }
                className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                  {c.otherUser.profilePic ? (
                    <img
                      src={c.otherUser.profilePic}
                      alt={c.otherUser.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    c.otherUser.displayName[0]?.toUpperCase() ?? "U"
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {c.otherUser.displayName}
                    </h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                    {c.last_message?.content ?? "No messages yet"}
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  {c.last_message?.read === false &&
                    c.last_message.sender_id !== user?.id && (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  <span className="text-gray-300">→</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">
                {query ? "No conversations found" : "No conversations yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
