import { Play, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Track } from '@/types/music';
import { useMusic } from '@/contexts/MusicContext';
import { formatDuration } from '@/utils/audioUtils';

interface TrackListProps {
  tracks: Track[];
  showIndex?: boolean;
  onTrackSelect?: (track: Track) => void;
}

export function TrackList({ tracks, showIndex = true, onTrackSelect }: TrackListProps) {
  const { playTrack, userData, addToLiked, removeFromLiked } = useMusic();

  const handlePlayTrack = (track: Track) => {
    playTrack(track, tracks);
    onTrackSelect?.(track);
  };

  const handleLikeToggle = (track: Track) => {
    const isLiked = userData.likedTracks.some(t => t.id === track.id);
    if (isLiked) {
      removeFromLiked(track.id);
    } else {
      addToLiked(track);
    }
  };

  return (
    <div className="space-y-2">
      {tracks.map((track, index) => {
        const isLiked = userData.likedTracks.some(t => t.id === track.id);
        
        return (
          <div
            key={track.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer group"
          >
            {showIndex && (
              <span className="w-6 text-sm text-muted-foreground group-hover:hidden">
                {index + 1}
              </span>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              className={`w-6 h-6 ${showIndex ? 'hidden group-hover:flex' : 'flex'} opacity-0 group-hover:opacity-100 transition-opacity`}
              onClick={() => handlePlayTrack(track)}
            >
              <Play className="h-3 w-3" />
            </Button>
            
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-12 h-12 rounded-md object-cover cursor-pointer"
              onClick={() => handlePlayTrack(track)}
            />
            
            <div 
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => handlePlayTrack(track)}
            >
              <p className="font-medium truncate">{track.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {track.artist} • {track.album}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLikeToggle(track)}
              className="shrink-0"
            >
              <Heart 
                className={`h-4 w-4 ${isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
              />
            </Button>
            
            <span className="text-sm text-muted-foreground w-12 text-right">
              {formatDuration(track.duration)}
            </span>
          </div>
        );
      })}
    </div>
  );
}