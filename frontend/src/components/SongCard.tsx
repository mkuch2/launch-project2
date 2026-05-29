import type { Song } from "../../../types";
import "./styles/SongCard.css";

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  const albumCover = song.album?.images?.[0]["url"] ?? "";
  const artistNames = song.artists?.map((artist) => artist.name).join(", ");
  const albumName = song.album?.name ?? "";
  const spotifyUrl = song.external_urls?.spotify;

  const cardContent = (
    <>
      {albumCover ? (
        <img className="song-card__cover" src={albumCover} alt={song.name} />
      ) : (
        <div className="song-card__cover song-card__cover--fallback">♪</div>
      )}

      <div className="song-card__info">
        <span className="song-card__name">{song.name}</span>
        <span className="song-card__artists">{artistNames}</span>
        {albumName && <span className="song-card__album">{albumName}</span>}
      </div>
    </>
  );

  if (spotifyUrl) {
    return (
      <a
        href={spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="song-card song-card--link"
      >
        {cardContent}
      </a>
    );
  }

  return <div className="song-card">{cardContent}</div>;
}
