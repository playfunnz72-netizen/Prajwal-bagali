

import React from 'react';
import { Video } from '../types';
import VideoCard, { VideoCardSkeleton } from './VideoCard';

interface VideoGridProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
  isLoading?: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, onVideoSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
        {Array.from({ length: 15 }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onVideoSelect={onVideoSelect} />
      ))}
    </div>
  );
};

export default VideoGrid;
