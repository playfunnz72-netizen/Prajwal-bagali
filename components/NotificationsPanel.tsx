
import React, { useEffect, useRef } from 'react';
import { Notification, Video } from '../types';

interface NotificationsPanelProps {
    notifications: Notification[];
    videos: Video[];
    onClose: () => void;
    onNotificationClick: (video: Video) => void;
}

const NotificationItem: React.FC<{ notification: Notification; video: Video | undefined; onClick: () => void; }> = ({ notification, video, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="flex items-start p-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors rounded-lg"
        >
            <img src={notification.channelImageUrl} alt="channel" className="w-10 h-10 rounded-full mr-4 flex-shrink-0"/>
            <div className="flex-1 min-w-0">
                <p className="text-sm line-clamp-3">{notification.text}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{notification.timestamp}</p>
            </div>
            {video && (
                <img src={video.thumbnailUrl} alt="video thumbnail" className="w-20 aspect-video object-cover rounded ml-4 flex-shrink-0"/>
            )}
        </div>
    );
};


const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, videos, onClose, onNotificationClick }) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                // To prevent closing when the bell icon is clicked (which toggles the panel),
                // we check if the click target is inside the bell button.
                const bellButton = document.getElementById('notification-bell');
                if (bellButton && bellButton.contains(event.target as Node)) {
                    return;
                }
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);
    
    const handleItemClick = (notification: Notification) => {
        const video = videos.find(v => v.id === notification.videoId);
        if (video) {
            onNotificationClick(video);
        }
    };

    return (
        <div 
            ref={panelRef} 
            className="absolute top-full mt-2 right-0 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl w-96 max-w-[calc(100vw-2rem)] border border-zinc-200 dark:border-zinc-700 z-30 animate-fade-in-up origin-top-right"
            style={{ animationDuration: '0.2s' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notifications-heading"
        >
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
                <h2 id="notifications-heading" className="text-lg font-semibold">Notifications</h2>
            </div>
            <div className="p-2 max-h-[70vh] overflow-y-auto">
                {notifications.map(notif => {
                    const video = videos.find(v => v.id === notif.videoId);
                    return (
                        <NotificationItem 
                            key={notif.id} 
                            notification={notif}
                            video={video}
                            onClick={() => handleItemClick(notif)}
                        />
                    )
                })}
                {notifications.length === 0 && (
                    <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">No new notifications</p>
                )}
            </div>
        </div>
    );
};

export default NotificationsPanel;
