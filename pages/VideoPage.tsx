
import React from 'react';
import { Video, Comment } from '../types';
import { comments } from '../constants';
import { LikeIcon, DislikeIcon, ShareIcon, SaveIcon, MoreIcon } from '../components/icons/Icons';

interface VideoPageProps {
    video: Video;
    relatedVideos: Video[];
    onVideoSelect: (video: Video) => void;
}

const RelatedVideoCard: React.FC<{video: Video, onVideoSelect: (video: Video) => void}> = ({ video, onVideoSelect }) => (
    <div className="flex items-start space-x-2 group cursor-pointer" onClick={() => onVideoSelect(video)}>
        <div className="relative flex-shrink-0">
            <img src={video.thumbnailUrl} alt={video.title} className="w-40 aspect-video object-cover rounded-lg" />
             <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                {video.duration}
            </span>
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-semibold text-zinc-50 leading-tight line-clamp-2">{video.title}</h4>
            <div className="text-xs text-zinc-400 mt-1">
                <p>{video.channelName}</p>
                <div className="flex items-center">
                    <span>{video.views}</span>
                    <span className="mx-1 text-[6px]">&#9679;</span>
                    <span>{video.uploadedAt}</span>
                </div>
            </div>
        </div>
    </div>
);

const VideoPage: React.FC<VideoPageProps> = ({ video, relatedVideos, onVideoSelect }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-8">
            <div className="lg:col-span-2">
                {/* Video Player Placeholder */}
                <div className="aspect-video bg-zinc-800 rounded-2xl mb-4">
                     <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover rounded-2xl" />
                </div>

                {/* Video Title */}
                <h1 className="text-xl font-bold text-white mb-2">{video.title}</h1>
                
                {/* Channel Info & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                        <img src={video.channelImageUrl} alt={video.channelName} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="text-base font-medium">{video.channelName}</p>
                            <p className="text-xs text-zinc-400">1.2M subscribers</p>
                        </div>
                        <button className="bg-white text-black font-semibold px-4 py-2 rounded-full text-sm ml-4">Subscribe</button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-zinc-800 rounded-full">
                            <button className="flex items-center space-x-2 px-4 py-2 hover:bg-zinc-700 rounded-l-full">
                                <LikeIcon />
                                <span className="text-sm">123K</span>
                            </button>
                            <div className="w-px h-6 bg-zinc-600"></div>
                            <button className="px-4 py-2 hover:bg-zinc-700 rounded-r-full"><DislikeIcon /></button>
                        </div>
                         <button className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700">
                            <ShareIcon />
                            <span className="text-sm">Share</span>
                        </button>
                        <button className="px-3 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700">
                           <MoreIcon />
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-zinc-800 p-4 rounded-xl mt-4">
                    <div className="flex items-center space-x-4 font-semibold text-sm mb-2">
                        <span>{video.views}</span>
                        <span>{video.uploadedAt}</span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{video.description}</p>
                </div>
                
                {/* Comments Section */}
                <div className="mt-6">
                    <h2 className="text-lg font-bold mb-4">{comments.length} Comments</h2>
                    <div className="space-y-6">
                        {comments.map(comment => (
                            <div key={comment.id} className="flex items-start space-x-3">
                                <img src={comment.avatarUrl} alt={comment.author} className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <div className="flex items-baseline space-x-2 text-sm">
                                        <p className="font-semibold">{comment.author}</p>
                                        <p className="text-xs text-zinc-400">{comment.timestamp}</p>
                                    </div>
                                    <p className="text-sm mt-1">{comment.text}</p>
                                    <div className="flex items-center space-x-4 mt-2 text-zinc-400">
                                        <button className="flex items-center space-x-1 text-xs hover:text-white">
                                            <LikeIcon /> <span>{comment.likes}</span>
                                        </button>
                                         <button className="flex items-center space-x-1 text-xs hover:text-white">
                                            <DislikeIcon />
                                        </button>
                                        <button className="text-xs hover:text-white font-semibold">Reply</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Related Videos */}
            <div className="lg:col-span-1 space-y-4">
                {relatedVideos.map(relatedVideo => (
                    <RelatedVideoCard key={relatedVideo.id} video={relatedVideo} onVideoSelect={onVideoSelect} />
                ))}
            </div>
        </div>
    );
};

export default VideoPage;
