"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { downloadGeometryPng } from "@/lib/geometry/export-geometry-png";
import { generateGeometry, getLayerCount, normalizeSize } from "@/lib/geometry/generate-geometry";
import { serializeGeometryUrl } from "@/lib/geometry/geometry-url-state";
import type { GeometryOptions, GeometryShape } from "@/lib/geometry/geometry-types";
import { GeometryCanvas } from "./geometry-canvas";
import { GeometryControls } from "./geometry-controls";

export function GeometryGenerator({
  shape,
  initialOptions,
}: {
  shape: GeometryShape;
  initialOptions: GeometryOptions;
}) {
  const [options, setOptions] = useState<GeometryOptions>(() => ({
    ...initialOptions,
    mode: initialOptions.mode === "filled" ? "filled" as const : "hollow" as const,
    thickness: 1,
  }));
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);
  const result = useMemo(() => generateGeometry(shape, options), [options, shape]);

  const showStatus = useCallback((message: string) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 3000);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    ["diameter", "width", "height", "mode", "thickness", "layer"].forEach((key) => params.delete(key));
    serializeGeometryUrl(shape, options).forEach((value, key) => params.set(key, value));
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  }, [options, shape]);

  const updateOptions = (updates: Partial<GeometryOptions>) => {
    setOptions((current) => {
      const next = { ...current, ...updates };
      next.mode = next.mode === "filled" ? "filled" : "hollow";
      next.diameter = normalizeSize(next.diameter, shape);
      next.width = normalizeSize(next.width, shape);
      next.height = normalizeSize(next.height, shape);
      next.layer = Math.max(1, Math.min(getLayerCount(shape, next.diameter), next.layer));
      const thicknessBase = shape === "oval" ? Math.min(next.width, next.height) : next.diameter;
      next.thickness = Math.max(1, Math.min(Math.ceil(thicknessBase / 2), Math.round(next.thickness)));
      return next;
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showStatus("Blueprint link copied");
    } catch {
      showStatus("Copy failed — select the URL from your browser");
    }
  };

  const download = async () => {
    try {
      await downloadGeometryPng(result, showGrid);
      showStatus("PNG downloaded");
    } catch {
      showStatus("The PNG could not be created");
    }
  };

  return (
    <div className="generator-shell geometry-generator" id="generator">
      <div className="generator-layout">
        <section className="tool-card canvas-card" aria-labelledby="blueprint-title">
          <h2 id="blueprint-title" className="sr-only">{result.label} blueprint</h2>
          <div className="blueprint-workbench">
            <GeometryCanvas result={result} showGrid={showGrid} zoom={zoom} />
            <aside className="workbench-settings" aria-label="Shape settings panel">
              <GeometryControls
                shape={shape}
                options={options}
                showGrid={showGrid}
                zoom={zoom}
                onChange={updateOptions}
                onShowGridChange={setShowGrid}
                onZoomChange={setZoom}
                onDownload={download}
                onCopyLink={copyLink}
                currentBlocks={result.currentBlocks}
                totalBlocks={result.totalBlocks}
                blueprintWidth={result.width}
                blueprintHeight={result.height}
                layerCount={result.layerCount}
              />
            </aside>
          </div>
        </section>
      </div>
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}
