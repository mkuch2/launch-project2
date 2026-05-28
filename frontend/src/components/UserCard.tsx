import { useNavigate } from "react-router";
import type { PublicUser } from "../../../types";
import "./styles/UserCard.css";

// randomly generate avatar color for user profiles
function getAvatarColor(name: string): string {
  const colors = [
    "#e05c97",
    "#7c6fcd",
    "#e8a838",
    "#4caf7d",
    "#e05c5c",
    "#5c9ee0",
  ];

  const index =
    name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    colors.length;

  return colors[index];
}

// get user's name initials
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface UserCardProps {
  user: PublicUser;
}

export default function UserCard({ user }: UserCardProps) {
  const navigate = useNavigate();

  return (
    <div className="user-card">
      <div className="user-card__header">
        {user.profilePic ? (
          <img
            className="user-card__avatar-image"
            src={user.profilePic}
            alt={user.displayName}
          />
        ) : (
          <div
            className="user-card__avatar"
            style={{
              backgroundColor: getAvatarColor(user.displayName ?? ""),
            }}
          >
            {getInitials(user.displayName ?? "")}
          </div>
        )}

        <span className="user-card__name">{user.displayName}</span>
      </div>

      <div className="user-card__info">
        <span className="user-card__details">
          Top artist: {user.topArtistAllTime?.[0]?.name ?? "N/A"} |{" "}
          {user.likedSongsCount ?? 0} liked songs
        </span>

        <button
          className="user-card__button"
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}