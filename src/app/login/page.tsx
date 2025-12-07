"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [verified, setVerified] = useState(searchParams.get("verified") === "true");

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        if (!formData.email || !formData.password || !formData.username) {
          throw new Error("Please fill in all required fields");
        }

        const result = await signIn("credentials", {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          isSignUp: "true",
          redirect: false,
        });

        if (result?.error) {
          if (result.error.includes("Verification email sent")) {
            setError(
              "Verification email sent! Please check your inbox and follow the link to verify your email."
            );
            setFormData({
              email: "",
              username: "",
              password: "",
              confirmPassword: "",
              firstName: "",
              lastName: "",
            });
            setTimeout(() => setIsSignUp(false), 3000);
          } else {
            throw new Error(result.error);
          }
        }
      } else {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        if (result?.ok) {
          router.push("/dashboard");
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "azure-ad") => {
    setError(null);
    setIsLoading(true);
    try {
      await signIn(provider, { redirect: true, callbackUrl: "/dashboard" });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Cosmos gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900 to-primary-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-10 h-32 w-32 rounded-full bg-primary-400 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-primary-600 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 h-40 w-40 rounded-full bg-primary-500 blur-3xl"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-white">Squants</h1>
            <p className="text-primary-200">Quantum Papers & Learning Paths</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-primary-200 border-opacity-20 bg-white bg-opacity-95 backdrop-blur-xl p-8 shadow-2xl">
            {/* Success Message */}
            {verified && (
              <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700">
                ✓ Email verified successfully! You can now log in.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className={`mb-6 rounded-lg p-4 ${
                error.includes("Verification email sent")
                  ? "bg-blue-50 text-blue-700"
                  : "bg-red-50 text-red-700"
              }`}>
                {error}
              </div>
            )}

            {/* Form Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {isSignUp
                  ? "Join the quantum learning community"
                  : "Sign in to your Squants account"}
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="mb-6 space-y-3">
              <button
                onClick={() => handleOAuthSignIn("google")}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <Image
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E"
                  alt="Google"
                  width={18}
                  height={18}
                />
                Continue with Google
              </button>

              <button
                onClick={() => handleOAuthSignIn("azure-ad")}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <Image
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect fill='%230078D4' x='3' y='3' width='8' height='8'/%3E%3Crect fill='%2350E6FF' x='13' y='3' width='8' height='8'/%3E%3Crect fill='%2350E6FF' x='3' y='13' width='8' height='8'/%3E%3Crect fill='%23FFB900' x='13' y='13' width='8' height='8'/%3E%3C/svg%3E"
                  alt="Microsoft"
                  width={18}
                  height={18}
                />
                Continue with Microsoft
              </button>
            </div>

            {/* Divider */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="text-xs text-slate-500">or</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            {/* Credential Form */}
            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-3">
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

                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />

              {isSignUp && (
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-primary-700 to-primary-900 px-4 py-2.5 font-medium text-white hover:from-primary-800 hover:to-primary-800 disabled:opacity-50 transition-all"
              >
                {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
              </button>
            </form>

            {/* Toggle Sign Up / Login */}
            <div className="mt-6 text-center text-sm text-slate-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="font-medium text-primary-700 hover:text-primary-900"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
