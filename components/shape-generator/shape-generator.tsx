"use client";

import Link from "next/link";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  SHAPE_LABELS,
  THREE_D_SHAPES,
  generateShapeLayers,
  normalizeShapeOptions,
  shapeCoordinates,
  type ShapeOptions,
  type UniversalShape,
} from "@/lib/shape/generate-shape";
import { ShapeCanvas } from "./shape-canvas";

const DEFAULT_OPTIONS: ShapeOptions = { shape: "sphere", width: 21, height: 15, depth: 21, sides: 6, thickness: 1, filled: false, layer: 11 };
const TWO_D: UniversalShape[] = ["circle", "ellipse", "triangle", "rectangle", "polygon", "star"];
const THREE_D: UniversalShape[] = ["sphere", "dome", "cylinder", "cone", "pyramid"];

function NumberControl({ label, value, min = 3, max, onChange }: { label: string; value: number; min?: number; max: number; onChange: (value: number) => void }) {
  const progress = ((value - min) / Math.max(1, max - min)) * 100;
  const id = `shape-${label.toLowerCase().replaceAll(" ", "-")}`;
  const [draftState, setDraftState] = useState({ value, draft: String(value) });
  const draft = draftState.value === value ? draftState.draft : String(value);

  const commitDraft = () => {
    const parsed = Number(draft);
    const next = Number.isFinite(parsed)
      ? Math.max(min, Math.min(max, Math.round(parsed)))
      : value;
    setDraftState({ value: next, draft: String(next) });
    if (next !== value) onChange(next);
  };

  return (
    <div className="shape-number-control">
      <div>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={draft}
          onChange={(event) => {
            const nextDraft = event.target.value;
            setDraftState({ value, draft: nextDraft });
            if (nextDraft.trim() === "") return;
            const parsed = Number(nextDraft);
            if (Number.isFinite(parsed) && parsed >= min && parsed <= max) {
              onChange(Math.round(parsed));
            }
          }}
          onBlur={commitDraft}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
        />
      </div>
      <input
        type="range"
        aria-label={`${label} slider`}
        min={min}
        max={max}
        value={value}
        style={{ "--range-progress": `${progress}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

export function ShapeGenerator() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [showGrid, setShowGrid] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d");
  const [autoRotate, setAutoRotate] = useState(false);
  const [toast, setToast] = useState("");
  const timer = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLElement>(null);
  const [nativeFullscreenActive, setNativeFullscreenActive] = useState(false);
  const [fallbackFullscreen, setFallbackFullscreen] = useState(false);
  const normalized = useMemo(() => normalizeShapeOptions(options), [options]);
  const previewOptions = useDeferredValue(normalized);
  const previewZoom = useDeferredValue(zoom);
  const layers = useMemo(() => generateShapeLayers(previewOptions), [previewOptions]);
  const blueprint = layers[Math.max(0, previewOptions.layer - 1)] ?? layers[0];
  const is3d = THREE_D_SHAPES.includes(normalized.shape);
  const hasHeight = ["ellipse", "triangle", "rectangle", "polygon", "star", "cylinder", "cone", "pyramid"].includes(normalized.shape);
  const supportsThickness = !["sphere", "dome"].includes(normalized.shape);
  const isFullscreen = nativeFullscreenActive || fallbackFullscreen;

  const showStatus = useCallback((message: string) => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    setToast(message);
    timer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);

  useEffect(() => {
    const updateFullscreen = () => {
      setNativeFullscreenActive(document.fullscreenElement === previewRef.current);
    };
    const timer = window.setTimeout(updateFullscreen, 0);
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("fullscreenchange", updateFullscreen);
    };
  }, []);

  useEffect(() => {
    if (!fallbackFullscreen) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFallbackFullscreen(false);
    };
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", exitOnEscape);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      document.removeEventListener("keydown", exitOnEscape);
    };
  }, [fallbackFullscreen]);

  const update = (partial: Partial<ShapeOptions>) => setOptions((current) => normalizeShapeOptions({ ...current, ...partial }));

  const copyCoordinates = async () => {
    const text = shapeCoordinates(blueprint).map(({ x, y, z }) => `${x}, ${y}, ${z}`).join("\n");
    try { await navigator.clipboard.writeText(text); showStatus(`${blueprint.currentBlocks.toLocaleString()} coordinates copied`); }
    catch { showStatus("Copy failed — clipboard access was unavailable"); }
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return showStatus("The PNG could not be created");
      const link = document.createElement("a");
      link.download = `minecraft-${normalized.shape}-layer-${blueprint.layer}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      showStatus("Blueprint PNG downloaded");
    }, "image/png");
  };

  const toggleFullscreen = async () => {
    const preview = previewRef.current;
    if (!preview) return;
    if (fallbackFullscreen) {
      setFallbackFullscreen(false);
      return;
    }
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (document.fullscreenEnabled && typeof preview.requestFullscreen === "function") {
      try {
        await preview.requestFullscreen();
        return;
      } catch {
        // Some mobile browsers expose the API but reject non-video elements.
      }
    }
    setFallbackFullscreen(true);
  };

  return (
    <div className="generator-shell universal-shape-generator" id="generator">
      <div className="shape-workbench">
        <section ref={previewRef} className={`shape-preview-card${fallbackFullscreen ? " is-fallback-fullscreen" : ""}`} aria-label="Shape preview">
          <div className="shape-view-toolbar">
            <p className="shape-view-tip">{is3d && viewMode === "3d" ? `Drag to rotate · Scroll to zoom · Layer ${blueprint.layer} highlighted` : "Point at the grid to inspect relative coordinates"}</p>
            <div className="shape-toolbar-controls" role="group" aria-label="Shape preview controls">
              <div className="shape-view-tabs" role="tablist" aria-label="Shape preview mode">
                <button type="button" role="tab" aria-selected={is3d && viewMode === "3d"} disabled={!is3d} onClick={() => setViewMode("3d")}>3D</button>
                <button type="button" role="tab" aria-selected={!is3d || viewMode === "2d"} onClick={() => { setViewMode("2d"); setAutoRotate(false); }}>2D Layers</button>
              </div>
              <button type="button" className="shape-auto-rotate" aria-pressed={autoRotate} disabled={!is3d || viewMode !== "3d"} onClick={() => setAutoRotate((current) => !current)}><span aria-hidden="true">{autoRotate ? "Ⅱ" : "▶"}</span>{autoRotate ? "Pause" : "Auto rotate"}</button>
              <div className="shape-zoom-controls"><button type="button" aria-label="Zoom out" onClick={() => setZoom((current) => Math.max(.5, current - .1))}>−</button><span>{Math.round(zoom * 100)}%</span><button type="button" aria-label="Zoom in" onClick={() => setZoom((current) => Math.min(2.5, current + .1))}>+</button><button type="button" onClick={() => setZoom(1)}>Fit</button><button type="button" className="shape-fullscreen-button" aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} aria-pressed={isFullscreen} title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} onClick={toggleFullscreen}><span aria-hidden="true">⛶</span></button></div>
            </div>
          </div>
          <ShapeCanvas blueprint={blueprint} layers={layers} mode={is3d ? viewMode : "2d"} showGrid={showGrid} showCoordinates={showCoordinates} zoom={previewZoom} autoRotate={autoRotate} onZoomChange={setZoom} canvasRef={canvasRef} />
        </section>

        <aside className="shape-settings-card" aria-labelledby="shape-settings-title">
          <p className="section-label">SHAPE SETTINGS</p><h2 id="shape-settings-title">Configure the blueprint</h2>
          <label className="shape-select"><span>Shape type</span><select value={normalized.shape} onChange={(event) => { const shape = event.target.value as UniversalShape; const nextIs3d = THREE_D_SHAPES.includes(shape); update({ shape, layer: 1 }); setViewMode(nextIs3d ? "3d" : "2d"); if (!nextIs3d) setAutoRotate(false); }}><optgroup label="2D Shapes">{TWO_D.map((shape) => <option key={shape} value={shape}>{SHAPE_LABELS[shape]}</option>)}</optgroup><optgroup label="3D / Building Shapes">{THREE_D.map((shape) => <option key={shape} value={shape}>{SHAPE_LABELS[shape]}</option>)}</optgroup></select></label>
          <div className="shape-control-stack">
            <NumberControl label={normalized.shape === "circle" || ["sphere", "dome", "cylinder", "cone"].includes(normalized.shape) ? "Diameter" : "Width"} value={normalized.width} max={is3d ? 128 : 256} onChange={(width) => update({ width, layer: 1 })} />
            {hasHeight && <NumberControl label={is3d ? "Build height" : "Height"} value={normalized.height} max={is3d ? 128 : 256} onChange={(height) => update({ height, layer: 1 })} />}
            {normalized.shape === "polygon" && <NumberControl label="Sides" value={normalized.sides} min={3} max={12} onChange={(sides) => update({ sides })} />}
            {!normalized.filled && supportsThickness && <NumberControl label="Thickness" value={normalized.thickness} min={1} max={Math.max(1, Math.floor(Math.min(normalized.width, normalized.height) / 2))} onChange={(thickness) => update({ thickness })} />}
          </div>
          <label className="simple-toggle-row"><span>Filled</span><input className="switch-input" type="checkbox" checked={normalized.filled} onChange={(event) => update({ filled: event.target.checked })} /></label>
          <label className="simple-toggle-row"><span>Grid lines</span><input className="switch-input" type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} /></label>
          <label className="simple-toggle-row"><span>Coordinate labels</span><input className="switch-input" type="checkbox" checked={showCoordinates} onChange={(event) => setShowCoordinates(event.target.checked)} /></label>
          {is3d && <div className="shape-layer-control"><div><strong>Layer / Y level</strong><span>Y {blueprint.layer - 1}</span></div><input type="range" min={1} max={blueprint.layerCount} value={blueprint.layer} onChange={(event) => update({ layer: Number(event.target.value) })} /><div><button type="button" disabled={blueprint.layer <= 1} onClick={() => update({ layer: blueprint.layer - 1 })}>← Previous Layer</button><button type="button" disabled={blueprint.layer >= blueprint.layerCount} onClick={() => update({ layer: blueprint.layer + 1 })}>Next Layer →</button></div></div>}

          <dl className="shape-stats"><div><dt>{is3d ? "Current layer" : "Block count"}</dt><dd>{blueprint.currentBlocks.toLocaleString()}</dd></div>{is3d && <div><dt>Total blocks</dt><dd>{blueprint.totalBlocks.toLocaleString()}</dd></div>}<div><dt>Grid size</dt><dd>{blueprint.width} × {blueprint.height}</dd></div></dl>
          <div className="shape-actions"><button type="button" className="primary-button" onClick={download}>↓ Download current view</button><button type="button" className="secondary-button" onClick={copyCoordinates}>Copy current-layer coordinates</button></div>
        </aside>
      </div>
      <div className="dedicated-shape-links"><span>Need focused controls?</span><Link href="/#generator">Circle Generator</Link><Link href="/oval-generator#generator">Oval Generator</Link><Link href="/sphere-generator#generator">Sphere Generator</Link><Link href="/dome-generator#generator">Dome Generator</Link></div>
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}
