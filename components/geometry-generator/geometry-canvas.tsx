"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { GeometryResult } from "@/lib/geometry/geometry-types";

interface GeometryCanvasProps {
  result: GeometryResult;
  showGrid: boolean;
  zoom: number;
}

export function GeometryCanvas({ result, showGrid, zoom }: GeometryCanvasProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const [size, setSize] = useState({ width: 640, height: 510 });

  const metrics = useCallback(() => {
    const cell = Math.min(
      (size.width * 0.86) / result.width,
      (size.height * 0.82) / result.height,
    ) * zoom;
    const width = cell * result.width;
    const height = cell * result.height;
    return { cell, width, height, x: (size.width - width) / 2, y: (size.height - height) / 2 };
  }, [result.height, result.width, size.height, size.width, zoom]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const update = () => {
      const rect = shell.getBoundingClientRect();
      setSize({ width: Math.max(1, Math.round(rect.width)), height: Math.max(1, Math.round(rect.height)) });
    };
    update();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(update);
      observer.observe(shell);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      const dpr = Math.min(3, window.devicePixelRatio || 1);
      canvas.width = Math.round(size.width * dpr);
      canvas.height = Math.round(size.height * dpr);
      canvas.style.width = `${size.width}px`;
      canvas.style.height = `${size.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.fillStyle = "#f8f5ed";
      context.fillRect(0, 0, size.width, size.height);
      const view = metrics();

      context.fillStyle = "#f2eee3";
      context.fillRect(view.x, view.y, view.width, view.height);
      result.grid.forEach((row, y) => row.forEach((filled, x) => {
        if (!filled) return;
        const inset = showGrid ? Math.min(1, view.cell * 0.1) : 0;
        context.fillStyle = "#4f8345";
        context.fillRect(
          view.x + x * view.cell + inset,
          view.y + y * view.cell + inset,
          Math.max(0.8, view.cell - inset * 2),
          Math.max(0.8, view.cell - inset * 2),
        );
      }));

      if (showGrid && view.cell >= 3) {
        context.strokeStyle = "rgba(68, 88, 64, .16)";
        context.lineWidth = 1;
        context.beginPath();
        for (let x = 0; x <= result.width; x += 1) {
          context.moveTo(view.x + x * view.cell, view.y);
          context.lineTo(view.x + x * view.cell, view.y + view.height);
        }
        for (let y = 0; y <= result.height; y += 1) {
          context.moveTo(view.x, view.y + y * view.cell);
          context.lineTo(view.x + view.width, view.y + y * view.cell);
        }
        context.stroke();
      }

      context.strokeStyle = "rgba(183, 103, 63, .72)";
      context.lineWidth = Math.max(1.5, Math.min(3, view.cell * 0.12));
      context.beginPath();
      context.moveTo(view.x + view.width / 2, view.y);
      context.lineTo(view.x + view.width / 2, view.y + view.height);
      context.moveTo(view.x, view.y + view.height / 2);
      context.lineTo(view.x + view.width, view.y + view.height / 2);
      context.stroke();

    });
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [metrics, result, showGrid, size.height, size.width]);

  return (
    <div className="workbench-canvas">
      <div ref={shellRef} className="canvas-shell geometry-canvas-shell">
        <canvas
          ref={canvasRef}
          role="img"
          tabIndex={0}
          aria-label={`${result.mode} ${result.label.toLowerCase()} blueprint, ${result.width} by ${result.height} blocks`}
        >{result.label} blueprint requiring {result.currentBlocks} blocks.</canvas>
      </div>
    </div>
  );
}
