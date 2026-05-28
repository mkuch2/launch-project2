import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import type { PrivateUser, Song, Artist } from "../../../types";
import "./styles/Profile.css";

type ProfileUser = PrivateUser & {
  topSongAllTime?: Song[];
  topArtistAllTime?: Artist[];
  likedSongs?: Song[];
};

export default function Profile() {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();

  const profileId = userId || user?.id;
  const isOwnProfile = !userId || userId === user?.id;

  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [showTopSongs, setShowTopSongs] = useState(false);
  const [showTopArtists, setShowTopArtists] = useState(false);
  const [showLikedSongs, setShowLikedSongs] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!profileId) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/${profileId}`,
        );

        setProfile(response.data);
        setIsPublic(response.data.isPublic ?? true);
        setShowTopSongs(response.data.showTopSongs ?? false);
        setShowTopArtists(response.data.showTopArtists ?? false);
        setShowLikedSongs(response.data.showLikedSongs ?? false);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    fetchProfile();
  }, [profileId]);

  async function updateProfile(
    updates: Partial<{
      isPublic: boolean;
      showTopSongs: boolean;
      showTopArtists: boolean;
      showLikedSongs: boolean;
    }>,
  ) {
    if (!user?.id) return;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
        updates,
      );

      setProfile(response.data);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  }

  if (!profile) {
    return <div className="profile-page">Loading...</div>;
  }

  if (!isOwnProfile && profile.isPublic === false) {
    return <div className="profile-page">This profile is private.</div>;
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

      {isOwnProfile && (
        <div className="profile-card">
          <ToggleRow
            title="Profile Visibility"
            description={isPublic ? "Public" : "Private"}
            value={isPublic}
            onClick={() => {
              const newValue = !isPublic;
              setIsPublic(newValue);
              updateProfile({ isPublic: newValue });
            }}
          />

          <ToggleRow
            title="Show Top Songs"
            description={showTopSongs ? "Visible on profile" : "Hidden from profile"}
            value={showTopSongs}
            onClick={() => {
              const newValue = !showTopSongs;
              setShowTopSongs(newValue);
              updateProfile({ showTopSongs: newValue });
            }}
          />

          <ToggleRow
            title="Show Top Artists"
            description={showTopArtists ? "Visible on profile" : "Hidden from profile"}
            value={showTopArtists}
            onClick={() => {
              const newValue = !showTopArtists;
              setShowTopArtists(newValue);
              updateProfile({ showTopArtists: newValue });
            }}
          />

          <ToggleRow
            title="Show Liked Songs"
            description={showLikedSongs ? "Visible on profile" : "Hidden from profile"}
            value={showLikedSongs}
            onClick={() => {
              const newValue = !showLikedSongs;
              setShowLikedSongs(newValue);
              updateProfile({ showLikedSongs: newValue });
            }}
          />
        </div>
      )}

      <div className="profile-sections">
          {showTopSongs && (
            <MusicSection title="Top Songs" items={profile.topSongAllTime} />
          )}

          {showTopArtists && (
            <MusicSection title="Top Artists" items={profile.topArtistAllTime} />
          )}

          {showLikedSongs && (
            <MusicSection title="Liked Songs" items={profile.likedSongs} />
          )}

          {!showTopSongs && !showTopArtists && !showLikedSongs && (
            <p className="profile-empty">This user has not shared any music yet.</p>
          )}
        </div>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  value,
  onClick,
}: {
  title: string;
  description: string;
  value: boolean;
  onClick: () => void;
}) {
  return (
    <div className="profile-toggle-row">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <button className={value ? "toggle toggle-on" : "toggle"} onClick={onClick}>
        <span></span>
      </button>
    </div>
  );
}

function MusicSection({
  title,
  items,
}: {
  title: string;
  items?: (Song | Artist)[];
}) {
  return (
    <div className="profile-music-section">
      <h2>{title}</h2>

      {!items || items.length === 0 ? (
        <p className="profile-empty">Nothing to show yet.</p>
      ) : (
        <div className="music-grid">
          {items.map((item) => (
            <div className="music-card" key={item.id}>
              {"album" in item && item.album?.images?.[0]?.url && (
                <img src={item.album.images[0].url} alt={item.name} />
              )}

              {"images" in item && item.images?.[0]?.url && (
                <img src={item.images[0].url} alt={item.name} />
              )}

              <h2>{item.name}</h2>

              {"artists" in item && item.artists && (
                <p>{item.artists.map((artist) => artist.name).join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}