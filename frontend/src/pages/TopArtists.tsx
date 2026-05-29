import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import "./styles/musicPages.css";
import type { Artist } from "../../../types";

type TimeRange = "long_term" | "medium_term" | "short_term";

export default function TopArtists() {
  const { user } = useContext(AuthContext);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("long_term");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/spotify/top-artists`,
          {
            params: { timeRange },
            withCredentials: true,
          },
        );

        const fetchedArtists = response.data.items || response.data || [];

        setArtists(fetchedArtists);

        const artistsToSave = fetchedArtists.slice(0, 10);

        if (user?.id && timeRange === "long_term") {
          await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
            {
              topArtistAllTime: artistsToSave,
            },
          );
        }
      } catch (err) {
        console.error("Error fetching top artists:", err);
        setError("Could not load top artists.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, [timeRange, user?.id]);

  return (
    <main className="music-page">
      <section className="music-header">
        <h1 className="music-title">Top Artists</h1>
        <p className="music-username">{user?.displayName || "Username"}</p>
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

      {loading && <p>Loading top artists...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <section className="music-grid">
          {artists.map((artist) => (
            <a
              key={artist.id}
              href={artist.external_urls?.spotify || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="music-card"
            >
              <img
                src={
                  artist.images?.[0]?.url || "https://via.placeholder.com/300"
                }
                alt={artist.name}
              />

              <h2>{artist.name}</h2>

              <p>
                {artist.genres && artist.genres.length > 0
                  ? artist.genres.slice(0, 2).join(", ")
                  : "Artist"}
              </p>
            </a>
          ))}
        </section>
      )}
    </main>
  );
}
