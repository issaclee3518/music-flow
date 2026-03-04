"use client";

import { useEffect } from "react";
import { renderCanvas } from "@/components/ui/canvas";

export function CanvasBackground() {
  useEffect(() => {
    const cleanup = renderCanvas();
    return () => cleanup?.();
  }, []);

  return (
    <canvas
      id="canvas"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
