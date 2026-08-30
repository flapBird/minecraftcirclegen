"use client";

import { useMemo, useState } from "react";
import {
  ENCHANTING_TABLE_ALPHABET,
  detectEnchantingTableDirection,
  translateEnchantingTable,
  type EnchantingTranslationDirection,
} from "@/lib/minecraft/enchanting-table";

type DirectionMode = "auto" | EnchantingTranslationDirection;

export function EnchantingTableTranslator({ initialInput = "The secret is in the symbols.", initialDirection = "auto" }: {
  initialInput?: string;
  initialDirection?: DirectionMode;
}) {
  const [directionMode, setDirectionMode] = useState<DirectionMode>(initialDirection);
  const [input, setInput] = useState(initialInput.slice(0, 4000));
  const [status, setStatus] = useState("");
  const detectedDirection = useMemo(() => detectEnchantingTableDirection(input), [input]);
  const direction = directionMode === "auto" ? detectedDirection : directionMode;
  const output = useMemo(() => translateEnchantingTable(input, direction), [direction, input]);
  const inputCount = [...input].length;
  const outputCount = [...output].length;
  const inputLines = input ? input.split("\n").length : 0;

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setStatus("Translation copied");
    } catch {
      setStatus("Copy failed — select the translation manually");
    }
  };

  const swap = () => {
    setInput(output);
    setDirectionMode(direction === "english-to-glyphs" ? "glyphs-to-english" : "english-to-glyphs");
    setStatus("Direction swapped");
  };

  const share = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("text", input);
    url.searchParams.set("direction", directionMode);
    window.history.replaceState(null, "", url);
    try {
      await navigator.clipboard.writeText(url.toString());
      setStatus("Share link copied");
    } catch {
      setStatus("Share link is ready in the address bar");
    }
  };

  const downloadPng = () => {
    if (!output) return;
    const canvas = document.createElement("canvas");
    const width = 1200;
    const padding = 72;
    const lineHeight = 58;
    const context = canvas.getContext("2d");
    if (!context) {
      setStatus("PNG export is not available in this browser");
      return;
    }
    context.font = "38px Georgia, serif";
    const lines = wrapCanvasText(context, output, width - padding * 2);
    canvas.width = width;
    canvas.height = Math.max(360, padding * 2 + 94 + lines.length * lineHeight);
    context.fillStyle = "#202722";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#9fbc98";
    context.font = "700 24px system-ui, sans-serif";
    context.fillText("MINECRAFT ENCHANTING TABLE TRANSLATION", padding, padding);
    context.fillStyle = "#f0f4ed";
    context.font = "38px Georgia, serif";
    lines.forEach((line, index) => context.fillText(line, padding, padding + 78 + (index + 1) * lineHeight));
    context.fillStyle = "#8d9b90";
    context.font = "20px system-ui, sans-serif";
    context.fillText("Unicode approximations of the Standard Galactic Alphabet", padding, canvas.height - 34);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "enchanting-table-translation.png";
      anchor.click();
      URL.revokeObjectURL(url);
      setStatus("PNG downloaded");
    }, "image/png");
  };

  return <div className="generator-shell enchanting-translator">
    <div className="translator-tabs" role="tablist" aria-label="Translation direction">
      <button type="button" role="tab" aria-selected={directionMode === "auto"} onClick={() => setDirectionMode("auto")}>Auto detect</button>
      <button type="button" role="tab" aria-selected={directionMode === "english-to-glyphs"} onClick={() => setDirectionMode("english-to-glyphs")}>English → Enchanting Table</button>
      <button type="button" role="tab" aria-selected={directionMode === "glyphs-to-english"} onClick={() => setDirectionMode("glyphs-to-english")}>Enchanting Table → English</button>
    </div>
    {directionMode === "auto" && <p className="translator-detected">Detected: {direction === "english-to-glyphs" ? "English text" : "enchanting table glyphs"}</p>}
    <div className="translator-workbench">
      <label className="translator-panel">
        <span>{direction === "english-to-glyphs" ? "English text" : "Enchanting table glyphs"}</span>
        <textarea aria-label={direction === "english-to-glyphs" ? "English text" : "Enchanting table glyphs"} value={input} rows={7} maxLength={4000} onChange={(event) => setInput(event.target.value)} placeholder="Type or paste text" />
        <small>{inputCount.toLocaleString()} characters · {inputLines} {inputLines === 1 ? "line" : "lines"}</small>
      </label>
      <div className="translator-swap"><button type="button" onClick={swap} aria-label="Swap translation direction">⇄</button></div>
      <label className="translator-panel translator-output">
        <span>{direction === "english-to-glyphs" ? "Enchanting table glyphs" : "English text"}</span>
        <textarea value={output} rows={7} readOnly aria-label="Translation output" />
        <small>{outputCount.toLocaleString()} characters</small>
      </label>
    </div>
    <div className="translator-capacity" role="note">
      <span><strong>Sign check</strong>{inputLines}/4 typed lines · line width is pixel-based</span>
      <span><strong>Book check</strong>{inputLines}/14 visible lines on a typical Java book page</span>
      <span><strong>Important</strong>Copied glyphs are Unicode lookalikes; Minecraft signs do not switch to the enchanting-table font.</span>
    </div>
    <div className="translator-actions">
      <button type="button" className="primary-button" onClick={copyOutput} disabled={!output}>Copy Translation</button>
      <button type="button" className="secondary-button" onClick={downloadPng} disabled={!output}>Download PNG</button>
      <button type="button" className="secondary-button" onClick={share}>Copy Share Link</button>
      <button type="button" className="secondary-button" onClick={() => { setInput(""); setStatus("Translator cleared"); }}>Clear</button>
      <button type="button" className="secondary-button" onClick={swap}>Swap</button>
      <p aria-live="polite">{status}</p>
    </div>
    <section className="enchanting-alphabet" aria-labelledby="enchanting-alphabet-title">
      <div className="tool-panel-heading"><div><p className="section-label">A–Z REFERENCE</p><h2 id="enchanting-alphabet-title">Minecraft Enchanting Table Alphabet</h2></div><span>Standard Galactic Alphabet</span></div>
      <div className="enchanting-alphabet-grid">
        {ENCHANTING_TABLE_ALPHABET.map(([letter, glyph]) => <div key={letter}><strong>{letter.toUpperCase()}</strong><span>{glyph}</span></div>)}
      </div>
    </section>
  </div>;
}

function wrapCanvasText(context: CanvasRenderingContext2D, value: string, maxWidth: number) {
  const lines: string[] = [];
  value.split("\n").forEach((paragraph) => {
    if (!paragraph) {
      lines.push("");
      return;
    }
    let line = "";
    [...paragraph].forEach((character) => {
      const next = line + character;
      if (line && context.measureText(next).width > maxWidth) {
        lines.push(line);
        line = character;
      } else {
        line = next;
      }
    });
    lines.push(line);
  });
  return lines;
}
