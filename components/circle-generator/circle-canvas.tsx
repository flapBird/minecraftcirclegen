"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { CircleResult } from "@/lib/circle/circle-types";
import { coordinateForIndex, formatCoordinate } from "@/lib/circle/circle-utils";

interface CircleCanvasProps {
  result: CircleResult;
  builderActive: boolean;
  currentRow: number;
  completedRows: Set<number>;
}

interface Point {
  x: number;
  y: number;
}

interface DragState {
  point: Point;
  pan: Point;
  dragging: boolean;
}

const DRAG_THRESHOLD = 8;

export function CircleCanvas({
  result,
  builderActive,
  currentRow,
  completedRows,
}: CircleCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const [size, setSize] = useState({ width: 640, height: 640 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [hoveredCell, setHoveredCell] = useState<Point | null>(null);
  const [canvasError, setCanvasError] = useState("");
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);

  const fitView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fitView, 0);
    return () => window.clearTimeout(timer);
  }, [result.diameter, fitView]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setFullscreenAvailable(Boolean(document.fullscreenEnabled)),
      0,
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      setSize({
        width: Math.max(280, Math.round(rect.width)),
        height: Math.max(320, Math.round(rect.height)),
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
          "Your browser could not display the interactive blueprint. The row guide and PNG export are still available.",
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

      const baseCell = (Math.min(size.width, size.height) * 0.82) / result.diameter;
      const cell = baseCell * zoom;
      const gridSize = cell * result.diameter;
      const originX = (size.width - gridSize) / 2 + pan.x;
      const originY = (size.height - gridSize) / 2 + pan.y;

      context.fillStyle = "#edf1eb";
      context.fillRect(originX, originY, gridSize, gridSize);

      if (builderActive) {
        for (const completed of completedRows) {
          context.fillStyle = "rgba(87, 133, 96, .12)";
          context.fillRect(originX, originY + completed * cell, gridSize, cell);
        }
        context.fillStyle = "rgba(232, 162, 55, .2)";
        context.fillRect(originX, originY + currentRow * cell, gridSize, cell);
      }

      result.rows.forEach((row, y) => {
        row.segments.forEach((segment) => {
          const startIndex = segment.startX + (result.diameter - 1) / 2;
          if (builderActive && y === currentRow) {
            context.fillStyle = "#d88b2e";
          } else if (builderActive && completedRows.has(y)) {
            context.fillStyle = "#6d9b73";
          } else {
            context.fillStyle = "#3e7f4c";
          }
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

      context.strokeStyle = "rgba(188,91,39,.72)";
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
    builderActive,
    completedRows,
    currentRow,
    hoveredCell,
    pan,
    result,
    size,
    zoom,
  ]);

  const cellFromPointer = useCallback(
    (clientX: number, clientY: number): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const baseCell = (Math.min(size.width, size.height) * 0.82) / result.diameter;
      const cell = baseCell * zoom;
      const gridSize = cell * result.diameter;
      const originX = (size.width - gridSize) / 2 + pan.x;
      const originY = (size.height - gridSize) / 2 + pan.y;
      const x = Math.floor((clientX - rect.left - originX) / cell);
      const y = Math.floor((clientY - rect.top - originY) / cell);
      if (x < 0 || y < 0 || x >= result.diameter || y >= result.diameter) {
        return null;
      }
      return { x, y };
    },
    [pan, result.diameter, size, zoom],
  );

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      point: { x: event.clientX, y: event.clientY },
      pan,
      dragging: false,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current) {
      const deltaX = event.clientX - dragRef.current.point.x;
      const deltaY = event.clientY - dragRef.current.point.y;
      if (
        !dragRef.current.dragging &&
        Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD
      ) {
        return;
      }
      dragRef.current.dragging = true;
      setPan({
        x: dragRef.current.pan.x + deltaX,
        y: dragRef.current.pan.y + deltaY,
      });
      return;
    }
    setHoveredCell(cellFromPointer(event.clientX, event.clientY));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current && !dragRef.current.dragging) {
      setHoveredCell(cellFromPointer(event.clientX, event.clientY));
    }
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container || !document.fullscreenEnabled) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await container.requestFullscreen();
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
        <span className="zoom-readout">{Math.round(zoom * 100)}%</span>
      </div>
      <div
        ref={containerRef}
        className="canvas-shell"
        data-testid="canvas-shell"
      >
        <canvas
          ref={canvasRef}
          aria-label={`${result.mode} ${result.diameter} by ${result.diameter} block circle blueprint`}
          role="img"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
          onPointerLeave={() => {
            if (!dragRef.current) setHoveredCell(null);
          }}
        >
          A {result.mode} {result.diameter} by {result.diameter} block circle
          requiring {result.totalBlocks} blocks.
        </canvas>
        <div className="canvas-legend" aria-hidden="true">
          <span><i className="legend-block built" /> Circle</span>
          <span><i className="legend-block current" /> Current row</span>
          <span><i className="legend-line" /> Center axes</span>
        </div>
      </div>
      {canvasError ? (
        <p className="field-error" role="alert">{canvasError}</p>
      ) : (
        <p className="coordinate-readout" aria-live="polite">
          {coordinateText}
        </p>
      )}
      <p className="sr-only">
        A {result.mode} {result.diameter} by {result.diameter} block circle
        requiring {result.totalBlocks} blocks.
      </p>
      <div className="canvas-controls" aria-label="Blueprint view controls">
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
        <button type="button" onClick={fitView}>Reset View</button>
        <button
          type="button"
          onClick={toggleFullscreen}
          disabled={!fullscreenAvailable}
          title={fullscreenAvailable ? undefined : "Fullscreen is unavailable in this browser"}
        >
          Fullscreen
        </button>
      </div>
      <p className="canvas-tip">
        Use the zoom controls · drag to pan · tap a cell for coordinates
      </p>
    </section>
  );
}
