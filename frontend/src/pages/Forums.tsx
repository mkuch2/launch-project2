import { useEffect, useState } from "react";
import ForumCard from "../components/ForumCard";
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
import { Pencil, Trash2 } from "lucide-react";

export default function Forums() {
  const { user } = useContext(AuthContext);
  const [forums, setForums] = useState<Forum[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [creatingForum, setCreatingForum] = useState(false);
  const [editingForum, setEditingForum] = useState(false);
  const [forumName, setForumName] = useState("");
  const [editedForum, setEditedForum] = useState("");
  const [newForumName, setNewForumName] = useState("");

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

  const handleEditForum = async (
    id: string,
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/forums/${id}`, {
        name: newForumName,
      });

      setForums((prevForums) =>
        prevForums.map((f) =>
          f.id === editedForum ? { ...f, name: newForumName } : f,
        ),
      );

      setEditedForum("");
      setEditingForum(false);
      setNewForumName("");
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
              <Link to={`/forum/${f.id}`}>
                <ForumCard
                  author={f.author}
                  name={f.name}
                  createdAt={firebaseTimestampToString(f.createdAt)}
                />
              </Link>
              {f.author.id === user?.id &&
                (editingForum && f.id === editedForum ? (
                  <form
                    className="forum-edit-form"
                    onSubmit={(e) => handleEditForum(f.id, e)}
                  >
                    <label htmlFor="edit-name">New name: </label>
                    <input
                      className="edit-form-input"
                      id="edit-name"
                      name="edit-name"
                      value={newForumName}
                      required
                      onChange={(e) => setNewForumName(e.target.value)}
                    ></input>
                    <div className="editting-btn-options">
                      <button type="submit" className="forum-edit-submit-btn">
                        Rename
                      </button>
                      <button
                        type="button"
                        className="cancel-edit-btn"
                        onClick={() => {
                          setEditingForum(false);
                          setEditedForum("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <span className="forum-icons-span">
                    <Pencil
                      onClick={() => {
                        setEditingForum(true);
                        setEditedForum(f.id);
                      }}
                      className="forum-icons forum-preview-edit-btn"
                    />
                    <Trash2
                      onClick={() => handleDeleteForum(f.id)}
                      className="forum-icons forum-preview-delete-btn"
                    />
                  </span>
                ))}
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
            onClick={() => setCreatingForum(true)}
          >
            Create new forum
          </button>
        )}
      </div>
    </div>
  );
}
