'use client';

import { useEffect } from 'react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export function PWAInstallPrompt() {
  const { installPrompt, canInstall, handleInstall } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-800 text-white p-4 shadow-2xl max-w-md mx-auto rounded-t-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">Install Squants App</h3>
          <p className="text-sm text-gray-300">
            Get offline access, faster loading, and home screen icon
          </p>
        </div>
        <button
          onClick={handleInstall}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors whitespace-nowrap"
        >
          Install
        </button>
      </div>
    </div>
  );
}
