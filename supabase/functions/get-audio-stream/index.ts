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

    // Use yt-dlp to extract audio stream URL
    const ytDlpCommand = new Deno.Command("yt-dlp", {
      args: [
        "--format", "bestaudio[ext=m4a]/bestaudio/best",
        "--get-url",
        "--no-playlist",
        `https://www.youtube.com/watch?v=${youtubeId}`
      ],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await ytDlpCommand.output();
    
    if (code !== 0) {
      const error = new TextDecoder().decode(stderr);
      console.error('yt-dlp error:', error);
      
      // Fallback to direct YouTube URL if yt-dlp fails
      return new Response(
        JSON.stringify({ 
          audioUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
          message: "Direct YouTube URL (may not work in all browsers)"
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const audioUrl = new TextDecoder().decode(stdout).trim();
    console.log(`Audio URL extracted: ${audioUrl.substring(0, 100)}...`);

    return new Response(
      JSON.stringify({ audioUrl }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in get-audio-stream function:', error);
    
    // Fallback response
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