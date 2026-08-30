"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  getLayerCount,
  maxSizeForShape,
  MIN_GEOMETRY_SIZE,
} from "@/lib/geometry/generate-geometry";
import type { GeometryOptions, GeometryShape } from "@/lib/geometry/geometry-types";

const SHAPES: Array<{ shape: GeometryShape; icon: string; label: string }> = [
  { shape: "circle", icon: "○", label: "Circle" },
  { shape: "oval", icon: "↗", label: "Oval" },
  { shape: "sphere", icon: "◎", label: "Sphere" },
  { shape: "dome", icon: "⌒", label: "Dome" },
];

interface DimensionControlProps {
  id: string;
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

function DimensionControl({ id, label, value, max, onChange }: DimensionControlProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);
  const [draftState, setDraftState] = useState({ value, draft: String(value) });
  const draft = draftState.value === value ? draftState.draft : String(value);
  const progress = ((value - MIN_GEOMETRY_SIZE) / (max - MIN_GEOMETRY_SIZE)) * 100;

  const adjustValue = useCallback((direction: 1 | -1) => {
    const parsed = Number(draft);
    const current = draft.trim() !== "" && Number.isFinite(parsed)
      ? Math.round(parsed)
      : value;
    const next = Math.max(
      MIN_GEOMETRY_SIZE,
      Math.min(max, current + direction),
    );
    setDraftState({ value, draft: String(next) });
    if (next !== current) onChange(next);
  }, [draft, max, onChange, value]);

