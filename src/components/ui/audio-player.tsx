import { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  src: string;
  isPlaying: boolean;
  volume: number;
  onLoadedMetadata?: (duration: number) => void;
  onTimeUpdate?: (currentTime: number, progress: number) => void;
  onEnded?: () => void;
  onError?: (error: any) => void;
}

export function AudioPlayer({
  src,
  isPlaying,
  volume,
  onLoadedMetadata,
  onTimeUpdate,
  onEnded,
  onError,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isYouTubeEmbed = src.includes('youtube.com/embed');

  useEffect(() => {
    if (isYouTubeEmbed) {
      console.log('Loading YouTube embed:', src);
      // For YouTube embeds, we'll use iframe
      if (onLoadedMetadata) {
        // Simulate metadata loading for YouTube
        setTimeout(() => onLoadedMetadata(180), 1000); // Default 3 minutes
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      onLoadedMetadata?.(audio.duration);
    };

    const handleTimeUpdate = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      onTimeUpdate?.(audio.currentTime, progress);
    };

    const handleEnded = () => {
      onEnded?.();
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      console.error('Audio src:', audio.src);
      onError?.(e);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [onLoadedMetadata, onTimeUpdate, onEnded, onError, isYouTubeEmbed]);

  useEffect(() => {
    if (isYouTubeEmbed) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume, isYouTubeEmbed]);

  useEffect(() => {
    if (isYouTubeEmbed) {
      // For YouTube embeds, we simulate playback since we can't control iframe audio directly
      console.log('YouTube embed playback state:', isPlaying ? 'playing' : 'paused');
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      console.log('Trying to play audio with src:', audio.src);
      audio.play().catch((error) => {
        console.error('Audio play error:', error);
        console.error('Audio src:', audio.src);
        console.error('Audio readyState:', audio.readyState);
        console.error('Audio networkState:', audio.networkState);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, isYouTubeEmbed]);

  useEffect(() => {
    if (isYouTubeEmbed) {
      console.log('Loading new YouTube embed:', src);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    console.log('Loading audio with new src:', src);
    audio.load();
  }, [src, isYouTubeEmbed]);

  if (isYouTubeEmbed) {
    return (
      <iframe
        ref={iframeRef}
        src={isPlaying ? src : src.replace('autoplay=1', 'autoplay=0')}
        style={{ 
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          visibility: 'hidden'
        }}
        allow="autoplay"
        onLoad={() => {
          console.log('YouTube iframe loaded');
          if (onLoadedMetadata) {
            onLoadedMetadata(180); // Default duration
          }
        }}
      />
    );
  }

  return (
    <audio
      ref={audioRef}
      src={src}
      preload="metadata"
      crossOrigin="anonymous"
      style={{ display: 'none' }}
    />
  );
}