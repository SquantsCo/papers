import Link from "next/link";
import type { ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-slate-200 bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary-200 bg-primary-50 text-sm font-semibold text-primary-700 shadow-sm">
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
            <Link href="/community" className="hover:text-primary-600">
              Community
            </Link>
            <Link href="/about" className="hover:text-primary-600">
              About
            </Link>
          </nav>
          <Link
            href="/papers/submit"
            className="rounded-full border border-primary-200 bg-primary-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary-600 md:text-sm"
          >
            Submit a paper explainer
          </Link>
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
