import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MusicProvider } from "@/contexts/MusicContext";
import { ErrorBoundary } from "@/components/debug/ErrorBoundary";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MusicPlayer } from "@/components/player/MusicPlayer";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import RecentlyPlayed from "./pages/RecentlyPlayed";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MusicProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 flex flex-col">
                  <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
                    <SidebarTrigger className="ml-4" />
                  </header>
                  <div className="flex-1 pb-20"> {/* Add padding bottom for player */}
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/liked" element={<LikedSongs />} />
                      <Route path="/recent" element={<RecentlyPlayed />} />
                      <Route path="/settings" element={<Settings />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </main>
              </div>
              <MusicPlayer />
            </SidebarProvider>
          </BrowserRouter>
        </MusicProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
