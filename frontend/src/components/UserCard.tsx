import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
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

export default function UserCard({ user: publicUser }: UserCardProps) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="user-card">
      <div className="user-card__header">
        {publicUser.profilePic ? (
          <img
            className="user-card__avatar-image"
            src={publicUser.profilePic}
            alt={publicUser.displayName}
          />
        ) : (
          <div
            className="user-card__avatar"
            style={{
              backgroundColor: getAvatarColor(publicUser.displayName ?? ""),
            }}
          >
            {getInitials(publicUser.displayName ?? "")}
          </div>
        )}

        <span className="user-card__name">{publicUser.displayName}</span>
      </div>

      <div className="user-card__info">
        <span className="user-card__details">
          Top artist: {publicUser.topArtistAllTime?.[0]?.name ?? "N/A"} |{" "}
          {publicUser.likedSongsCount ?? 0} liked songs
        </span>
      
      <button
        className="user-card__button"
        onClick={() => {
          if (user) {
            navigate(`/profile/${publicUser.id}`);
          } else {
            const confirmed = confirm("You need to login to view profiles. Go to login?");
            if (confirmed) {
              window.location.href = `${import.meta.env.VITE_API_URL}/spotify/login`;
            }
          }
        }}
      >
        View Profile
      </button>
      
        
      </div>
    </div>
  );
}