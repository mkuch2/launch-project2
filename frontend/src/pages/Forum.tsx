import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Forum as ForumType } from "../../../types";
import axios from "axios";

export default function Forum() {
  const { forumId } = useParams();
  const [forum, setForum] = useState<ForumType | null>(null);

  useEffect(() => {
    const fetchForumInfo = async () => {
      console.log("forum id is: ", forumId);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/forums/${forumId}`,
        );

        setForum(response.data);
      } catch (err) {
        console.error("Error fetching forum: ", err);
      }
    };
    fetchForumInfo();
  }, []);

  return (
    <div className="forum-page">
      <h1>Forums</h1>
      <div className="forums-list-container"></div>
      {forum && <p>Form name is {forum.name}</p>}
    </div>
  );
}
