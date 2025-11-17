import React from 'react';
import { Video } from '../types';
import { ShareIcon, LinkIcon } from './icons/Icons';

interface VideoCardProps {
  video: Video;
  onVideoSelect: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onVideoSelect }) => {
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onVideoSelect

    const videoUrl = `${window.location.origin}${window.location.pathname}?v=${video.id}`;
    const shareData = {
      title: video.title,
      text: `Check out this FunsTube video: ${video.title}`,
      url: videoUrl,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(videoUrl);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Failed to share:', err);
      alert('Could not copy link.');
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onVideoSelect
    const videoUrl = `${window.location.origin}${window.location.pathname}?v=${video.id}`;
    try {
      await navigator.clipboard.writeText(videoUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Could not copy link.');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onVideoSelect(video);
    }
  };

  return (
    <div 
      className="flex flex-col group cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-violet-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 overflow-hidden"
      onClick={() => onVideoSelect(video)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Watch: ${video.title}`}
    >
      <div className="relative">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full aspect-video object-cover"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute bottom-2 right-2 bg-black/75 text-white text-xs font-semibold px-2 py-1 rounded">
          {video.duration}
        </span>
      </div>
      <div className="flex space-x-3 py-3 px-2">
        <img
          src={video.channelImageUrl}
          alt={video.channelName}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          loading="lazy"
          decoding="async"
        />
        <div className="flex-1">
          <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2">
            {video.title}
          </h3>
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            <p>{video.channelName}</p>
            <div className="flex items-center">
              <span>{video.views}</span>
              <span className="mx-1.5 text-[8px]">&#9679;</span>
              <span>{video.uploadedAt}</span>
            </div>
          </div>
        </div>
        <div className="flex self-start opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700" 
                onClick={handleCopyLink}
                aria-label="Copy video link"
                title="Copy link"
            >
                <LinkIcon />
            </button>
            <button 
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700" 
                onClick={handleShare}
                aria-label="Share video"
                title="Share"
            >
                <ShareIcon />
            </button>
        </div>
      </div>
    </div>
  );
};

export const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="relative">
        <div className="w-full aspect-video bg-zinc-200 dark:bg-zinc-700 rounded-xl"></div>
      </div>
      <div className="flex mt-3 space-x-3">
        <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 flex-shrink-0"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};


export default VideoCard;