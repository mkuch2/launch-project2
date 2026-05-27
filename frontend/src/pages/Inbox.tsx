import { useMemo, useState } from "react";

type Message = {
  id: string;
  senderName: string;
  senderInitials?: string;
  preview: string;
  timestamp?: string;
};

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    senderName: "User Name",
    senderInitials: "UN",
    preview:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
  },
  {
    id: "2",
    senderName: "User Name",
    senderInitials: "UN",
    preview:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
  },
  {
    id: "3",
    senderName: "User Name",
    senderInitials: "UN",
    preview:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
  },
  {
    id: "4",
    senderName: "User Name",
    senderInitials: "UN",
    preview:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
  },
];

export default function Inbox(): JSX.Element {
  const [query, setQuery] = useState("");

  const messages = useMemo(() => {
    if (!query) return MOCK_MESSAGES;
    return MOCK_MESSAGES.filter(
      (m) =>
        m.senderName.toLowerCase().includes(query.toLowerCase()) ||
        m.preview.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const handleMessageClick = (messageId: string) => {
    // TODO: Connect to backend - navigate to message detail or open message
    console.log("Opening message:", messageId);
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header with title and search */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-semibold">Inbox</h2>
            <div className="text-2xl">📮</div>
          </div>

          <div className="relative w-80">
            <input
              type="text"
              className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="Search messages..."
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

        {/* Messages list */}
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((m) => (
              <div
                key={m.id}
                onClick={() => handleMessageClick(m.id)}
                className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-sm">
                  {m.senderInitials ?? "U"}
                </div>

                {/* Message content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {m.senderName}
                    </h3>
                    {m.timestamp && (
                      <span className="text-xs text-gray-500">{m.timestamp}</span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                    {m.preview}
                  </p>
                </div>

                {/* Right arrow indicator */}
                <div className="flex-shrink-0 text-gray-300">
                  →
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">No messages found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
