"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-slate-50 p-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">
            Welcome, {session.user?.name || session.user?.email}! 🚀
          </h1>
          <p className="mb-6 text-slate-600">
            You're now part of the Squants quantum learning community.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Browse Papers */}
            <Link href="/papers">
              <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="mb-4 text-3xl">📄</div>
                <h3 className="mb-2 font-semibold text-slate-900">Browse Papers</h3>
                <p className="text-sm text-slate-600">
                  Explore quantum papers with detailed explanations.
                </p>
              </div>
            </Link>

            {/* Submit Paper */}
            <Link href="/papers/submit">
              <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="mb-4 text-3xl">✍️</div>
                <h3 className="mb-2 font-semibold text-slate-900">Submit Paper</h3>
                <p className="text-sm text-slate-600">
                  Share a paper explainer with the community.
                </p>
              </div>
            </Link>

            {/* Your Profile */}
            <Link href="/profile">
              <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="mb-4 text-3xl">👤</div>
                <h3 className="mb-2 font-semibold text-slate-900">Your Profile</h3>
                <p className="text-sm text-slate-600">
                  View and edit your profile information.
                </p>
              </div>
            </Link>

            {/* Find Users */}
            <Link href="/search">
              <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="mb-4 text-3xl">🔍</div>
                <h3 className="mb-2 font-semibold text-slate-900">Find Users</h3>
                <p className="text-sm text-slate-600">
                  Search and connect with community members.
                </p>
              </div>
            </Link>

            {/* Learning Paths */}
            <Link href="/learn">
              <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="mb-4 text-3xl">🎓</div>
                <h3 className="mb-2 font-semibold text-slate-900">Learning Paths</h3>
                <p className="text-sm text-slate-600">
                  Follow curated quantum learning guides.
                </p>
              </div>
            </Link>

            {/* Community */}
            <Link href="/community">
              <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="mb-4 text-3xl">👥</div>
                <h3 className="mb-2 font-semibold text-slate-900">Community</h3>
                <p className="text-sm text-slate-600">
                  Join the quantum learning community.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
