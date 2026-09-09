"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FORMATTING_CODES, MINECRAFT_COLORS } from "@/lib/minecraft-text/formatting";

type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";
type ExportPreset = "minimessage" | "json" | "css" | "tailwind" | "tailwind3" | "figma" | "codes";
type PaletteMode = "tailwind" | "shades" | "tints" | "tones" | "analogous" | "complementary" | "split" | "triadic";

const EXPORT_PRESETS: Array<{ id: ExportPreset; name: string; description: string }> = [
  { id: "minimessage", name: "MiniMessage", description: "Modern Minecraft plugins" },
  { id: "json", name: "JSON text", description: "Commands and components" },
  { id: "css", name: "CSS variables", description: "Custom properties" },
  { id: "tailwind", name: "Tailwind v4", description: "Theme color variables" },
  { id: "tailwind3", name: "Tailwind v3", description: "Config color object" },
  { id: "figma", name: "Figma", description: "Color token object" },
  { id: "codes", name: "Just the codes", description: "HEX, RGB, HSL, or OKLCH" },
];

function hexToRgb(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function rgbToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const [red, green, blue] = [r, g, b].map((value) => value / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(lightness * 100) };
  const delta = max - min;
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue = max === red ? ((green - blue) / delta) % 6 : max === green ? (blue - red) / delta + 2 : (red - green) / delta + 4;
  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;
  return { h: hue, s: Math.round(saturation * 100), l: Math.round(lightness * 100) };
}

function rgbToOklch(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const linear = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  const red = linear(r);
  const green = linear(g);
  const blue = linear(b);
  const lRoot = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const mRoot = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const sRoot = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  const lightness = 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot;
  const a = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot;
  const bAxis = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot;
  const chroma = Math.sqrt(a * a + bAxis * bAxis);
  const hue = (Math.atan2(bAxis, a) * 180 / Math.PI + 360) % 360;
  return { l: lightness, c: chroma, h: hue };
}

function hslToHex(hue: number, saturation: number, lightness: number) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const sector = ((hue % 360) + 360) % 360 / 60;
  const x = chroma * (1 - Math.abs(sector % 2 - 1));
  const [red, green, blue] = sector < 1 ? [chroma, x, 0] : sector < 2 ? [x, chroma, 0] : sector < 3 ? [0, chroma, x] : sector < 4 ? [0, x, chroma] : sector < 5 ? [x, 0, chroma] : [chroma, 0, x];
  const offset = lightness - chroma / 2;
  const channel = (value: number) => Math.round((value + offset) * 255).toString(16).padStart(2, "0");
  return `#${channel(red)}${channel(green)}${channel(blue)}`.toUpperCase();
}

function mixHex(from: string, to: string, amount: number) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const channel = (start: number, end: number) => Math.round(start + (end - start) * amount).toString(16).padStart(2, "0");
  return `#${channel(a.r, b.r)}${channel(a.g, b.g)}${channel(a.b, b.b)}`.toUpperCase();
}

function makePalette(base: string) {
  return Array.from({ length: 11 }, (_, index) => index <= 5
    ? mixHex("#FFFFFF", base, index / 5)
    : mixHex(base, "#000000", (index - 5) / 5));
}

function makePaletteOptions(base: string) {
  const { h, s, l } = rgbToHsl(base);
  const saturation = s / 100;
  const lightness = l / 100;
  const rotate = (degrees: number) => hslToHex(h + degrees, saturation, lightness);
  return [
    { id: "tailwind" as const, name: "Tailwind", colors: makePalette(base), active: 5 },
    { id: "shades" as const, name: "Shades", colors: Array.from({ length: 11 }, (_, index) => mixHex(base, "#000000", index / 10)), active: 0 },
    { id: "tints" as const, name: "Tints", colors: Array.from({ length: 11 }, (_, index) => mixHex("#FFFFFF", base, index / 10)), active: 10 },
    { id: "tones" as const, name: "Tones", colors: Array.from({ length: 11 }, (_, index) => mixHex(base, "#808080", index / 10)), active: 0 },
    { id: "analogous" as const, name: "Analogous", colors: [rotate(-30), base, rotate(30)], active: 1 },
    { id: "complementary" as const, name: "Complementary", colors: [base, rotate(180)], active: 0 },
    { id: "split" as const, name: "Split complementary", colors: [base, rotate(150), rotate(210)], active: 0 },
    { id: "triadic" as const, name: "Triadic", colors: [base, rotate(120), rotate(240)], active: 0 },
  ];
}

