import { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX,
  Heart,
  Maximize2 
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function MusicPlayer() {
  const {
    playerState,
    userData,
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
  } = useMusic();

  const [isMuted, setIsMuted] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  if (!playerState.currentTrack) return null;

  const isLiked = userData.likedTracks.some(t => t.id === playerState.currentTrack?.id);
  
  const handlePlayPause = () => {
    if (playerState.isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const handleVolumeToggle = () => {
    if (isMuted) {
      setVolume(0.7);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleLikeToggle = () => {
    if (isLiked) {
      removeFromLiked(playerState.currentTrack!.id);
    } else {
      addToLiked(playerState.currentTrack!);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (playerState.progress / 100) * playerState.duration;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-player-background border-t border-border h-20 flex items-center px-4 z-50">
      {/* Track Info */}
      <div className="flex items-center gap-3 min-w-0 w-80">
        <img
          src={playerState.currentTrack.coverUrl}
          alt={playerState.currentTrack.title}
          className="w-12 h-12 rounded-md object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">
            {playerState.currentTrack.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {playerState.currentTrack.artist}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLikeToggle}
          className="shrink-0"
        >
          <Heart 
            className={`h-4 w-4 ${isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
          />
        </Button>
      </div>

      {/* Player Controls */}
      <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl mx-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleShuffle}
            className={playerState.shuffle ? 'text-primary' : 'text-muted-foreground'}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={previousTrack}>
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            className="player-button w-8 h-8" 
            onClick={handlePlayPause}
          >
            {playerState.isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={nextTrack}>
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRepeat}
            className={playerState.repeat !== 'none' ? 'text-primary' : 'text-muted-foreground'}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1">
            <Slider
              value={[playerState.progress]}
              max={100}
              step={1}
              onValueChange={(value) => seekTo(value[0])}
              className="w-full"
            />
          </div>
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(playerState.duration)}
          </span>
        </div>
      </div>

      {/* Volume and Additional Controls */}
      <div className="flex items-center gap-3 w-80 justify-end">
        <Button variant="ghost" size="sm" onClick={handleVolumeToggle}>
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        
        <div className="w-24">
          <Slider
            value={[playerState.volume * 100]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0] / 100)}
            className="w-full"
          />
        </div>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowFullPlayer(true)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}