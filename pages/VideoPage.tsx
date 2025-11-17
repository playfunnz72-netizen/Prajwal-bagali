

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Video, Comment, Playlist } from '../types';
import { comments as initialComments, currentUser } from '../constants';
import { LikeIcon, DislikeIcon, ShareIcon, SaveIcon, MoreIcon, PlayIcon, PauseIcon, VolumeHighIcon, VolumeMuteIcon, FullscreenIcon, FullscreenExitIcon, CaptionsIcon, SettingsIcon, CheckIcon, DownloadIcon, EditIcon, CloseIcon, SortIcon, FlagIcon } from '../components/icons/Icons';
import VideoCard from '../components/VideoCard';
import PlaylistModal from '../components/PlaylistModal';

const CommentItem: React.FC<{ comment: Comment; isLiked: boolean; onToggleLike: () => void; }> = ({ comment, isLiked, onToggleLike }) => {
    const [animate, setAnimate] = useState(false);
    const prevIsLiked = useRef(isLiked);

    useEffect(() => {
        // Only trigger animation when liking, not unliking
        if (prevIsLiked.current === false && isLiked === true) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 300);
            return () => clearTimeout(timer);
        }
        prevIsLiked.current = isLiked;
    }, [isLiked]);

    return (
        <div className="flex items-start space-x-4">
            <img
                src={comment.avatarUrl}
                alt={comment.author}
                className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                    <p className="font-semibold text-sm">{comment.author}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{comment.timestamp}</p>
                </div>
                <p className="text-sm mt-1">{comment.text}</p>
                <div className="flex items-center space-x-4 mt-2 text-zinc-500 dark:text-zinc-400">
                    <button
                        onClick={onToggleLike}
                        className={`flex items-center space-x-2 hover:text-zinc-900 dark:hover:text-white transition-colors ${isLiked ? 'text-blue-500 dark:text-blue-400' : ''}`}
                    >
                        <div className={animate ? 'animate-like-pop' : ''}>
                            <LikeIcon />
                        </div>
                        {comment.likes && comment.likes !== '0' && <span className="text-xs">{comment.likes}</span>}
                    </button>
                    <button className="hover:text-zinc-900 dark:hover:text-white">
                        <DislikeIcon />
                    </button>
                    <button className="text-xs font-semibold hover:text-zinc-900 dark:hover:text-white">REPLY</button>
                </div>
            </div>
        </div>
    );
};

const RelatedShortCard: React.FC<{ video: Video }> = ({ video }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
                if (entry.isIntersecting) {
                    videoRef.current?.play().catch(e => {
                        if (e.name !== 'AbortError') {
                            console.error("Autoplay for related short failed", e);
                        }
                    });
                } else {
                    videoRef.current?.pause();
                }
            },
            { threshold: 0.7 }
        );

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                videoRef.current?.pause();
            } else if (isIntersecting) {
                videoRef.current?.play().catch(e => {
                    if (e.name !== 'AbortError') {
                        console.error("Autoplay for related short failed after tab switch", e);
                    }
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isIntersecting]);
    
    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        if (videoRef.current) {
            videoRef.current.muted = newMutedState;
        }
    };

    return (
        <div ref={containerRef} className="relative w-48 flex-shrink-0 cursor-pointer group snap-start">
            <video
                ref={videoRef}
                src={video.videoUrl}
                loop
                muted
                playsInline
                className="w-full aspect-[9/16] object-cover rounded-xl bg-black"
                poster={video.thumbnailUrl}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl pointer-events-none"></div>
            <div className="absolute bottom-2 left-2 text-white pointer-events-none">
                <h4 className="font-semibold text-sm line-clamp-2">{video.title}</h4>
                <p className="text-xs text-zinc-300">{video.views}</p>
            </div>
            <button 
                onClick={toggleMute}
                className="absolute top-2 right-2 p-1.5 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? <VolumeMuteIcon /> : <VolumeHighIcon />}
            </button>
        </div>
    );
};


