import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react';
import { Track, PlayerState, UserData, RepeatMode } from '@/types/music';
import { sampleTracks } from '@/data/sampleTracks';
import { AudioPlayer } from '@/components/ui/audio-player';
import { youtubeService } from '@/services/youtubeApi';

interface MusicContextType {
  playerState: PlayerState;
  userData: UserData;
  playTrack: (track: Track, playlist?: Track[]) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setVolume: (volume: number) => void;
  seekTo: (progress: number) => void;
  addToLiked: (track: Track) => void;
  removeFromLiked: (trackId: string) => void;
  createPlaylist: (name: string, description: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

type Action =
  | { type: 'PLAY_TRACK'; payload: { track: Track; queue: Track[]; index: number } }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'ADD_TO_LIKED'; payload: Track }
  | { type: 'REMOVE_FROM_LIKED'; payload: string }
  | { type: 'CREATE_PLAYLIST'; payload: { name: string; description: string } }
  | { type: 'ADD_TO_PLAYLIST'; payload: { playlistId: string; track: Track } }
  | { type: 'REMOVE_FROM_PLAYLIST'; payload: { playlistId: string; trackId: string } }
  | { type: 'DELETE_PLAYLIST'; payload: string }
  | { type: 'LOAD_USER_DATA'; payload: UserData };

const initialPlayerState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  queue: [],
  currentIndex: 0,
  shuffle: false,
  repeat: 'none',
  duration: 0,
};

const initialUserData: UserData = {
  likedTracks: [],
  playlists: [],
  recentlyPlayed: [],
};

interface MusicState {
  playerState: PlayerState;
  userData: UserData;
}

const initialState: MusicState = {
  playerState: initialPlayerState,
  userData: initialUserData,
};

