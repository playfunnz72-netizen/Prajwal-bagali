

import React, { useState, useRef, useEffect } from 'react';
import { Notification, Video, UserProfile } from '../types';
import { HamburgerIcon, AppLogo, SearchIcon, VideoIcon, BellIcon, ArrowBackIcon, CameraIcon } from './icons/Icons';
import NotificationsPanel from './NotificationsPanel';
import ProfileMenu from './ProfileMenu';

interface HeaderProps {
    onLogoClick?: () => void;
    onCreateClick: () => void;
    onCameraSearchClick: () => void;
    onNotificationsClick: () => void;
    hasUnreadNotifications: boolean;
    isNotificationsOpen: boolean;
    notifications: Notification[];
    videos: Video[];
    onNotificationClick: (video: Video) => void;
    onVideoSelect: (video: Video) => void;
    onCloseNotifications: () => void;
    currentUser: UserProfile;
    onNavItemClick: (label: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onLogoClick, 
    onCreateClick, 
    onCameraSearchClick, 
    onNotificationsClick, 
    hasUnreadNotifications,
    isNotificationsOpen,
    notifications,
    videos,
    onNotificationClick,
    onVideoSelect,
    onCloseNotifications,
    currentUser,
    onNavItemClick
}) => {
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setIsResultsOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === '') {
        setIsResultsOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
        const results = videos.filter(video => 
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            video.channelName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setIsResultsOpen(true);
    }
  };

  const handleResultClick = (video: Video) => {
    onVideoSelect(video);
    setSearchQuery('');
    setSearchResults([]);
    setIsResultsOpen(false);
    if(isMobileSearchVisible) {
        setIsMobileSearchVisible(false);
    }
  };

  const SearchResultsPanel = () => (
    <div className="absolute top-full mt-2 w-full bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 z-20 max-h-96 overflow-y-auto animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
        {searchResults.length > 0 ? (
            searchResults.map(video => (
                <div key={video.id} onClick={() => handleResultClick(video)} className="flex items-center p-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl">
                    <img src={video.thumbnailUrl} alt={video.title} className="w-24 aspect-video object-cover rounded" />
                    <div className="ml-3 overflow-hidden">
                        <p className="font-semibold text-sm line-clamp-2 text-zinc-900 dark:text-white">{video.title}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{video.channelName}</p>
                    </div>
                </div>
            ))
        ) : (
            <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
                No results found for "{searchQuery}"
            </div>
        )}
    </div>
  );

  if (isMobileSearchVisible) {
    return (
      <header ref={searchContainerRef as React.RefObject<HTMLElement>} className="bg-white/95 dark:bg-zinc-900/95 sticky top-0 z-10 flex items-center h-14 px-2 sm:px-4 shadow-sm dark:shadow-none backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setIsMobileSearchVisible(false)}
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700"
          aria-label="Back"
        >
          <ArrowBackIcon />
        </button>
        <div className="relative w-full flex items-center ml-2">
           <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-zinc-500 dark:text-zinc-400">
                <SearchIcon />
            </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            className="w-full bg-transparent focus:outline-none text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 pl-8 pr-10"
            autoFocus
          />
           <button 
            onClick={onCameraSearchClick}
            className="absolute inset-y-0 right-0 flex items-center p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
            aria-label="Search with camera"
          >
            <CameraIcon />
          </button>
          {isResultsOpen && <SearchResultsPanel />}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/95 dark:bg-zinc-900/95 sticky top-0 z-10 flex items-center justify-between h-14 px-4 shadow-sm dark:shadow-none backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 hidden sm:block">
          <HamburgerIcon />
        </button>
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={onLogoClick}
        >
          <AppLogo className="w-8 h-8 text-violet-500" />
          <span className="text-xl font-semibold tracking-tighter text-zinc-900 dark:text-white">FunsTube</span>
        </div>
      </div>
      <div ref={searchContainerRef} className="flex-1 justify-center px-4 lg:px-16 hidden sm:flex">
        <div className="w-full max-w-2xl flex items-center space-x-2">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-zinc-500 dark:text-zinc-400">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchSubmit}
                    className="w-full bg-zinc-100 border border-zinc-300 rounded-full pl-12 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-zinc-900 placeholder-zinc-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-400"
                />
                {isResultsOpen && <SearchResultsPanel />}
            </div>
             <button 
                onClick={onCameraSearchClick}
                className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                aria-label="Search with camera"
            >
                <CameraIcon />
            </button>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button 
            onClick={() => setIsMobileSearchVisible(true)}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 sm:hidden"
            aria-label="Search"
        >
            <SearchIcon />
        </button>
        <button onClick={onCreateClick} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 hidden sm:block">
          <VideoIcon />
        </button>
        <div className="relative">
            <button 
                id="notification-bell"
                onClick={onNotificationsClick} 
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700"
                aria-label="Notifications"
            >
              <BellIcon />
              {hasUnreadNotifications && (
                <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-zinc-900"></span>
              )}
            </button>
            {isNotificationsOpen && (
                <NotificationsPanel 
                    notifications={notifications}
                    videos={videos}
                    onClose={onCloseNotifications}
                    onNotificationClick={onNotificationClick}
                />
            )}
        </div>
        <div className="relative">
             <button
                onClick={() => setIsProfileMenuOpen(prev => !prev)}
                aria-label="User menu"
             >
                <img
                    src={currentUser.avatarUrl}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full cursor-pointer"
                />
            </button>
            {isProfileMenuOpen && (
                <ProfileMenu
                    user={currentUser}
                    onClose={() => setIsProfileMenuOpen(false)}
                    onNavItemClick={onNavItemClick}
                />
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
