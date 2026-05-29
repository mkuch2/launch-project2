import { useState } from "react";
import { Link } from "react-router";
import type { PrivateUser } from "../../../types";
import "./styles/ForumCard.css";
import { Pencil, Trash2, X, Check } from "lucide-react";

export interface ForumCardProps {
  forumId: string;
  author: PrivateUser;
  name: string;
  createdAt: string;
  currentUserId?: string;
  onEdit: (forumId: string, name: string) => Promise<void>;
  onDelete: (forumId: string) => Promise<void>;
}

export default function ForumCard({
  forumId,
  author,
  name,
  createdAt,
  currentUserId,
  onEdit,
  onDelete,
}: ForumCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);

  const isAuthor = currentUserId && currentUserId === author.id;

  const handleSave = async () => {
    const trimmedName = editName.trim();

    if (!trimmedName) {
      return;
    }

    await onEdit(forumId, trimmedName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(name);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this forum?")) {
      await onDelete(forumId);
    }
  };

  return (
    <div className="forum-preview">
      {isEditing ? (
        <>
          <div className="forum-preview-header">
            <input
              className="forum-preview__edit-input"
              id={`edit-forum-name-${forumId}`}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <span className="forum-preview-timestamp">{createdAt}</span>
          </div>
          <div className="forum-preview__edit-actions">
            <button
              className="forum-preview__save-button"
              type="button"
              onClick={handleSave}
              disabled={!editName.trim()}
            >
              <Check size={16} />
              Save
            </button>
            <button
              className="forum-preview__cancel-button"
              type="button"
              onClick={handleCancel}
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <Link
            to={`/forum/${forumId}`}
            className="forum-preview__link-area"
          >
            <div className="forum-preview-header">
              <h3 className="forum-preview-name">{name}</h3>
              <span className="forum-preview-timestamp">{createdAt}</span>
            </div>
          </Link>

          <footer className="forum-preview__footer">
            <span className="forum-preview-author">
              Created by: {author.displayName}
            </span>

            {isAuthor && (
              <div className="forum-preview__actions">
                <button
                  className="forum-preview__action-button forum-preview__edit-button"
                  type="button"
                  onClick={() => {
                    setEditName(name);
                    setIsEditing(true);
                  }}
                  aria-label="Edit forum"
                >
                  <Pencil />
                </button>
                <button
                  className="forum-preview__action-button forum-preview__delete-button"
                  type="button"
                  onClick={handleDelete}
                  aria-label="Delete forum"
                >
                  <Trash2 />
                </button>
              </div>
            )}
          </footer>
        </>
      )}
    </div>
  );
}
