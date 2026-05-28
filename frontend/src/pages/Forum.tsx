import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Post, Forum as ForumType } from "../../../types";
import axios from "axios";
import PostCard from "../components/PostCard";
import { firebaseTimestampToString } from "../utilities/firebaseTimestampToString";

import "./styles/Forum.css";

export default function Forum() {
  const { forumId } = useParams();
  const [forum, setForum] = useState<ForumType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchForumInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/forums/${forumId}`,
        );

        setForum(response.data);
      } catch (err) {
        console.error("Error fetching forum: ", err);
      }
    };

    const fetchForumPosts = async (forumId: string) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/posts/forum/${forumId}`,
        );

        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching forum posts: ", err);
      } finally {
        setLoading(false);
      }
    };

    if (!forumId) {
      return;
    }

    fetchForumInfo();
    fetchForumPosts(forumId);
  }, []);

  return (
    <div className="forum-page">
      <div className="forum-header">
        <h1>{forum?.name}</h1>
        by: {forum?.author.displayName}
      </div>

      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : loading ? (
        <p>Loading posts... </p>
      ) : (
        <div className="forum-post-list">
          {posts.map((p) => (
            <PostCard
              title={p.title}
              author={p.author}
              content={p.content}
              createdAt={firebaseTimestampToString(p.createdAt, true)}
              likes={p.likes.toString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
