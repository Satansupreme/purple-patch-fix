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

  useEffect(() => {
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
      console.error('Audio playback error:', e);
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
  }, [onLoadedMetadata, onTimeUpdate, onEnded, onError]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
  }, [src]);

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