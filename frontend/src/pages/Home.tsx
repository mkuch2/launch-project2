import { Link } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import type { PublicUser, Song, Artist } from "../../../types";

function Home() {
  const { user } = useContext(AuthContext) as { user: PublicUser | null };

  const [publicUser, setPublicUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getFullUser() {
      if (!user?.id) return;

      try {
        setLoading(true);

        const response = await axios.get<PublicUser>(
          `${import.meta.env.VITE_API_URL}/api/users/${user.id}`
        );

        setPublicUser(response.data);
      } catch (err) {
        console.error("Could not load full user:", err);
      } finally {
        setLoading(false);
      }
    }

    getFullUser();
  }, [user?.id]);

  if (!user) {
    return (
      <main className="home-page">
        <section className="landing-hero">
          <div className="landing-content">
            <p className="home-kicker">WELCOME TO REVERB</p>

            <h1>Music sounds better together.</h1>

            <p className="home-subtitle">
              Reverb connects Spotify listeners through profiles,
              forums, discovery, and messaging.
            </p>

            <div className="home-actions">
              <Link to="/login" className="primary-button">
                Log in with Spotify
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const fullUser = publicUser || user;

  const topSongs: Song[] = fullUser.topSongAllTime || [];
  const topArtists: Artist[] = fullUser.topArtistAllTime || [];

  return (
    <main className="home-page">
      <section className="dashboard-hero">
        <div>
          <p className="home-kicker">YOUR REVERB</p>

          <h1>Welcome back, {fullUser.displayName}</h1>

          <div className="home-actions">

            <Link to="/discover" className="primary-button">
              Discover Users
            </Link>

            <Link to="/forum" className="primary-button">
              Forums
            </Link>

            <Link to="/inbox" className="primary-button">
              Inbox
            </Link>

          </div>
        </div>
      </section>

      {loading && <p className="loading-text">Loading your Reverb data...</p>}

      <section className="content-section">
        <div className="section-header">
          <div>
            <p className="home-kicker">YOUR MUSIC</p>
            <h2>Top Songs</h2>
          </div>

          <Link to="/top-songs" className="small-link">
            View all
          </Link>
        </div>

        {topSongs.length > 0 ? (
          <div className="media-grid">
            {topSongs.slice(0, 5).map((song) => (
              <Link to="/top-songs" className="media-card" key={song.id}>
                {song.album?.images?.[0]?.url && (
                  <img src={song.album.images[0].url} alt={song.name} />
                )}

                <h3>{song.name}</h3>

                <p>
                  {song.artists?.map((artist) => artist.name).join(", ") ||
                    "Unknown Artist"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No top songs saved yet. Visit Top Songs to load your Spotify data.
          </div>
        )}
      </section>

      <section className="content-section">
        <div className="section-header">
          <div>
            <p className="home-kicker">YOUR ARTISTS</p>
            <h2>Top Artists</h2>
          </div>

          <Link to="/top-artists" className="small-link">
            View all
          </Link>
        </div>

        {topArtists.length > 0 ? (
          <div className="media-grid">
            {topArtists.slice(0, 5).map((artist) => (
              <Link to="/top-artists" className="media-card" key={artist.id}>
                {artist.images?.[0]?.url && (
                  <img src={artist.images[0].url} alt={artist.name} />
                )}

                <h3>{artist.name}</h3>

                <p>{artist.genres?.slice(0, 2).join(", ") || "Artist"}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No top artists saved yet. Visit Top Artists to load your Spotify
            data.
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;