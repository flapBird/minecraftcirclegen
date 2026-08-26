"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { ShapeBlueprint } from "@/lib/shape/generate-shape";

type ViewMode = "2d" | "3d";
type Point3 = [number, number, number];

const FACE_DATA: Array<{ normal: Point3; neighbor: Point3; vertices: Point3[]; shade: number }> = [
  { normal: [0, 1, 0], neighbor: [0, 1, 0], shade: 0, vertices: [[-.5,.5,-.5],[.5,.5,-.5],[.5,.5,.5],[-.5,.5,.5]] },
  { normal: [1, 0, 0], neighbor: [1, 0, 0], shade: 1, vertices: [[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5],[.5,-.5,.5]] },
  { normal: [-1, 0, 0], neighbor: [-1, 0, 0], shade: 2, vertices: [[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5],[-.5,-.5,-.5]] },
  { normal: [0, 0, 1], neighbor: [0, 0, 1], shade: 1, vertices: [[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]] },
  { normal: [0, 0, -1], neighbor: [0, 0, -1], shade: 2, vertices: [[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5]] },
  { normal: [0, -1, 0], neighbor: [0, -1, 0], shade: 3, vertices: [[-.5,-.5,.5],[.5,-.5,.5],[.5,-.5,-.5],[-.5,-.5,-.5]] },
];

