// Utility functions for audio handling

// Check if URL is a YouTube video
export function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com/watch') || url.includes('youtu.be/');
}

// Extract YouTube video ID from URL
export function getYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

// Get streaming URL for YouTube video (Note: This is a placeholder)
// In a real app, you'd need a backend service to provide streaming URLs
export function getStreamingUrl(videoId: string): string {
  // For demo purposes, we'll return a placeholder
  // In production, you'd need proper YouTube streaming integration
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0`;
}

// Format duration in seconds to MM:SS
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Convert ISO 8601 duration to seconds (for YouTube API responses)
export function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}