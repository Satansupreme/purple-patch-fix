import { Play, Heart } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';

export default function LikedSongs() {
  const { userData, playTrack, removeFromLiked } = useMusic();

  const handlePlayAll = () => {
    if (userData.likedTracks.length > 0) {
      playTrack(userData.likedTracks[0], userData.likedTracks);
    }
  };

  const handlePlayTrack = (track: any, index: number) => {
    playTrack(track, userData.likedTracks);
  };

  const handleRemoveFromLiked = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    removeFromLiked(trackId);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-green-900/20 to-transparent p-6 pb-8">
        <div className="flex items-end gap-6">
          <div className="w-60 h-60 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-2xl">
            <Heart className="w-24 h-24 text-white fill-white" />
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-wide">Playlist</p>
            <h1 className="text-5xl font-bold">Liked Songs</h1>
            <p className="text-muted-foreground">
              {userData.likedTracks.length} liked songs
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      {userData.likedTracks.length > 0 && (
        <div className="px-6 py-4">
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all duration-200"
            onClick={handlePlayAll}
          >
            <Play className="h-6 w-6 fill-white" />
          </Button>
        </div>
      )}

      {/* Track List */}
      <div className="px-6 pb-6">
        {userData.likedTracks.length > 0 ? (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-[16px_4fr_2fr_1fr_48px] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
              <span>#</span>
              <span>Title</span>
              <span>Album</span>
              <span>Duration</span>
              <span></span>
            </div>

            {/* Tracks */}
            {userData.likedTracks.map((track, index) => (
              <div
                key={track.id}
                className="grid grid-cols-[16px_4fr_2fr_1fr_48px] gap-4 px-4 py-3 rounded-lg hover:bg-muted/50 cursor-pointer group"
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
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </div>

                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleRemoveFromLiked(e, track.id)}
                  >
                    <Heart className="h-4 w-4 fill-green-500 text-green-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Songs you like will appear here</h2>
            <p className="text-muted-foreground mb-6">
              Save songs by tapping the heart icon.
            </p>
            <Button asChild>
              <a href="/search">Find something to like</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}