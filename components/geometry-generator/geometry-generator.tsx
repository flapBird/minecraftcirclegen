"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { downloadGeometryPng } from "@/lib/geometry/export-geometry-png";
import { generateGeometry, getLayerCount, normalizeSize } from "@/lib/geometry/generate-geometry";
import {
  parseGeometryShape,
  parseGeometryUrl,
  serializeGeometryUrl,
} from "@/lib/geometry/geometry-url-state";
import type { GeometryOptions, GeometryShape } from "@/lib/geometry/geometry-types";
import { SITE_NAVIGATION_EVENT } from "@/lib/site/navigation-events";
import { GeometryCanvas } from "./geometry-canvas";
import { GeometryControls } from "./geometry-controls";

function normalizeInitialOptions(initialOptions: GeometryOptions): GeometryOptions {
  return {
    ...initialOptions,
    mode: initialOptions.mode === "filled" ? "filled" : "hollow",
    thickness: 1,
  };
}

export function GeometryGenerator({
  shape: initialShape,
  canonicalShape = initialShape,
  initialOptions,
}: {
  shape: GeometryShape;
  canonicalShape?: GeometryShape;
  initialOptions: GeometryOptions;
}) {
  const [shape, setShape] = useState<GeometryShape>(initialShape);
  const [options, setOptions] = useState<GeometryOptions>(() => normalizeInitialOptions(initialOptions));
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);
  const previewOptions = useDeferredValue(options);
  const previewZoom = useDeferredValue(zoom);
  const result = useMemo(
    () => generateGeometry(shape, previewOptions),
    [previewOptions, shape],
  );

  const showStatus = useCallback((message: string) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 3000);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    const restoreUrlState = () => {
      const nextShape = parseGeometryShape(window.location.search, canonicalShape);
      const nextOptions = parseGeometryUrl(nextShape, window.location.search);
      setShape(nextShape);
      setOptions(normalizeInitialOptions(nextOptions));
    };
    window.addEventListener(SITE_NAVIGATION_EVENT, restoreUrlState);
    window.addEventListener("popstate", restoreUrlState);
    return () => {
      window.removeEventListener(SITE_NAVIGATION_EVENT, restoreUrlState);
      window.removeEventListener("popstate", restoreUrlState);
    };
  }, [canonicalShape]);

  const currentShareUrl = useCallback(() => {
    const url = new URL(window.location.href);
    ["shape", "diameter", "width", "height", "mode", "thickness", "layer"].forEach((key) => url.searchParams.delete(key));
    if (shape !== canonicalShape) url.searchParams.set("shape", shape);
    serializeGeometryUrl(shape, options).forEach((value, key) => url.searchParams.set(key, value));
    return url;
  }, [canonicalShape, options, shape]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.history.replaceState(null, "", currentShareUrl());
    }, 120);
    return () => window.clearTimeout(timer);
  }, [currentShareUrl]);

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

  const changeShape = (nextShape: GeometryShape) => {
    if (nextShape === shape) return;
    setOptions((current) => {
      const fromOval = shape === "oval";
      const nextDiameter = normalizeSize(fromOval ? current.width : current.diameter, nextShape);
      const nextWidth = normalizeSize(current.width, nextShape);
      const nextHeight = normalizeSize(current.height, nextShape);
      const nextMode = current.mode === "filled" ? "filled" as const : "hollow" as const;
      return {
        ...current,
        diameter: nextDiameter,
        width: nextWidth,
        height: nextHeight,
        mode: nextMode,
        thickness: 1,
        layer: 1,
      };
    });
    setShape(nextShape);
  };

  const copyLink = async () => {
    try {
      const url = currentShareUrl();
      window.history.replaceState(null, "", url);
      await navigator.clipboard.writeText(url.toString());
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
            <GeometryCanvas result={result} showGrid={showGrid} zoom={previewZoom} />
            <aside className="workbench-settings" aria-label="Shape settings panel">
              <GeometryControls
                shape={shape}
                options={options}
                showGrid={showGrid}
                zoom={zoom}
                onShapeChange={changeShape}
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
