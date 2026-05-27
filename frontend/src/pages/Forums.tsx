import { useEffect, useState } from "react";
import ForumPreview from "../components/ForumPreview";
import type { Forum } from "../../../types";
import axios from "axios";
import { firebaseTimestampToString } from "../utilities/firebaseTimestampToString";
import "./styles/Forums.css";
import { Link } from "react-router";
import Loading from "../components/ui/Loading";
import CreateForumForm from "../components/ui/CreateForumForm";

export default function Forums() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(false);

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
      <CreateForumForm />
    </div>
  );
}