interface VideoPageProps {
    video: Video;
    relatedVideos: Video[];
    onVideoSelect: (video: Video) => void;
    userPlaylists: Playlist[];
    onToggleVideoInPlaylist: (playlistId: string, videoId: string) => void;
    onCreatePlaylist: (playlistName: string) => void;
    subscribedChannels: Set<string>;
    onToggleSubscription: (channelName: string) => void;
}

const parseViews = (views: string): number => {
    const numStr = views.split(' ')[0];
    const multiplier = numStr.slice(-1).toLowerCase();
    if (['k', 'm', 'b'].includes(multiplier)) {
        const num = parseFloat(numStr.slice(0, -1));
        if (multiplier === 'k') return num * 1000;
        if (multiplier === 'm') return num * 1000000;
        if (multiplier === 'b') return num * 1000000000;
    }
    return parseFloat(numStr) || 0;
};

const parseLikes = (likesStr: string): number => {
    if (!likesStr) return 0;
    const lowerCaseStr = likesStr.toLowerCase().trim();
    const numPart = parseFloat(lowerCaseStr);
    if (lowerCaseStr.endsWith('k')) {
        return numPart * 1000;
    }
    if (lowerCaseStr.endsWith('m')) {
        return numPart * 1000000;
    }
    return parseInt(likesStr.replace(/,/g, ''), 10) || 0;
};


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


