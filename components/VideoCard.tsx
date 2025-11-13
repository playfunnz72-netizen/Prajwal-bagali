
import React from 'react';
import { Video } from '../types';
import { MoreIcon } from './icons/Icons';

interface VideoCardProps {
  video: Video;
  onVideoSelect: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onVideoSelect }) => {
  return (
    <div 
      className="flex flex-col group cursor-pointer"
      onClick={() => onVideoSelect(video)}
    >
      <div className="relative">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full aspect-video object-cover rounded-xl"
        />
        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {video.duration}
        </span>
      </div>
      <div className="flex mt-3 space-x-3">
        <img
          src={video.channelImageUrl}
          alt={video.channelName}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <h3 className="text-base font-medium text-zinc-50 leading-snug line-clamp-2">
            {video.title}
          </h3>
          <div className="text-sm text-zinc-400 mt-1">
            <p>{video.channelName}</p>
            <div className="flex items-center">
              <span>{video.views}</span>
              <span className="mx-1.5 text-[8px]">&#9679;</span>
              <span>{video.uploadedAt}</span>
            </div>
          </div>
        </div>
         <button className="opacity-0 group-hover:opacity-100 p-1 self-start" onClick={(e) => e.stopPropagation()}>
            <MoreIcon />
        </button>
      </div>
    </div>
  );
};

export default VideoCard;