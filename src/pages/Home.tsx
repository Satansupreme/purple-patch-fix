import { Play } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { TrackList } from '@/components/common/TrackList';
import { sampleTracks } from '@/data/sampleTracks';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { playTrack, userData } = useMusic();

  const recentTracks = userData.recentlyPlayed.slice(0, 6);
  const popularTracks = sampleTracks.slice(0, 6);

  const handlePlayTrack = (track: any) => {
    playTrack(track, sampleTracks);
  };

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Good evening</h1>
        <p className="text-muted-foreground">Ready to jam to some music?</p>
      </div>

      {/* Recently Played */}
      {recentTracks.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Recently Played</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTracks.map((track) => (
              <div
                key={track.id}
                className="music-card group flex items-center gap-3"
                onClick={() => handlePlayTrack(track)}
              >
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{track.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {track.artist}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="player-button opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Tracks */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Popular Right Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {popularTracks.map((track) => (
            <div
              key={track.id}
              className="music-card group"
              onClick={() => handlePlayTrack(track)}
            >
              <div className="aspect-square mb-3 relative">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full rounded-md object-cover"
                />
                <Button
                  size="sm"
                  className="player-button absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-medium text-sm truncate mb-1">{track.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Discover */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Made for You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {sampleTracks.slice(6).map((track) => (
            <div
              key={track.id}
              className="music-card group"
              onClick={() => handlePlayTrack(track)}
            >
              <div className="aspect-square mb-3 relative">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full rounded-md object-cover"
                />
                <Button
                  size="sm"
                  className="player-button absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-medium text-sm truncate mb-1">{track.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}