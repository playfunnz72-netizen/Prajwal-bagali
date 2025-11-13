
import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  fill: "currentColor",
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
};

export const HamburgerIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
  </svg>
);

export const YouTubeLogo: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 28 20" fill="none">
        <path fill="#FF0000" d="M27.402 3.09s-0.273-1.92-1.11-2.766C25.473 0.1 24.43 0.1 23.834 0.082 19.91 0 14 0 14 0S8.09 0 4.166 0.082c-0.597 0.018-1.638 0.018-2.455 0.242C0.873 1.17 0.6 3.09 0.6 3.09S0.328 5.01 0.328 6.93v6.138c0 1.92 0.273 3.84 0.273 3.84s0.272 1.92 1.11 2.765c0.817 0.224 1.858 0.222 2.455 0.24C8.09 20 14 20 14 20s5.91 0 9.834-0.082c0.597-0.018 1.638-0.018 2.455-0.24 0.838-0.845 1.11-2.765 1.11-2.765s0.272-1.92 0.272-3.84V6.93c0-1.92-0.272-3.84-0.272-3.84z"/>
        <path fill="#FFFFFF" d="M11.2 14.248V5.752L18.496 10l-7.296 4.248z"/>
    </svg>
);


export const SearchIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
  </svg>
);

export const MicIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"></path>
  </svg>
);

export const VideoIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"></path>
  </svg>
);

export const BellIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
  </svg>
);

export const HomeIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
  </svg>
);

export const ShortsIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M17.77,10.32l-1.2-.5L18,8.07l-1.6-.73,1.2-.5L17,5.09l-1.6-.73,1.2-.5L16,2.12,14.4,2.85l-1.2-.5L14.6,4.1,13,4.83l1.2.5-1.39,1.75,1.6.73-1.2.5,1.39,1.75,1.6.73-1.2.5,1.2,1.75,1.6-.73,1.19.5-1.19,1.75Z"></path><path d="M10,12.2,6,14.55V9.85Z"></path><path d="M10.74,21.9a3.26,3.26,0,0,1-3.26-3.26V5.36a3.26,3.26,0,0,1,3.26-3.26H13a1.45,1.45,0,0,1,1.45,1.45V20.31a1.45,1.45,0,0,1-1.45,1.45h-1.8Z"></path>
    </svg>
);


export const SubscriptionsIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4-6-3.27v6.53L16 16z"></path>
  </svg>
);

export const LibraryIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"></path>
  </svg>
);

export const HistoryIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path>
  </svg>
);

export const YourVideosIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M10 16.5l6-4.5-6-4.5v9zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z"></path>
  </svg>
);

export const WatchLaterIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7"></path>
  </svg>
);

export const LikedVideosIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path>
  </svg>
);

export const ChevronRightIcon: React.FC = () => (
    <svg {...iconProps} className="w-5 h-5">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
    </svg>
);

export const MoreIcon: React.FC = () => (
    <svg {...iconProps} className="w-6 h-6 fill-zinc-400 group-hover:fill-white">
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
    </svg>
);

export const LikeIcon: React.FC = () => (
    <svg {...iconProps} className="w-5 h-5">
        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path>
    </svg>
);

export const DislikeIcon: React.FC = () => (
    <svg {...iconProps} className="w-5 h-5">
        <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path>
    </svg>
);

export const ShareIcon: React.FC = () => (
    <svg {...iconProps} className="w-5 h-5">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"></path>
    </svg>
);

export const SaveIcon: React.FC = () => (
    <svg {...iconProps} className="w-5 h-5">
        <path d="M14 10H2v2h12v-2zm-2-4H2v2h10V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"></path>
    </svg>
);