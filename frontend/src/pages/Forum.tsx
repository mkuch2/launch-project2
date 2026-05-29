import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Post, Forum as ForumType } from "../../../types";
import axios from "axios";
import PostCard from "../components/PostCard";
import { firebaseTimestampToString } from "../utilities/firebaseTimestampToString";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

import "./styles/Forum.css";
import CreatePostForm from "../components/ui/CreatePostForm";

export default function Forum() {
  const { user } = useContext(AuthContext);
  const { forumId } = useParams();
  const [forum, setForum] = useState<ForumType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

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

    const fetchForumPosts = async (forumId: string, viewerId?: string) => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams();

        if (viewerId) {
          searchParams.set("viewerId", viewerId);
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/posts/forum/${forumId}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
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
    fetchForumPosts(forumId, user?.id);
  }, [forumId, user?.id]);

  const handleCreatePost = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !forumId) {
      return;
    }

    const title = postTitle.trim();
    const content = postContent.trim();

    if (!title || !content) {
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        {
          author: {
            id: user.id,
            displayName: user.displayName,
            profilePic: user.profilePic ?? "",
          },
          title,
          content,
          forumId,
        },
      );

      setPosts((prevPosts) => [response.data, ...prevPosts]);
      setPostTitle("");
      setPostContent("");
      setCreatingPost(false);
    } catch (err) {
      console.error("Error creating post: ", err);
    }
  };

  const handleEditPost = async (
    postId: string,
    title: string,
    content: string,
  ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}`,
        { title, content },
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, ...response.data } : post,
        ),
      );
    } catch (err) {
      console.error("Error editing post: ", err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`);

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Error deleting post: ", err);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) {
      return;
    }

    const currentPost = posts.find((post) => post.id === postId);
    const currentLikedByCurrentUser = currentPost?.likedByCurrentUser ?? false;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}/likes`,
        {
          user: {
            id: user.id,
            displayName: user.displayName,
            profilePic: user.profilePic ?? "",
          },
        },
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...response.data,
                likedByCurrentUser: !currentLikedByCurrentUser,
              }
            : post,
        ),
      );
    } catch (err) {
      console.error("Error liking post: ", err);
    }
  };

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
              key={p.id}
              postId={p.id}
              title={p.title}
              author={p.author}
              content={p.content}
              createdAt={firebaseTimestampToString(p.createdAt, true)}
              likes={p.likes.toString()}
              likedByCurrentUser={p.likedByCurrentUser ?? false}
              currentUserId={user?.id}
              onLike={handleLikePost}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      )}

      <div className="create-post-area">
        {creatingPost ? (
          <CreatePostForm
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postContent={postContent}
            setPostContent={setPostContent}
            onSubmit={handleCreatePost}
            setCreatingForm={setCreatingPost}
          />
        ) : (
          <button
            className="create-post-btn"
            onClick={() => setCreatingPost(true)}
          >
            Create new post
          </button>
        )}
      </div>
    </div>
  );
}
