import { useState } from 'react';
import { Search as SearchIcon, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { sampleTracks } from '@/data/sampleTracks';
import { useMusic } from '@/contexts/MusicContext';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const { playTrack } = useMusic();

  const filteredTracks = sampleTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayTrack = (track: any) => {
    playTrack(track, filteredTracks);
  };

  const genres = ['Electronic', 'Pop', 'Rock', 'Jazz', 'Ambient', 'R&B', 'Synthwave'];

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Search</h1>
        
        {/* Search Input */}
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
      </div>

      {searchQuery ? (
        /* Search Results */
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">
            Search results for "{searchQuery}"
          </h2>
          
          {filteredTracks.length > 0 ? (
            <div className="space-y-2">
              {filteredTracks.map((track, index) => (
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
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
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
                  onClick={() => setSearchQuery(genre)}
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