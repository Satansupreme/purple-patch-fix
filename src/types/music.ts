export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  genre: string;
  year: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number; // 0-100
  queue: Track[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'track' | 'playlist';
  duration: number;
}

export interface UserData {
  likedTracks: Track[];
  playlists: Playlist[];
  recentlyPlayed: Track[];
}

export type RepeatMode = 'none' | 'track' | 'playlist';