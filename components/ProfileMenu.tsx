
import React, { useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { ChannelIcon, LogoutIcon } from './icons/Icons';

interface ProfileMenuProps {
    user: UserProfile;
    onClose: () => void;
    onNavItemClick: (label: string) => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, onClose, onNavItemClick }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleSignOut = () => {
        alert('Signed out!');
        onClose();
    };

    const handleChannelClick = () => {
        onNavItemClick('Your Channel');
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className="absolute top-full mt-2 right-0 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl w-72 border border-zinc-200 dark:border-zinc-700 z-30 animate-fade-in-up origin-top-right"
            style={{ animationDuration: '0.2s' }}
        >
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center space-x-4">
                <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full" />
                <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.handle}</p>
                </div>
            </div>
            <nav className="p-2">
                <button
                    onClick={handleChannelClick}
                    className="w-full flex items-center space-x-4 px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-left"
                >
                    <ChannelIcon />
                    <span>Your Channel</span>
                </button>
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-4 px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-left"
                >
                    <LogoutIcon />
                    <span>Sign out</span>
                </button>
            </nav>
        </div>
    );
};

export default ProfileMenu;