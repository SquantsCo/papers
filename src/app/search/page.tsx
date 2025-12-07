"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface UserResult {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  profilePhoto: string | null;
  bio: string | null;
  emailVerified: boolean;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const searchUsers = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/user/search?q=${encodeURIComponent(searchQuery)}&limit=20`
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-primary-700 hover:text-primary-900"
          >
            ← Back to home
          </Link>
        </div>

        {/* Search Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Users</h1>
          <p className="text-slate-600 mb-6">
            Search for community members and view their profiles
          </p>

          <input
            type="text"
            placeholder="Search by name, username, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>

        {/* Results */}
        {hasSearched && (
          <div>
            {isSearching ? (
              <div className="text-center text-slate-600">Searching...</div>
            ) : results.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 text-center text-slate-600">
                No users found matching "{searchQuery}"
              </div>
            ) : (
              <div className="grid gap-4">
                {results.map((user) => (
                  <Link key={user.id} href={`/users/${user.id}`}>
                    <div className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md hover:border-primary-300 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 overflow-hidden flex-shrink-0">
                          {user.profilePhoto ? (
                            <Image
                              src={user.profilePhoto}
                              alt={`${user.firstName} ${user.lastName}`}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xl text-white font-bold">
                              {(user.firstName?.[0] || user.username[0]).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">
                              {user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.username}
                            </h3>
                            {user.emailVerified && (
                              <span className="text-green-600 text-sm">✓</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">@{user.username}</p>
                          {user.bio && (
                            <p className="mt-1 text-sm text-slate-700 line-clamp-2">
                              {user.bio}
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <div className="text-primary-600 text-xl">→</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
