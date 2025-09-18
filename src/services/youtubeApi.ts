import { Track } from '@/types/music';
import { supabase } from '@/integrations/supabase/client';

export class YouTubeService {
  async searchTracks(query: string): Promise<Track[]> {
    try {
      console.log(`Searching for: ${query}`);
      
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: { query, maxResults: 20 }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      return data?.tracks || [];
    } catch (error) {
      console.error('YouTube search error:', error);
      throw error;
    }
  }

  async getTrendingTracks(): Promise<Track[]> {
    return this.searchTracks('trending music 2024');
  }

  async getTracksByGenre(genre: string): Promise<Track[]> {
    return this.searchTracks(`${genre} music`);
  }

  async getAudioStreamUrl(youtubeId: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('get-audio-stream', {
        body: { youtubeId }
      });

      if (error) {
        console.error('Audio stream error:', error);
        // Fallback to direct YouTube URL
        return `https://www.youtube.com/watch?v=${youtubeId}`;
      }

      return data?.audioUrl || `https://www.youtube.com/watch?v=${youtubeId}`;
    } catch (error) {
      console.error('Audio stream extraction error:', error);
      return `https://www.youtube.com/watch?v=${youtubeId}`;
    }
  }
}

export const youtubeService = new YouTubeService();