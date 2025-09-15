import { Play, Clock } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';

export default function RecentlyPlayed() {
  const { userData, playTrack } = useMusic();

  const handlePlayTrack = (track: any, index: number) => {
    playTrack(track, userData.recentlyPlayed);
  };

  const formatTimeAgo = (date: Date) => {
    // For demo purposes, return random recent times
    const hours = Math.floor(Math.random() * 24) + 1;
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-blue-900/20 to-transparent p-6 pb-8">
        <div className="flex items-end gap-6">
          <div className="w-60 h-60 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-2xl">
            <Clock className="w-24 h-24 text-white" />
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-wide">Playlist</p>
            <h1 className="text-5xl font-bold">Recently Played</h1>
            <p className="text-muted-foreground">
              {userData.recentlyPlayed.length} recently played tracks
            </p>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="px-6 pb-6">
        {userData.recentlyPlayed.length > 0 ? (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
              <span>#</span>
              <span>Title</span>
              <span>Album</span>
              <span>Played</span>
              <span>Duration</span>
            </div>

            {/* Tracks */}
            {userData.recentlyPlayed.map((track, index) => (
              <div
                key={`${track.id}-${index}`}
                className="grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-4 py-3 rounded-lg hover:bg-muted/50 cursor-pointer group"
                onClick={() => handlePlayTrack(track, index)}
              >
                <span className="text-muted-foreground text-sm group-hover:hidden">
                  {index + 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-4 h-4 hidden group-hover:flex opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="h-3 w-3" />
                </Button>

                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground truncate">
                  {track.album}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  {formatTimeAgo(new Date())}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No recent activity</h2>
            <p className="text-muted-foreground mb-6">
              Tracks you've played will show up here.
            </p>
            <Button asChild>
              <a href="/">Start listening</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}