import { useState } from 'react';
import { Plus, ListMusic, Heart, Clock } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Library() {
  const { userData, createPlaylist } = useMusic();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim(), newPlaylistDescription.trim());
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setIsCreateDialogOpen(false);
    }
  };

  const quickAccessItems = [
    {
      title: 'Liked Songs',
      subtitle: `${userData.likedTracks.length} liked songs`,
      icon: Heart,
      iconColor: 'text-green-500',
      href: '/liked'
    },
    {
      title: 'Recently Played',
      subtitle: `${userData.recentlyPlayed.length} tracks`,
      icon: Clock,
      iconColor: 'text-blue-500',
      href: '/recent'
    }
  ];

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
              <DialogDescription>
                Give your playlist a name and description to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Playlist Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Playlist"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="A collection of my favorite songs..."
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Access */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Access</h2>
        <div className="grid gap-4">
          {quickAccessItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="flex items-center gap-4 p-4 rounded-lg bg-card hover:bg-card/80 transition-colors"
            >
              <div className={`p-2 rounded-md bg-muted ${item.iconColor}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Created Playlists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Created by You</h2>
        </div>
        
        {userData.playlists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {userData.playlists.map((playlist) => (
              <a
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                className="music-card group"
              >
                <div className="aspect-square mb-3 relative bg-muted rounded-md flex items-center justify-center">
                  {playlist.coverUrl ? (
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      className="w-full h-full rounded-md object-cover"
                    />
                  ) : (
                    <ListMusic className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <h3 className="font-medium text-sm truncate mb-1">{playlist.name}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {playlist.tracks.length} tracks • By you
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
            <ListMusic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">You haven't created any playlists yet</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create Your First Playlist
            </Button>
          </div>
        )}
      </section>

      {/* Recently Created */}
      {userData.playlists.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Recently Created</h2>
          <div className="space-y-2">
            {userData.playlists.slice(0, 5).map((playlist) => (
              <a
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                  <ListMusic className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{playlist.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {playlist.tracks.length} tracks • {playlist.description || 'No description'}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}