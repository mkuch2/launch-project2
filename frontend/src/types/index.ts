export interface PublicUser {
    id: string;
    displayName: string;

    profilePic: string; //url
    topArtistAllTime: Artist[];
    topArtistSixMonths: Artist[];
    topArtistThisMonth: Artist[];
    topSongAllTime: Song[];
    topSongSixMonths: Song[];
    topSongThisMonth: Song[];
    likedSongsCount: number;
}
export interface Artist
{
    name: string;
}
export interface Song {
    id: string;
    name: string;
    albumName: string;
    albumCover: string; // picture's url
    artists: Artist[]; 
}