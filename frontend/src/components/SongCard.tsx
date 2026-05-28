import type { Song } from "../types/index";
import "./styles/SongCard.css";

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  return (
    <div className="song-card">
      {song.albumCover ? (
        <img
          className="song-card__cover"
          src={song.albumCover}
          alt={song.albumName}
        />
      ) : (
        <div className="song-card__cover song-card__cover--fallback">♪</div>
      )}
      <div className="song-card__info">
        <span className="song-card__name">{song.name}</span>
        <span className="song-card__album">{song.albumName}</span>
      </div>
    </div>
  );
}