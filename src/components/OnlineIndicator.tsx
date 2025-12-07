'use client';

import { useEffect, useState } from 'react';

interface OnlineStatus {
  isOnline: boolean;
  lastSync: Date | null;
}

export function OnlineIndicator() {
  const [status, setStatus] = useState<OnlineStatus>({
    isOnline: true,
    lastSync: null,
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({
        ...prev,
        isOnline: true,
        lastSync: new Date(),
      }));
    };

    const handleOffline = () => {
      setStatus((prev) => ({
        ...prev,
        isOnline: false,
      }));
    };

    // Set initial state
    setStatus((prev) => ({
      ...prev,
      isOnline: navigator.onLine,
    }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (status.isOnline) return null;

  return (
    <div className="sticky top-0 z-50 bg-yellow-50 border-b border-yellow-200 px-4 py-3 text-center">
      <p className="text-sm text-yellow-800">
        🔌 You're offline. Using cached data.
        {status.lastSync && (
          <span className="ml-2 text-yellow-700">
            Last synced: {status.lastSync.toLocaleTimeString()}
          </span>
        )}
      </p>
    </div>
  );
}
