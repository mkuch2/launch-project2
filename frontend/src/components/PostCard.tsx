import { useState } from "react";
import type { PrivateUser } from "../../../types";
import "./styles/PostCard.css";
import { Heart, Pencil, Trash2, X, Check } from "lucide-react";

export interface PostCardProps {
  postId: string;
  title: string;
  author: PrivateUser;
  content: string;
  createdAt: string;
  likes: string;
  likedByCurrentUser: boolean;
  currentUserId?: string;
  onLike: (postId: string) => Promise<void>;
  onEdit: (postId: string, title: string, content: string) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
}

export default function PostCard({
  postId,
  title,
  author,
  content,
  createdAt,
  likes,
  likedByCurrentUser,
  currentUserId,
  onLike,
  onEdit,
  onDelete,
}: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);

  const profileImage = author.profilePic;
  const initials = author.displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isAuthor = currentUserId && currentUserId === author.id;

  const handleSave = async () => {
    const trimmedTitle = editTitle.trim();
    const trimmedContent = editContent.trim();

    if (!trimmedTitle || !trimmedContent) {
      return;
    }

    await onEdit(postId, trimmedTitle, trimmedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditContent(content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await onDelete(postId);
    }
  };

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

      {isEditing ? (
        <section className="post-card__edit-form">
          <label
            className="post-card__edit-label"
            htmlFor={`edit-title-${postId}`}
          >
            Title
          </label>
          <input
            className="post-card__edit-input"
            id={`edit-title-${postId}`}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <label
            className="post-card__edit-label"
            htmlFor={`edit-content-${postId}`}
          >
            Content
          </label>
          <textarea
            className="post-card__edit-textarea"
            id={`edit-content-${postId}`}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
          />

          <div className="post-card__edit-actions">
            <button
              className="post-card__save-button"
              type="button"
              onClick={handleSave}
              disabled={!editTitle.trim() || !editContent.trim()}
            >
              <Check size={16} />
              Save
            </button>
            <button
              className="post-card__cancel-button"
              type="button"
              onClick={handleCancel}
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="post-card__body">
            <h4 className="post-card__title">{title}</h4>
            <p className="post-card__content">{content}</p>
          </section>

          <footer className="post-card__footer">
            <div className="post-card__actions">
              <button
                className={`post-card__action-button post-card__like-button${likedByCurrentUser ? " post-card__like-button--liked" : ""}`}
                type="button"
                onClick={() => onLike(postId)}
              >
                <Heart />
                <span className="post-card__like-count">{likes}</span>
              </button>

              {isAuthor && (
                <>
                  <button
                    className="post-card__action-button post-card__edit-button"
                    type="button"
                    onClick={() => {
                      setEditTitle(title);
                      setEditContent(content);
                      setIsEditing(true);
                    }}
                    aria-label="Edit post"
                  >
                    <Pencil />
                  </button>
                  <button
                    className="post-card__action-button post-card__delete-button"
                    type="button"
                    onClick={handleDelete}
                    aria-label="Delete post"
                  >
                    <Trash2 />
                  </button>
                </>
              )}
            </div>
          </footer>
        </>
      )}
    </article>
  );
}
