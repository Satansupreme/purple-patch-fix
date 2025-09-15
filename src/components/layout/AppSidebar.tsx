import { Home, Search, Library, ListMusic, Settings, Heart } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useMusic } from '@/contexts/MusicContext';

const mainItems = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Search', url: '/search', icon: Search },
  { title: 'Your Library', url: '/library', icon: Library },
];

const libraryItems = [
  { title: 'Liked Songs', url: '/liked', icon: Heart },
  { title: 'Recently Played', url: '/recent', icon: ListMusic },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { userData } = useMusic();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `sidebar-item ${isActive ? 'active' : ''}`;

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent className="bg-sidebar-background border-r border-sidebar-border">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Library Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-4 mb-2">
            {!collapsed && 'Library'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Playlists Section */}
        {userData.playlists.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground px-4 mb-2">
              {!collapsed && 'Playlists'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userData.playlists.map((playlist) => (
                  <SidebarMenuItem key={playlist.id}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={`/playlist/${playlist.id}`} 
                        className={getNavCls}
                      >
                        <ListMusic className="h-5 w-5" />
                        {!collapsed && (
                          <span className="truncate">{playlist.name}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className={getNavCls}>
                    <Settings className="h-5 w-5" />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}