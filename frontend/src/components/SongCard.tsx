import type { Song } from "../../../types";
import "./styles/SongCard.css";

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  const albumCover = song.album?.images?.[0]?.url || "";
  const artistNames = song.artists?.map((artist) => artist.name).join(", ");

  return (
    <div className="song-card">
      {albumCover ? (
        <img
          className="song-card__cover"
          src={albumCover}
          alt={song.name}
        />
      ) : (
        <div className="song-card__cover song-card__cover--fallback">♪</div>
      )}

      <div className="song-card__info">
        <span className="song-card__name">{song.name}</span>
        <span className="song-card__album">{artistNames}</span>
      </div>
    </div>
  );
}