import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import type { PrivateUser } from "../../../types";
import "./styles/Profile.css";

export default function Profile() {
 const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState<PrivateUser | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [showLikedSongs, setShowLikedSongs] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
        );

        setProfile(response.data);
        setIsPublic(response.data.isPublic ?? true);
        setShowLikedSongs(response.data.showLikedSongs ?? false);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    fetchProfile();
  }, [user]);

  if (!profile) {
    return <div className="profile-page">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        {profile.profilePic ? (
          <img
            className="profile-image"
            src={profile.profilePic}
            alt={profile.displayName}
          />
        ) : (
          <div className="profile-avatar">{profile.displayName?.[0]}</div>
        )}

        <div>
          <h1 className="profile-title">{profile.displayName}</h1>
          <p className="profile-username">@{profile.displayName}</p>
        </div>
      </div>

      <div className="profile-card">
        <button className="profile-button">Edit Name</button>

        <div className="profile-toggle-row">
          <div>
            <h2>Profile Visibility</h2>
            <p>{isPublic ? "Public" : "Private"}</p>
          </div>

          <button
            className={isPublic ? "toggle toggle-on" : "toggle"}
            onClick={() => setIsPublic(!isPublic)}
          >
            <span></span>
          </button>
        </div>

        <div className="profile-toggle-row">
          <div>
            <h2>Show Liked Songs</h2>
            <p>{showLikedSongs ? "Visible on profile" : "Hidden from profile"}</p>
          </div>

          <button
            className={showLikedSongs ? "toggle toggle-on" : "toggle"}
            onClick={() => setShowLikedSongs(!showLikedSongs)}
          >
            <span></span>
          </button>
        </div>
      </div>
    </div>
  );
}