export const VideoPage: React.FC<VideoPageProps> = ({ video, relatedVideos, onVideoSelect, userPlaylists, onToggleVideoInPlaylist, onCreatePlaylist, subscribedChannels, onToggleSubscription }) => {
    // STATE
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [areCaptionsEnabled, setAreCaptionsEnabled] = useState(false);
    const [hasCaptions, setHasCaptions] = useState(false);

    const [isScrubbing, setIsScrubbing] = useState(false);
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverPosition, setHoverPosition] = useState(0);

    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [animateLike, setAnimateLike] = useState(false);
    const [animateDislike, setAnimateDislike] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

    const [videoTitle, setVideoTitle] = useState(video.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(video.title);

    const [videoDesc, setVideoDesc] = useState(video.description);
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [editedDesc, setEditedDesc] = useState(video.description);

    const [videoViews, setVideoViews] = useState(video.views);
    const [isEditingViews, setIsEditingViews] = useState(false);
    const [editedViews, setEditedViews] = useState(video.views);

    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [isCommentFocused, setIsCommentFocused] = useState(false);
    const [likedComments, setLikedComments] = useState(new Set<string>());
    const [sortOrder, setSortOrder] = useState<'Top' | 'Newest'>('Top');
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);


    // REFS
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const progressContainerRef = useRef<HTMLDivElement>(null);
    const snackbarTimerRef = useRef<number | null>(null);
    const sortMenuRef = useRef<HTMLDivElement>(null);
    const moreMenuRef = useRef<HTMLDivElement>(null);

    // UTILS & DERIVED STATE
    const WATCH_LATER_PLAYLIST_ID = 'pl1';
    const isOwner = video.channelName === currentUser.name;
    const isSubscribed = subscribedChannels.has(video.channelName);
    const isSavedToWatchLater = userPlaylists
        .find(p => p.id === WATCH_LATER_PLAYLIST_ID)
        ?.videoIds.includes(video.id) ?? false;
    const formatDuration = (time: number) => new Date(time * 1000).toISOString().slice(time >= 3600 ? 11 : 14, 19);

    const parseTimestamp = (text: string): number | null => {
        // Matches HH:MM:SS or MM:SS at the start of the line, possibly surrounded by brackets or followed by a hyphen.
        const match = text.match(/^(?:\[)?(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:\])?/);
        if (!match) return null;

        const hours = match[1] ? parseInt(match[1], 10) : 0;
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);

        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
        
        return (hours * 3600) + (minutes * 60) + seconds;
    };
    
    const subtitlesVtt = useMemo(() => {
        if (video.id !== '1') return null;
        return `WEBVTT

00:00:03.000 --> 00:00:07.000
Welcome to this quick crash course on React Hooks.

00:00:07.000 --> 00:00:12.000
We'll cover the most important hooks you need to know to get started with modern React.

00:00:12.000 --> 00:00:18.000
Let's begin with the useState hook, which lets you add state to function components.

00:00:18.000 --> 00:00:22.000
It's the most common hook you'll use.`;
    }, [video.id]);

    const subtitlesUrl = useMemo(() => {
        if (!subtitlesVtt) return null;
        return `data:text/vtt;base64,${btoa(subtitlesVtt)}`;
    }, [subtitlesVtt]);


    const parsedDescription = videoDesc.split('\n').map((line, index) => {
        const timestamp = parseTimestamp(line);
        if (timestamp !== null) {
            return (
                <a
                    key={index}
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        if (videoRef.current) {
                            videoRef.current.currentTime = timestamp;
                        }
                    }}
                    className="text-blue-500 dark:text-blue-400 hover:underline"
                >
                    {line}
                </a>
            );
        }
        return <span key={index}>{line}</span>;
    }).map((line, index) => <React.Fragment key={index}>{line}<br /></React.Fragment>);
    
    const sortedComments = useMemo(() => {
        const commentsCopy = [...comments];
        if (sortOrder === 'Top') {
            return commentsCopy.sort((a, b) => parseLikes(b.likes) - parseLikes(a.likes));
        }
        return commentsCopy;
    }, [comments, sortOrder]);

    const relatedShorts = useMemo(() => relatedVideos.filter(v => v.isShort), [relatedVideos]);
    const relatedRegularVideos = useMemo(() => relatedVideos.filter(v => !v.isShort), [relatedVideos]);

    // HANDLERS
    const togglePlay = useCallback(() => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }, []);
    
    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    }, []);
    
    const toggleMute = useCallback(() => {
        if (!videoRef.current) return;
        const newMuted = !videoRef.current.muted;
        videoRef.current.muted = newMuted;
        setIsMuted(newMuted);
        if(!newMuted && volume === 0) setVolume(0.5);
    }, [volume]);
    
    const toggleFullscreen = useCallback(() => {
        if (!playerContainerRef.current) return;
        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, []);

    const handleToggleCaptions = () => {
        if (hasCaptions) {
            setAreCaptionsEnabled(prev => !prev);
        }
    };

    const handleSeek = useCallback((amount: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += amount;
        }
    }, []);

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressContainerRef.current || !videoRef.current) return;
        const rect = progressContainerRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pos * duration;
    };

    const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressContainerRef.current) return;
        const rect = progressContainerRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        setHoverPosition(pos * 100);
        setHoverTime(pos * duration);
    };

    const handleLike = () => {
        setAnimateLike(false);
        if (isLiked) {
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
        } else {
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
            setAnimateLike(true);
            setTimeout(() => setAnimateLike(false), 300);
            if (isDisliked) {
                setIsDisliked(false);
            }
        }
    };

    const handleDislike = () => {
        if (isDisliked) {
            setIsDisliked(false);
        } else {
            setIsDisliked(true);
            setAnimateDislike(true);
            setTimeout(() => setAnimateDislike(false), 300);
            if (isLiked) {
                setIsLiked(false);
                setLikeCount(prev => prev - 1);
            }
        }
    };

    const handleShare = async () => {
        const videoUrl = `${window.location.origin}${window.location.pathname}?v=${video.id}`;
        const shareData = {
            title: video.title,
            text: `Check out this FunsTube video: ${video.title}`,
            url: videoUrl,
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // AbortError is thrown when the user cancels the share dialog, which is not an actual error.
                if (err.name !== 'AbortError') {
                    console.error('Error with Web Share API:', err);
                }
            }
        } else {
            // Fallback for browsers that don't support the Web Share API.
            try {
                await navigator.clipboard.writeText(shareData.url);
                setSnackbarMessage('Link copied to clipboard');
            } catch (err) {
                console.error('Failed to copy link:', err);
                setSnackbarMessage('Failed to copy link');
            } finally {
                // Clear any existing timer and set a new one for the snackbar.
                if (snackbarTimerRef.current) {
                    clearTimeout(snackbarTimerRef.current);
                }
                snackbarTimerRef.current = window.setTimeout(() => {
                    setSnackbarMessage(null);
                }, 4000);
            }
        }
    };

    const handleToggleWatchLater = () => {
        onToggleVideoInPlaylist(WATCH_LATER_PLAYLIST_ID, video.id);

        const message = isSavedToWatchLater ? "Removed from Watch Later" : "Saved to Watch Later";
        setSnackbarMessage(message);

        if (snackbarTimerRef.current) {
            clearTimeout(snackbarTimerRef.current);
        }

        snackbarTimerRef.current = window.setTimeout(() => {
            setSnackbarMessage(null);
        }, 4000);
    };

    const handleSaveTitle = () => {
        setVideoTitle(editedTitle);
        setIsEditingTitle(false);
    };
    
    const handleSaveDesc = () => {
        setVideoDesc(editedDesc);
        setIsEditingDesc(false);
    };
    
    const handleSaveViews = () => {
        setVideoViews(editedViews);
        setIsEditingViews(false);
    };
    
    const handleDownload = () => {
        if (videoRef.current && !isDownloading) {
            setIsDownloading(true);

            const link = document.createElement('a');
            link.href = videoRef.current.src;
            const fileName = `${videoTitle.replace(/[^a-z0-9._-\s]/gi, '_')}.mp4`;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => {
                setIsDownloading(false);
            }, 3000);
        }
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        const newCommentObj: Comment = {
            id: `c${Date.now()}`,
            author: currentUser.name,
            avatarUrl: currentUser.avatarUrl,
            text: newComment,
            likes: '0',
            timestamp: 'Just now'
        };
        setComments([newCommentObj, ...comments]);
        setNewComment('');
        setIsCommentFocused(false);
    };

    const handleToggleCommentLike = (commentId: string) => {
        const isCurrentlyLiked = likedComments.has(commentId);
    
        setLikedComments(prev => {
            const newSet = new Set(prev);
            if (isCurrentlyLiked) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    
        setComments(prevComments => 
            prevComments.map(comment => {
                if (comment.id === commentId) {
                    const currentLikes = parseLikes(comment.likes);
                    const newLikes = isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1;
                    return { ...comment, likes: formatCount(newLikes) };
                }
                return comment;
            })
        );
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        switch (e.key) {
            case ' ':
            case 'k':
                e.preventDefault();
                togglePlay();
                break;
            case 'f':
                toggleFullscreen();
                break;
            case 'm':
                toggleMute();
                break;
            case 'ArrowLeft':
                handleSeek(-5);
                break;
            case 'ArrowRight':
                handleSeek(5);
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (videoRef.current) {
                    const newVolume = Math.min(videoRef.current.volume + 0.1, 1);
                    videoRef.current.volume = newVolume;
                    setVolume(newVolume);
                }
                break;
            case 'ArrowDown':
                 e.preventDefault();
                if (videoRef.current) {
                    const newVolume = Math.max(videoRef.current.volume - 0.1, 0);
                    videoRef.current.volume = newVolume;
                    setVolume(newVolume);
                }
                break;
        }
    }, [togglePlay, toggleFullscreen, toggleMute, handleSeek]);

    const handleReportClick = () => {
        setIsMoreMenuOpen(false);
        setIsReportDialogOpen(true);
    };

    const handleConfirmReport = () => {
        setIsReportDialogOpen(false);
        setSnackbarMessage('Video reported successfully. Thank you for your feedback.');
        if (snackbarTimerRef.current) {
            clearTimeout(snackbarTimerRef.current);
        }
        snackbarTimerRef.current = window.setTimeout(() => {
            setSnackbarMessage(null);
        }, 4000);
    };

    // EFFECTS
    useEffect(() => {
        return () => {
            if (snackbarTimerRef.current) {
                clearTimeout(snackbarTimerRef.current);
            }
        };
    }, []);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setIsSortMenuOpen(false);
            }
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
                setIsMoreMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;
        const setVideoData = () => {
            setDuration(videoEl.duration);
            setProgress(videoEl.currentTime);
        };
        videoEl.addEventListener('loadedmetadata', setVideoData);
        return () => videoEl.removeEventListener('loadedmetadata', setVideoData);
    }, [video.id]);
    
    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;
        const handleTimeUpdate = () => setProgress(videoEl.currentTime);
        videoEl.addEventListener('timeupdate', handleTimeUpdate);
        return () => videoEl.removeEventListener('timeupdate', handleTimeUpdate);
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);
    
    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;

        const onAddTrack = () => {
            if (videoEl.textTracks.length > 0) {
                setHasCaptions(true);
                videoEl.textTracks[0].mode = areCaptionsEnabled ? 'showing' : 'hidden';
            }
        };

        setHasCaptions(videoEl.textTracks.length > 0);
        videoEl.textTracks.addEventListener('addtrack', onAddTrack);

        if (videoEl.textTracks.length > 0) {
            videoEl.textTracks[0].mode = areCaptionsEnabled ? 'showing' : 'hidden';
        }

        return () => {
            if (videoEl && videoEl.textTracks) {
                videoEl.textTracks.removeEventListener('addtrack', onAddTrack);
            }
        };
    }, [areCaptionsEnabled, video.id]);

    useEffect(() => {
        setVideoTitle(video.title);
        setEditedTitle(video.title);
        setVideoDesc(video.description);
        setEditedDesc(video.description);
        setVideoViews(video.views);
        setEditedViews(video.views);
        setIsPlaying(false);
        setProgress(0);
        if (videoRef.current) videoRef.current.currentTime = 0;
        
        setIsLiked(false);
        setIsDisliked(false);
        setAreCaptionsEnabled(false);
        setHasCaptions(false);
        const initialViews = parseViews(video.views);
        setLikeCount(Math.floor(initialViews * 0.05));
    }, [video]);


    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="lg:col-span-2 xl:col-span-3">
                    <div ref={playerContainerRef} className="relative aspect-video bg-black rounded-xl overflow-hidden group">
                        <video
                            ref={videoRef}
                            src={video.videoUrl}
                            className="w-full h-full"
                            onClick={togglePlay}
                            crossOrigin="anonymous"
                        >
                             {subtitlesUrl && (
                                <track
                                    key={video.id}
                                    src={subtitlesUrl}
                                    kind="subtitles"
                                    srcLang="en"
                                    label="English"
                                    default
                                />
                            )}
                        </video>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {/* Player controls here */}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div 
                                ref={progressContainerRef}
                                className="relative w-full h-1.5 bg-white/20 cursor-pointer group/progress"
                                onClick={handleProgressClick}
                                onMouseMove={handleProgressHover}
                                onMouseLeave={() => setHoverTime(null)}
                            >
                                <div className="absolute h-full bg-violet-500" style={{ width: `${(progress / duration) * 100}%` }}></div>
                                <div className="absolute h-3 w-3 -mt-1 bg-violet-500 rounded-full" style={{ left: `calc(${(progress / duration) * 100}% - 6px)` }}></div>
                                
                                {hoverTime !== null && (
                                    <>
                                    <div className="absolute bottom-6 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded" style={{ left: `${hoverPosition}%`}}>
                                        <video 
                                            src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4#t=5" 
                                            className="w-36 h-auto"
                                            style={{ display: "none" }}
                                        />
                                        <img src={video.thumbnailUrl} className="w-36 aspect-video object-cover" />
                                        <span>{formatDuration(hoverTime)}</span>
                                    </div>
                                    <div className="absolute h-full bg-white/40" style={{ width: `${hoverPosition}%` }}></div>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-2 text-white">
                            <div className="flex items-center space-x-4">
                                <button onClick={togglePlay}>
                                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                                </button>
                                <div className="flex items-center space-x-2">
                                    <button onClick={toggleMute}>
                                        {isMuted || volume === 0 ? <VolumeMuteIcon /> : <VolumeHighIcon />}
                                    </button>
                                    <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-20 accent-white h-1 bg-white/30 rounded-full" />
                                </div>
                                <span className="text-xs font-semibold">{formatDuration(progress)} / {formatDuration(duration)}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleToggleCaptions}
                                    disabled={!hasCaptions}
                                    className={`${areCaptionsEnabled ? 'text-violet-500' : ''} ${!hasCaptions ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <CaptionsIcon />
                                </button>
                                <button><SettingsIcon /></button>
                                <button onClick={toggleFullscreen}>
                                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>

                    {isEditingTitle ? (
                        <div className="my-3 space-y-2">
                            <input 
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="w-full bg-zinc-200 dark:bg-zinc-700 text-xl font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveTitle();
                                    if (e.key === 'Escape') {
                                        setEditedTitle(videoTitle);
                                        setIsEditingTitle(false);
                                    }
                                }}
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => { setEditedTitle(videoTitle); setIsEditingTitle(false); }} className="px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 font-semibold">Cancel</button>
                                <button onClick={handleSaveTitle} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold text-white">Save</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start my-3 group/title">
                            <h1 className="text-xl font-bold flex-1">{videoTitle}</h1>
                            {isOwner && (
                            <button onClick={() => setIsEditingTitle(true)} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 opacity-0 group-hover/title:opacity-100 transition-opacity"><EditIcon className="w-5 h-5"/></button>
                            )}
                        </div>
                    )}
                

                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <img src={video.channelImageUrl} alt={video.channelName} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold">{video.channelName}</p>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400">1.23M subscribers</p>
                            </div>
                            <button 
                                onClick={() => onToggleSubscription(video.channelName)}
                                className={`font-semibold px-4 py-2 rounded-full text-sm ml-4 transition-colors ${
                                    isSubscribed
                                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                                    : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-200'
                                }`}
                            >
                                {isSubscribed ? (
                                    <span className="flex items-center gap-1.5">
                                        <CheckIcon className="w-4 h-4" />
                                        Subscribed
                                    </span>
                                ) : (
                                    'Subscribe'
                                )}
                            </button>
                        </div>
                        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
                            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full">
                                <button onClick={handleLike} className={`flex items-center space-x-2 pl-4 pr-3 py-2 rounded-l-full hover:bg-zinc-200 dark:hover:bg-zinc-700 ${isLiked ? 'text-blue-500 dark:text-blue-400' : ''}`}>
                                    <div className={animateLike ? 'animate-like-pop' : ''}>
                                        <LikeIcon />
                                    </div>
                                    <span className={`text-sm font-semibold ${animateLike ? 'animate-like-pop' : ''}`}>{formatCount(likeCount)}</span>
                                </button>
                                <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600"></div>
                                <button onClick={handleDislike} className={`px-3 py-2 rounded-r-full hover:bg-zinc-200 dark:hover:bg-zinc-700 ${isDisliked ? 'text-blue-500 dark:text-blue-400' : ''}`}>
                                    <div className={animateDislike ? 'animate-like-pop' : ''}>
                                        <DislikeIcon />
                                    </div>
                                </button>
                            </div>
                            <button 
                                onClick={handleShare}
                                className="flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            >
                                <ShareIcon />
                                <span className="text-sm font-semibold">Share</span>
                            </button>
                            <button 
                                onClick={handleDownload} 
                                disabled={isDownloading}
                                className="flex items-center justify-center space-x-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-70 disabled:cursor-not-allowed w-40 transition-colors"
                            >
                                {isDownloading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="text-sm font-semibold">Downloading...</span>
                                    </>
                                ) : (
                                    <>
                                        <DownloadIcon />
                                        <span className="text-sm font-semibold">Download</span>
                                    </>
                                )}
                            </button>
                            <button 
                                onClick={handleToggleWatchLater} 
                                className={`flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${
                                    isSavedToWatchLater 
                                    ? 'bg-zinc-200 dark:bg-zinc-700' 
                                    : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                            >
                                {isSavedToWatchLater ? <CheckIcon className="w-5 h-5" /> : <SaveIcon />}
                                <span className="text-sm font-semibold">{isSavedToWatchLater ? 'Saved' : 'Save'}</span>
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setIsMoreMenuOpen(prev => !prev)}
                                    className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                    aria-label="More options"
                                >
                                    <MoreIcon />
                                </button>
                                {isMoreMenuOpen && (
                                    <div
                                        ref={moreMenuRef}
                                        className="absolute bottom-full mb-2 right-0 bg-white dark:bg-zinc-800 rounded-lg shadow-2xl w-48 border border-zinc-200 dark:border-zinc-700 z-10 py-1 animate-fade-in-up origin-bottom-right"
                                        style={{ animationDuration: '0.15s' }}
                                    >
                                        <button
                                            onClick={handleReportClick}
                                            className="w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                                        >
                                            <FlagIcon />
                                            <span>Report</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl mt-4">
                        <div className="flex items-center space-x-4 font-semibold text-sm">
                            {isEditingViews ? (
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        value={editedViews} 
                                        onChange={(e) => setEditedViews(e.target.value)} 
                                        className="bg-zinc-200 dark:bg-zinc-700 p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveViews();
                                            if (e.key === 'Escape') {
                                                setEditedViews(videoViews);
                                                setIsEditingViews(false);
                                            }
                                        }}
                                    />
                                    <button onClick={handleSaveViews}><CheckIcon className="w-5 h-5 text-green-500"/></button>
                                    <button onClick={() => { setEditedViews(videoViews); setIsEditingViews(false); }}><CloseIcon className="w-5 h-5 text-red-500"/></button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 group/views">
                                    <span>{videoViews}</span>
                                    {isOwner && (
                                        <button onClick={() => setIsEditingViews(true)} className="opacity-0 group-hover/views:opacity-100"><EditIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400"/></button>
                                    )}
                                </div>
                            )}
                            <span>{video.uploadedAt}</span>
                        </div>
                        <div className="text-sm mt-2 whitespace-pre-wrap">
                            {isEditingDesc ? (
                                <div className="space-y-2">
                                    <textarea
                                        value={editedDesc}
                                        onChange={(e) => setEditedDesc(e.target.value)}
                                        rows={5}
                                        className="w-full bg-zinc-200 dark:bg-zinc-700 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') {
                                                setEditedDesc(videoDesc);
                                                setIsEditingDesc(false);
                                            }
                                        }}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => { setEditedDesc(videoDesc); setIsEditingDesc(false); }} className="px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 font-semibold">Cancel</button>
                                        <button onClick={handleSaveDesc} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold text-white">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative group/desc">
                                    <p>{parsedDescription}</p>
                                    {isOwner && (
                                        <button onClick={() => setIsEditingDesc(true)} className="absolute top-0 right-0 p-2 rounded-full bg-zinc-200 dark:bg-zinc-700 opacity-0 group-hover/desc:opacity-100 transition-opacity"><EditIcon className="w-4 h-4"/></button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shorts you might also like Section */}
                    {relatedShorts.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-4">Shorts you might like</h3>
                            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x snap-mandatory">
                                {relatedShorts.map(short => (
                                    <RelatedShortCard key={`short-rec-${short.id}`} video={short} />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Comments Section */}
                    <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-bold">{comments.length} Comments</h3>
                            <div ref={sortMenuRef} className="relative ml-4">
                                <button onClick={() => setIsSortMenuOpen(prev => !prev)} className="flex items-center space-x-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                                    <SortIcon />
                                    <span>SORT BY</span>
                                </button>
                                {isSortMenuOpen && (
                                    <div className="absolute mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-700 z-10 py-1 animate-fade-in-up origin-top" style={{ animationDuration: '0.15s' }}>
                                        <button onClick={() => { setSortOrder('Top'); setIsSortMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${sortOrder === 'Top' ? 'bg-zinc-100 dark:bg-zinc-700 font-semibold' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}>
                                            <span>Top comments</span>
                                            {sortOrder === 'Top' && <CheckIcon className="w-5 h-5 text-zinc-900 dark:text-white" />}
                                        </button>
                                        <button onClick={() => { setSortOrder('Newest'); setIsSortMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${sortOrder === 'Newest' ? 'bg-zinc-100 dark:bg-zinc-700 font-semibold' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}>
                                            <span>Newest first</span>
                                            {sortOrder === 'Newest' && <CheckIcon className="w-5 h-5 text-zinc-900 dark:text-white" />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex items-start space-x-4">
                            <img
                                src={currentUser.avatarUrl}
                                alt={currentUser.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <form onSubmit={handleCommentSubmit} className="flex-1">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onFocus={() => setIsCommentFocused(true)}
                                    placeholder="Add a comment..."
                                    className="w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-white outline-none pb-2 transition-colors"
                                />
                                {isCommentFocused && (
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNewComment('');
                                                setIsCommentFocused(false);
                                            }}
                                            className="px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-semibold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim()}
                                            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:bg-zinc-200 dark:disabled:bg-zinc-700 disabled:text-zinc-500 dark:disabled:text-zinc-400 disabled:cursor-not-allowed"
                                        >
                                            Comment
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                        <div className="mt-6 space-y-6">
                            {sortedComments.map((comment) => (
                                <CommentItem 
                                    key={comment.id} 
                                    comment={comment} 
                                    isLiked={likedComments.has(comment.id)}
                                    onToggleLike={() => handleToggleCommentLike(comment.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1 xl:col-span-1 space-y-4">
                    {relatedRegularVideos.map(relatedVideo => (
                        <VideoCard key={relatedVideo.id} video={relatedVideo} onVideoSelect={onVideoSelect} />
                    ))}
                </div>
                {showPlaylistModal && (
                    <PlaylistModal 
                        video={video} 
                        playlists={userPlaylists} 
                        onClose={() => setShowPlaylistModal(false)}
                        onToggleVideoInPlaylist={onToggleVideoInPlaylist}
                        onCreatePlaylist={onCreatePlaylist}
                    />
                )}
            </div>
            {snackbarMessage && (
                <div className="fixed bottom-4 left-4 sm:left-auto sm:ml-60 sm:bottom-8 bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 px-6 py-3 rounded-lg shadow-lg flex items-center justify-between z-50 animate-fade-in-up">
                    <span>{snackbarMessage}</span>
                    {snackbarMessage.toLowerCase().includes('watch later') && (
                        <button 
                            onClick={() => {
                                if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
                                setSnackbarMessage(null);
                                setShowPlaylistModal(true);
                            }}
                            className="ml-6 font-bold uppercase text-sm text-violet-400 dark:text-violet-600 hover:underline"
                        >
                            Change
                        </button>
                    )}
                </div>
            )}
            {isReportDialogOpen && (
                <div
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
                    onClick={() => setIsReportDialogOpen(false)}
                >
                    <div
                        className="bg-white dark:bg-zinc-800 rounded-xl w-full max-w-md p-6 shadow-2xl m-4 animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold mb-2">Report Video</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">Are you sure you want to report this video for inappropriate content? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsReportDialogOpen(false)}
                                className="px-4 py-2 rounded-full font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmReport}
                                className="px-4 py-2 rounded-full font-semibold bg-red-600 text-white hover:bg-red-700"
                            >
                                Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
