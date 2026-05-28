import type { PrivateUser } from "../../../types";
import "./styles/PostCard.css";
import { Heart } from "lucide-react";

export interface PostCardProps {
  postId: string;
  title: string;
  author: PrivateUser;
  content: string;
  createdAt: string;
  likes: string;
  likedByCurrentUser: boolean;
  onLike: (postId: string) => Promise<void>;
}

export default function PostCard({
  postId,
  title,
  author,
  content,
  createdAt,
  likes,
  likedByCurrentUser,
  onLike,
}: PostCardProps) {
  const profileImage = author.profilePic;
  const initials = author.displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <article className="post-card">
      <header className="post-card__header">
        {profileImage ? (
          <img
            className="post-card__avatar"
            src={profileImage}
            alt={`${author.displayName}'s profile picture`}
          />
        ) : (
          <div
            className="post-card__avatar post-card__avatar--fallback"
            aria-hidden="true"
          >
            {initials || "U"}
          </div>
        )}

        <div className="post-card__author-meta">
          <h3 className="post-card__author-name">{author.displayName}</h3>
          <span className="post-card__timestamp">{createdAt}</span>
        </div>
      </header>

      <section className="post-card__body">
        <h4 className="post-card__title">{title}</h4>
        <p className="post-card__content">{content}</p>
      </section>

      <footer className="post-card__footer">
        <button
          className={`post-card__like-button${likedByCurrentUser ? " post-card__like-button--liked" : ""}`}
          type="button"
          onClick={() => onLike(postId)}
        >
          <Heart />
          <span className="post-card__like-count">{likes}</span>
        </button>
      </footer>
    </article>
  );
}
