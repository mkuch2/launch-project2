import type { PrivateUser } from "../../../types";
import "./styles/ForumPreview.css";

export interface ForumPreviewProps {
  author: PrivateUser;
  name: string;
  createdAt: string;
}

export default function ForumPreview({
  author,
  name,
  createdAt,
}: ForumPreviewProps) {
  return (
    <div className="forum-preview">
      <div className="forum-preview-header">
        <h3 className="forum-preview-name">{name}</h3>
        <span className="forum-preview-timestamp">Created {createdAt}</span>
      </div>

      <span className="forum-preview-author">
        Created by: {author.displayName}
      </span>
    </div>
  );
}
