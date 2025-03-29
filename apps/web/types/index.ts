export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface YouTubeVideo {
  title: string;
  thumbnail: string;
  duration: string;
  videoId: string;
}

export interface YouTubePlaylist {
  title: string;
  creator: string;
  videoCount: number;
  thumbnail: string;
  videos: YouTubeVideo[];
}
