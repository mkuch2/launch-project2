import { useState, useEffect, useContext } from "react";
import type { Song } from "../../../types";
import SongCard from "../components/SongCard";
import "./styles/LikedSongs.css";
import { AuthContext } from "../AuthContext";
import axios from "axios";

interface SpotifyTrackItem {
  track: {
    id: string;
    name: string;
    album: {
      name: string;
      images: { url: string }[];
    };
    artists: { name: string }[];
  };
}

export default function LikedSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchLikedSongs() {
      try {
        const response = await fetch("http://127.0.0.1:5005/spotify/liked-songs", {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log("Liked songs error:", response.status, errorData);

          throw new Error("Failed to fetch liked songs");
        }

        const data = await response.json();

        const songs: Song[] = data.items.map((item: SpotifyTrackItem) => ({
          id: item.track.id,
          name: item.track.name,
          album: {
            images: item.track.album.images,
          },
          artists: item.track.artists,
        }));

        const songsToSave = songs.slice(0, 10);

        setSongs(songs);

        if (user?.id) {
          await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
            {
              likedSongs: songsToSave,
              likedSongsCount: songs.length,
            },
          );
        }
      } catch (err) {
        setError("Could not load liked songs. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLikedSongs();
  }, []);

  return (
    <div className="liked-songs">
      <h1>Liked Songs</h1>

      {isLoading && <p className="liked-songs__status">Loading...</p>}
      {error && <p className="liked-songs__status liked-songs__status--error">{error}</p>}

      {!isLoading && !error && songs.length === 0 && (
        <p className="liked-songs__status">No liked songs found.</p>
      )}

      {!isLoading && !error && (
        <div className="liked-songs__list">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}