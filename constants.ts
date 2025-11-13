
import { Video, UserProfile, Comment } from './types';

export const currentUser: UserProfile = {
  name: 'John Doe',
  handle: '@johndoe',
  avatarUrl: 'https://picsum.photos/seed/profile-pic/100/100',
};

export const videos: Video[] = [
  {
    id: '1',
    thumbnailUrl: 'https://picsum.photos/seed/a/684/384',
    channelImageUrl: 'https://picsum.photos/seed/user-a/48/48',
    title: 'React Hooks in 10 Minutes | Complete Crash Course',
    channelName: 'DevSimplified',
    views: '1.2M views',
    uploadedAt: '1 year ago',
    duration: '10:32',
    description: 'A quick and complete crash course on React Hooks. We will cover useState, useEffect, useContext, and creating custom hooks from scratch. Perfect for beginners and those needing a refresher.'
  },
  {
    id: '2',
    thumbnailUrl: 'https://picsum.photos/seed/b/684/384',
    channelImageUrl: 'https://picsum.photos/seed/user-b/48/48',
    title: 'Building a Full-Stack App with Next.js 14',
    channelName: 'Traversy Media',
    views: '876K views',
    uploadedAt: '3 months ago',
    duration: '2:15:45',
    description: "In this comprehensive tutorial, we'll build a full-stack application from start to finish using the latest features in Next.js 14, including server actions, app router, and more. We'll use Prisma for the database and Tailwind CSS for styling."
  },
  {
    id: '3',
    thumbnailUrl: 'https://picsum.photos/seed/c/684/384',
    channelImageUrl: 'https://picsum.photos/seed/user-c/48/48',
    title: 'UI/UX Design Trends in 2024 You NEED to Know',
    channelName: 'Fireship',
    views: '2.5M views',
    uploadedAt: '6 months ago',
    duration: '08:12',
    description: "Discover the hottest UI/UX design trends for 2024. From bento grids and glassmorphism to AI-powered design tools, we're breaking down what's in, what's out, and what's next in the world of digital design."
  },
  {
    id: '4',
    thumbnailUrl: 'https://picsum.photos/seed/d/684/384',
    channelImageUrl: 'https://picsum.photos/seed/user-d/48/48',
    title: 'Lo-fi Hip Hop Radio - Beats to Relax/Study to',
    channelName: 'Lofi Girl',
    views: '1.4B views',
    uploadedAt: 'Streamed 2 years ago',
    duration: 'LIVE',
    description: 'Thank you for listening, I hope you will have a good time here :)'
  },
  {
    id: '5',
    thumbnailUrl: 'https://picsum.photos/seed/e/684/384',
    channelImageUrl: 'https://picsum.photos/seed/user-e/48/48',
    title: 'The Ultimate Tailwind CSS Tutorial',
    channelName: 'Net Ninja',
    views: '540K views',
    uploadedAt: '2 years ago',
    duration: '1:45:03',
    description: 'A complete guide to Tailwind CSS. Learn how to set it up, use utility-first classes, customize your design system, and build responsive layouts with this popular CSS framework.'
  },
  {
    id: '6',
    thumbnailUrl: 'https://picsum.photos/seed/f/684/384',
    channelImageUrl: 'https://picsum.photos/seed/user-f/48/48',
    title: 'I Cooked a Gordon Ramsay Steak for 100 Hours',
    channelName: 'MrBeast',
    views: '121M views',
    uploadedAt: '8 months ago',
    duration: '15:20',
    description: 'We tried to cook a steak using Gordon Ramsay\'s perfect steak recipe, but we left it in the sous vide for 100 hours. The result was... surprising. SUBSCRIBE for a slice!'
  },
  {
    id: '7',
    thumbnailUrl: 'https://picsum.photos/seed/g/684/384',
    channelImageUrl: 'https://picsum.photos/seed/user-g/48/48',
    title: 'The insane math behind quantum computers',
    channelName: 'Veritasium',
    views: '15M views',
    uploadedAt: '11 months ago',
    duration: '22:31',
    description: "Quantum computers are not just faster classical computers. They are a fundamentally new kind of machine. In this video, we explore the mind-bending principles of superposition and entanglement that make them work."
  },
  {
    id: '8',
    thumbnailUrl: 'https://picsum.photos/seed/h/684/384',
    channelImageUrl: 'https://picsum.photos/seed/user-h/48/48',
    title: 'My Desk Setup Tour 2024!',
    channelName: 'MKBHD',
    views: '7.1M views',
    uploadedAt: '4 months ago',
    duration: '18:55',
    description: "Here it is! A full tour of my desk setup for 2024. We'll look at the monitor, keyboard, mouse, audio gear, and all the accessories that make this my ultimate productivity and editing station."
  },
  {
    id: '9',
    thumbnailUrl: 'https://picsum.photos/seed/i/684/384',
    channelImageUrl: 'https://picsum.photos/seed/user-i/48/48',
    title: 'JavaScript Pro Tips - Code This, Not That',
    channelName: 'Fireship',
    views: '1.8M views',
    uploadedAt: '9 months ago',
    duration: '11:42',
    description: 'Level up your JavaScript skills with these pro tips. We compare common patterns with more efficient, modern alternatives. Learn about optional chaining, nullish coalescing, and other ES2020+ features.'
  },
  {
    id: '10',
    thumbnailUrl: 'https://picsum.photos/seed/j/684/384',
    channelImageUrl: 'https://picsum.photos/seed/user-j/48/48',
    title: 'Why The James Webb Telescope is a HUGE Deal',
    channelName: 'Kurzgesagt – In a Nutshell',
    views: '23M views',
    uploadedAt: '2 years ago',
    duration: '12:01',
    description: "The James Webb Space Telescope is one of the most ambitious and complex scientific instruments ever built. What makes it so special? And what cosmic secrets will it help us unlock? Let's find out."
  },
   {
    id: '11',
    thumbnailUrl: 'https://picsum.photos/seed/k/684/384',
    channelImageUrl: 'https://picsum.photos/seed/user-k/48/48',
    title: 'The Art of Code Refactoring',
    channelName: 'freeCodeCamp.org',
    views: '302K views',
    uploadedAt: '10 months ago',
    duration: '45:18',
    description: "Learn the principles of code refactoring in this practical tutorial. We'll take a messy codebase and clean it up step-by-step, improving its readability, maintainability, and performance without changing its external behavior."
  },
  {
    id: '12',
    thumbnailUrl: 'https://picsum.photos/seed/l/684/384',
    channelImageUrl: 'https://picsum.photos/seed/user-l/48/48',
    title: 'Building a PC for the First Time...',
    channelName: 'Linus Tech Tips',
    views: '4.5M views',
    uploadedAt: '5 months ago',
    duration: '35:49',
    description: "It's a rite of passage for every tech enthusiast: the first PC build. Watch as we guide a complete novice through the process, from picking parts to the triumphant first boot. Will it post? Find out!"
  }
];

