


import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VideoGrid from './components/VideoGrid';
import { videos, playlists as initialPlaylists, notifications, currentUser } from './constants';
import { Video, Playlist, Notification } from './types';
import { VideoPage } from './pages/VideoPage';
import BottomNavBar from './components/BottomNavBar';
import ShortsPlayer from './components/ShortsPlayer';
import UploadModal from './components/UploadModal';
import { LibraryPage } from './pages/LibraryPage';
import { ChannelPage } from './pages/ChannelPage';
import CameraSearchModal from './components/CameraSearchModal';

export const App: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState<string>('Home');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCameraSearchModalOpen, setIsCameraSearchModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>(initialPlaylists);
  const [subscribedChannels, setSubscribedChannels] = useState(new Set<string>());
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  useEffect(() => {
      const timer = setTimeout(() => {
          setIsLoading(false);
      }, 2000); // Simulate 2 second load time
      return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
      const root = window.document.documentElement;
      
      const applyTheme = (themeValue: string) => {
          const isDark = themeValue === 'dark' || (themeValue === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
          root.classList.toggle('dark', isDark);
      };

      applyTheme(theme);
      localStorage.setItem('theme', theme);

      if (theme === 'system') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = () => applyTheme('system');
          mediaQuery.addEventListener('change', handleChange);
          return () => mediaQuery.removeEventListener('change', handleChange);
      }
  }, [theme]);

  const handleToggleNotifications = () => {
    setIsNotificationsOpen(prev => !prev);
    if (hasUnreadNotifications) {
        setHasUnreadNotifications(false);
    }
  };

  const handleNotificationClick = (video: Video) => {
    setSelectedVideo(video);
    setIsNotificationsOpen(false); // Close panel on navigation
  };

  const handleToggleSubscription = (channelName: string) => {
    setSubscribedChannels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(channelName)) {
        newSet.delete(channelName);
      } else {
        newSet.add(channelName);
      }
      return newSet;
    });
  };

  const handleToggleVideoInPlaylist = (playlistId: string, videoId: string) => {
    setUserPlaylists(prevPlaylists => {
      return prevPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          const videoIndex = playlist.videoIds.indexOf(videoId);
          if (videoIndex > -1) {
            // Remove video
            const newVideoIds = [...playlist.videoIds];
            newVideoIds.splice(videoIndex, 1);
            return { ...playlist, videoIds: newVideoIds };
          } else {
            // Add video
            return { ...playlist, videoIds: [...playlist.videoIds, videoId] };
          }
        }
        return playlist;
      });
    });
  };

  const handleCreatePlaylist = (playlistName: string) => {
    const newPlaylist: Playlist = {
      id: `pl${Date.now()}`,
      name: playlistName,
      videoIds: [],
    };
    setUserPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
  };

  const handleGoHome = () => {
    setSelectedVideo(null);
    setActiveNavItem('Home');
  };

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleNavItemClick = (label: string) => {
    setSelectedVideo(null);
    setActiveNavItem(label);
  };

  const renderContent = () => {
    if (selectedVideo) {
      return (
        <VideoPage 
          video={selectedVideo} 
          relatedVideos={videos.filter(v => v.id !== selectedVideo.id && !v.isShort)}
          onVideoSelect={handleSelectVideo}
          userPlaylists={userPlaylists}
          onToggleVideoInPlaylist={handleToggleVideoInPlaylist}
          onCreatePlaylist={handleCreatePlaylist}
          subscribedChannels={subscribedChannels}
          onToggleSubscription={handleToggleSubscription}
        />
      );
    }
    
    if (activeNavItem === 'Your Channel') {
        return <ChannelPage
            currentUser={currentUser}
            allVideos={videos}
            playlists={userPlaylists}
            onVideoSelect={handleSelectVideo}
        />;
    }

    const libraryNavItems = ['Library', 'History', 'Your videos', 'Watch Later', 'Liked videos'];
    if (libraryNavItems.includes(activeNavItem)) {
        return <LibraryPage 
            videos={videos} 
            playlists={userPlaylists} 
            onVideoSelect={handleSelectVideo} 
        />;
    }

    if (activeNavItem === 'Shorts') {
      return <ShortsPlayer 
                videos={videos} 
                subscribedChannels={subscribedChannels}
                onToggleSubscription={handleToggleSubscription}
                userPlaylists={userPlaylists}
                onToggleVideoInPlaylist={handleToggleVideoInPlaylist}
                onCreatePlaylist={handleCreatePlaylist}
              />;
    }
    
    if (activeNavItem === 'Subscriptions') {
      const subscribedVideos = videos.filter(video => subscribedChannels.has(video.channelName) && !video.isShort);
      if (subscribedVideos.length === 0 && !isLoading) {
        return (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <h2 className="text-2xl font-bold mb-2">No videos from your subscriptions</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Videos from channels you subscribe to will appear here.</p>
          </div>
        );
      }
      return <VideoGrid videos={subscribedVideos} onVideoSelect={handleSelectVideo} isLoading={isLoading} />;
    }

    return <VideoGrid videos={videos.filter(v => !v.isShort)} onVideoSelect={handleSelectVideo} isLoading={isLoading} />;
  };

  return (
    <div className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white min-h-screen font-sans">
      <Header 
        onLogoClick={handleGoHome} 
        onCreateClick={() => setIsUploadModalOpen(true)}
        onCameraSearchClick={() => setIsCameraSearchModalOpen(true)}
        onNotificationsClick={handleToggleNotifications}
        hasUnreadNotifications={hasUnreadNotifications}
        isNotificationsOpen={isNotificationsOpen}
        notifications={notifications}
        videos={videos}
        onNotificationClick={handleNotificationClick}
        onVideoSelect={handleSelectVideo}
        onCloseNotifications={() => setIsNotificationsOpen(false)}
        currentUser={currentUser}
        onNavItemClick={handleNavItemClick}
      />
      <div className="flex">
        <Sidebar activeItem={activeNavItem} onItemClick={handleNavItemClick} />
        <main className="flex-1 p-4 pb-20 sm:p-6 lg:p-8 sm:ml-60">
           {renderContent()}
        </main>
      </div>
      <BottomNavBar 
        activeItem={activeNavItem} 
        onItemClick={handleNavItemClick} 
        onUploadClick={() => setIsUploadModalOpen(true)}
      />
      {isUploadModalOpen && <UploadModal onClose={() => setIsUploadModalOpen(false)} />}
      {isCameraSearchModalOpen && <CameraSearchModal onClose={() => setIsCameraSearchModalOpen(false)} />}
    </div>
  );
};