"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { downloadFontPng, paintPixelText } from "@/lib/font/export-font-png";
import { renderPixelText } from "@/lib/font/pixel-font";

export function FontGenerator() {
  const [text, setText] = useState("MINE\nCRAFT");
  const [mainColor, setMainColor] = useState("#f2c94c");
  const [shadowColor, setShadowColor] = useState("#7a5327");
  const [backgroundColor, setBackgroundColor] = useState("#26352c");
  const [blockSize, setBlockSize] = useState(12);
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [lineSpacing, setLineSpacing] = useState(2);
  const [shadow, setShadow] = useState(true);
  const [transparent, setTransparent] = useState(true);
  const [toast, setToast] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toastTimer = useRef<number | null>(null);
  const result = useMemo(
    () => renderPixelText({ text, letterSpacing, lineSpacing, shadow }),
    [letterSpacing, lineSpacing, shadow, text],
  );

  const showStatus = useCallback((message: string) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const previewBlock = blockSize;
    const padding = previewBlock * 2;
    canvas.width = result.width * previewBlock + padding * 2;
    canvas.height = result.height * previewBlock + padding * 2;
    context.imageSmoothingEnabled = false;
    paintPixelText(context, result, {
      blockSize: previewBlock,
      mainColor,
      shadowColor,
      backgroundColor,
      transparent,
    }, padding);
  }, [backgroundColor, blockSize, mainColor, result, shadowColor, transparent]);

  const copyBlueprint = async () => {
    const plan = result.cells
      .map((row) => row.map((cell) => cell === 1 ? "█" : cell === 2 ? "▒" : "·").join(""))
      .join("\n");
    try {
      await navigator.clipboard.writeText(plan);
      showStatus("Block blueprint copied");
    } catch {
      showStatus("Copy failed — download the PNG instead");
    }
  };

  const download = () => {
    try {
      downloadFontPng(result, { blockSize, mainColor, shadowColor, backgroundColor, transparent });
      showStatus("PNG downloaded");
    } catch {
      showStatus("The PNG could not be created");
    }
  };

  return (
    <div className="generator-shell creative-generator font-generator" id="generator">
      <div className="creative-workbench">
        <section className="creative-preview font-preview" aria-labelledby="font-preview-title">
          <div className="creative-preview-heading">
            <div>
              <p className="section-label">LIVE PIXEL PREVIEW</p>
              <h2 id="font-preview-title">Your block text</h2>
            </div>
            <span>{result.width} × {result.height} blocks</span>
          </div>
          <div className={`font-canvas-board ${transparent ? "is-transparent" : ""}`}>
            <div className="font-canvas-stage">
              <canvas ref={canvasRef} aria-label="Generated Minecraft pixel text preview" />
            </div>
          </div>
          <p className="creative-preview-note">
            Builder 5×7 is an original block alphabet designed for clear in-game signs and wall text.
          </p>
        </section>

        <aside className="creative-settings" aria-labelledby="font-settings-title">
          <h2 id="font-settings-title" className="sr-only">Font settings</h2>
          <div className="creative-settings-card">
            <div className="creative-text-field">
              <label htmlFor="font-text">Your text</label>
              <textarea
                id="font-text"
                rows={3}
                maxLength={80}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Type up to three lines"
              />
              <small>{text.length}/80 characters</small>
            </div>

            <div className="creative-color-row">
              <label><span>Text</span><input type="color" value={mainColor} onChange={(event) => setMainColor(event.target.value)} /></label>
              <label><span>Shadow</span><input type="color" value={shadowColor} onChange={(event) => setShadowColor(event.target.value)} /></label>
              <label><span>Background</span><input type="color" value={backgroundColor} disabled={transparent} onChange={(event) => setBackgroundColor(event.target.value)} /></label>
            </div>

            <RangeSetting id="font-block-size" label="Pixel block size" value={blockSize} min={4} max={24} suffix="px" onChange={setBlockSize} />
            <RangeSetting id="font-letter-spacing" label="Letter spacing" value={letterSpacing} min={0} max={3} suffix=" blocks" onChange={setLetterSpacing} />
            <RangeSetting
              id="font-line-spacing"
              label="Line spacing"
              value={lineSpacing}
              min={0}
              max={12}
              suffix=" blocks"
              hint="Adds space between text lines"
              onChange={setLineSpacing}
            />

            <label className="simple-toggle-row">
              <span>Block shadow</span>
              <input className="switch-input" type="checkbox" checked={shadow} onChange={(event) => setShadow(event.target.checked)} />
            </label>
            <label className="simple-toggle-row">
              <span>Transparent background</span>
              <input className="switch-input" type="checkbox" checked={transparent} onChange={(event) => setTransparent(event.target.checked)} />
            </label>
          </div>

          <section className="creative-stats" aria-labelledby="font-stats-title">
            <h3 id="font-stats-title">Blueprint stats</h3>
            <dl>
              <div><dt>Text blocks</dt><dd>{result.mainBlocks}</dd></div>
              <div><dt>Shadow blocks</dt><dd>{result.shadowBlocks}</dd></div>
              <div><dt>Width</dt><dd>{result.width}</dd></div>
              <div><dt>Height</dt><dd>{result.height}</dd></div>
            </dl>
          </section>

          <div className="settings-actions creative-actions">
            <button type="button" className="primary-button" onClick={download}>↓ Download as PNG</button>
            <button type="button" className="secondary-button" onClick={copyBlueprint}>Copy blueprint</button>
          </div>
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
  hint,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  hint?: string;
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
      {hint && <small className="creative-range-hint">{hint}</small>}
    </div>
  );
}
