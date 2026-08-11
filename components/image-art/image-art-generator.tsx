"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type DragEvent } from "react";
import { convertRasterToBlocks, resizeRasterImage } from "@/lib/image-art/convert-image-art";
import { downloadImageArtPng, drawImageArt } from "@/lib/image-art/export-image-art-png";
import type { ImageArtMode, ImageArtResult, ImageFit, RasterImage } from "@/lib/image-art/image-art-types";
import type { GradientPalette } from "@/lib/gradient/gradient-types";

const MAP_SIZES = [
  { value: "1x1", label: "1 × 1 map", width: 128, height: 128 },
  { value: "2x1", label: "2 × 1 maps", width: 256, height: 128 },
  { value: "1x2", label: "1 × 2 maps", width: 128, height: 256 },
  { value: "2x2", label: "2 × 2 maps", width: 256, height: 256 },
];

export function ImageArtGenerator({ mode }: { mode: ImageArtMode }) {
  const [source, setSource] = useState<RasterImage | null>(null);
  const [sourceName, setSourceName] = useState("");
  const [pixelSize, setPixelSize] = useState(48);
  const [mapSize, setMapSize] = useState("1x1");
  const [palette, setPalette] = useState<GradientPalette>("common");
  const [fit, setFit] = useState<ImageFit>(mode === "map" ? "cover" : "contain");
  const [dither, setDither] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [transparentPixels, setTransparentPixels] = useState(mode === "pixel");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toastTimer = useRef<number | null>(null);

  const showStatus = useCallback((message: string) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 2800);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const targetSize = useMemo(() => {
    if (mode === "map") {
      return MAP_SIZES.find((size) => size.value === mapSize) ?? MAP_SIZES[0];
    }
    if (!source) return { width: pixelSize, height: pixelSize };
    const scale = pixelSize / Math.max(source.width, source.height);
    return {
      width: Math.max(1, Math.round(source.width * scale)),
      height: Math.max(1, Math.round(source.height * scale)),
    };
  }, [mapSize, mode, pixelSize, source]);

  const result = useMemo<ImageArtResult | null>(() => {
    if (!source) return null;
    const resized = resizeRasterImage(source, targetSize.width, targetSize.height, fit);
    return convertRasterToBlocks({
      raster: resized,
      mode,
      palette,
      dither,
      backgroundColor,
      transparentPixels: mode === "pixel" && transparentPixels,
    });
  }, [backgroundColor, dither, fit, mode, palette, source, targetSize.height, targetSize.width, transparentPixels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !result) return;
    const cell = Math.max(2, Math.min(12, Math.floor(900 / Math.max(result.width, result.height))));
    canvas.width = result.width * cell;
    canvas.height = result.height * cell;
    context.imageSmoothingEnabled = false;
    drawImageArt(context, result, cell, showGrid, mode);
  }, [mode, result, showGrid]);

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showStatus("Choose a PNG, JPG, WebP, or GIF image");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      showStatus("The image must be smaller than 20 MB");
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const maxDimension = 1024;
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        URL.revokeObjectURL(url);
        showStatus("This browser could not read the image");
        return;
      }
      context.drawImage(image, 0, 0, width, height);
      const imageData = context.getImageData(0, 0, width, height);
      setSource({ width, height, data: imageData.data });
      setSourceName(file.name);
      URL.revokeObjectURL(url);
      showStatus("Image converted locally");
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      showStatus("The image could not be opened");
    };
    image.src = url;
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) loadFile(file);
  };

  const copyMaterials = async () => {
    if (!result) return;
    const text = result.materials
      .map(({ block, count }) => `${block.name}: ${count} (${Math.ceil(count / 64)} stacks)`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      showStatus("Material list copied");
    } catch {
      showStatus("Copy failed — download the blueprint instead");
    }
  };

  const download = () => {
    if (!result) return;
    try {
      downloadImageArtPng(result, mode, showGrid);
      showStatus("PNG downloaded");
    } catch {
      showStatus("The PNG could not be created");
    }
  };

  const title = mode === "map" ? "Map art preview" : "Pixel art preview";
  return (
    <div className="generator-shell creative-generator image-art-generator" id="generator">
      <div className="creative-workbench">
        <section className="creative-preview image-art-preview" aria-labelledby="image-art-preview-title">
          <div className="creative-preview-heading">
            <div>
              <p className="section-label">LOCAL IMAGE CONVERTER</p>
              <h2 id="image-art-preview-title">{title}</h2>
            </div>
            {result && <span>{result.width} × {result.height} blocks</span>}
          </div>

          {result ? (
            <>
              <div className="image-art-canvas-board">
                <canvas ref={canvasRef} aria-label={`Generated Minecraft ${mode} art preview`} />
              </div>
              <div className="image-material-heading">
                <strong>Material preview</strong>
                <span>{result.materials.length} block types</span>
              </div>
              <ul className="image-material-list">
                {result.materials.slice(0, 12).map(({ block, count }) => (
                  <li key={block.id}>
                    <span style={{ backgroundColor: block.hex }} aria-hidden="true" />
                    <strong>{block.name}</strong>
                    <small>{count.toLocaleString()}</small>
                  </li>
                ))}
              </ul>
              {result.materials.length > 12 && (
                <p className="creative-preview-note">Copy the material list to get all {result.materials.length} block types.</p>
              )}
            </>
          ) : (
            <div
              className={`image-upload-empty ${dragging ? "is-dragging" : ""}`}
              onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <span aria-hidden="true">▦</span>
              <strong>Drop an image here</strong>
              <p>PNG, JPG, WebP, or GIF · processed only in your browser</p>
              <button type="button" className="primary-button" onClick={() => inputRef.current?.click()}>
                Choose image
              </button>
            </div>
          )}
        </section>

        <aside className="creative-settings" aria-labelledby="image-art-settings-title">
          <h2 id="image-art-settings-title" className="sr-only">Image conversion settings</h2>
          <div className="creative-settings-card">
            <div className="image-file-control">
              <div>
                <span>Source image</span>
                <strong>{sourceName || "No image selected"}</strong>
              </div>
              <button type="button" className="secondary-button" onClick={() => inputRef.current?.click()}>
                {source ? "Replace" : "Upload"}
              </button>
              <input
                ref={inputRef}
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) loadFile(file);
                  event.target.value = "";
                }}
              />
            </div>

            {mode === "pixel" ? (
              <RangeSetting
                id="pixel-art-size"
                label="Longest side"
                value={pixelSize}
                min={16}
                max={128}
                suffix=" blocks"
                onChange={setPixelSize}
              />
            ) : (
              <label className="creative-select-field" htmlFor="map-art-size">
                <span>Map layout</span>
                <select id="map-art-size" value={mapSize} onChange={(event) => setMapSize(event.target.value)}>
                  {MAP_SIZES.map((size) => <option key={size.value} value={size.value}>{size.label} · {size.width}×{size.height}</option>)}
                </select>
              </label>
            )}

            {mode === "pixel" && (
              <label className="creative-select-field" htmlFor="pixel-art-palette">
                <span>Block palette</span>
                <select id="pixel-art-palette" value={palette} onChange={(event) => setPalette(event.target.value as GradientPalette)}>
                  <option value="all">All building blocks</option>
                  <option value="common">Common survival blocks</option>
                  <option value="colorful">Concrete & terracotta</option>
                  <option value="natural">Natural materials</option>
                </select>
              </label>
            )}

            {mode === "map" && (
              <label className="creative-select-field" htmlFor="map-image-fit">
                <span>Image fit</span>
                <select id="map-image-fit" value={fit} onChange={(event) => setFit(event.target.value as ImageFit)}>
                  <option value="contain">Fit entire image</option>
                  <option value="cover">Fill and crop</option>
                </select>
              </label>
            )}

            <div className="creative-color-row single-color">
              <label><span>Empty/background color</span><input type="color" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} /></label>
            </div>

            <label className="simple-toggle-row">
              <span>Color dithering</span>
              <input className="switch-input" type="checkbox" checked={dither} onChange={(event) => setDither(event.target.checked)} />
            </label>
            <label className="simple-toggle-row">
              <span>Grid lines</span>
              <input className="switch-input" type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} />
            </label>
            {mode === "pixel" && (
              <label className="simple-toggle-row">
                <span>Leave transparent pixels empty</span>
                <input className="switch-input" type="checkbox" checked={transparentPixels} onChange={(event) => setTransparentPixels(event.target.checked)} />
              </label>
            )}
          </div>

          <section className="creative-stats" aria-labelledby="image-art-stats-title">
            <h3 id="image-art-stats-title">Blueprint stats</h3>
            <dl>
              <div><dt>Blocks</dt><dd>{result?.blockCount.toLocaleString() ?? "—"}</dd></div>
              <div><dt>Materials</dt><dd>{result?.materials.length ?? "—"}</dd></div>
              <div><dt>Width</dt><dd>{result?.width ?? targetSize.width}</dd></div>
              <div><dt>Height</dt><dd>{result?.height ?? targetSize.height}</dd></div>
            </dl>
          </section>

          <div className="settings-actions creative-actions">
            <button type="button" className="primary-button" disabled={!result} onClick={download}>↓ Download as PNG</button>
            <button type="button" className="secondary-button" disabled={!result} onClick={copyMaterials}>Copy materials</button>
          </div>
          {mode === "map" && (
            <p className="image-art-scope-note">Flat map-art blueprint only. No world file, schematic, or map.dat is generated.</p>
          )}
        </aside>
      </div>
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}

function RangeSetting({
  id,
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  const progress = ((value - min) / (max - min)) * 100;
  return (
    <div className="creative-range-setting">
      <div className="setting-heading">
        <label htmlFor={id}>{label}</label>
        <span className="setting-value">{value}{suffix}</span>
      </div>
      <input
        id={id}
        className="gradient-range"
        type="range"
        min={min}
        max={max}
        value={value}
        style={{ "--range-progress": `${progress}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
