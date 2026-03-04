"use client";

import { useRef, useEffect, useState, useCallback } from "react";

const MIN_PEN = 1;
const MAX_PEN = 30;
const MIN_ERASER = 5;
const MAX_ERASER = 80;

type Tool = "pen" | "eraser";

export function SketchCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>("pen");
  const [penSize, setPenSize] = useState(4);
  const [penColor, setPenColor] = useState("#171717");
  const [eraserSize, setEraserSize] = useState(20);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const prevPoint = useRef<{ x: number; y: number } | null>(null);

  const getCoords = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    []
  );

  const draw = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const last = lastPoint.current;
      const prev = prevPoint.current;

      if (tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = eraserSize;
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
      }
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (last) {
        ctx.beginPath();
        if (prev) {
          ctx.moveTo(prev.x, prev.y);
          ctx.quadraticCurveTo(last.x, last.y, x, y);
        } else {
          ctx.moveTo(last.x, last.y);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (tool === "eraser") {
        ctx.globalCompositeOperation = "source-over";
      }

      prevPoint.current = lastPoint.current;
      lastPoint.current = { x, y };
    },
    [tool, penSize, penColor, eraserSize]
  );

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const coords = getCoords(e);
      if (coords) {
        setIsDrawing(true);
        lastPoint.current = coords;
      }
    },
    [getCoords]
  );

  const moveDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const coords = getCoords(e);
      if (coords) {
        draw(coords.x, coords.y);
      }
    },
    [isDrawing, getCoords, draw]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    lastPoint.current = null;
    prevPoint.current = null;
  }, []);

  // Resize canvas to match container
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio ?? 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTool("pen")}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              tool === "pen"
                ? "border-white/30 bg-white/20 text-white"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            펜
          </button>
          <button
            type="button"
            onClick={() => setTool("eraser")}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              tool === "eraser"
                ? "border-white/30 bg-white/20 text-white"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            지우개
          </button>
        </div>
        {tool === "pen" && (
          <>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-white/60">펜 굵기</span>
              <input
                type="range"
                min={MIN_PEN}
                max={MAX_PEN}
                value={penSize}
                onChange={(e) => setPenSize(Number(e.target.value))}
                className="h-2 w-28 cursor-pointer appearance-none rounded-full bg-white/10 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
                style={{ accentColor: "rgba(255,255,255,0.9)" }}
              />
              <span className="w-6 text-right text-xs text-white/50">
                {penSize}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-white/60">펜 색</span>
              <input
                type="color"
                value={penColor}
                onChange={(e) => setPenColor(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded-lg border-0 border-white/10 bg-white/5 p-0"
              />
            </div>
          </>
        )}
        {tool === "eraser" && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-white/60">지우개 굵기</span>
            <input
              type="range"
              min={MIN_ERASER}
              max={MAX_ERASER}
              value={eraserSize}
              onChange={(e) => setEraserSize(Number(e.target.value))}
              className="h-2 w-28 cursor-pointer appearance-none rounded-full bg-white/10 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
              style={{ accentColor: "rgba(255,255,255,0.9)" }}
            />
            <span className="w-8 text-right text-xs text-white/50">
              {eraserSize}
            </span>
          </div>
        )}
      </div>
      <div
        ref={containerRef}
        className="relative h-[calc(100vh-18rem)] w-full min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl"
        style={{
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.04), 0 25px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full touch-none ${tool === "eraser" ? "cursor-cell" : "cursor-crosshair"}`}
          onMouseDown={startDrawing}
          onMouseMove={moveDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
}
