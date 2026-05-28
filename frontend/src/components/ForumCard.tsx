import type { PrivateUser } from "../../../types";
import "./styles/ForumCard.css";

export interface ForumCardProps {
  author: PrivateUser;
  name: string;
  createdAt: string;
}

export default function ForumCard({ author, name, createdAt }: ForumCardProps) {
  return (
    <div className="forum-preview">
      <div className="forum-preview-header">
        <h3 className="forum-preview-name">{name}</h3>
        <span className="forum-preview-timestamp">{createdAt}</span>
      </div>

      <span className="forum-preview-author">
        Created by: {author.displayName}
      </span>
    </div>
  );
}
