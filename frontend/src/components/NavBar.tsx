import { Link } from "react-router";
import "./styles/NavBar.css";
import SpotifyIcon from "../assets/spotify-icon.svg";

const profileImageSrc = "";

export default function NavBar() {
  return (
    <div className="nav-bar">
      <Link className="nav-icon" to="/">
        <img src={SpotifyIcon} height={45} width={45} />
      </Link>

      <nav className="nav-links">
        <Link to="/liked-songs">Liked Songs</Link>
        <Link to="/top-artists">Top Artists</Link>
        <Link to="/top-songs">Top Songs</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/forum">Forum</Link>
        <Link to="/inbox">Inbox</Link>
        <Link className="profile-link" to="/profile">
          {profileImageSrc ? (
            <img
              className="profile-picture"
              src={profileImageSrc}
              alt="profile picture"
            />
          ) : (
            <span
              className="profile-picture profile-picture--fallback"
              aria-hidden="true"
            />
          )}
        </Link>
      </nav>
    </div>
  );
}
