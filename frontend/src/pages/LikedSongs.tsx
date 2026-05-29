import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
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
    external_urls: {
      spotify?: string;
    };
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
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/spotify/liked-songs`,
          { credentials: "include" },
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.log("Liked songs error:", response.status, errorData);

          throw new Error("Failed to fetch liked songs");
        }

        const data = await response.json();

        const songs: Song[] = data.items.map(
          (item: SpotifyTrackItem, index: number) => {
            const rawImages = item.track.album?.images;
            console.log(`LikedSong #${index} raw album.images:`, rawImages);

            return {
              id: item.track.id,
              name: item.track.name,
              album: {
                name: item.track.album?.name ?? "",
                images:
                  rawImages && rawImages.length > 0
                    ? rawImages.map((img) => ({ url: img.url }))
                    : [],
              },
              artists: item.track.artists?.map((a) => ({ name: a.name })) ?? [],
              external_urls: item.track.external_urls,
            };
          },
        );

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
  }, [user]);

  // Show login prompt if not logged in
  if (!user) {
    return (
      <div className="liked-songs">
        <h1>Liked Songs</h1>
        <p className="liked-songs__status">
          Please{" "}
          <Link to={`${import.meta.env.VITE_API_URL}/spotify/login`}>
            login
          </Link>{" "}
          to view your liked songs.
        </p>
      </div>
    );
  }

  return (
    <div className="liked-songs">
      <h1>Liked Songs</h1>

      {isLoading && <p className="liked-songs__status">Loading...</p>}
      {error && (
        <p className="liked-songs__status liked-songs__status--error">
          {error}
        </p>
      )}

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
