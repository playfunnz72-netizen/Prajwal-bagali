

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

    const [videoDuration, setVideoDuration] = useState(video.duration);
    const [isEditingDuration, setIsEditingDuration] = useState(false);
    const [editedDuration, setEditedDuration] = useState(video.duration);

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
    
    const handleSaveDuration = () => {
        setVideoDuration(editedDuration);
        setIsEditingDuration(false);
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
        setVideoDuration(video.duration);
        setEditedDuration(video.duration);
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