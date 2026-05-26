export interface PublicUser {
    id: string; 
    displayName: string;
    topArtist: string; 
    likedSongsCount: number; 
}

export interface Song {
    id: string;
    name: string;
    albumName: string;
    albumCover: string; // picture's url
    artists: string[]; 
}