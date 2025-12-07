"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    profilePhoto: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user) {
      // Fetch user profile data
      fetchUserProfile();
    }
  }, [status, session, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        bio: data.bio || "",
        profilePhoto: data.profilePhoto || "",
      });
      if (data.profilePhoto) {
        setPhotoPreview(data.profilePhoto);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFormData((prev) => ({
          ...prev,
          profilePhoto: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save profile");
      
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      
      setTimeout(() => {
        fetchUserProfile();
      }, 1000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setFormData((prev) => ({
      ...prev,
      profilePhoto: "",
    }));
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-primary-700 hover:text-primary-900"
          >
            ← Back to home
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Sign Out
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-primary-700 to-primary-900"></div>

          {/* Content */}
          <div className="px-8 pb-8">
            {/* Success Message */}
            {success && (
              <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
                ✓ {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
                ✗ {error}
              </div>
            )}

            {/* Profile Info */}
            <div className="mt--16 mb-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
              {/* Photo */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-white bg-gradient-to-br from-primary-200 to-primary-400 overflow-hidden shadow-lg">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-3xl text-white font-bold">
                      {(formData.firstName?.[0] || "S").toUpperCase()}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center cursor-pointer hover:bg-primary-700">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    📷
                  </label>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-slate-900">
                  {formData.firstName && formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`
                    : session.user?.name || session.user?.email}
                </h1>
                <p className="text-sm text-slate-600">{session.user?.email}</p>
                {formData.bio && (
                  <p className="mt-2 text-slate-700 italic">"{formData.bio}"</p>
                )}
              </div>
            </div>

            {/* Edit / Save Buttons */}
            <div className="mb-6 flex gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 rounded-lg bg-gradient-to-r from-primary-700 to-primary-900 px-4 py-2 font-medium text-white hover:from-primary-800 hover:to-primary-800 transition-all"
                  >
                    Edit Profile
                  </button>
                  {photoPreview && (
                    <button
                      onClick={handleRemovePhoto}
                      className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Remove Photo
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 rounded-lg bg-gradient-to-r from-primary-700 to-primary-900 px-4 py-2 font-medium text-white hover:from-primary-800 hover:to-primary-800 disabled:opacity-50 transition-all"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      fetchUserProfile();
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* Form */}
            {isEditing && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <textarea
                  name="bio"
                  placeholder="Write a short bio or status (e.g., 'Quantum computing enthusiast 🚀')"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={200}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
                <p className="text-xs text-slate-500">
                  {formData.bio.length}/200 characters
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Photo Upload
                  </span>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* User Stats */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="mb-4 font-semibold text-slate-900">Activity</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="text-2xl font-bold text-primary-700">0</div>
                  <div className="text-xs text-slate-600">Papers Submitted</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="text-2xl font-bold text-primary-700">0</div>
                  <div className="text-xs text-slate-600">Explainers Written</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="text-2xl font-bold text-primary-700">0</div>
                  <div className="text-xs text-slate-600">Comments Added</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
