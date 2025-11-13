
import React from 'react';
import { HomeIcon, ShortsIcon, SubscriptionsIcon, LibraryIcon, HistoryIcon, YourVideosIcon, WatchLaterIcon, LikedVideosIcon, ChevronRightIcon } from './icons/Icons';
import { NavItem } from '../types';
import { currentUser } from '../constants';

const mainNavItems: NavItem[] = [
    { icon: <HomeIcon />, label: 'Home' },
    { icon: <ShortsIcon />, label: 'Shorts' },
    { icon: <SubscriptionsIcon />, label: 'Subscriptions' }
];

const youNavItems: NavItem[] = [
    { icon: <LibraryIcon />, label: 'Your Channel' },
    { icon: <HistoryIcon />, label: 'History' },
    { icon: <YourVideosIcon />, label: 'Your videos' },
    { icon: <WatchLaterIcon />, label: 'Watch Later' },
    { icon: <LikedVideosIcon />, label: 'Liked videos' },
];

interface NavLinkProps {
    item: NavItem;
    isSelected?: boolean;
    onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ item, isSelected, onClick }) => (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className={`flex items-center space-x-6 px-3 py-2.5 rounded-lg hover:bg-zinc-700 ${isSelected ? 'bg-zinc-700 font-bold' : ''}`}>
        {item.icon}
        <span className="text-sm">{item.label}</span>
    </a>
);

interface SidebarProps {
    activeItem: string;
    onItemClick: (label: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  return (
    <aside className="fixed top-14 left-0 h-[calc(100vh-56px)] w-60 bg-zinc-900 text-white p-3 space-y-2 hidden sm:block overflow-y-auto">
        <nav className="space-y-1">
            {mainNavItems.map((item) => (
                <NavLink 
                    key={item.label} 
                    item={item} 
                    isSelected={activeItem === item.label}
                    onClick={() => onItemClick(item.label)}
                />
            ))}
        </nav>
        <hr className="border-zinc-700 my-3" />
        <a href="#" 
           onClick={(e) => { e.preventDefault(); onItemClick('Your Channel'); }}
           className={`flex items-center p-2 rounded-lg hover:bg-zinc-700 transition-colors ${activeItem === 'Your Channel' ? 'bg-zinc-700' : ''}`}>
            <div className="flex-1 flex items-center space-x-3">
                 <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full"
                />
                 <div className="overflow-hidden">
                    <h2 className="text-base font-semibold truncate">{currentUser.name}</h2>
                    <p className="text-xs text-zinc-400 truncate">{currentUser.handle}</p>
                 </div>
            </div>
            <ChevronRightIcon />
        </a>
        <nav className="space-y-1 mt-2">
            {youNavItems.map((item) => (
                <NavLink 
                    key={item.label} 
                    item={item} 
                    isSelected={activeItem === item.label}
                    onClick={() => onItemClick(item.label)}
                />
            ))}
        </nav>
    </aside>
  );
};

export default Sidebar;
