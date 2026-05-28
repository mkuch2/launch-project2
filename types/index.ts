import { Timestamp, FieldValue } from "firebase/firestore";

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
  isPublic?: boolean;
  showTopSongs?: boolean;
  showTopArtists?: boolean;
  showLikedSongs?: boolean;
}

export interface PrivateUser {
  id: string;
  displayName: string;
  profilePic?: string;

  isPublic?: boolean;
  showTopSongs?: boolean;
  showTopArtists?: boolean;
  showLikedSongs?: boolean;
}

export interface Conversation {
  id: string;
  last_message: {
    content: string;
    read: boolean;
    sender_id: string;
    sent_at: Timestamp | FieldValue;
  };
  participants: string[];
}

export interface Message {
  id: string;
  content: string;
  conversation_id: string;
  sender_id: string;
  sent_at: Timestamp | FieldValue;
}

export interface Forum {
  id: string;
  author: PrivateUser;
  name: string;
  createdAt: Timestamp | FieldValue;
}

export interface Post {
  id: string;
  author: PrivateUser;
  title: string;
  content: string;
  likes: Number;
  likedByCurrentUser?: boolean;
  createdAt: Timestamp | FieldValue;
  forumId: string;
}

export interface Artist {
  id: string;
  name: string;
  genres?: string[];
  images?: { url: string }[];
}
export interface Song {
  id: string;
  name: string;
  artists?: {
    name: string;
  }[];
  album?: {
    images?: {
      url: string;
    }[];
  };
}
