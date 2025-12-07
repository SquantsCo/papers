'use client';

import { useCallback, useState } from 'react';

interface CacheStatus {
  cached: boolean;
  size: string;
  lastUpdated: string | null;
}

export function CacheManager() {
  const [status, setStatus] = useState<CacheStatus>({
    cached: false,
    size: '0 MB',
    lastUpdated: null,
  });

  const handleClearCache = useCallback(async () => {
    if (!('caches' in window)) return;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      setStatus({
        cached: false,
        size: '0 MB',
        lastUpdated: null,
      });

      alert('Cache cleared successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, []);

  const handleCheckCache = useCallback(async () => {
    if (!('caches' in window)) return;

    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();

        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }

      const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

      setStatus({
        cached: cacheNames.length > 0,
        size: `${sizeInMB} MB`,
        lastUpdated: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error('Error checking cache:', error);
    }
  }, []);

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Offline Cache
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Size: {status.size}
            {status.lastUpdated && ` • Updated: ${status.lastUpdated}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCheckCache}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Check
          </button>
          <button
            onClick={handleClearCache}
            className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
