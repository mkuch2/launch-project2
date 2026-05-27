import { useEffect, useState } from "react";
import ForumPreview from "../components/ForumPreview";
import type { Forum } from "../../../types";
import axios from "axios";
import { firebaseTimestampToString } from "../utilities/firebaseTimestampToString";
import "./styles/Forums.css";
import { Link } from "react-router";
import Loading from "../components/ui/Loading";
import CreateForumForm from "../components/ui/CreateForumForm";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Timestamp } from "firebase/firestore";

export default function Forums() {
  const { user } = useContext(AuthContext);
  const [forums, setForums] = useState<Forum[]>([]);
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

  const handleCreateForum = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !forumName.trim()) {
      return;
    }

    const newForumTempId = `new-${Date.now()}`;
    const newForumTemp: Forum = {
      id: newForumTempId,
      author: { id: user.id, displayName: user.displayName },
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
          author: { id: user.id, displayName: user.displayName },
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="forum-page">
      <h1>Forums</h1>
      <div className="forums-list-container">
        {forums.length > 0 ? (
          forums.map((f) => (
            <Link key={f.id} to={`/forum/${f.id}`}>
              <ForumPreview
                author={f.author}
                name={f.name}
                createdAt={firebaseTimestampToString(f.createdAt)}
              />
            </Link>
          ))
        ) : (
          <span>No forums found</span>
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
            onClick={() => setCreatingForum(true)}
          >
            Create new forum
          </button>
        )}
      </div>
    </div>
  );
}
