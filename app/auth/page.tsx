"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CanvasBackground } from "@/components/canvas-background";
import { useAuth } from "@/contexts/auth-context";

export default function AuthPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/workspace");
    }
  }, [user, loading, router]);

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-skin-base px-4 py-12">
      <CanvasBackground />

      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl"
        style={{
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.06) inset, 0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
          }}
        />

        <div className="relative flex flex-col items-center gap-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Welcome
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Sign in with your Google account to continue
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.08] px-5 py-3.5 text-sm font-medium text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-md transition-all duration-200 hover:bg-white/[0.12] hover:border-white/[0.18] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          <Link
            href="/"
            className="text-xs text-white/40 transition-colors hover:text-white/60"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
