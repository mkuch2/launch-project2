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
    sent_at: string;
  };
  otherUser: {
    id: string;
    displayName: string;
    profilePic?: string;
  };
};

function timeAgo(sentAt: string): string {
  if (!sentAt) return "";
  let ms: number;
  //if (sentAt?.seconds != null) {
    //ms = sentAt.seconds * 1000;
  if (typeof sentAt === "string") {
    ms = Date.parse(sentAt);
  } else {
    return "";
  }
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

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
  }, []);

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
          <h2 className="text-3xl font-semibold">Inbox</h2>

          <input
            type="text"
            placeholder="Search username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-80 px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 outline-none transition-colors focus:border-gray-400"
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">Loading...</p>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((c) => {
              const isUnread =
                c.last_message?.read === false &&
                c.last_message.sender_id !== user?.id;

              return (
                <div
                  key={c.id}
                  onClick={() =>
                    navigate(`/message/${c.id}`, {
                      state: { userName: c.otherUser.displayName, profilePic: c.otherUser.profilePic },
                    })
                  }
                  className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                >
                  {/* Avatar */}
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

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {c.otherUser.displayName}
                      </h3>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {timeAgo(c.last_message?.sent_at)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed line-clamp-1 text-gray-500">
                      {c.last_message?.content ?? "No messages yet"}
                    </p>
                  </div>

                  {/* Unread dot */}
                  <div className="flex-shrink-0 flex items-center self-center">
                    {isUnread ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    ) : (
                      <span className="text-gray-300 text-sm">›</span>
                    )}
                  </div>
                </div>
              );
            })
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
