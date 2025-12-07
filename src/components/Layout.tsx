"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-slate-200 bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-primary-700 to-primary-900 text-sm font-semibold text-white shadow-sm">
              Sq
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold text-slate-900">
                Squants<span className="text-primary-600">.com</span>
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Quantum · Code · Cosmology
              </span>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <Link href="/learn" className="hover:text-primary-600">
              Learn
            </Link>
            <Link href="/papers" className="hover:text-primary-600">
              Papers
            </Link>
            <Link href="/blog" className="hover:text-primary-600">
              Blog
            </Link>
            <Link href="/search" className="hover:text-primary-600">
              Users
            </Link>
            <Link href="/community" className="hover:text-primary-600">
              Community
            </Link>
            <Link href="/about" className="hover:text-primary-600">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/papers/submit"
              className="rounded-full border border-primary-200 bg-gradient-to-r from-primary-700 to-primary-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:from-primary-800 hover:to-primary-800 md:text-sm transition-all"
            >
              Submit a paper
            </Link>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="h-8 w-8 rounded-full border-2 border-primary-300 bg-gradient-to-br from-primary-200 to-primary-400 overflow-hidden hover:border-primary-500 transition-all flex items-center justify-center text-sm font-bold text-white"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {(session.user?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
                    </span>
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
                    <div className="border-b border-slate-200 p-4">
                      <p className="text-sm font-medium text-slate-900">
                        {session.user?.name || session.user?.email}
                      </p>
                      <p className="text-xs text-slate-600">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      View Profile
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-primary-700 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-50 md:text-sm transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-12 border-t border-slate-200 bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} Squants.com · All rights reserved.</p>
          <p>
            Built for the quantum community — from beginners to researchers and curious seekers.
          </p>
        </div>
      </footer>
    </div>
  );
}
