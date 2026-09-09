"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateTextGradient, textGradientOutputs } from "@/lib/gradient/generate-text-gradient";

type OutputKey = "hex" | "miniMessage" | "tellraw" | "pluginRgb";
const OUTPUTS: Array<{ key: OutputKey; label: string; hint: string }> = [
  { key: "hex", label: "HEX Text", hint: "A readable per-character <#RRGGBB> sequence; use only where this syntax is supported." },
  { key: "miniMessage", label: "MiniMessage", hint: "Compact gradient tag for MiniMessage-compatible server plugins." },
  { key: "tellraw", label: "Java Tellraw", hint: "A JSON-compatible Java text component with per-character RGB colors." },
  { key: "pluginRgb", label: "Plugin RGB", hint: "&#RRGGBB syntax used by some plugins; it is not vanilla legacy formatting." },
];

export function TextGradientGenerator() {
  const [text, setText] = useState("Welcome");
  const [start, setStart] = useState("#55FF55");
  const [middle, setMiddle] = useState("#FFFF55");
  const [end, setEnd] = useState("#55FFFF");
  const [drafts, setDrafts] = useState({ "Start color": start, "Middle color": middle, "End color": end });
  const [useMiddle, setUseMiddle] = useState(false);
  const invalidColors = Object.entries(drafts).filter(([label, value]) => (label !== "Middle color" || useMiddle) && !/^#[0-9a-f]{6}$/i.test(value));
  const [activeOutput, setActiveOutput] = useState<OutputKey>("miniMessage");
  const [toast, setToast] = useState("");
  const timer = useRef<number | null>(null);
  const stops = useMemo(() => useMiddle ? [start, middle, end] : [start, end], [end, middle, start, useMiddle]);
  const characters = useMemo(() => generateTextGradient(text, stops), [stops, text]);
  const outputs = useMemo(() => textGradientOutputs(characters, stops), [characters, stops]);

  const showStatus = useCallback((message: string) => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    setToast(message);
    timer.current = window.setTimeout(() => setToast(""), 2500);
  }, []);
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);

  const copy = async () => {
    if (invalidColors.length) return;
    try { await navigator.clipboard.writeText(outputs[activeOutput]); showStatus(`${OUTPUTS.find((item) => item.key === activeOutput)?.label} copied`); }
    catch { showStatus("Copy failed — select the output manually"); }
  };

  const colorInput = (label: keyof typeof drafts, value: string, onChange: (value: string) => void) => {
    const updateDraft = (raw: string) => {
      setDrafts((current) => ({ ...current, [label]: raw }));
      if (/^#[0-9a-f]{6}$/i.test(raw)) onChange(raw.toUpperCase());
    };
    const invalid = !/^#[0-9a-f]{6}$/i.test(drafts[label]);
    return <div className="text-gradient-color"><span>{label}</span><div>
      <input type="color" aria-label={label} value={value} onChange={(event) => updateDraft(event.target.value.toUpperCase())} />
      <input type="text" aria-label={`${label} HEX`} value={drafts[label]} maxLength={7} aria-invalid={invalid} aria-describedby={invalid ? "gradient-color-error" : undefined} onChange={(event) => updateDraft(event.target.value)} />
    </div></div>;
  };

  return (
    <div className="gradient-generator text-gradient-generator">
      <div className="text-gradient-workbench">
        <section className="text-gradient-preview" aria-labelledby="text-gradient-preview-title">
          <div className="server-card-heading"><h2 id="text-gradient-preview-title" className="preview-heading">PREVIEW</h2><span>{characters.filter((item) => item.character !== "\n").length} characters</span></div>
          <div className="text-gradient-stage"><span className="text-gradient-text">{characters.map((item, index) => <span key={`${index}-${item.character}`} style={{ color: item.hex }}>{item.character === "\n" ? <br /> : item.character}</span>)}</span></div>
          <section className="output-panel text-gradient-output"><h3>Copy-ready output</h3><div className="output-tabs" role="tablist" aria-label="Gradient output format">{OUTPUTS.map((output) => <button key={output.key} type="button" role="tab" aria-selected={activeOutput === output.key} onClick={() => setActiveOutput(output.key)}>{output.label}</button>)}</div><pre tabIndex={0}><code>{outputs[activeOutput]}</code></pre><p>{OUTPUTS.find((item) => item.key === activeOutput)?.hint}</p><button type="button" className="primary-button" disabled={invalidColors.length > 0} onClick={copy}>Copy output</button></section>
        </section>
        <aside className="text-gradient-settings"><p className="section-label">TEXT GRADIENT SETUP</p><h2>Choose text and color stops</h2><label className="server-text-field"><span>Text</span><textarea rows={4} maxLength={120} value={text} onChange={(event) => setText(event.target.value)} /></label>{invalidColors.length > 0 && <p id="gradient-color-error" role="alert">Enter a complete six-digit HEX color, such as #55FF55. The preview keeps the last valid colors; copying is paused.</p>}<div className="text-gradient-colors">{colorInput("Start color", start, setStart)}{useMiddle && colorInput("Middle color", middle, setMiddle)}{colorInput("End color", end, setEnd)}</div><label className="simple-toggle-row"><span>Use middle color</span><input className="switch-input" type="checkbox" checked={useMiddle} onChange={(event) => setUseMiddle(event.target.checked)} /></label><button type="button" className="secondary-button text-gradient-reverse" onClick={() => { setStart(end); setEnd(start); setDrafts((current) => ({ ...current, "Start color": end, "End color": start })); }}>⇄ Reverse colors</button><div className="compatibility-note"><strong>Compatibility</strong><p>Vanilla legacy § codes cannot represent RGB gradients. Use the Java Tellraw component for modern commands, or choose the exact syntax supported by your server plugin.</p></div></aside>
      </div>
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}
