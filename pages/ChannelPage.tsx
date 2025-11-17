import React, { useState } from 'react';
import { UserProfile, Video, Playlist } from '../types';
import VideoGrid from '../components/VideoGrid';
import { PlaylistIcon } from '../components/icons/Icons';

interface ChannelPageProps {
    currentUser: UserProfile;
    allVideos: Video[];
    playlists: Playlist[];
    onVideoSelect: (video: Video) => void;
}

const getVideosByIds = (ids: string[], allVideos: Video[]) => {
    return ids.map(id => allVideos.find(v => v.id === id)).filter((v): v is Video => v !== undefined);
};


export const ChannelPage: React.FC<ChannelPageProps> = ({ currentUser, allVideos, playlists, onVideoSelect }) => {
    const [activeTab, setActiveTab] = useState('Videos');

    const userVideos = allVideos.filter(v => v.channelName === currentUser.name && !v.isShort);
    const userShorts = allVideos.filter(v => v.channelName === currentUser.name && v.isShort);
    const userPlaylists = playlists.filter(p => p.name !== "Watch Later");

    const TabButton: React.FC<{ label: string }> = ({ label }) => (
        <button
            onClick={() => setActiveTab(label)}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === label
                    ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
        >
            {label.toUpperCase()}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'Videos':
                return userVideos.length > 0 ? (
                    <VideoGrid videos={userVideos} onVideoSelect={onVideoSelect} />
                ) : (
                    <p className="text-zinc-500 dark:text-zinc-400 mt-8 text-center">You haven't uploaded any videos yet.</p>
                );
            case 'Shorts':
                 return userShorts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {userShorts.map(short => (
                            <div key={short.id} className="cursor-pointer group" onClick={() => onVideoSelect(short)}>
                                <img src={short.thumbnailUrl} alt={short.title} className="w-full aspect-[9/16] object-cover rounded-lg transition-transform group-hover:scale-105" />
                                <h3 className="font-semibold mt-2 line-clamp-2 text-sm">{short.title}</h3>
                            </div>
                        ))}
                    </div>
                ) : (
                     <p className="text-zinc-500 dark:text-zinc-400 mt-8 text-center">You haven't uploaded any shorts yet.</p>
                );
            case 'Playlists':
                return userPlaylists.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {userPlaylists.map(playlist => {
                             const playlistVideos = getVideosByIds(playlist.videoIds, allVideos);
                             const firstVideo = playlistVideos[0];
                             return (
                                <div key={playlist.id} className="cursor-pointer group">
                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 transition-transform duration-200 group-hover:scale-105">
                                        {firstVideo ? (
                                            <img src={firstVideo.thumbnailUrl} alt={firstVideo.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                                                <PlaylistIcon className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-2 py-2 text-white font-bold">
                                            <PlaylistIcon />
                                            <span>{playlist.videoIds.length} videos</span>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold mt-2 group-hover:text-violet-500">{playlist.name}</h3>
                                </div>
                             )
                        })}
                    </div>
                ) : (
                    <p className="text-zinc-500 dark:text-zinc-400 mt-8 text-center">You haven't created any playlists yet.</p>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8">
            {/* Channel Header */}
            <div>
                <div className="h-32 sm:h-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/banner/1200/300)` }}></div>
                <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 px-4 sm:px-8">
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-zinc-900 flex-shrink-0" />
                    <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                        <h1 className="text-3xl font-bold">{currentUser.name}</h1>
                        <div className="flex items-center justify-center sm:justify-start space-x-3 text-zinc-500 dark:text-zinc-400">
                            <span>{currentUser.handle}</span>
                            <span className="text-xs">&#9679;</span>
                            <span>1.23M subscribers</span>
                             <span className="text-xs">&#9679;</span>
                            <span>{userVideos.length + userShorts.length} videos</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <nav className="border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex space-x-4">
                    <TabButton label="Videos" />
                    <TabButton label="Shorts" />
                    <TabButton label="Playlists" />
                </div>
            </nav>

            {/* Content */}
            <div>
                {renderContent()}
            </div>
        </div>
    );
};
