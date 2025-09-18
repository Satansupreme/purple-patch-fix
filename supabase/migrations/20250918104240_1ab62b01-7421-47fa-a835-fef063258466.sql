-- Create tracks table for storing music metadata
CREATE TABLE public.tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT DEFAULT 'Unknown Album',
  duration INTEGER NOT NULL DEFAULT 0,
  cover_url TEXT,
  genre TEXT DEFAULT 'Unknown',
  year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
  view_count BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user playlists table
CREATE TABLE public.playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create playlist tracks junction table
CREATE TABLE public.playlist_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(playlist_id, track_id)
);

-- Create user liked tracks table
CREATE TABLE public.user_liked_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  liked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, track_id)
);

-- Create user listening history table
CREATE TABLE public.user_listening_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_listened INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_liked_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_listening_history ENABLE ROW LEVEL SECURITY;

-- Tracks are publicly readable but only admin can insert/update
CREATE POLICY "Tracks are publicly readable" 
ON public.tracks 
FOR SELECT 
USING (true);

-- Playlists policies
CREATE POLICY "Users can view public playlists and their own" 
ON public.playlists 
FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own playlists" 
ON public.playlists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" 
ON public.playlists 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" 
ON public.playlists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Playlist tracks policies
CREATE POLICY "Users can view tracks in accessible playlists" 
ON public.playlist_tracks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.playlists p 
    WHERE p.id = playlist_id 
    AND (p.is_public = true OR p.user_id = auth.uid())
  )
);

CREATE POLICY "Users can manage tracks in their own playlists" 
ON public.playlist_tracks 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.playlists p 
    WHERE p.id = playlist_id 
    AND p.user_id = auth.uid()
  )
);

-- User liked tracks policies  
CREATE POLICY "Users can manage their own liked tracks" 
ON public.user_liked_tracks 
FOR ALL
USING (auth.uid() = user_id);

-- User listening history policies
CREATE POLICY "Users can manage their own listening history" 
ON public.user_listening_history 
FOR ALL
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_tracks_youtube_id ON public.tracks(youtube_id);
CREATE INDEX idx_tracks_title_search ON public.tracks USING GIN(to_tsvector('english', title || ' ' || artist));
CREATE INDEX idx_playlists_user_id ON public.playlists(user_id);
CREATE INDEX idx_playlist_tracks_playlist_id ON public.playlist_tracks(playlist_id);
CREATE INDEX idx_user_liked_tracks_user_id ON public.user_liked_tracks(user_id);
CREATE INDEX idx_user_listening_history_user_id ON public.user_listening_history(user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON public.tracks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();