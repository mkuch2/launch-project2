import { NavLink, Link, useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

import "./styles/NavBar.css";
import SpotifyIcon from "../assets/spotify-icon.svg";

export default function NavBar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const profileImage = user?.profilePic;
  const displayName = user?.displayName || "U";
  const loginUrl = `${import.meta.env.VITE_API_URL}/spotify/login`;

  // show login prompt if not logged in, otherwise navigate to page
  function handleProtectedNav(pageName: string, path: string) {
    if (user) {
      navigate(path);
    } else{
      const confirmed = confirm (`You need to login to view the ${pageName} page. Go to login?`)
    };
    if (confirmed) {
      window.location.href = loginUrl;
    }
  }

  return (
    <div className="nav-bar">
      <NavLink className="nav-brand" to="/">
        <img src={SpotifyIcon} alt="Spotify logo" />
        <span>Reverb</span>
      </NavLink>

      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>

        <button
          className="nav-button"
          onClick={() => handleProtectedNav("Liked Songs", "/liked-songs")}
        >
          Liked Songs
        </button>

        <button
          className="nav-button"
          onClick={() => handleProtectedNav("Top Artists", "/top-artists")}
        >
          Top Artists
        </button>

        <button
          className="nav-button"
          onClick={() => handleProtectedNav("Top Songs", "/top-songs")}
        >
          Top Songs
        </button>

        <NavLink to="/discover">Discover</NavLink>
        <NavLink to="/forums">Forums</NavLink>

        <button
          className="nav-button"
          onClick={() => handleProtectedNav("Inbox", "/inbox")}
        >
          Inbox
        </button>

        {user ? (
          <NavLink className="profile-link" to="/profile">
            {profileImage ? (
              <img
                className="profile-picture"
                src={profileImage}
                alt="profile"
              />
            ) : (
              <span className="profile-fallback">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </NavLink>
        ) : (
          <Link
            className="login-button"
            to={loginUrl}
          >
            Login
          </Link>
        )}
      </nav>
    </div>
  );
}
