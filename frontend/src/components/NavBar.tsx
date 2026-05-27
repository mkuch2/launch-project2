import { NavLink } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

import "./styles/NavBar.css";
import SpotifyIcon from "../assets/spotify-icon.svg";

export default function NavBar() {
  const { user } = useContext(AuthContext);

  const profileImage = user?.profilePic;
  const displayName = user?.displayName || user?.username || "U";

  return (
    <div className="nav-bar">
      <NavLink className="nav-brand" to="/">
        <img src={SpotifyIcon} alt="Spotify logo" />
        <span>Reverb</span>
      </NavLink>

      <nav className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/liked-songs">Liked</NavLink>
        <NavLink to="/top-artists">Top Artists</NavLink>
        <NavLink to="/top-songs">Top Songs</NavLink>
        <NavLink to="/discover">Discover</NavLink>
        <NavLink to="/forum">Forum</NavLink>
        <NavLink to="/inbox">Inbox</NavLink>

        {user ? (
          <NavLink className="profile-link" to="/profile">
            {profileImage ? (
              <img className="profile-picture" src={profileImage} alt="profile" />
            ) : (
              <span className="profile-fallback">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </NavLink>
        ) : (
          <NavLink className="login-button" to="/login">
            Login
          </NavLink>
        )}
      </nav>
    </div>
  );
}