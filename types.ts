
import React from 'react';

export interface Video {
  id: string;
  thumbnailUrl: string;
  channelImageUrl: string;
  title: string;
  channelName: string;
  views: string;
  uploadedAt: string;
  duration: string;
  description: string;
  isShort?: boolean;
  videoUrl: string;
}

export interface NavItem {
    icon: React.ReactNode;
    label: string;
}

export interface UserProfile {
    name: string;
    handle: string;
    avatarUrl: string;
}

export interface Comment {
    id: string;
    author: string;
    avatarUrl: string;
    text: string;
    likes: string;
    timestamp: string;
}

export interface Playlist {
  id: string;
  name: string;
  videoIds: string[];
}

export interface Notification {
  id: string;
  text: string;
  timestamp: string;
  videoId: string;
  channelImageUrl: string;
}