export interface PublicUser {
  id: string;
  displayName: string;

  //  Sourced From Firebase^   vSourced from Spotify
  profilePic: string; //url
  topArtistAllTime: Artist[];
  topArtistSixMonths: Artist[];
  topArtistThisMonth: Artist[];
  topSongAllTime: Song[];
  topSongSixMonths: Song[];
  topSongThisMonth: Song[];
  likedSongsCount: number;
}

export interface PrivateUser {
  id: string;
  displayName: string;
  username?: string;
}

export interface Artist {
  name: string;
}

export interface Song {
  id: string;
  name: string;
  albumName: string;
  albumCover: string; // picture's url
  artists: string[];
}
