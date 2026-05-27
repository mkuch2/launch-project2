import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import "./styles/musicPages.css";
import type { Song } from "../../../types";

type TimeRange = "long_term" | "medium_term" | "short_term";

export default function TopSongs() {
  const { user } = useContext(AuthContext);

  const [songs, setSongs] = useState<Song[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("long_term");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopSongs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/spotify/top-songs`,
          {
            params: { timeRange },
            withCredentials: true,
          },
        );

        setSongs(response.data.items || response.data || []);
      } catch (err) {
        console.error("Error fetching top songs:", err);
        setError("Could not load top songs.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopSongs();
  }, [timeRange]);

  return (
    <main className="music-page">
      <section className="music-header">
        <h1 className="music-title">Top Songs</h1>

        <p className="music-username">{user?.displayName || user?.username || "Username"}</p>
      </section>

      <div className="filter-buttons">
        <button
          className={timeRange === "long_term" ? "active" : ""}
          onClick={() => setTimeRange("long_term")}
        >
          All Time
        </button>

        <button
          className={timeRange === "medium_term" ? "active" : ""}
          onClick={() => setTimeRange("medium_term")}
        >
          Last 6 Months
        </button>

        <button
          className={timeRange === "short_term" ? "active" : ""}
          onClick={() => setTimeRange("short_term")}
        >
          Last Month
        </button>
      </div>

      {loading && <p>Loading top songs...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <section className="music-grid">
          {songs.map((song) => (
            <article className="music-card" key={song.id}>
              <img
                src={
                  song.album?.images?.[0]?.url ||
                  "https://via.placeholder.com/300"
                }
                alt={song.name}
              />

              <h2>{song.name}</h2>

              <p>
                {song.artists?.map((artist) => artist.name).join(", ") ||
                  "Artist"}
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
