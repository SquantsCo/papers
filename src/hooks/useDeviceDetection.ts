'use client';

import { useEffect, useState } from 'react';

interface Device {
  type: 'mobile' | 'tablet' | 'desktop';
  isMobile: boolean;
  isTablet: boolean;
  isStandalone: boolean; // PWA installed
}

export function useDeviceDetection(): Device {
  const [device, setDevice] = useState<Device>({
    type: 'desktop',
    isMobile: false,
    isTablet: false,
    isStandalone: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    // Check if running as standalone PWA
    const isStandalone =
      (navigator as any).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;

    // Mobile detection
    const isMobile =
      /android|webos|iphone|ipod|blackberry|iemobile|opera mini/.test(userAgent);

    // Tablet detection
    const isTablet =
      /ipad|android(?!.*mobi)|tablet|playbook|silk/.test(userAgent) ||
      (window.innerWidth >= 768 && window.innerWidth < 1024);

    const type = isMobile && !isTablet ? 'mobile' : isTablet ? 'tablet' : 'desktop';

    setDevice({
      type,
      isMobile,
      isTablet,
      isStandalone,
    });
  }, []);

  return device;
}
