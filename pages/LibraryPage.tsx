
import React, { useState } from 'react';
import { Video, Playlist } from '../types';
import VideoCard from '../components/VideoCard';
import { HistoryIcon, WatchLaterIcon, LikedVideosIcon, PlaylistIcon, CloseIcon } from '../components/icons/Icons';

interface LibraryPageProps {
    videos: Video[];
    playlists: Playlist[];
    onVideoSelect: (video: Video) => void;
}

const getVideosByIds = (ids: string[], allVideos: Video[]) => {
    return ids.map(id => allVideos.find(v => v.id === id)).filter((v): v is Video => v !== undefined);
};

export const LibraryPage: React.FC<LibraryPageProps> = ({ videos, playlists, onVideoSelect }) => {
    // State for history to make it manageable
    const [historyVideos, setHistoryVideos] = useState(videos.slice(0, 8));
    
    const watchLaterPlaylist = playlists.find(p => p.name === "Watch Later");
    const watchLaterVideos = watchLaterPlaylist ? getVideosByIds(watchLaterPlaylist.videoIds, videos) : [];
    
    // Mock liked videos for now
    const likedVideosPlaylist = { id: 'liked', name: 'Liked Videos', videoIds: ['2', '7', '8'] };
    const likedVideos = getVideosByIds(likedVideosPlaylist.videoIds, videos);
    
    const userPlaylists = playlists.filter(p => p.name !== "Watch Later");

    const handleRemoveFromHistory = (e: React.MouseEvent, videoId: string) => {
        e.stopPropagation();
        setHistoryVideos(prev => prev.filter(video => video.id !== videoId));
    };

    return (
        <div className="space-y-12">
            {/* History Section - New Layout */}
            <section>
                <div className="flex items-center gap-4 mb-4">
                    <HistoryIcon />
                    <h2 className="text-2xl font-bold">History</h2>
                </div>
                <div className="flex flex-col gap-4">
                    {historyVideos.length > 0 ? (
                        historyVideos.map(video => (
                           <div 
                                key={`hist-${video.id}`} 
                                onClick={() => onVideoSelect(video)}
                                className="group flex gap-4 cursor-pointer p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                               <div className="relative w-48 flex-shrink-0">
                                   <img 
                                        src={video.thumbnailUrl} 
                                        alt={video.title} 
                                        className="w-full aspect-video object-cover rounded-lg"
                                    />
                                    <span className="absolute bottom-1 right-1 bg-black/75 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                                        {video.duration}
                                    </span>
                               </div>
                               <div className="flex-1 min-w-0">
                                   <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2">
                                       {video.title}
                                   </h3>
                                   <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{video.channelName}</p>
                                   <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-1">
                                       {video.description.split('\n')[0]}
                                   </p>
                               </div>
                               <button 
                                    onClick={(e) => handleRemoveFromHistory(e, video.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 rounded-full self-start hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-opacity"
                                    aria-label="Remove from history"
                                >
                                   <CloseIcon className="w-5 h-5" />
                               </button>
                           </div>
                        ))
                    ) : (
                        <p className="text-zinc-500 dark:text-zinc-400">Your viewing history is empty.</p>
                    )}
                </div>
            </section>
            
            <hr className="border-zinc-200 dark:border-zinc-700" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Watch Later Section */}
                <section>
                    <div className="flex items-center gap-4 mb-4">
                        <WatchLaterIcon />
                        <h2 className="text-2xl font-bold">Watch Later</h2>
                    </div>
                     {watchLaterVideos.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            <div className="cursor-pointer group" onClick={() => onVideoSelect(watchLaterVideos[0])}>
                                <img src={watchLaterVideos[0].thumbnailUrl} alt={watchLaterVideos[0].title} className="w-full aspect-video object-cover rounded-xl mb-2 transition-transform duration-200 group-hover:scale-105" />
                                <h3 className="font-bold text-lg group-hover:text-violet-500">{watchLaterVideos[0].title}</h3>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{watchLaterVideos.length} videos</p>
                        </div>
                    ) : (
                        <p className="text-zinc-500 dark:text-zinc-400">Videos you save for later will appear here.</p>
                    )}
                </section>
                
                {/* Liked Videos Section */}
                 <section>
                    <div className="flex items-center gap-4 mb-4">
                        <LikedVideosIcon />
                        <h2 className="text-2xl font-bold">Liked Videos</h2>
                    </div>
                    {likedVideos.length > 0 ? (
                         <div className="flex flex-col gap-2">
                            <div className="cursor-pointer group" onClick={() => onVideoSelect(likedVideos[0])}>
                                <img src={likedVideos[0].thumbnailUrl} alt={likedVideos[0].title} className="w-full aspect-video object-cover rounded-xl mb-2 transition-transform duration-200 group-hover:scale-105" />
                                <h3 className="font-bold text-lg group-hover:text-violet-500">{likedVideos[0].title}</h3>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{likedVideos.length} videos</p>
                        </div>
                    ) : (
                        <p className="text-zinc-500 dark:text-zinc-400">Videos you like will appear here.</p>
                    )}
                </section>
            </div>
            
            <hr className="border-zinc-200 dark:border-zinc-700" />
            
            {/* Playlists Section */}
            <section>
                 <div className="flex items-center gap-4 mb-4">
                    <PlaylistIcon />
                    <h2 className="text-2xl font-bold">Playlists</h2>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {userPlaylists.map(playlist => {
                         const playlistVideos = getVideosByIds(playlist.videoIds, videos);
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
            </section>
        </div>
    );
};
