"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import {
  getLayerCount,
  maxSizeForShape,
  MIN_GEOMETRY_SIZE,
} from "@/lib/geometry/generate-geometry";
import type { GeometryOptions, GeometryShape } from "@/lib/geometry/geometry-types";

const SHAPES: Array<{ shape: GeometryShape; href: string; icon: string; label: string }> = [
  { shape: "circle", href: "/#generator", icon: "○", label: "Circle" },
  { shape: "oval", href: "/oval-generator#generator", icon: "↗", label: "Oval" },
  { shape: "sphere", href: "/sphere-generator#generator", icon: "◎", label: "Sphere" },
  { shape: "dome", href: "/dome-generator#generator", icon: "⌒", label: "Dome" },
];

interface DimensionControlProps {
  id: string;
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

function DimensionControl({ id, label, value, max, onChange }: DimensionControlProps) {
  const progress = ((value - MIN_GEOMETRY_SIZE) / (max - MIN_GEOMETRY_SIZE)) * 100;
  return (
    <div className="simple-range-setting">
      <div className="setting-heading">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          className="setting-number-input"
          type="number"
          inputMode="numeric"
          min={MIN_GEOMETRY_SIZE}
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
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
      <nav className="settings-shape-tabs" aria-label="Shape generators">
        {SHAPES.map((item) => (
          <Link
            key={item.shape}
            href={item.href}
            className={shape === item.shape ? "is-active" : ""}
            aria-current={shape === item.shape ? "page" : undefined}
          >
            <span aria-hidden="true">{item.icon}</span>
            <strong>{item.label}</strong>
          </Link>
        ))}
      </nav>

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
            <dt>Size</dt>
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
