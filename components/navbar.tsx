"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

export function Navbar() {
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
        >
          music flow
        </Link>
        {!loading &&
          (user ? (
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/50 hover:border-white/15"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/auth"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10 hover:border-white/15"
            >
              Log in
            </Link>
          ))}
      </div>
    </nav>
  );
}