function paletteStep(index: number) {
  return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950][index];
}

function formatColor(hex: string, format: ColorFormat) {
  if (format === "rgb") {
    const { r, g, b } = hexToRgb(hex);
    return `rgb(${r}, ${g}, ${b})`;
  }
  if (format === "hsl") {
    const { h, s, l } = rgbToHsl(hex);
    return `hsl(${h} ${s}% ${l}%)`;
  }
  if (format === "oklch") {
    const { l, c, h } = rgbToOklch(hex);
    return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
  }
  return hex;
}

function exportPalette(palette: string[], preset: ExportPreset, format: ColorFormat, prefix: string) {
  const safePrefix = prefix.trim().replace(/[^a-z0-9-_]/gi, "-") || "minecraft";
  if (preset === "minimessage") return palette.map((color, index) => `<${color}>Palette ${paletteStep(index)}</${color}>`).join("\n");
  if (preset === "json") return JSON.stringify(palette.map((color, index) => ({ text: `Palette ${paletteStep(index)}`, color })), null, 2);
  if (preset === "figma") return JSON.stringify(Object.fromEntries(palette.map((color, index) => [`${safePrefix}/${paletteStep(index)}`, { $type: "color", $value: color }])), null, 2);
  if (preset === "tailwind") return `@theme {\n${palette.map((color, index) => `  --color-${safePrefix}-${paletteStep(index)}: ${formatColor(color, format)};`).join("\n")}\n}`;
  if (preset === "tailwind3") return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        ${JSON.stringify(safePrefix)}: {\n${palette.map((color, index) => `          ${paletteStep(index)}: "${formatColor(color, format)}",`).join("\n")}\n        }\n      }\n    }\n  }\n};`;
  if (preset === "css") return `:root {\n${palette.map((color, index) => `  --${safePrefix}-${paletteStep(index)}: ${formatColor(color, format)};`).join("\n")}\n}`;
  return palette.map((color) => formatColor(color, format)).join("\n");
}

function foregroundFor(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 145 ? "#172019" : "#FFFFFF";
}

export function ColorCodesTool() {
  const [toast, setToast] = useState("");
  const [customColor, setCustomColor] = useState("#94766F");
  const [paletteMode, setPaletteMode] = useState<PaletteMode>("tailwind");
  const [paletteMenuOpen, setPaletteMenuOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportPreset, setExportPreset] = useState<ExportPreset>("minimessage");
  const [colorFormat, setColorFormat] = useState<ColorFormat>("hex");
  const [prefix, setPrefix] = useState("minecraft");
  const timer = useRef<number | null>(null);
  const paletteMenu = useRef<HTMLDivElement | null>(null);
  const exportDialog = useRef<HTMLElement | null>(null);
  const exportBackdrop = useRef<HTMLDivElement | null>(null);
  const exportTrigger = useRef<HTMLButtonElement | null>(null);
  const paletteOptions = useMemo(() => makePaletteOptions(customColor), [customColor]);
  const selectedPalette = paletteOptions.find((option) => option.id === paletteMode) ?? paletteOptions[0];
  const palette = selectedPalette.colors;
  const rgb = useMemo(() => hexToRgb(customColor), [customColor]);
  const hsl = useMemo(() => rgbToHsl(customColor), [customColor]);
  const oklch = useMemo(() => formatColor(customColor, "oklch"), [customColor]);
  const exportValue = useMemo(() => exportPalette(palette, exportPreset, colorFormat, prefix), [colorFormat, exportPreset, palette, prefix]);
  const showsPrefix = !(["minimessage", "json"] as ExportPreset[]).includes(exportPreset);

  const showStatus = useCallback((message: string) => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    setToast(message);
    timer.current = window.setTimeout(() => setToast(""), 2500);
  }, []);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (!exportOpen) return;
    const dialog = exportDialog.current;
    if (!dialog) return;
    const returnFocus = exportTrigger.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background: Array<{ element: Element; inert: boolean }> = [];
    let branch: Element | null = exportBackdrop.current;
    while (branch?.parentElement) {
      for (const sibling of branch.parentElement.children) {
        if (sibling === branch) continue;
        background.push({ element: sibling, inert: sibling.hasAttribute("inert") });
        sibling.setAttribute("inert", "");
      }
      if (branch.parentElement === document.body) break;
      branch = branch.parentElement;
    }
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'))
      .filter((element) => !element.closest("[hidden], [inert]"));
    const first = () => focusable()[0] ?? dialog;
    const containFocus = (event: FocusEvent) => {
      if (!dialog.contains(event.target as Node)) first().focus();
    };
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setExportOpen(false); }
      if (event.key !== "Tab") return;
      const elements = focusable();
      const last = elements.at(-1) ?? dialog;
      if (event.shiftKey && document.activeElement === first()) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first().focus();
      }
    };
    first().focus();
    document.addEventListener("focusin", containFocus);
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", close);
      document.removeEventListener("focusin", containFocus);
      background.forEach(({ element, inert }) => { if (!inert) element.removeAttribute("inert"); });
      returnFocus?.focus();
    };
  }, [exportOpen]);

  useEffect(() => {
    if (!paletteMenuOpen) return;
    const close = (event: PointerEvent) => {
      if (!paletteMenu.current?.contains(event.target as Node)) setPaletteMenuOpen(false);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [paletteMenuOpen]);

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showStatus(`${label} copied`);
    } catch {
      showStatus("Copy failed — select the code manually");
    }
  };

  return (
    <div className="generator-shell color-codes-tool" id="generator">
      <section className="color-reference" aria-labelledby="color-reference-title">
        <div className="compact-color-toolbar" aria-label="Custom RGB palette">
          <label className="compact-color-picker" title="Choose a custom color">
            <input type="color" aria-label="Color" value={customColor} onChange={(event) => setCustomColor(event.target.value.toUpperCase())} />
          </label>
          <dl className="compact-color-values">
            <div><dt>HEX</dt><dd><button type="button" onClick={() => copy(customColor, "HEX color")}>{customColor}</button></dd></div>
            <div><dt>RGB</dt><dd>{rgb.r}, {rgb.g}, {rgb.b}</dd></div>
            <div><dt>HSL</dt><dd>{hsl.h}°, {hsl.s}%, {hsl.l}%</dd></div>
            <div><dt>OKLCH</dt><dd><button type="button" onClick={() => copy(oklch, "OKLCH color")}>{oklch.replace("oklch(", "").replace(")", "")}</button></dd></div>
          </dl>
          <div className="compact-palette-strip" aria-label="Generated color shades">
            {palette.map((color, index) => <button key={`${color}-${index}`} type="button" className={index === selectedPalette.active ? "is-base" : ""} style={{ background: color, color: foregroundFor(color) }} aria-label={`Copy palette color ${color}`} title={`${paletteStep(index)} · ${color}`} onClick={() => copy(color, color)}><code>{color.slice(1)}</code></button>)}
          </div>
          <div className="compact-palette-actions" ref={paletteMenu}>
            <button type="button" className="compact-palette-expand" aria-label="Choose palette type" aria-expanded={paletteMenuOpen} onClick={() => setPaletteMenuOpen((open) => !open)}><span aria-hidden="true" /></button>
            <button ref={exportTrigger} type="button" className="compact-export-button" aria-label="Export color palette" title="Export color palette" onClick={() => setExportOpen(true)}><span aria-hidden="true" /></button>
            {paletteMenuOpen && <div className="compact-palette-menu" role="menu" aria-label="Palette type">
              {paletteOptions.map((option) => <button key={option.id} type="button" role="menuitemradio" aria-checked={paletteMode === option.id} onClick={() => { setPaletteMode(option.id); setPaletteMenuOpen(false); }}><span>{option.name}</span><i>{option.colors.map((color, index) => <b key={`${option.id}-${color}-${index}`} style={{ background: color }} className={index === option.active ? "is-base" : ""} />)}</i></button>)}
            </div>}
          </div>
        </div>

        <div className="color-reference-heading">
          <h2 id="color-reference-title">List of Minecraft Color Codes</h2>
        </div>
        <div className="color-code-table-wrap">
          <table className="color-code-table" aria-label="Minecraft color codes">
            <thead><tr><th scope="col">Color</th><th scope="col">§ code</th><th scope="col">Plugin</th><th scope="col">MOTD</th><th scope="col">HEX</th></tr></thead>
            <tbody>
              {MINECRAFT_COLORS.map((item) => (
                <tr key={item.code}>
                  <th scope="row"><span className="color-table-name"><span className="color-table-swatch" style={{ background: item.hex }} /><strong>{item.name}</strong></span></th>
                  <td><button type="button" className="code-copy-button" aria-label={`Copy ${item.name} section code`} title="Click to copy" onClick={() => copy(`§${item.code}`, `${item.name} § code`)}><code>§{item.code}</code></button></td>
                  <td><button type="button" className="code-copy-button" aria-label={`Copy ${item.name} plugin code`} title="Click to copy" onClick={() => copy(`&${item.code}`, `${item.name} & code`)}><code>&amp;{item.code}</code></button></td>
                  <td><button type="button" className="code-copy-button" aria-label={`Copy ${item.name} MOTD code`} title="Click to copy" onClick={() => copy(`\\u00A7${item.code}`, `${item.name} MOTD code`)}><code>\u00A7{item.code}</code></button></td>
                  <td><button type="button" className="code-copy-button" aria-label={`Copy ${item.name} hex color`} title="Click to copy" onClick={() => copy(item.hex, `${item.name} hex`)}><code>{item.hex}</code></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="format-reference" aria-labelledby="format-reference-title">
        <p className="section-label">TEXT STYLES</p>
        <h2 id="format-reference-title">Formatting codes</h2>
        <div className="color-code-table-wrap">
          <table className="color-code-table format-code-table" aria-label="Minecraft formatting codes">
            <thead><tr><th scope="col">Format</th><th scope="col">§ code</th><th scope="col">Plugin</th><th scope="col">Effect</th></tr></thead>
            <tbody>
              {FORMATTING_CODES.map((format) => (
                <tr key={format.code}>
                  <th scope="row"><strong>{format.name}</strong></th>
                  <td><button type="button" className="code-copy-button" aria-label={`Copy ${format.name} section code`} title="Click to copy" onClick={() => copy(`§${format.code}`, `${format.name} § code`)}><code>§{format.code}</code></button></td>
                  <td><button type="button" className="code-copy-button" aria-label={`Copy ${format.name} plugin code`} title="Click to copy" onClick={() => copy(`&${format.code}`, `${format.name} & code`)}><code>&amp;{format.code}</code></button></td>
                  <td><span className={`format-code-sample is-${format.key}`}>{format.key === "obfuscated" ? "▒▓▒▓" : format.key === "reset" ? "Default" : "Sample"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {exportOpen && (
        <div ref={exportBackdrop} className="palette-export-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setExportOpen(false); }}>
          <section ref={exportDialog} tabIndex={-1} className="palette-export-dialog" role="dialog" aria-modal="true" aria-labelledby="palette-export-title">
            <header className="palette-export-header"><h2 id="palette-export-title">Export color codes</h2><button type="button" aria-label="Close palette export" onClick={() => setExportOpen(false)}>×</button></header>
            <div className="palette-export-body">
              <nav className="palette-export-presets" aria-label="Export use case">
                {EXPORT_PRESETS.map((preset) => <button key={preset.id} type="button" className={exportPreset === preset.id ? "is-active" : ""} aria-pressed={exportPreset === preset.id} onClick={() => setExportPreset(preset.id)}><strong>{preset.name}</strong><span>{preset.description}</span></button>)}
              </nav>
              <div className="palette-export-center">
                <div className="palette-export-tabs" role="tablist" aria-label="Color value format">
                  {(["hex", "rgb", "hsl", "oklch"] as ColorFormat[]).map((format) => <button key={format} type="button" role="tab" aria-selected={colorFormat === format} onClick={() => setColorFormat(format)}>{format.toUpperCase()}</button>)}
                </div>
                <div className="palette-export-swatches" aria-label="Exported palette colors">
                  {palette.map((color, index) => <button key={`${color}-export-${index}`} type="button" style={{ background: color, color: foregroundFor(color) }} aria-label={`Copy ${formatColor(color, colorFormat)}`} onClick={() => copy(formatColor(color, colorFormat), color)}><span>{paletteStep(index)}</span><code>{formatColor(color, colorFormat)}</code><i className="copy-glyph" aria-hidden="true" /></button>)}
                </div>
              </div>
              <div className={`palette-export-output${showsPrefix ? " has-prefix" : ""}`}>
                {showsPrefix && <label><span>Prefix</span><input value={prefix} onChange={(event) => setPrefix(event.target.value)} /></label>}
                <pre tabIndex={0}><code>{exportValue}</code></pre>
                <button type="button" className="primary-button palette-copy-all" onClick={() => copy(exportValue, "Palette")}>Copy codes <i className="copy-glyph" aria-hidden="true" /></button>
              </div>
            </div>
          </section>
        </div>
      )}
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}
