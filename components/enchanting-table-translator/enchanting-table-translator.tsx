"use client";

import { useMemo, useState } from "react";
import {
  ENCHANTING_TABLE_ALPHABET,
  translateEnchantingTable,
  type EnchantingTranslationDirection,
} from "@/lib/minecraft/enchanting-table";

export function EnchantingTableTranslator() {
  const [direction, setDirection] = useState<EnchantingTranslationDirection>("english-to-glyphs");
  const [input, setInput] = useState("The secret is in the symbols.");
  const [status, setStatus] = useState("");
  const output = useMemo(() => translateEnchantingTable(input, direction), [direction, input]);

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
    setDirection((current) => current === "english-to-glyphs" ? "glyphs-to-english" : "english-to-glyphs");
    setStatus("Direction swapped");
  };

  return <div className="generator-shell enchanting-translator">
    <div className="translator-tabs" role="tablist" aria-label="Translation direction">
      <button type="button" role="tab" aria-selected={direction === "english-to-glyphs"} onClick={() => setDirection("english-to-glyphs")}>English → Enchanting Table</button>
      <button type="button" role="tab" aria-selected={direction === "glyphs-to-english"} onClick={() => setDirection("glyphs-to-english")}>Enchanting Table → English</button>
    </div>
    <div className="translator-workbench">
      <label className="translator-panel">
        <span>{direction === "english-to-glyphs" ? "English text" : "Enchanting table glyphs"}</span>
        <textarea value={input} rows={7} onChange={(event) => setInput(event.target.value)} placeholder="Type or paste text" />
      </label>
      <div className="translator-swap"><button type="button" onClick={swap} aria-label="Swap translation direction">⇄</button></div>
      <label className="translator-panel translator-output">
        <span>{direction === "english-to-glyphs" ? "Enchanting table glyphs" : "English text"}</span>
        <textarea value={output} rows={7} readOnly aria-label="Translation output" />
      </label>
    </div>
    <div className="translator-actions">
      <button type="button" className="primary-button" onClick={copyOutput} disabled={!output}>Copy Translation</button>
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
