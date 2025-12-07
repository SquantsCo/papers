"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface UserProfile {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  profilePhoto: string | null;
  bio: string | null;
  emailVerified: boolean;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) throw new Error("User not found");
        const data = await response.json();
        setUser(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Error loading user";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "User not found"}</p>
          <Link
            href="/search"
            className="text-primary-700 hover:text-primary-900"
          >
            ← Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/search"
            className="text-sm text-primary-700 hover:text-primary-900"
          >
            ← Back to search
          </Link>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-primary-700 to-primary-900"></div>

          {/* Content */}
          <div className="px-8 pb-8">
            {/* Profile Info */}
            <div className="mt--16 mb-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
              {/* Photo */}
              <div className="h-24 w-24 rounded-full border-4 border-white bg-gradient-to-br from-primary-200 to-primary-400 overflow-hidden shadow-lg">
                {user.profilePhoto ? (
                  <Image
                    src={user.profilePhoto}
                    alt={`${user.firstName} ${user.lastName}`}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-3xl text-white font-bold">
                    {(user.firstName?.[0] || user.username[0]).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-slate-900">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </h1>
                <p className="text-sm text-slate-600">@{user.username}</p>
                {user.bio && (
                  <p className="mt-2 text-slate-700 italic">"{user.bio}"</p>
                )}
                {user.emailVerified && (
                  <p className="mt-2 text-xs text-green-600">✓ Verified</p>
                )}
              </div>
            </div>

            {/* User Stats */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="mb-4 font-semibold text-slate-900">Contributions</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="text-2xl font-bold text-primary-700">0</div>
                  <div className="text-xs text-slate-600">Papers</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="text-2xl font-bold text-primary-700">0</div>
                  <div className="text-xs text-slate-600">Explainers</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="text-2xl font-bold text-primary-700">0</div>
                  <div className="text-xs text-slate-600">Comments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
