import React from 'react';
import { HomeIcon, ShortsIcon, SubscriptionsIcon, LibraryIcon, PlusIcon } from './icons/Icons';
import { NavItem } from '../types';

const leftNavItems: NavItem[] = [
    { icon: <HomeIcon />, label: 'Home' },
    { icon: <ShortsIcon />, label: 'Shorts' },
];

const rightNavItems: NavItem[] = [
    { icon: <SubscriptionsIcon />, label: 'Subscriptions' },
    { icon: <LibraryIcon />, label: 'Library' }
];

interface BottomNavLinkProps {
    item: NavItem;
    isSelected?: boolean;
    onClick: () => void;
}

const BottomNavLink: React.FC<BottomNavLinkProps> = ({ item, isSelected, onClick }) => (
    <button 
        onClick={onClick} 
        className={`flex flex-col items-center justify-center space-y-1 w-full pt-2 pb-1 transition-colors duration-200 ${isSelected ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}
    >
        <div className={`${isSelected ? 'scale-110' : ''} transition-transform`}>
            {item.icon}
        </div>
        <span className="text-xs tracking-wide">{item.label}</span>
    </button>
);

interface BottomNavBarProps {
    activeItem: string;
    onItemClick: (label: string) => void;
    onUploadClick: () => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeItem, onItemClick, onUploadClick }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around sm:hidden z-20">
            <div className="flex justify-around w-full">
                {leftNavItems.map((item) => (
                    <BottomNavLink
                        key={item.label}
                        item={item}
                        isSelected={activeItem === item.label}
                        onClick={() => onItemClick(item.label)}
                    />
                ))}
            </div>

            <button 
                onClick={onUploadClick}
                className="absolute left-1/2 -translate-x-1/2 -top-4 w-14 h-14 bg-violet-500 hover:bg-violet-600 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform active:scale-90"
                aria-label="Create a video"
            >
                <PlusIcon className="w-8 h-8"/>
            </button>

            <div className="flex justify-around w-full">
                {rightNavItems.map((item) => (
                    <BottomNavLink
                        key={item.label}
                        item={item}
                        isSelected={activeItem === item.label}
                        onClick={() => onItemClick(item.label)}
                    />
                ))}
            </div>
        </nav>
    );
};

export default BottomNavBar;
