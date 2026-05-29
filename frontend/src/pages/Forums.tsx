import { useEffect, useState } from "react";
import ForumCard from "../components/ForumCard";
import type { Forum } from "../../../types";
import axios from "axios";
import { firebaseTimestampToString } from "../utilities/firebaseTimestampToString";
import "./styles/Forums.css";
import Loading from "../components/ui/Loading";
import CreateForumForm from "../components/ui/CreateForumForm";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Timestamp } from "firebase/firestore";

export default function Forums() {
  const { user } = useContext(AuthContext);
  const [forums, setForums] = useState<Forum[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [creatingForum, setCreatingForum] = useState(false);
  const [forumName, setForumName] = useState("");

  useEffect(() => {
    const fetchForums = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/forums`,
        );

        setForums(response.data);
      } catch (err) {
        console.error("Error fetching forums: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, []);

  const filteredForums = forums.filter((forum) =>
    forum.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateForum = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !forumName.trim()) {
      return;
    }

    const newForumTempId = `new-${Date.now()}`;
    const newForumTemp: Forum = {
      id: newForumTempId,
      author: {
        id: user.id,
        displayName: user.displayName,
        profilePic: user.profilePic ?? "",
      },
      name: forumName.trim(),
      createdAt: Timestamp.now(),
    };

    setForums((prevForums) => [newForumTemp, ...prevForums]);
    setForumName("");
    setCreatingForum(false);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/forums`,
        {
          author: {
            id: user.id,
            displayName: user.displayName,
            profilePic: user.profilePic ?? "",
          },
          name: newForumTemp.name,
        },
      );

      const createdForum = response.data as Forum;

      setForums((prevForums) =>
        prevForums.map((forum) =>
          forum.id === newForumTempId ? { ...forum, ...createdForum } : forum,
        ),
      );
    } catch (err) {
      console.error("Error posting forum:", err);
      setForums((prevForums) =>
        prevForums.filter((forum) => forum.id !== newForumTempId),
      );
    }
  };

  const handleEditForum = async (id: string, name: string) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/forums/${id}`, {
        name,
      });

      setForums((prevForums) =>
        prevForums.map((f) => (f.id === id ? { ...f, name } : f)),
      );
    } catch (err) {
      console.error("Error patching forum post: ", err);
    }
  };

  const handleDeleteForum = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/forums/${id}`);
      setForums((prevForums) => prevForums.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Error deleting forum: ", err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="forum-page">
      <div className="discover__header">
        <h1>Forums</h1>
        <input
          className="discover__search"
          type="text"
          placeholder="Browse forums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="forums-list-container">
        {filteredForums.length > 0 ? (
          filteredForums.map((f) => (
            <div key={f.id} className="forum-preview-container">
              <ForumCard
                forumId={f.id}
                author={f.author}
                name={f.name}
                createdAt={firebaseTimestampToString(f.createdAt)}
                currentUserId={user?.id}
                onEdit={handleEditForum}
                onDelete={handleDeleteForum}
              />
            </div>
          ))
        ) : (
          <span className="discover__status">No forums found</span>
        )}
      </div>

      <div className="forums-create-new">
        {creatingForum ? (
          <CreateForumForm
            forumName={forumName}
            setForumName={setForumName}
            onSubmit={handleCreateForum}
            setCreatingForm={setCreatingForum}
          />
        ) : (
          <button
            className="forum-create-button"
            onClick={() => {
              if (user) {
                setCreatingForum(true);
              } else {
                const confirmed = confirm("You need to login to create a forum. Go to login?");
                if (confirmed) {
                  window.location.href = `${import.meta.env.VITE_API_URL}/spotify/login`;
                }
              }
            }}
          >
            Create new forum
          </button>
        )}
      </div>
    </div>
  );
}