export const comments: Comment[] = [
    {
        id: 'c1',
        author: 'CodeWizard',
        avatarUrl: 'https://picsum.photos/seed/comment1/48/48',
        text: 'Great explanation! The way you broke down useEffect was super helpful.',
        likes: '1.2k',
        timestamp: '6 months ago'
    },
    {
        id: 'c2',
        author: 'FrontendFan',
        avatarUrl: 'https://picsum.photos/seed/comment2/48/48',
        text: 'This is the best tutorial on React Hooks I\'ve seen. Subscribed!',
        likes: '845',
        timestamp: '8 months ago'
    },
    {
        id: 'c3',
        author: 'NewbieDev',
        avatarUrl: 'https://picsum.photos/seed/comment3/48/48',
        text: 'I was so confused about custom hooks before this. Thank you!',
        likes: '312',
        timestamp: '3 months ago'
    },
    {
        id: 'c4',
        author: 'PixelPerfect',
        avatarUrl: 'https://picsum.photos/seed/comment4/48/48',
        text: 'Awesome video. Could you do one on state management libraries like Zustand or Redux Toolkit next?',
        likes: '560',
        timestamp: '1 month ago'
    },
    {
        id: 'c5',
        author: 'LogicLord',
        avatarUrl: 'https://picsum.photos/seed/comment5/48/48',
        text: 'At 5:23, you could have also used a `useCallback` to optimize the function. Just a thought! Otherwise, fantastic content.',
        likes: '189',
        timestamp: '2 weeks ago'
    }
];