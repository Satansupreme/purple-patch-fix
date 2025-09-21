import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { youtubeId } = await req.json();

    if (!youtubeId) {
      return new Response(
        JSON.stringify({ error: 'YouTube ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Getting audio stream for YouTube ID: ${youtubeId}`);

    // For now, we'll use YouTube's embed player which works better for audio
    // This creates a streamable URL that works in most browsers
    const audioUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0&enablejsapi=1&origin=${req.headers.get('origin') || 'localhost'}`;
    
    console.log(`Returning embed URL for audio: ${audioUrl}`);

    return new Response(
      JSON.stringify({ 
        audioUrl,
        type: 'embed',
        message: "YouTube embed URL for audio playback"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in get-audio-stream function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Audio stream extraction failed',
        fallback: true
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});