  useEffect(() => {
    const stepper = stepperRef.current;
    const input = inputRef.current;
    if (!stepper || !input) return;
    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;
      event.preventDefault();
      input.focus({ preventScroll: true });
      adjustValue(event.deltaY < 0 ? 1 : -1);
    };
    stepper.addEventListener("wheel", handleWheel, { passive: false });
    return () => stepper.removeEventListener("wheel", handleWheel);
  }, [adjustValue]);

  const commitDraft = () => {
    const parsed = Number(draft);
    const next = Number.isFinite(parsed)
      ? Math.max(MIN_GEOMETRY_SIZE, Math.min(max, Math.round(parsed)))
      : value;
    setDraftState({ value: next, draft: String(next) });
    if (next !== value) onChange(next);
  };

  return (
    <div className="simple-range-setting">
      <div className="setting-heading">
        <label htmlFor={id}>{label}</label>
        <div ref={stepperRef} className="setting-number-stepper">
          <input
            ref={inputRef}
            id={id}
            className="setting-number-input"
            type="number"
            inputMode="numeric"
            min={MIN_GEOMETRY_SIZE}
            max={max}
            value={draft}
            onChange={(event) => {
              const nextDraft = event.target.value;
              setDraftState({ value, draft: nextDraft });
              if (nextDraft.trim() === "") return;
              const parsed = Number(nextDraft);
              if (
                Number.isFinite(parsed)
                && parsed >= MIN_GEOMETRY_SIZE
                && parsed <= max
              ) {
                onChange(Math.round(parsed));
              }
            }}
            onBlur={commitDraft}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
          />
          <span className="setting-number-stepper-buttons">
            <button
              type="button"
              aria-label={`Increase ${label}`}
              disabled={value >= max}
              onClick={() => adjustValue(1)}
            >
              <span aria-hidden="true">▲</span>
            </button>
            <button
              type="button"
              aria-label={`Decrease ${label}`}
              disabled={value <= MIN_GEOMETRY_SIZE}
              onClick={() => adjustValue(-1)}
            >
              <span aria-hidden="true">▼</span>
            </button>
          </span>
        </div>
      </div>
      <input
        className="range-control simple-range"
        aria-label={`${label} slider`}
        type="range"
        min={MIN_GEOMETRY_SIZE}
        max={max}
        value={value}
        style={{ "--range-progress": `${progress}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

interface GeometryControlsProps {
  shape: GeometryShape;
  options: GeometryOptions;
  showGrid: boolean;
  zoom: number;
  onShapeChange: (shape: GeometryShape) => void;
  onChange: (updates: Partial<GeometryOptions>) => void;
  onShowGridChange: (show: boolean) => void;
  onZoomChange: (zoom: number) => void;
  onDownload: () => void;
  onCopyLink: () => void;
  currentBlocks: number;
  totalBlocks: number;
  blueprintWidth: number;
  blueprintHeight: number;
  layerCount: number;
}

export function GeometryControls({
  shape,
  options,
  showGrid,
  zoom,
  onShapeChange,
  onChange,
  onShowGridChange,
  onZoomChange,
  onDownload,
  onCopyLink,
  currentBlocks,
  totalBlocks,
  blueprintWidth,
  blueprintHeight,
  layerCount: resultLayerCount,
}: GeometryControlsProps) {
  const max = maxSizeForShape(shape);
  const volume = shape === "sphere" || shape === "dome";
  const layerCount = getLayerCount(shape, options.diameter);

  return (
    <section className="controls-card blueprint-settings" aria-labelledby="controls-title">
      <h2 id="controls-title" className="sr-only">Shape settings</h2>
      <div className="settings-shape-tabs" role="group" aria-label="Shape generators">
        {SHAPES.map((item) => (
          <button
            type="button"
            key={item.shape}
            className={shape === item.shape ? "is-active" : ""}
            aria-pressed={shape === item.shape}
            onClick={() => onShapeChange(item.shape)}
          >
            <span aria-hidden="true">{item.icon}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </div>

      <div className="simple-settings-card">
        {shape === "oval" ? (
          <>
            <DimensionControl
              id="width"
              label="Width"
              value={options.width}
              max={max}
              onChange={(width) => onChange({ width })}
            />
            <DimensionControl
              id="height"
              label="Height"
              value={options.height}
              max={max}
              onChange={(height) => onChange({ height })}
            />
          </>
        ) : (
          <DimensionControl
            id="diameter"
            label="Diameter"
            value={options.diameter}
            max={max}
            onChange={(diameter) => onChange({ diameter, layer: 1 })}
          />
        )}

        {volume && (
          <div className="simple-range-setting">
            <div className="setting-heading">
              <label htmlFor="layer">Layer {options.layer} / {layerCount}</label>
              <span className="setting-value">Y={options.layer - 1}</span>
            </div>
            <input
              id="layer"
              className="range-control simple-range"
              aria-label="Layer slider"
              type="range"
              min={1}
              max={layerCount}
              value={Math.min(options.layer, layerCount)}
              style={{ "--range-progress": `${layerCount <= 1 ? 0 : ((options.layer - 1) / (layerCount - 1)) * 100}%` } as CSSProperties}
              onChange={(event) => onChange({ layer: Number(event.target.value) })}
            />
            <p className="geometry-layer-note">
              {shape === "dome"
                ? "The canvas combines the full roof footprint. Use the slider to highlight one horizontal building layer."
                : "Each preview is one horizontal layer. Build from the bottom layer to the matching top layer."}
            </p>
          </div>
        )}

        <label className="simple-toggle-row">
          <span>Filled</span>
          <input
            className="switch-input"
            type="checkbox"
            checked={options.mode === "filled"}
            onChange={(event) => onChange({ mode: event.target.checked ? "filled" : "hollow", thickness: 1 })}
          />
        </label>

        <label className="simple-toggle-row">
          <span>Grid Lines</span>
          <input
            className="switch-input"
            type="checkbox"
            checked={showGrid}
            onChange={(event) => onShowGridChange(event.target.checked)}
          />
        </label>

        <div className="simple-range-setting zoom-setting">
          <div className="setting-heading">
            <label htmlFor="blueprint-zoom">Zoom</label>
            <span className="setting-value">{Math.round(zoom * 100)}%</span>
          </div>
          <input
            id="blueprint-zoom"
            className="range-control simple-range"
            aria-label="Zoom slider"
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={zoom}
            style={{ "--range-progress": `${((zoom - 0.5) / 2.5) * 100}%` } as CSSProperties}
            onChange={(event) => onZoomChange(Number(event.target.value))}
          />
        </div>
      </div>

      <section className="geometry-stats-card" aria-labelledby="geometry-stats-title">
        <h3 id="geometry-stats-title">Stats</h3>
        <dl>
          <div>
            <dt>{resultLayerCount > 1 ? "Current layer" : "Blocks"}</dt>
            <dd>{currentBlocks.toLocaleString()}</dd>
          </div>
          {resultLayerCount > 1 && (
            <div>
              <dt>Total blocks</dt>
              <dd>{totalBlocks.toLocaleString()}</dd>
            </div>
          )}
          <div>
            <dt>{volume ? "Layer grid" : "Size"}</dt>
            <dd>{blueprintWidth} × {blueprintHeight}</dd>
          </div>
        </dl>
      </section>

      <div className="settings-actions">
        <button type="button" className="primary-button" onClick={onDownload}>
          ↓ Download as PNG
        </button>
        <button type="button" className="secondary-button" onClick={onCopyLink}>
          Copy link
        </button>
      </div>
    </section>
  );
}
