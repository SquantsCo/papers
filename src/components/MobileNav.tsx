'use client';

import { useState } from 'react';

interface NavLink {
  label: string;
  href: string;
  icon?: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/', icon: '🏠' },
  { label: 'Papers', href: '/papers', icon: '📄' },
  { label: 'Learn', href: '/learn', icon: '📚' },
  { label: 'Community', href: '/community', icon: '👥' },
  { label: 'Blog', href: '/blog', icon: '✍️' },
  { label: 'About', href: '/about', icon: 'ℹ️' },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle navigation"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <nav className="md:hidden fixed bottom-20 right-4 left-4 z-40 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.icon && <span className="text-lg">{link.icon}</span>}
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
