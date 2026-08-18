"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { copyFontPng, downloadFontPng, paintPixelText, type FontExportOptions } from "@/lib/font/export-font-png";
import {
  MINECRAFT_COLORS,
  renderPixelText,
  type PixelTextAlignment,
  type PixelTextStyle,
} from "@/lib/font/pixel-font";

type FillMode = "solid" | "gradient" | "rainbow";
type StyleKey = keyof PixelTextStyle;

const STYLE_CONTROLS: { key: StyleKey; label: string }[] = [
  { key: "bold", label: "Bold" },
  { key: "italic", label: "Italic" },
  { key: "underline", label: "Underline" },
  { key: "strikethrough", label: "Strike" },
];

export function FontGenerator() {
  const [text, setText] = useState("MINE\nCRAFT");
  const [mainColor, setMainColor] = useState("#ffff55");
  const [gradientColor, setGradientColor] = useState("#55ffff");
  const [shadowColor, setShadowColor] = useState("#3f3f15");
  const [outlineColor, setOutlineColor] = useState("#111111");
  const [backgroundColor, setBackgroundColor] = useState("#26352c");
  const [fillMode, setFillMode] = useState<FillMode>("solid");
  const [blockSize, setBlockSize] = useState(12);
  const [padding, setPadding] = useState(2);
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [lineSpacing, setLineSpacing] = useState(2);
  const [shadowDistance, setShadowDistance] = useState(1);
  const [alignment, setAlignment] = useState<PixelTextAlignment>("left");
  const [style, setStyle] = useState<PixelTextStyle>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });
  const [shadow, setShadow] = useState(true);
  const [gameShadow, setGameShadow] = useState(true);
  const [outline, setOutline] = useState(false);
  const [transparent, setTransparent] = useState(true);
  const [toast, setToast] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toastTimer = useRef<number | null>(null);

  const result = useMemo(
    () => renderPixelText({
      text,
      letterSpacing,
      lineSpacing,
      shadow,
      shadowDistance,
      outline,
      alignment,
      style,
    }),
    [alignment, letterSpacing, lineSpacing, outline, shadow, shadowDistance, style, text],
  );

  const exportOptions = useMemo<FontExportOptions>(() => ({
    blockSize,
    mainColor,
    gradientColor,
    fillMode,
    shadowColor,
    gameShadow,
    outlineColor,
    backgroundColor,
    transparent,
    padding,
  }), [backgroundColor, blockSize, fillMode, gameShadow, gradientColor, mainColor, outlineColor, padding, shadowColor, transparent]);

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
    const canvasPadding = blockSize * padding;
    canvas.width = result.width * blockSize + canvasPadding * 2;
    canvas.height = result.height * blockSize + canvasPadding * 2;
    context.imageSmoothingEnabled = false;
    paintPixelText(context, result, exportOptions, canvasPadding);
  }, [blockSize, exportOptions, padding, result]);

  const toggleStyle = (key: StyleKey) => {
    setStyle((current) => ({ ...current, [key]: !current[key] }));
  };

  const copyBlueprint = async () => {
    const plan = result.cells
      .map((row) => row.map((cell) => cell === 1 ? "█" : cell === 2 ? "▒" : cell === 3 ? "▓" : "·").join(""))
      .join("\n");
    try {
      await navigator.clipboard.writeText(plan);
      showStatus("Block blueprint copied");
    } catch {
      showStatus("Copy failed — download the PNG instead");
    }
  };

  const copyImage = async () => {
    try {
      await copyFontPng(result, exportOptions);
      showStatus("PNG copied to clipboard");
    } catch {
      showStatus("PNG copying is not supported in this browser");
    }
  };

  const download = () => {
    try {
      downloadFontPng(result, exportOptions);
      showStatus("PNG downloaded");
    } catch {
      showStatus("The PNG could not be created");
    }
  };

  return (
    <div className="generator-shell creative-generator font-generator" id="generator">
      <div className="creative-workbench font-workbench">
        <aside className="creative-settings font-settings" aria-labelledby="font-settings-title">
          <h2 id="font-settings-title" className="sr-only">Font settings</h2>
          <section className="creative-settings-card font-settings-card font-panel">
            <h3 id="font-text-panel-title" className="font-panel-title">Your text</h3>
            <div className="creative-text-field">
              <label htmlFor="font-text" className="sr-only">Your text</label>
              <textarea
                id="font-text"
                rows={6}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Type or paste text — line breaks supported"
              />
              <small>{text.split(/\r\n?|\n/).length} lines · {text.length} characters</small>
            </div>
            <p className="font-format-hint">
              Inline codes: <code>&amp;a</code> colour, <code>&amp;l</code> bold, <code>&amp;o</code> italic,
              <code>&amp;n</code> underline, <code>&amp;m</code> strike, <code>&amp;k</code> obfuscated, <code>&amp;r</code> reset. <code>§</code> also works.
            </p>
          </section>

          <section className="creative-settings-card font-settings-card font-panel">
            <h3 id="font-colour-panel-title" className="font-panel-title">Colour</h3>
            <div className="font-color-palette" role="group" aria-label="Minecraft colour presets">
              {MINECRAFT_COLORS.map((color) => (
                <button
                  key={color.code}
                  type="button"
                  className={mainColor.toLowerCase() === color.value ? "is-active" : ""}
                  aria-label={`Use ${color.name} (§${color.code})`}
                  title={`${color.name} · §${color.code}`}
                  style={{ "--swatch-color": color.value } as CSSProperties}
                  onClick={() => setMainColor(color.value)}
                />
              ))}
            </div>
            <div className="creative-color-row font-base-colour-inputs">
              <ColorSetting label="Text" value={mainColor} onChange={setMainColor} />
              {fillMode === "gradient" && <ColorSetting label="Gradient end" value={gradientColor} onChange={setGradientColor} />}
            </div>
            <div className="font-subcontrol-label">Fill</div>
            <div className="font-segmented three" role="group" aria-label="Text fill">
              {(["solid", "gradient", "rainbow"] as const).map((mode) => (
                <button key={mode} type="button" aria-pressed={fillMode === mode} onClick={() => setFillMode(mode)}>
                  {mode[0].toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </section>

          <section className="creative-settings-card font-settings-card font-panel">
            <h3 id="font-style-panel-title" className="font-panel-title">Size and style</h3>
            <RangeSetting id="font-block-size" label="Pixel block size" value={blockSize} min={4} max={24} suffix="px" onChange={setBlockSize} />
            <div className="font-subcontrol-label">Text style</div>
            <div className="font-toggle-grid font-style-grid">
              {STYLE_CONTROLS.map((control) => (
                <button key={control.key} type="button" aria-pressed={style[control.key]} onClick={() => toggleStyle(control.key)}>
                  {control.label}
                </button>
              ))}
            </div>
            <div className="font-toggle-grid three font-effect-grid">
              <button type="button" aria-pressed={shadow} onClick={() => setShadow((value) => !value)}>Drop shadow</button>
              <button type="button" aria-pressed={outline} onClick={() => setOutline((value) => !value)}>Outline</button>
              <button type="button" aria-pressed={transparent} onClick={() => setTransparent((value) => !value)}>Transparent bg</button>
            </div>
            {shadow && <RangeSetting id="font-shadow-distance" label="Shadow distance" value={shadowDistance} min={1} max={4} suffix=" blocks" onChange={setShadowDistance} />}
            {shadow && (
              <button
                type="button"
                className="font-shadow-mode-button"
                aria-pressed={gameShadow}
                onClick={() => setGameShadow((value) => !value)}
              >
                Game shadow (25%)
              </button>
            )}
            <div className="creative-color-row font-effect-colours">
              <ColorSetting label="Shadow" value={shadowColor} disabled={!shadow || gameShadow} onChange={setShadowColor} />
              <ColorSetting label="Outline" value={outlineColor} disabled={!outline} onChange={setOutlineColor} />
              <ColorSetting label="Background" value={backgroundColor} disabled={transparent} onChange={setBackgroundColor} />
            </div>
          </section>

          <section className="creative-settings-card font-settings-card font-panel">
            <h3 id="font-spacing-panel-title" className="font-panel-title">Spacing and layout</h3>
            <RangeSetting id="font-padding" label="Padding" value={padding} min={0} max={8} suffix=" blocks" onChange={setPadding} />
            <RangeSetting id="font-letter-spacing" label="Letter spacing" value={letterSpacing} min={0} max={3} suffix=" blocks" onChange={setLetterSpacing} />
            <RangeSetting id="font-line-spacing" label="Line spacing" value={lineSpacing} min={0} max={12} suffix=" blocks" onChange={setLineSpacing} />
            <div className="font-alignment-setting">
              <span>Alignment</span>
              <div className="font-segmented three" role="group" aria-label="Text alignment">
                {(["left", "center", "right"] as const).map((value) => (
                  <button key={value} type="button" aria-pressed={alignment === value} onClick={() => setAlignment(value)}>
                    {value[0].toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <p className="font-layout-hint">Spacing is measured in build blocks and scales with the pixel block size. Alignment applies to multi-line text.</p>
          </section>

          <section className="creative-stats" aria-labelledby="font-stats-title">
            <h3 id="font-stats-title">Blueprint stats</h3>
            <dl>
              <div><dt>Text blocks</dt><dd>{result.mainBlocks}</dd></div>
              <div><dt>Shadow blocks</dt><dd>{result.shadowBlocks}</dd></div>
              <div><dt>Outline blocks</dt><dd>{result.outlineBlocks}</dd></div>
              <div><dt>Size</dt><dd>{result.width} × {result.height}</dd></div>
            </dl>
          </section>
          <button type="button" className="secondary-button font-blueprint-button" onClick={copyBlueprint}>Copy block blueprint</button>
        </aside>

        <div className="font-output-stack">
          <section className="creative-preview font-preview" aria-labelledby="font-preview-title">
            <div className="creative-preview-heading font-preview-heading">
              <h2 id="font-preview-title">Preview</h2>
              <div className="font-preview-actions">
                <button type="button" className="secondary-button" onClick={copyImage}>Copy PNG</button>
                <button type="button" className="primary-button" onClick={download}>↓ Download PNG</button>
              </div>
            </div>
            <div className={`font-canvas-board ${transparent ? "is-transparent" : ""}`}>
              <div className="font-canvas-stage">
                <canvas ref={canvasRef} aria-label="Generated Minecraft pixel text preview" />
              </div>
            </div>
            <p className="creative-preview-note">
              The checkerboard marks transparent areas. Builder 5×7 remains block-for-block buildable in Minecraft.
            </p>
          </section>

          <section className="creative-preview font-colour-codes" aria-labelledby="font-colour-codes-title">
            <h2 id="font-colour-codes-title">Minecraft colour codes</h2>
            <div className="font-code-grid">
              {MINECRAFT_COLORS.map((color) => (
                <button
                  key={color.code}
                  type="button"
                  className={mainColor.toLowerCase() === color.value ? "is-active" : ""}
                  aria-label={`Set text colour to ${color.name} (§${color.code})`}
                  style={{ "--swatch-color": color.value } as CSSProperties}
                  onClick={() => setMainColor(color.value)}
                >
                  <span className="font-code-swatch" aria-hidden="true" />
                  <span>{color.name}</span>
                  <code>§{color.code}</code>
                </button>
              ))}
            </div>
            <p>Click a colour to use it as the base colour, or type its code into your text with § or &amp;.</p>
          </section>
        </div>
      </div>
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}

function ColorSetting({ label, value, disabled, onChange }: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span>{label}</span>
      <input type="color" aria-label={`${label} colour`} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function RangeSetting({ id, label, value, min, max, suffix, hint, onChange }: {
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
