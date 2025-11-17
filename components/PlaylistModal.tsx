import React, { useState } from 'react';
import { Video, Playlist } from '../types';
import { CloseIcon, PlusIcon } from './icons/Icons';

interface PlaylistModalProps {
    video: Video;
    playlists: Playlist[];
    onClose: () => void;
    onToggleVideoInPlaylist: (playlistId: string, videoId: string) => void;
    onCreatePlaylist: (playlistName: string) => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ video, playlists, onClose, onToggleVideoInPlaylist, onCreatePlaylist }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    const handleCreate = () => {
        if (newPlaylistName.trim()) {
            onCreatePlaylist(newPlaylistName.trim());
            setNewPlaylistName('');
            setIsCreating(false);
        }
    };

    const handleCancelCreate = () => {
        setNewPlaylistName('');
        setIsCreating(false);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleCreate();
        else if (e.key === 'Escape') handleCancelCreate();
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl w-full max-w-sm flex flex-col shadow-2xl m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
                    <h2 className="text-lg font-semibold">Save to...</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700" aria-label="Close">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[60vh]">
                    {playlists.map(playlist => (
                        <label key={playlist.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-5 w-5 rounded bg-white dark:bg-zinc-600 border-zinc-400 dark:border-zinc-500 text-blue-500 focus:ring-blue-500"
                                checked={playlist.videoIds.includes(video.id)}
                                onChange={() => onToggleVideoInPlaylist(playlist.id, video.id)}
                            />
                            <span className="text-base">{playlist.name}</span>
                        </label>
                    ))}
                </main>

                <footer className="p-4 border-t border-zinc-200 dark:border-zinc-700">
                    {isCreating ? (
                        <div className="space-y-2">
                             <input
                                type="text"
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter playlist name..."
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white"
                                autoFocus
                            />
                            <div className="flex justify-end space-x-2">
                                <button onClick={handleCancelCreate} className="px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-semibold">
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleCreate} 
                                    className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
                                    disabled={!newPlaylistName.trim()}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setIsCreating(true)} className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700">
                            <PlusIcon className="w-6 h-6" />
                            <span className="text-base">Create new playlist</span>
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default PlaylistModal;