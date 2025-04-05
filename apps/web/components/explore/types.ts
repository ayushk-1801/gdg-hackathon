export interface Playlist {
  id: string;
  title: string;
  creator: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  viewCount: number;
  category: string;
  playlist_link?: string;
}
