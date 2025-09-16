import { YOUTUBE_CONFIG } from '@/config/youtube';
import { Track } from '@/types/music';

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      channelTitle: string;
      thumbnails: {
        medium: { url: string };
        high: { url: string };
      };
      publishedAt: string;
    };
  }>;
}

interface YouTubeVideoResponse {
  items: Array<{
    contentDetails: {
      duration: string; // ISO 8601 format (PT4M13S)
    };
  }>;
}

// Convert ISO 8601 duration to seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

export class YouTubeService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = YOUTUBE_CONFIG.API_KEY;
    this.baseUrl = YOUTUBE_CONFIG.BASE_URL;
  }

  async searchTracks(query: string): Promise<Track[]> {
    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY') {
      console.warn('YouTube API key not configured, using demo tracks');
      return [];
    }

    try {
      // Search for videos
      const searchUrl = `${this.baseUrl}/search?part=snippet&type=video&videoCategoryId=10&maxResults=${YOUTUBE_CONFIG.MAX_RESULTS}&q=${encodeURIComponent(query)}&key=${this.apiKey}`;
      
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) {
        throw new Error(`YouTube API error: ${searchResponse.status}`);
      }
      
      const searchData: YouTubeSearchResponse = await searchResponse.json();
      
      if (!searchData.items || searchData.items.length === 0) {
        return [];
      }

      // Get video durations
      const videoIds = searchData.items.map(item => item.id.videoId).join(',');
      const videoUrl = `${this.baseUrl}/videos?part=contentDetails&id=${videoIds}&key=${this.apiKey}`;
      
      const videoResponse = await fetch(videoUrl);
      const videoData: YouTubeVideoResponse = await videoResponse.json();

      // Combine search results with video details
      const tracks: Track[] = searchData.items.map((item, index) => {
        const duration = videoData.items[index] 
          ? parseDuration(videoData.items[index].contentDetails.duration)
          : 180; // default 3 minutes

        // Extract artist and title from video title
        const fullTitle = item.snippet.title;
        const titleParts = fullTitle.split(' - ');
        const artist = titleParts.length > 1 ? titleParts[0] : item.snippet.channelTitle;
        const title = titleParts.length > 1 ? titleParts[1] : fullTitle;

        return {
          id: item.id.videoId,
          title: title.slice(0, 100), // Limit title length
          artist: artist.slice(0, 50), // Limit artist length
          album: 'YouTube',
          duration,
          coverUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
          audioUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`, // Note: This is for reference only
          genre: 'Music',
          year: new Date(item.snippet.publishedAt).getFullYear(),
        };
      });

      return tracks;
    } catch (error) {
      console.error('YouTube API Error:', error);
      throw error;
    }
  }

  async getTrendingTracks(): Promise<Track[]> {
    return this.searchTracks('trending music 2024');
  }

  async getTracksByGenre(genre: string): Promise<Track[]> {
    return this.searchTracks(`${genre} music`);
  }
}

export const youtubeService = new YouTubeService();