
import React from 'react';
import { HamburgerIcon, YouTubeLogo, SearchIcon, MicIcon, VideoIcon, BellIcon } from './icons/Icons';

interface HeaderProps {
    onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="bg-zinc-900/95 sticky top-0 z-10 flex items-center justify-between h-14 px-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-zinc-700 hidden sm:block">
          <HamburgerIcon />
        </button>
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={onLogoClick}
        >
          <YouTubeLogo />
          <span className="text-xl font-semibold tracking-tighter">YouTube</span>
        </div>
      </div>
      <div className="flex-1 flex justify-center px-4 lg:px-16">
        <div className="w-full max-w-2xl flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500 text-white placeholder-zinc-400"
          />
          <button className="bg-zinc-700 border border-zinc-700 border-l-0 px-5 py-2 rounded-r-full hover:bg-zinc-600">
            <SearchIcon />
          </button>
          <button className="ml-4 p-2.5 bg-zinc-800 rounded-full hover:bg-zinc-700 hidden sm:block">
            <MicIcon />
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-full hover:bg-zinc-700">
          <VideoIcon />
        </button>
        <button className="p-2 rounded-full hover:bg-zinc-700">
          <BellIcon />
        </button>
        <img
          src="https://picsum.photos/seed/user-avatar/40/40"
          alt="User Avatar"
          className="w-8 h-8 rounded-full cursor-pointer"
        />
      </div>
    </header>
  );
};

export default Header;