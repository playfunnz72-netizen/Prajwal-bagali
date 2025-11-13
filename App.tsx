
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VideoGrid from './components/VideoGrid';
import { videos } from './constants';
import { Video } from './types';
import VideoPage from './pages/VideoPage';

const App: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState<string>('Home');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleGoHome = () => {
    setSelectedVideo(null);
    setActiveNavItem('Home');
  };

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    // Optionally, you can clear the active sidebar item or set it to something else
    // setActiveNavItem(''); 
  };

  return (
    <div className="bg-zinc-900 text-white min-h-screen font-sans">
      <Header onLogoClick={handleGoHome} />
      <div className="flex">
        <Sidebar activeItem={activeNavItem} onItemClick={setActiveNavItem} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 sm:ml-60">
           {selectedVideo ? (
             <VideoPage 
                video={selectedVideo} 
                relatedVideos={videos.filter(v => v.id !== selectedVideo.id)}
                onVideoSelect={handleSelectVideo}
             />
           ) : (
             <VideoGrid videos={videos} onVideoSelect={handleSelectVideo} />
           )}
        </main>
      </div>
    </div>
  );
};

export default App;