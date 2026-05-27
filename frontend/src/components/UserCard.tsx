import type { PublicUser } from "../types";
import "./styles/UserCard.css";

type UserCardProps = {
  user: PublicUser;
};

function UserCard({ user }: UserCardProps) {
  return (
    <div className="user-card">
      <img src={user.profilePic} alt={user.displayName} />

      <h3>{user.displayName}</h3>

      <p>Liked Songs: {user.likedSongsCount}</p>
    </div>
  );
}

export default UserCard;