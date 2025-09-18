import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

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
      duration: string;
    };
    statistics: {
      viewCount: string;
    };
  }>;
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, maxResults = 20 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Searching YouTube for: ${query}`);

    // Search YouTube for videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=${maxResults}&q=${encodeURIComponent(query + ' music')}&key=${YOUTUBE_API_KEY}`;
    
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('YouTube search error:', errorText);
      return new Response(
        JSON.stringify({ error: 'YouTube API search failed' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const searchData: YouTubeSearchResponse = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return new Response(
        JSON.stringify({ tracks: [] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get video details for duration and view count
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData: YouTubeVideoResponse = await detailsResponse.json();

    // Map results to track format and store in database
    const tracks = [];
    
    for (let i = 0; i < searchData.items.length; i++) {
      const item = searchData.items[i];
      const details = detailsData.items[i];
      
      if (!details) continue;

      const duration = parseDuration(details.contentDetails.duration);
      const viewCount = parseInt(details.statistics.viewCount || '0');
      
      // Extract artist and title from video title
      const title = item.snippet.title;
      let artist = item.snippet.channelTitle;
      let trackTitle = title;
      
      // Try to parse "Artist - Title" format
      if (title.includes(' - ')) {
        const parts = title.split(' - ');
        if (parts.length >= 2) {
          artist = parts[0].trim();
          trackTitle = parts.slice(1).join(' - ').trim();
        }
      }
      
      const track = {
        youtube_id: item.id.videoId,
        title: trackTitle,
        artist: artist,
        album: 'YouTube',
        duration: duration,
        cover_url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        genre: 'Unknown',
        year: new Date(item.snippet.publishedAt).getFullYear(),
        view_count: viewCount,
      };

      // Insert or update track in database
      const { data, error } = await supabase
        .from('tracks')
        .upsert(track, { onConflict: 'youtube_id' })
        .select()
        .single();

      if (!error && data) {
        tracks.push({
          id: data.id,
          title: data.title,
          artist: data.artist,
          album: data.album,
          duration: data.duration,
          coverUrl: data.cover_url,
          audioUrl: `https://www.youtube.com/watch?v=${data.youtube_id}`,
          genre: data.genre,
          year: data.year,
        });
      } else {
        console.error('Database error:', error);
      }
    }

    console.log(`Found ${tracks.length} tracks`);

    return new Response(
      JSON.stringify({ tracks }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in youtube-search function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});