function musicReducer(state: MusicState, action: Action): MusicState {
  switch (action.type) {
    case 'PLAY_TRACK':
      return {
        ...state,
        playerState: {
          ...state.playerState,
          currentTrack: action.payload.track,
          queue: action.payload.queue,
          currentIndex: action.payload.index,
          isPlaying: true,
          progress: 0,
        },
        userData: {
          ...state.userData,
          recentlyPlayed: [
            action.payload.track,
            ...state.userData.recentlyPlayed.filter(t => t.id !== action.payload.track.id),
          ].slice(0, 10),
        },
      };

    case 'PAUSE':
      return {
        ...state,
        playerState: { ...state.playerState, isPlaying: false },
      };

    case 'RESUME':
      return {
        ...state,
        playerState: { ...state.playerState, isPlaying: true },
      };

    case 'NEXT_TRACK':
      const nextIndex = state.playerState.currentIndex + 1;
      if (nextIndex < state.playerState.queue.length) {
        return {
          ...state,
          playerState: {
            ...state.playerState,
            currentTrack: state.playerState.queue[nextIndex],
            currentIndex: nextIndex,
            progress: 0,
          },
        };
      }
      return state;

    case 'PREVIOUS_TRACK':
      const prevIndex = state.playerState.currentIndex - 1;
      if (prevIndex >= 0) {
        return {
          ...state,
          playerState: {
            ...state.playerState,
            currentTrack: state.playerState.queue[prevIndex],
            currentIndex: prevIndex,
            progress: 0,
          },
        };
      }
      return state;

    case 'TOGGLE_SHUFFLE':
      return {
        ...state,
        playerState: { ...state.playerState, shuffle: !state.playerState.shuffle },
      };

    case 'TOGGLE_REPEAT':
      const repeatModes: RepeatMode[] = ['none', 'track', 'playlist'];
      const currentIndex = repeatModes.indexOf(state.playerState.repeat);
      const nextRepeatMode = repeatModes[(currentIndex + 1) % repeatModes.length];
      return {
        ...state,
        playerState: { ...state.playerState, repeat: nextRepeatMode },
      };

    case 'SET_VOLUME':
      return {
        ...state,
        playerState: { ...state.playerState, volume: action.payload },
      };

    case 'SET_PROGRESS':
      return {
        ...state,
        playerState: { ...state.playerState, progress: action.payload },
      };

    case 'SET_DURATION':
      return {
        ...state,
        playerState: { ...state.playerState, duration: action.payload },
      };

    case 'ADD_TO_LIKED':
      return {
        ...state,
        userData: {
          ...state.userData,
          likedTracks: [...state.userData.likedTracks, action.payload],
        },
      };

    case 'REMOVE_FROM_LIKED':
      return {
        ...state,
        userData: {
          ...state.userData,
          likedTracks: state.userData.likedTracks.filter(t => t.id !== action.payload),
        },
      };

    case 'LOAD_USER_DATA':
      return {
        ...state,
        userData: action.payload,
      };

    default:
      return state;
  }
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(musicReducer, initialState);

  // Load user data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('musicAppData');
      if (savedData) {
        const userData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_USER_DATA', payload: userData });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  // Save user data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('musicAppData', JSON.stringify(state.userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }, [state.userData]);

  const playTrack = async (track: Track, playlist: Track[] = sampleTracks) => {
    console.log('Playing track:', track.title);
    
    // Extract YouTube ID from audioUrl and get streaming URL
    let audioUrl = track.audioUrl;
    const youtubeMatch = audioUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    
    if (youtubeMatch) {
      try {
        // Try to get a better streaming URL from our backend
        const streamUrl = await youtubeService.getAudioStreamUrl(youtubeMatch[1]);
        audioUrl = streamUrl;
      } catch (error) {
        console.warn('Failed to get streaming URL, using original:', error);
      }
    }
    
    const index = playlist.findIndex(t => t.id === track.id);
    dispatch({ 
      type: 'PLAY_TRACK', 
      payload: { 
        track: { ...track, audioUrl },
        queue: playlist, 
        index: Math.max(0, index)
      } 
    });
  };

  const pauseTrack = () => {
    dispatch({ type: 'PAUSE' });
  };

  const resumeTrack = () => {
    dispatch({ type: 'RESUME' });
  };

  const nextTrack = () => {
    dispatch({ type: 'NEXT_TRACK' });
  };

  const previousTrack = () => {
    dispatch({ type: 'PREVIOUS_TRACK' });
  };

  const toggleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const toggleRepeat = () => {
    dispatch({ type: 'TOGGLE_REPEAT' });
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const seekTo = (progress: number) => {
    dispatch({ type: 'SET_PROGRESS', payload: progress });
  };

  const addToLiked = (track: Track) => {
    dispatch({ type: 'ADD_TO_LIKED', payload: track });
  };

  const removeFromLiked = (trackId: string) => {
    dispatch({ type: 'REMOVE_FROM_LIKED', payload: trackId });
  };

  const createPlaylist = (name: string, description: string) => {
    dispatch({ type: 'CREATE_PLAYLIST', payload: { name, description } });
  };

  const addToPlaylist = (playlistId: string, track: Track) => {
    dispatch({ type: 'ADD_TO_PLAYLIST', payload: { playlistId, track } });
  };

  const removeFromPlaylist = (playlistId: string, trackId: string) => {
    dispatch({ type: 'REMOVE_FROM_PLAYLIST', payload: { playlistId, trackId } });
  };

  const deletePlaylist = (playlistId: string) => {
    dispatch({ type: 'DELETE_PLAYLIST', payload: playlistId });
  };

  const value: MusicContextType = {
    playerState: state.playerState,
    userData: state.userData,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
    setVolume,
    seekTo,
    addToLiked,
    removeFromLiked,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      {state.playerState.currentTrack && (
        <AudioPlayer
          src={state.playerState.currentTrack.audioUrl}
          isPlaying={state.playerState.isPlaying}
          volume={state.playerState.volume}
          onLoadedMetadata={(duration) => {
            dispatch({ type: 'SET_DURATION', payload: duration });
          }}
          onTimeUpdate={(currentTime, progress) => {
            dispatch({ type: 'SET_PROGRESS', payload: progress });
          }}
          onEnded={() => {
            if (state.playerState.repeat === 'track') {
              playTrack(state.playerState.currentTrack!, state.playerState.queue);
            } else {
              nextTrack();
            }
          }}
          onError={(error) => {
            console.error('Audio playback error:', error);
          }}
        />
      )}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    console.error('useMusic called outside MusicProvider. Check component tree.');
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}