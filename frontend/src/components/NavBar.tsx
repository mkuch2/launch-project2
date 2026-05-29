import { NavLink, Link, useNavigate, useLocation } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

import "./styles/NavBar.css";
import SpotifyIcon from "../assets/spotify-icon.svg";

export default function NavBar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const profileImage = user?.profilePic;
  const displayName = user?.displayName || "U";
  const loginUrl = `${import.meta.env.VITE_API_URL}/spotify/login`;
  const loginPageUrl = `http://127.0.0.1:5173/`;

  // show login prompt if not logged in, otherwise navigate to page
  function handleProtectedNav(pageName: string, path: string) {
    if (user) {
      navigate(path);
    } else {
      const confirmed = confirm(
        `You need to login to view the ${pageName} page. Go to login page?`,
      );
      if (confirmed) {
        window.location.href = loginPageUrl;
      }
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
          className={`nav-button ${location.pathname === "/liked-songs" ? "active" : ""}`}
          onClick={() => handleProtectedNav("Liked Songs", "/liked-songs")}
        >
          Liked Songs
        </button>

        <button
          className={`nav-button ${location.pathname === "/top-artists" ? "active" : ""}`}
          onClick={() => handleProtectedNav("Top Artists", "/top-artists")}
        >
          Top Artists
        </button>

        <button
          className={`nav-button ${location.pathname === "/top-songs" ? "active" : ""}`}
          onClick={() => handleProtectedNav("Top Songs", "/top-songs")}
        >
          Top Songs
        </button>

        <NavLink to="/discover">Discover</NavLink>
        <NavLink to="/forums">Forums</NavLink>

        <button
          className={`nav-button ${location.pathname === "/inbox" ? "active" : ""}`}
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
          <Link className="login-button" to={loginUrl}>
            Login
          </Link>
        )}
      </nav>
    </div>
  );
}
