import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Squants - Quantum Papers & Learning',
    short_name: 'Squants',
    description: 'Explore quantum physics papers with explanations and community learning paths',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    theme_color: '#1f2937',
    background_color: '#ffffff',
    categories: ['education', 'science'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/mobile-1.png',
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: '/screenshots/mobile-2.png',
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: '/screenshots/desktop-1.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
    shortcuts: [
      {
        name: 'Browse Papers',
        short_name: 'Papers',
        description: 'Browse and search papers',
        url: '/papers',
        icons: [
          {
            src: '/icons/papers-icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Learning Paths',
        short_name: 'Learn',
        description: 'Start a learning path',
        url: '/learn',
        icons: [
          {
            src: '/icons/learn-icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Community',
        short_name: 'Community',
        description: 'Join the community',
        url: '/community',
        icons: [
          {
            src: '/icons/community-icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    ],
    prefer_related_applications: false,
  };
}
