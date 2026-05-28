import { Link } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import type { PublicUser, Song, Artist } from "../../../types";

function Home() {
  const { user } = useContext(AuthContext) as { user: PublicUser | null };;

  const topSongs: Song[] = user?.topSongAllTime || [];
  const topArtists: Artist[] = user?.topArtistAllTime || [];
  const likedSongsCount = user?.likedSongsCount ?? 0;

  const hasTopSongs = topSongs.length > 0;
  const hasTopArtists = topArtists.length > 0;
  const hasLikedSongs = likedSongsCount > 0;

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-kicker">Your music social space</p>

          <h1>
            Welcome back
            {user?.displayName ? `, ${user.displayName}` : ""}
          </h1>

          <p className="home-subtitle">
            View your music taste, share your profile, discover other listeners,
            and join music discussions.
          </p>

          <div className="home-actions">
            <Link to="/top-songs" className="primary-button">
              View Top Songs
            </Link>
            <Link to="/discover" className="secondary-button">
              Discover Users
            </Link>
          </div>
        </div>

        <div className="home-profile-card">
          {user?.profilePic ? (
            <img src={user.profilePic} alt={user.displayName} />
          ) : (
            <div className="home-avatar">
              {user?.displayName?.charAt(0).toUpperCase() || "S"}
            </div>
          )}

          <h2>{user?.displayName || "Spotify User"}</h2>

          <p>
            Your profile is currently{" "}
            <strong>{user?.isPublic ? "public" : "private"}</strong>.
          </p>

          <Link to="/profile" className="small-link">
            Edit profile
          </Link>
        </div>
      </section>

      <section className="home-stats">
        <div className="stat-card">
          <span>{hasLikedSongs ? likedSongsCount : "—"}</span>
          <p>Liked Songs</p>
        </div>

        <div className="stat-card">
          <span>{hasTopSongs ? topSongs.length : "—"}</span>
          <p>Top Songs This Month</p>
        </div>

        <div className="stat-card">
          <span>{hasTopArtists ? topArtists.length : "—"}</span>
          <p>Top Artists This Month</p>
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <p className="home-kicker">This month</p>
            <h2>Top Songs</h2>
          </div>

          <Link to="/top-songs" className="small-link">
            View all
          </Link>
        </div>

        {hasTopSongs ? (
          <div className="preview-row">
            {topSongs.slice(0, 5).map((song) => (
              <Link to="/top-songs" className="preview-card" key={song.id}>
                <img
                  src={
                    song.album?.images?.[0]?.url
                  }
                  alt={song.name}
                />
                <h3>{song.name}</h3>
                <p>{song.artists?.join(", ")}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-card">
            <p>
              No top songs are saved yet. Visit your Top Songs page to load your
              Spotify data.
            </p>
          </div>
        )}
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <p className="home-kicker">Your artists</p>
            <h2>Top Artists</h2>
          </div>

          <Link to="/top-artists" className="small-link">
            View all
          </Link>
        </div>

        {hasTopArtists ? (
          <div className="preview-row">
            {topArtists.slice(0, 5).map((artist) => (
              <Link to="/top-artists" className="preview-card" key={artist.id}>
                <img
                  src={artist.images?.[0]?.url || "/default-artist.png"}
                  alt={artist.name}
                />
                <h3>{artist.name}</h3>
                <p>{artist.genres?.slice(0, 2).join(", ") || "Artist"}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-card">
            <p>
              No top artists are saved yet. Visit your Top Artists page to load
              your Spotify data.
            </p>
          </div>
        )}
      </section>

      <section className="home-grid">
        <Link to="/liked-songs" className="home-card">
          <span>01</span>
          <h3>Liked Songs</h3>
          <p>Browse your saved songs with album artwork.</p>
        </Link>

        <Link to="/discover" className="home-card">
          <span>02</span>
          <h3>Discover</h3>
          <p>Find public profiles and see what other users listen to.</p>
        </Link>

        <Link to="/forum" className="home-card">
          <span>03</span>
          <h3>Forums</h3>
          <p>Create boards, post music takes, and like discussions.</p>
        </Link>

        <Link to="/inbox" className="home-card">
          <span>04</span>
          <h3>Inbox</h3>
          <p>Message other users from their profiles.</p>
        </Link>
      </section>
    </main>
  );
}

export default Home;