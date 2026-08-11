"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from "react";
import type { CircleResult } from "@/lib/circle/circle-types";
import { coordinateForIndex, formatCoordinate } from "@/lib/circle/circle-utils";

interface CircleCanvasProps {
  settingsPanel?: ReactNode;
  summaryPanel?: ReactNode;
  actionPanel?: ReactNode;
  result: CircleResult;
}

interface Point {
  x: number;
  y: number;
}

interface CanvasSize {
  width: number;
  height: number;
}

function getCanvasMetrics(
  size: CanvasSize,
  diameter: number,
  zoom: number,
) {
  const baseCell = (Math.min(size.width, size.height) * 0.82) / diameter;
  const cell = baseCell * zoom;
  const gridSize = cell * diameter;

  return {
    cell,
    gridSize,
    originX: (size.width - gridSize) / 2,
    originY: (size.height - gridSize) / 2,
  };
}

export function CircleCanvas({
  settingsPanel,
  summaryPanel,
  actionPanel,
  result,
}: CircleCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const workbenchRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const [size, setSize] = useState({ width: 640, height: 640 });
  const [zoom, setZoom] = useState(1);
  const [hoveredCell, setHoveredCell] = useState<Point | null>(null);
  const [canvasError, setCanvasError] = useState("");
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fitView = useCallback(() => {
    setZoom(1);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fitView, 0);
    return () => window.clearTimeout(timer);
  }, [result.diameter, fitView]);

  useEffect(() => {
    const updateFullscreen = () => {
      setFullscreenAvailable(Boolean(document.fullscreenEnabled));
      setIsFullscreen(document.fullscreenElement === workbenchRef.current);
    };
    const timer = window.setTimeout(updateFullscreen, 0);
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("fullscreenchange", updateFullscreen);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      setSize({
        width: Math.max(1, Math.round(rect.width)),
        height: Math.max(1, Math.round(rect.height)),
      });
    };
    updateSize();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateSize);
      observer.observe(container);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) {
        setCanvasError(
          "Your browser could not display the interactive blueprint. PNG export is still available.",
        );
        return;
      }
      setCanvasError("");
      const dpr = Math.min(3, window.devicePixelRatio || 1);
      canvas.width = Math.round(size.width * dpr);
      canvas.height = Math.round(size.height * dpr);
      canvas.style.width = `${size.width}px`;
      canvas.style.height = `${size.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, size.width, size.height);
      context.fillStyle = "#f7f9f5";
      context.fillRect(0, 0, size.width, size.height);

      const { cell, gridSize, originX, originY } = getCanvasMetrics(
        size,
        result.diameter,
        zoom,
      );

      context.fillStyle = "#edf1eb";
      context.fillRect(originX, originY, gridSize, gridSize);

      result.rows.forEach((row, y) => {
        row.segments.forEach((segment) => {
          const startIndex = segment.startX + (result.diameter - 1) / 2;
          context.fillStyle = "#3e7f4c";
          context.fillRect(
            originX + startIndex * cell + Math.min(0.5, cell * 0.08),
            originY + y * cell + Math.min(0.5, cell * 0.08),
            Math.max(0.75, segment.length * cell - Math.min(1, cell * 0.12)),
            Math.max(0.75, cell - Math.min(1, cell * 0.12)),
          );
        });
      });

      if (cell >= 3) {
        context.strokeStyle = cell >= 7 ? "rgba(35,55,41,.2)" : "rgba(35,55,41,.12)";
        context.lineWidth = 1;
        context.beginPath();
        for (let i = 0; i <= result.diameter; i += 1) {
          const position = i * cell;
          context.moveTo(originX + position, originY);
          context.lineTo(originX + position, originY + gridSize);
          context.moveTo(originX, originY + position);
          context.lineTo(originX + gridSize, originY + position);
        }
        context.stroke();
      }

      context.strokeStyle = "#a54821";
      context.lineWidth = Math.max(1.5, Math.min(3, cell * 0.12));
      context.beginPath();
      context.moveTo(originX + gridSize / 2, originY);
      context.lineTo(originX + gridSize / 2, originY + gridSize);
      context.moveTo(originX, originY + gridSize / 2);
      context.lineTo(originX + gridSize, originY + gridSize / 2);
      context.stroke();

      context.strokeStyle = "#2b3e30";
      context.lineWidth = 1.5;
      context.strokeRect(originX, originY, gridSize, gridSize);

      if (hoveredCell) {
        context.strokeStyle = "#173f28";
        context.lineWidth = 2.5;
        context.strokeRect(
          originX + hoveredCell.x * cell + 1,
          originY + hoveredCell.y * cell + 1,
          Math.max(1, cell - 2),
          Math.max(1, cell - 2),
        );
      }
    });
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [
    hoveredCell,
    result,
    size,
    zoom,
  ]);

  const cellFromPointer = useCallback(
    (clientX: number, clientY: number): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const { cell, originX, originY } = getCanvasMetrics(
        size,
        result.diameter,
        zoom,
      );
      const x = Math.floor((clientX - rect.left - originX) / cell);
      const y = Math.floor((clientY - rect.top - originY) / cell);
      if (x < 0 || y < 0 || x >= result.diameter || y >= result.diameter) {
        return null;
      }
      return { x, y };
    },
    [result.diameter, size, zoom],
  );

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    setHoveredCell(cellFromPointer(event.clientX, event.clientY));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    setHoveredCell(cellFromPointer(event.clientX, event.clientY));
  };

  const handleWheel = (event: ReactWheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.2 : 1 / 1.2;
    setZoom((value) => Math.max(0.25, Math.min(8, value * factor)));
  };

  const handleCanvasKeyDown = (
    event: ReactKeyboardEvent<HTMLCanvasElement>,
  ) => {
    const center = Math.floor((result.diameter - 1) / 2);
    const current = hoveredCell ?? { x: center, y: center };
    let next = current;
    if (event.key === "ArrowLeft") next = { ...current, x: current.x - 1 };
    else if (event.key === "ArrowRight") next = { ...current, x: current.x + 1 };
    else if (event.key === "ArrowUp") next = { ...current, y: current.y - 1 };
    else if (event.key === "ArrowDown") next = { ...current, y: current.y + 1 };
    else if (event.key === "Home") next = { x: center, y: center };
    else return;
    event.preventDefault();
    setHoveredCell({
      x: Math.max(0, Math.min(result.diameter - 1, next.x)),
      y: Math.max(0, Math.min(result.diameter - 1, next.y)),
    });
  };

  const toggleFullscreen = async () => {
    const workbench = workbenchRef.current;
    if (!workbench || !document.fullscreenEnabled) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await workbench.requestFullscreen();
    } catch {
      setFullscreenAvailable(false);
    }
  };

  const coordinateText = hoveredCell
    ? `X: ${formatCoordinate(coordinateForIndex(hoveredCell.x, result.diameter))}, Z: ${formatCoordinate(coordinateForIndex(hoveredCell.y, result.diameter))}`
    : "Point to or tap a cell to see its coordinates";

  return (
    <section className="tool-card canvas-card" aria-labelledby="blueprint-title">
      <div className="canvas-heading">
        <div className="card-heading">
          <div>
            <h2 id="blueprint-title">Blueprint</h2>
            <p>
              {result.diameter} × {result.diameter} blocks
            </p>
          </div>
        </div>
        {summaryPanel}
      </div>
      <div className="blueprint-workbench">
        <aside className="workbench-settings" aria-label="Shape settings panel">
          {settingsPanel}
        </aside>
        <div ref={workbenchRef} className="workbench-canvas">
          <div
            ref={containerRef}
            className="canvas-shell"
            data-testid="canvas-shell"
          >
            <canvas
              ref={canvasRef}
              aria-label={`${result.mode} ${result.diameter} by ${result.diameter} block circle blueprint. Use arrow keys to inspect block coordinates.`}
              aria-describedby="coordinate-readout"
              role="img"
              tabIndex={0}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
              onKeyDown={handleCanvasKeyDown}
              onPointerLeave={() => setHoveredCell(null)}
            >
              A {result.mode} {result.diameter} by {result.diameter} block circle
              requiring {result.totalBlocks} blocks.
            </canvas>
            <div className="canvas-legend" aria-hidden="true">
              <span><i className="legend-block built" /> Circle</span>
              <span><i className="legend-line" /> Center axes</span>
            </div>
          </div>
          {canvasError ? (
            <p className="field-error" role="alert">{canvasError}</p>
          ) : (
            <p id="coordinate-readout" className="coordinate-readout" aria-live="polite">
              {coordinateText}
            </p>
          )}
          <p className="sr-only">
            A {result.mode} {result.diameter} by {result.diameter} block circle
            requiring {result.totalBlocks} blocks.
          </p>
          <div className="canvas-controls" aria-label="Blueprint view controls">
            <span className="zoom-readout">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => setZoom((value) => Math.max(0.25, value / 1.25))}
            >
              −
            </button>
            <button type="button" onClick={fitView}>Fit</button>
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => setZoom((value) => Math.min(8, value * 1.25))}
            >
              +
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              disabled={!fullscreenAvailable}
              title={fullscreenAvailable ? undefined : "Fullscreen is unavailable in this browser"}
            >
              {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            </button>
          </div>
        </div>
      </div>
      <div className="workbench-footer">
        {actionPanel}
        <p className="canvas-tip">
          Point to or tap a cell for coordinates. The blueprint stays centered.
        </p>
      </div>
    </section>
  );
}
