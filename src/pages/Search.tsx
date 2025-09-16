import { useState, useEffect } from 'react';
import { Search as SearchIcon, Play, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { sampleTracks } from '@/data/sampleTracks';
import { useMusic } from '@/contexts/MusicContext';
import { youtubeService } from '@/services/youtubeApi';
import { Track } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState<'local' | 'youtube'>('local');
  const { playTrack } = useMusic();
  const { toast } = useToast();

  // Local search through sample tracks
  const filteredTracks = sampleTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // YouTube search with debouncing
  useEffect(() => {
    if (searchQuery && searchMode === 'youtube') {
      const timeoutId = setTimeout(async () => {
        try {
          setIsSearching(true);
          const results = await youtubeService.searchTracks(searchQuery);
          setSearchResults(results);
        } catch (error: any) {
          toast({
            title: "Search Error", 
            description: error.message || "Failed to search YouTube",
            variant: "destructive"
          });
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchMode, toast]);

  const handlePlayTrack = (track: Track) => {
    const currentTracks = searchMode === 'youtube' ? searchResults : filteredTracks;
    playTrack(track, currentTracks);
  };

  const currentTracks = searchMode === 'youtube' ? searchResults : filteredTracks;
  const displayTracks = searchQuery ? currentTracks : [];

  const genres = ['Electronic', 'Pop', 'Rock', 'Jazz', 'Ambient', 'R&B', 'Synthwave'];

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Search</h1>
        
        {/* Search Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={searchMode === 'local' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSearchMode('local')}
          >
            Local Tracks
          </Button>
          <Button
            variant={searchMode === 'youtube' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSearchMode('youtube')}
          >
            YouTube Search
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
          <Input
            type="text"
            placeholder={
              searchMode === 'youtube' 
                ? "Search YouTube for music..." 
                : "Search local tracks..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-background"
          />
        </div>
      </div>

      {searchQuery ? (
        /* Search Results */
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">
            Search results for "{searchQuery}" 
            {searchMode === 'youtube' && <span className="text-sm text-muted-foreground ml-2">(YouTube)</span>}
          </h2>
          
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Searching YouTube...</span>
            </div>
          ) : displayTracks.length > 0 ? (
            <div className="space-y-2">
              {displayTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer group"
                  onClick={() => handlePlayTrack(track)}
                >
                  <span className="w-6 text-sm text-muted-foreground group-hover:hidden">
                    {index + 1}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-6 h-6 hidden group-hover:flex opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                  
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artist} • {track.album}
                    </p>
                  </div>
                  
                  <span className="text-sm text-muted-foreground">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchMode === 'youtube' 
                  ? 'No YouTube results found. Try different keywords or check your API key in src/config/youtube.ts'
                  : `No local results found for "${searchQuery}"`
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Browse Genres */
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Browse all</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {genres.map((genre) => {
              const genreTracks = sampleTracks.filter(track => track.genre === genre);
              const randomColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
              
              return (
                <div
                  key={genre}
                  className="aspect-square rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: randomColor }}
                  onClick={() => {
                    setSearchQuery(genre);
                    setSearchMode('youtube');
                  }}
                >
                  <h3 className="text-white font-semibold text-lg">{genre}</h3>
                  <p className="text-white/80 text-sm mt-1">
                    {genreTracks.length} tracks
                  </p>
                </div>
              );
            })}
          </div>
          
          {/* Recently Searched (placeholder) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recently searched</h3>
            <div className="text-muted-foreground">
              <p>Your recent searches will appear here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}