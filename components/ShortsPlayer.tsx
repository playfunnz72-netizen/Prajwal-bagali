

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Video, Playlist } from '../types';
import { LikeIcon, DislikeIcon, ShareIcon, MoreIcon, CommentIcon, HeartFilledIcon, SaveIcon, CloseIcon, DescriptionIcon, PlusIcon, CheckIcon, VolumeHighIcon, VolumeMuteIcon, PlayIcon, PauseIcon, LinkIcon } from './icons/Icons';
import { comments as initialCommentsData, currentUser } from '../constants';
import PlaylistModal from './PlaylistModal';


interface ShortCardProps {
  video: Video;
  isSubscribed: boolean;
  onToggleSubscription: (channelName: string) => void;
  interactionState: {
    isLiked: boolean;
    isDisliked: boolean;
    likeCount: number;
    commentCount: number;
  };
  onLike: (videoId: string) => void;
  onDislike: (videoId: string) => void;
  onShare: (video: Video) => void;
  onComment: (videoId: string, newComment: string) => void;
  onSave: (video: Video) => void;
  setVideoRef: (id: string, element: HTMLVideoElement | null) => void;
  isPlaying: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

// Utility to format large numbers
const formatCount = (num: number): string => {
    if (num >= 1_000_000) {
        const formatted = (num / 1_000_000).toFixed(1);
        return formatted.endsWith('.0') ? `${Math.floor(num / 1_000_000)}M` : `${formatted}M`;
    }
    if (num >= 1_000) {
        const formatted = (num / 1_000).toFixed(1);
        return formatted.endsWith('.0') ? `${Math.floor(num / 1_000)}K` : `${formatted}K`;
    }
    return num.toString();
};


const ShortCard: React.FC<ShortCardProps> = ({ 
  video, 
  isSubscribed, 
  onToggleSubscription,
  interactionState,
  onLike,
  onDislike,
  onShare,
  onComment,
  onSave,
  setVideoRef,
  isPlaying,
  isMuted,
  onToggleMute
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const clickTimeoutRef = useRef<number | null>(null);

  const [animateLike, setAnimateLike] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);

  const { isLiked, isDisliked, likeCount, commentCount } = interactionState;
  
  const handleLikeClick = () => {
    if (!isLiked) {
      setAnimateLike(true);
      setTimeout(() => setAnimateLike(false), 300);
    }
    onLike(video.id);
  };
  
  const handleDoubleClick = () => {
    if (!isLiked) {
      onLike(video.id);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 600);
  };
  
  const handleSingleClick = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPaused(false);
        } else {
            videoRef.current.pause();
            setIsPaused(true);
        }
        setShowPlayPauseIcon(true);
        setTimeout(() => setShowPlayPauseIcon(false), 600);
      }
  };

  const handleClick = () => {
      if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
          clickTimeoutRef.current = null;
          handleDoubleClick();
      } else {
          clickTimeoutRef.current = window.setTimeout(() => {
              clickTimeoutRef.current = null;
              handleSingleClick();
          }, 250);
      }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setVideoRef(video.id, videoElement);
      const handleTimeUpdate = () => {
        if (videoElement.duration) {
          setProgress((videoElement.currentTime / videoElement.duration) * 100);
        }
      };
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        setVideoRef(video.id, null);
      };
    }
  }, [video.id, setVideoRef]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
        if (isPlaying) {
            const playPromise = videoElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Autoplay was prevented or interrupted by a pause().
                    // We can ignore 'AbortError' which is common during scrolling.
                    if (error.name !== 'AbortError') {
                        console.error("Play failed", error);
                    }
                });
            }
            setIsPaused(false);
        } else {
            videoElement.pause();
            setIsPaused(true);
        }
    }
  }, [isPlaying]);

  useEffect(() => {
    if(videoRef.current) {
        videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <>
    <div 
      className="relative h-full w-full snap-start flex-shrink-0 rounded-2xl overflow-hidden shadow-black/20 shadow-xl"
      onClick={handleClick}
    >
      <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          className="w-full h-full object-cover"
          loop
          playsInline
       />
       {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <HeartFilledIcon className="w-24 h-24 text-white drop-shadow-lg animate-heart-burst" />
          </div>
        )}
        {showPlayPauseIcon && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 p-4 rounded-full">
                   {isPaused ? <PlayIcon /> : <PauseIcon />}
                </div>
            </div>
        )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

      {/* Mute Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
        className="absolute top-4 right-4 bg-black/30 p-2 rounded-full z-10"
      >
        {isMuted ? <VolumeMuteIcon /> : <VolumeHighIcon />}
      </button>

      {/* Video Info Overlay */}
      <div className="absolute bottom-4 left-4 text-white w-[calc(100%-6rem)] pointer-events-none">
        <div className="flex items-center space-x-3 mb-2">
            <img src={video.channelImageUrl} alt={video.channelName} className="w-10 h-10 rounded-full border-2 border-white" />
            <p className="font-semibold text-sm truncate">{video.channelName}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleSubscription(video.channelName); }}
              className={`text-sm font-bold px-4 py-2 rounded-lg transition-all duration-200 transform active:scale-95 pointer-events-auto ${
                isSubscribed 
                  ? 'bg-white/25 text-white' 
                  : 'bg-violet-500 text-white hover:bg-violet-600'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
        <h3 className="font-semibold text-base line-clamp-2 leading-tight">{video.title}</h3>
        <p className="text-xs mt-1">{video.duration === 'LIVE' ? 'LIVE' : `Duration: ${video.duration}`}</p>
      </div>

      {/* Action Buttons Overlay */}
      <div className="absolute bottom-4 right-2 text-white flex flex-col items-center space-y-4">
        <button className="flex flex-col items-center group" onClick={(e) => { e.stopPropagation(); handleLikeClick(); }} aria-label={isLiked ? 'Unlike' : 'Like'}>
            <div className={`p-3.5 rounded-full bg-white/20 backdrop-blur-sm transition-colors duration-300 ${isLiked ? 'bg-violet-500' : 'group-hover:bg-white/30'}`}>
              <div className={animateLike ? 'animate-like-pop' : ''}>
                <LikeIcon />
              </div>
            </div>
            <span className="text-sm font-bold mt-2">{formatCount(likeCount)}</span>
        </button>
        <button className="flex flex-col items-center group" onClick={(e) => { e.stopPropagation(); onDislike(video.id); }} aria-label={isDisliked ? 'Remove dislike' : 'Dislike'}>
            <div className={`p-3.5 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300 ${isDisliked ? 'bg-zinc-500' : ''}`}>
              <DislikeIcon />
            </div>
            <span className="text-sm font-bold mt-2">Dislike</span>
        </button>
         <button className="flex flex-col items-center group" aria-label="Comments" onClick={(e) => { e.stopPropagation(); setIsCommentPanelOpen(true); }}>
            <div className="p-3.5 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
              <CommentIcon />
            </div>
            <span className="text-sm font-bold mt-2">{formatCount(commentCount)}</span>
        </button>
        <button className="flex flex-col items-center group" aria-label="Share" onClick={(e) => { e.stopPropagation(); onShare(video); }}>
            <div className="p-3.5 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
              <ShareIcon />
            </div>
            <span className="text-sm font-bold mt-2">Share</span>
        </button>
        <button className="group" aria-label="More options" onClick={(e) => { e.stopPropagation(); setIsMoreOptionsOpen(true); }}>
            <div className="p-3.5 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
              <MoreIcon />
            </div>
        </button>
        <div className="w-12 h-12 rounded-lg bg-zinc-800 border-2 border-zinc-500 mt-2 overflow-hidden">
            <img src={video.channelImageUrl} alt="sound" className="w-full h-full object-cover animate-spin-slow" />
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 pointer-events-none">
          <div className="h-full bg-violet-500" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
    {isCommentPanelOpen && <CommentsPanel video={video} commentCount={commentCount} onClose={() => setIsCommentPanelOpen(false)} onCommentSubmit={onComment} />}
    {isMoreOptionsOpen && <MoreOptionsPanel video={video} onClose={() => setIsMoreOptionsOpen(false)} onSave={onSave}/>}
    </>
  );
};


// Comments Panel Component
const CommentsPanel = ({ video, commentCount, onClose, onCommentSubmit }) => {
    const [comments, setComments] = useState(initialCommentsData);
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(newComment.trim()) {
            const newCommentObj = {
                id: `c${Date.now()}`,
                author: currentUser.name,
                avatarUrl: currentUser.avatarUrl,
                text: newComment,
                likes: '0',
                timestamp: 'Just now'
            };
            setComments([newCommentObj, ...comments]);
            onCommentSubmit(video.id, newComment);
            setNewComment('');
        }
    }
    
    return (
        <div className="absolute inset-0 bg-black/50 z-10" onClick={onClose}>
            <div
                className="absolute bottom-0 left-0 right-0 h-3/4 bg-zinc-100 dark:bg-zinc-800 rounded-t-2xl flex flex-col slide-in-bottom"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-zinc-300 dark:border-zinc-700">
                    <h3 className="font-bold text-lg">{commentCount} Comments</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"><CloseIcon/></button>
                </header>
                <main className="flex-1 p-4 overflow-y-auto space-y-4">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-3">
                            <img src={comment.avatarUrl} alt={comment.author} className="w-9 h-9 rounded-full"/>
                            <div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">@{comment.author.toLowerCase().replace(' ', '')} &middot; {comment.timestamp}</p>
                                <p className="text-sm">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </main>
                <footer className="p-4 border-t border-zinc-300 dark:border-zinc-700">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                        <img src={currentUser.avatarUrl} alt="your avatar" className="w-9 h-9 rounded-full"/>
                        <input 
                            type="text" 
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 bg-transparent border-b-2 border-zinc-300 dark:border-zinc-600 focus:border-violet-500 outline-none transition-colors"
                        />
                        <button type="submit" disabled={!newComment.trim()} className="font-bold text-violet-500 disabled:opacity-50">Send</button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

const DescriptionPanel = ({ description, onClose }) => (
    <div className="absolute inset-0 bg-black/50 z-20" onClick={onClose}>
        <div
            className="absolute bottom-0 left-0 right-0 max-h-[60%] bg-zinc-100 dark:bg-zinc-800 rounded-t-2xl flex flex-col slide-in-bottom p-4"
            onClick={(e) => e.stopPropagation()}
        >
            <header className="flex items-center justify-between pb-2 border-b border-zinc-300 dark:border-zinc-700">
                <h3 className="font-bold text-lg">Description</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"><CloseIcon/></button>
            </header>
            <main className="flex-1 py-4 overflow-y-auto whitespace-pre-wrap">
                {description}
            </main>
        </div>
    </div>
);


// More Options Panel Component
const MoreOptionsPanel = ({ video, onClose, onSave }) => {
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

    const handleCopyLink = async () => {
         const url = window.location.href.split('?')[0] + `?v=${video.id}`;
         await navigator.clipboard.writeText(url);
         alert('Link copied to clipboard');
         onClose();
    }
    
    if (isDescriptionOpen) {
        return <DescriptionPanel description={video.description} onClose={() => setIsDescriptionOpen(false)} />;
    }

    return (
        <div className="absolute inset-0 bg-black/50 z-10" onClick={onClose}>
            <div
                className="absolute bottom-0 left-0 right-0 bg-zinc-100 dark:bg-zinc-800 rounded-t-2xl flex flex-col slide-in-bottom p-4 space-y-2"
                onClick={(e) => e.stopPropagation()}
            >
               <button onClick={() => setIsDescriptionOpen(true)} className="flex items-center space-x-4 p-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg w-full text-left">
                   <DescriptionIcon />
                   <span>Description</span>
               </button>
               <button onClick={() => { onSave(video); onClose(); }} className="flex items-center space-x-4 p-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg w-full text-left">
                   <SaveIcon />
                   <span>Save to playlist</span>
               </button>
               <button onClick={handleCopyLink} className="flex items-center space-x-4 p-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg w-full text-left">
                   <LinkIcon />
                   <span>Copy link</span>
               </button>
                <button onClick={onClose} className="w-full mt-4 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 font-bold py-3 rounded-full">
                    Cancel
                </button>
            </div>
        </div>
    );
};



interface ShortsPlayerProps {
    videos: Video[];
    subscribedChannels: Set<string>;
    onToggleSubscription: (channelName: string) => void;
    userPlaylists: Playlist[];
    onToggleVideoInPlaylist: (playlistId: string, videoId: string) => void;
    onCreatePlaylist: (playlistName: string) => void;
}

const ShortsPlayer: React.FC<ShortsPlayerProps> = ({ videos, subscribedChannels, onToggleSubscription, userPlaylists, onToggleVideoInPlaylist, onCreatePlaylist }) => {
    const shorts = videos.filter(v => v.isShort);
    
    type ShortsInteractionState = Record<string, {
      isLiked: boolean;
      isDisliked: boolean;
      likeCount: number;
      commentCount: number;
    }>;

    const [shortsState, setShortsState] = useState<ShortsInteractionState>({});
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const [selectedVideoForPlaylist, setSelectedVideoForPlaylist] = useState<Video | null>(null);

    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(shorts[0]?.id || null);
    const [isMuted, setIsMuted] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

    const setVideoRef = useCallback((id: string, element: HTMLVideoElement | null) => {
        const map = videoRefs.current;
        if (element) {
            map.set(id, element);
        } else {
            map.delete(id);
        }
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const videoId = entry.target.getAttribute('data-video-id');
                    if (!videoId) return;

                    if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
                        setCurrentlyPlaying(videoId);
                    } else {
                        // If the video that is not intersecting is the one currently playing, pause it.
                        setCurrentlyPlaying(prev => (prev === videoId ? null : prev));
                    }
                });
            },
            { 
                root: containerRef.current, 
                threshold: 0.7 
            }
        );
        
        // Observe all the children of the container, which are the short video wrappers
        const elementsToObserve = Array.from(containerRef.current.children);
        // FIX: Explicitly cast `el` to Element. TypeScript was inferring it as `unknown`
        // which is not assignable to the `Element` type expected by `observer.observe`.
        elementsToObserve.forEach(el => observer.observe(el as Element));

        return () => {
            observer.disconnect();
        };
    }, [shorts]);

    useEffect(() => {
      const initialState = shorts.reduce((acc, video) => {
        acc[video.id] = {
          isLiked: false,
          isDisliked: false,
          likeCount: Math.floor(Math.random() * 2000000) + 50000,
          commentCount: Math.floor(Math.random() * 10000) + 500,
        };
        return acc;
      }, {} as ShortsInteractionState);
      setShortsState(initialState);
    }, [videos]);

    const handleLike = (videoId: string) => {
      setShortsState(prev => {
        const current = prev[videoId];
        const newIsLiked = !current.isLiked;
        const likeChange = newIsLiked ? 1 : -1;
        
        return {
          ...prev,
          [videoId]: {
            ...current,
            isLiked: newIsLiked,
            isDisliked: newIsLiked ? false : current.isDisliked,
            likeCount: current.likeCount + likeChange,
          }
        };
      });
    };

    const handleDislike = (videoId: string) => {
       setShortsState(prev => {
        const current = prev[videoId];
        const newIsDisliked = !current.isDisliked;
        
        return {
          ...prev,
          [videoId]: {
            ...current,
            isDisliked: newIsDisliked,
            isLiked: newIsDisliked ? false : current.isLiked,
            likeCount: current.isLiked && newIsDisliked ? current.likeCount - 1 : current.likeCount,
          }
        };
      });
    };
    
    const handleShare = async (video: Video) => {
        const shareData = {
            title: video.title,
            text: `Check out this FunsTube Short: ${video.title}`,
            url: window.location.href.split('?')[0] + `?v=${video.id}`, 
        };
        if (navigator.share) {
             await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareData.url);
            alert('Link copied to clipboard');
        }
    };

    const handleComment = (videoId: string, newComment: string) => {
        console.log(`Comment added to video ${videoId}: ${newComment}`);
        setShortsState(prev => ({
            ...prev,
            [videoId]: {
                ...prev[videoId],
                commentCount: prev[videoId].commentCount + 1,
            }
        }));
    };
    
    const handleSave = (video: Video) => {
        setSelectedVideoForPlaylist(video);
        setIsPlaylistModalOpen(true);
    };

    return (
        <>
            <div className="relative h-[calc(100vh-8rem)] w-full max-w-sm mx-auto">
                <div ref={containerRef} className="h-full w-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide rounded-2xl">
                    {shorts.map(short => (
                         <div key={short.id} data-video-id={short.id} className="h-full w-full snap-start flex-shrink-0">
                            <ShortCard 
                                video={short}
                                isSubscribed={subscribedChannels.has(short.channelName)}
                                onToggleSubscription={onToggleSubscription}
                                interactionState={shortsState[short.id] || { isLiked: false, isDisliked: false, likeCount: 0, commentCount: 0 }}
                                onLike={handleLike}
                                onDislike={handleDislike}
                                onShare={handleShare}
                                onComment={handleComment}
                                onSave={handleSave}
                                setVideoRef={setVideoRef}
                                isPlaying={currentlyPlaying === short.id}
                                isMuted={isMuted}
                                onToggleMute={() => setIsMuted(prev => !prev)}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {isPlaylistModalOpen && selectedVideoForPlaylist && (
                <PlaylistModal
                    video={selectedVideoForPlaylist}
                    playlists={userPlaylists}
                    onClose={() => setIsPlaylistModalOpen(false)}
                    onToggleVideoInPlaylist={onToggleVideoInPlaylist}
                    onCreatePlaylist={onCreatePlaylist}
                />
            )}
        </>
    );
};

export default ShortsPlayer;