"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { CanvasBackground } from "@/components/canvas-background";
import { SketchCanvas } from "@/components/workspace/sketch-canvas";
import { useAuth } from "@/contexts/auth-context";

export default function WorkspacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <span className="text-sm text-white/50">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <CanvasBackground />
      <div className="relative z-10 px-4 pt-20 pb-12">
        <div className="mx-auto max-w-7xl space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Workspace
          </h1>
          <p className="text-sm text-white/50">
            Welcome, {user.email ?? "user"}
          </p>
          <SketchCanvas />
        </div>
      </div>
    </div>
  );
}
