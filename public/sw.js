/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'squants-v1';
const RUNTIME_CACHE = 'squants-runtime-v1';
const API_CACHE = 'squants-api-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Cache strategies
const NETWORK_FIRST_ROUTES = ['/api/', '/papers', '/papers/'];
const CACHE_FIRST_ROUTES = ['/icons/', '/_next/static/', '/fonts/'];
const STALE_WHILE_REVALIDATE = ['/', '/learn', '/community', '/about', '/blog'];

self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching precache assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== RUNTIME_CACHE &&
            cacheName !== API_CACHE
          ) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API calls: Network first
  if (NETWORK_FIRST_ROUTES.some((route) => url.pathname.startsWith(route))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets: Cache first
  if (CACHE_FIRST_ROUTES.some((route) => url.pathname.startsWith(route))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML pages: Stale while revalidate
  if (STALE_WHILE_REVALIDATE.some((route) => url.pathname === route)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Default: Network first
  event.respondWith(networkFirst(request));
});

// Network first strategy
async function networkFirst(request: Request): Promise<Response> {
  const cacheName = request.url.includes('/api/') ? API_CACHE : RUNTIME_CACHE;

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[SW] Network request failed, using cache:', request.url);

    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // Offline fallback
    if (request.destination === 'document') {
      const fallback = await caches.match('/offline.html');
      return fallback || new Response('Offline', { status: 503 });
    }

    return new Response('Network error', { status: 503 });
  }
}

// Cache first strategy
async function cacheFirst(request: Request): Promise<Response> {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[SW] Cache miss and network error:', request.url);
    return new Response('Not found', { status: 404 });
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request: Request): Promise<Response> {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      const cache = caches.open(RUNTIME_CACHE);
      cache.then((c) => c.put(request, response.clone()));
    }
    return response;
  });

  return cached || fetchPromise;
}

// Handle background sync for offline submissions
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-comments') {
    event.waitUntil(syncPendingComments());
  }
});

async function syncPendingComments(): Promise<void> {
  console.log('[SW] Syncing pending comments...');
  // Implementation for offline comment sync
}

// Handle push notifications
self.addEventListener('push', (event: PushEvent) => {
  if (event.data) {
    const data = event.data.json();
    const options: NotificationOptions = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: data.tag || 'notification',
      requireInteraction: false,
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return (client as WindowClient).focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

export {};