export function ShapeCanvas({
  blueprint,
  layers,
  mode,
  showGrid,
  showCoordinates,
  zoom,
  autoRotate,
  onZoomChange,
  canvasRef,
}: {
  blueprint: ShapeBlueprint;
  layers: ShapeBlueprint[];
  mode: ViewMode;
  showGrid: boolean;
  showCoordinates: boolean;
  zoom: number;
  autoRotate: boolean;
  onZoomChange: Dispatch<SetStateAction<number>>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState({ width: 680, height: 560 });
  const [hover, setHover] = useState<{ x: number; z: number; filled: boolean } | null>(null);
  const [rotation, setRotation] = useState({ yaw: -0.72, pitch: -0.52 });

  const volume = useMemo(() => {
    if (mode !== "3d") return { occupied: new Set<string>(), blocks: [] as Point3[] };
    const occupied = new Set<string>();
    const blocks: Point3[] = [];
    layers.forEach((layer, y) => layer.grid.forEach((row, z) => row.forEach((filled, x) => {
      if (!filled) return;
      occupied.add(`${x},${y},${z}`);
      blocks.push([x, y, z]);
    })));
    return { occupied, blocks };
  }, [layers, mode]);

  const viewMetrics = useCallback(() => {
    const cell = Math.max(1, Math.min((size.width * 0.88) / blueprint.width, (size.height * 0.82) / blueprint.height) * zoom);
    const width = cell * blueprint.width;
    const height = cell * blueprint.height;
    return { cell, width, height, x: (size.width - width) / 2, y: (size.height - height) / 2 };
  }, [blueprint.height, blueprint.width, size.height, size.width, zoom]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const update = () => {
      const rect = shell.getBoundingClientRect();
      setSize({ width: Math.max(1, Math.round(rect.width)), height: Math.max(1, Math.round(rect.height)) });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || mode !== "3d") return;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      onZoomChange((current) => Math.max(.5, Math.min(2.5, current + (event.deltaY < 0 ? .1 : -.1))));
    };
    shell.addEventListener("wheel", handleWheel, { passive: false });
    return () => shell.removeEventListener("wheel", handleWheel);
  }, [mode, onZoomChange]);

  useEffect(() => {
    if (!autoRotate || mode !== "3d") return;
    let frame = 0;
    let previous: number | null = null;
    const animate = (timestamp: number) => {
      if (previous === null) previous = timestamp;
      const elapsed = timestamp - previous;
      if (elapsed >= 40) {
        previous = timestamp;
        setRotation((current) => ({ ...current, yaw: current.yaw + Math.min(elapsed, 80) * .00032 }));
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [autoRotate, mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    canvas.width = Math.round(size.width * dpr);
    canvas.height = Math.round(size.height * dpr);
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, size.width, size.height);

    if (mode === "3d") {
      context.fillStyle = "#eef1ea";
      context.fillRect(0, 0, size.width, size.height);
      context.strokeStyle = "rgba(64,83,65,.08)";
      context.lineWidth = 1;
      for (let offset = -size.height; offset < size.width + size.height; offset += 34) {
        context.beginPath(); context.moveTo(offset, size.height); context.lineTo(offset + size.height, 0); context.stroke();
      }

      const width = layers[0]?.width ?? blueprint.width;
      const depth = layers[0]?.height ?? blueprint.height;
      const layerCount = layers.length;
      const maxDimension = Math.max(width, depth, layerCount);
      const scale = Math.max(2.2, Math.min(size.width / (maxDimension * 1.7), size.height / (maxDimension * 1.45)) * zoom);
      const cosY = Math.cos(rotation.yaw);
      const sinY = Math.sin(rotation.yaw);
      const cosP = Math.cos(rotation.pitch);
      const sinP = Math.sin(rotation.pitch);
      const center: Point3 = [(width - 1) / 2, (layerCount - 1) / 2, (depth - 1) / 2];
      const transform = ([x, y, z]: Point3) => {
        const px = x - center[0];
        const py = y - center[1];
        const pz = z - center[2];
        const rx = px * cosY - pz * sinY;
        const rz = px * sinY + pz * cosY;
        const ry = py * cosP - rz * sinP;
        const depthValue = py * sinP + rz * cosP;
        return { x: size.width / 2 + rx * scale, y: size.height / 2 - ry * scale, depth: depthValue };
      };
      const normalDepth = ([x, y, z]: Point3) => y * sinP + (x * sinY + z * cosY) * cosP;
      const faces: Array<{ points: Array<{ x: number; y: number }>; depth: number; shade: number; active: boolean }> = [];
      const surfaceBlocks = volume.blocks.filter(([x, y, z]) => FACE_DATA.some(({ neighbor }) => !volume.occupied.has(`${x + neighbor[0]},${y + neighbor[1]},${z + neighbor[2]}`)));
      const step = Math.max(1, Math.ceil(surfaceBlocks.length / 24000));
      surfaceBlocks.forEach(([x, y, z], blockIndex) => {
        if (blockIndex % step !== 0) return;
        FACE_DATA.forEach((face) => {
          const [dx, dy, dz] = face.neighbor;
          if (volume.occupied.has(`${x + dx},${y + dy},${z + dz}`) || normalDepth(face.normal) <= 0.035) return;
          const projected = face.vertices.map(([vx, vy, vz]) => transform([x + vx, y + vy, z + vz]));
          faces.push({ points: projected, depth: projected.reduce((sum, point) => sum + point.depth, 0) / projected.length, shade: face.shade, active: y === blueprint.layer - 1 });
        });
      });
      faces.sort((a, b) => a.depth - b.depth);
      const muted = ["#aebcaf", "#879a89", "#718373", "#5d6f60"];
      const active = ["#79ad6f", "#568b51", "#447644", "#355f39"];
      faces.forEach((face) => {
        context.beginPath();
        face.points.forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
        context.closePath();
        context.fillStyle = (face.active ? active : muted)[face.shade];
        context.fill();
        if (scale >= 4) { context.strokeStyle = "rgba(32,47,35,.28)"; context.lineWidth = Math.min(1.1, scale * .08); context.stroke(); }
      });
      return;
    }

    context.fillStyle = "#f8f5ed";
    context.fillRect(0, 0, size.width, size.height);
    const view = viewMetrics();
    context.fillStyle = "#eef0e8";
    context.fillRect(view.x, view.y, view.width, view.height);
    blueprint.grid.forEach((row, z) => row.forEach((filled, x) => {
      if (!filled) return;
      const inset = showGrid ? Math.min(1, view.cell * 0.08) : 0;
      context.fillStyle = (x + z) % 2 ? "#477a45" : "#52894d";
      context.fillRect(view.x + x * view.cell + inset, view.y + z * view.cell + inset, Math.max(0.8, view.cell - inset * 2), Math.max(0.8, view.cell - inset * 2));
      if (showCoordinates && view.cell >= 22) {
        context.fillStyle = "rgba(255,255,255,.86)";
        context.font = `${Math.max(7, Math.min(10, view.cell * 0.3))}px monospace`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        const rx = x - (blueprint.width - 1) / 2;
        const rz = z - (blueprint.height - 1) / 2;
        context.fillText(`${rx},${rz}`, view.x + (x + 0.5) * view.cell, view.y + (z + 0.5) * view.cell);
      }
    }));
    if (showGrid && view.cell >= 3) {
      context.strokeStyle = "rgba(68,88,64,.18)";
      context.lineWidth = 1;
      context.beginPath();
      for (let x = 0; x <= blueprint.width; x += 1) { context.moveTo(view.x + x * view.cell, view.y); context.lineTo(view.x + x * view.cell, view.y + view.height); }
      for (let y = 0; y <= blueprint.height; y += 1) { context.moveTo(view.x, view.y + y * view.cell); context.lineTo(view.x + view.width, view.y + y * view.cell); }
      context.stroke();
    }
    context.strokeStyle = "rgba(183,103,63,.75)";
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(view.x + view.width / 2, view.y); context.lineTo(view.x + view.width / 2, view.y + view.height);
    context.moveTo(view.x, view.y + view.height / 2); context.lineTo(view.x + view.width, view.y + view.height / 2);
    context.stroke();
  }, [blueprint, canvasRef, layers, mode, rotation.pitch, rotation.yaw, showCoordinates, showGrid, size.height, size.width, viewMetrics, volume.blocks, volume.occupied, zoom]);

  const updatePointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode === "3d") {
      if (!dragRef.current) return;
      const dx = event.clientX - dragRef.current.x;
      const dy = event.clientY - dragRef.current.y;
      dragRef.current = { x: event.clientX, y: event.clientY };
      setRotation((current) => ({ yaw: current.yaw + dx * .012, pitch: Math.max(-1.15, Math.min(.15, current.pitch + dy * .009)) }));
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const view = viewMetrics();
    const x = Math.floor((event.clientX - rect.left - view.x) / view.cell);
    const z = Math.floor((event.clientY - rect.top - view.y) / view.cell);
    if (x < 0 || z < 0 || x >= blueprint.width || z >= blueprint.height) return setHover(null);
    setHover({ x: x - (blueprint.width - 1) / 2, z: z - (blueprint.height - 1) / 2, filled: blueprint.grid[z][x] });
  };

  return (
    <div className={`shape-canvas-wrap is-${mode}`}>
      <div ref={shellRef} className="shape-canvas-shell">
        <canvas
          ref={canvasRef}
          role={mode === "3d" ? "application" : "img"}
          tabIndex={mode === "3d" ? 0 : undefined}
          aria-label={mode === "3d" ? `Interactive 3D preview of ${blueprint.label}; drag to rotate and scroll to zoom` : `${blueprint.label} block blueprint`}
          onPointerDown={(event) => { if (mode === "3d") { dragRef.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); } }}
          onPointerMove={updatePointer}
          onPointerUp={(event) => { dragRef.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
          onPointerCancel={() => { dragRef.current = null; }}
          onPointerLeave={() => { if (mode === "2d") setHover(null); }}
          onKeyDown={(event) => { if (mode === "3d" && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) { event.preventDefault(); setRotation((current) => ({ yaw: current.yaw + (event.key === "ArrowLeft" ? -.12 : event.key === "ArrowRight" ? .12 : 0), pitch: Math.max(-1.15, Math.min(.15, current.pitch + (event.key === "ArrowUp" ? -.08 : event.key === "ArrowDown" ? .08 : 0))) })); } }}
        />
        <span className="shape-canvas-stat" data-testid="shape-canvas-stat">{(blueprint.is3d ? blueprint.totalBlocks : blueprint.currentBlocks).toLocaleString()} blocks</span>
      </div>
      {mode === "2d" && <p className="shape-coordinate-readout" aria-live="polite">{hover ? `X ${hover.x} · Y ${blueprint.is3d ? blueprint.layer - 1 : 0} · Z ${hover.z} · ${hover.filled ? "Block" : "Empty"}` : "Point at the grid to inspect relative coordinates"}</p>}
    </div>
  );
}
