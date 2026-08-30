"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_TEXT_STYLES,
  FORMATTING_CODES,
  MINECRAFT_COLORS,
  getMinecraftColor,
  makeLegacyText,
  makeMiniMessage,
  makeMotdText,
  makeTellraw,
  previewStyle,
  type TextStyles,
} from "@/lib/minecraft-text/formatting";

type OutputKey = "section" | "ampersand" | "mini" | "motd" | "tellraw";

const OUTPUTS: Array<{ key: OutputKey; label: string; hint: string }> = [
  { key: "section", label: "Minecraft Codes", hint: "Legacy § codes; support depends on the input field." },
  { key: "ampersand", label: "Plugin / Config", hint: "For plugins that translate ampersand codes." },
  { key: "mini", label: "MiniMessage", hint: "Requires a MiniMessage-compatible server plugin." },
  { key: "motd", label: "MOTD", hint: "Unicode-escaped section signs for server.properties." },
  { key: "tellraw", label: "Tellraw / JSON", hint: "A JSON-compatible structured text component for Java Edition." },
];

export function TextGenerator() {
  const [text, setText] = useState("Welcome to My Server");
  const [colorCode, setColorCode] = useState("a");
  const [styles, setStyles] = useState<TextStyles>(DEFAULT_TEXT_STYLES);
  const [activeOutput, setActiveOutput] = useState<OutputKey>("section");
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);
  const color = getMinecraftColor(colorCode);

  const outputs = useMemo<Record<OutputKey, string>>(() => ({
    section: makeLegacyText(text, colorCode, styles, "§"),
    ampersand: makeLegacyText(text, colorCode, styles, "&"),
    mini: makeMiniMessage(text, colorCode, styles),
    motd: makeMotdText(text, colorCode, styles),
    tellraw: makeTellraw(text, colorCode, styles),
  }), [colorCode, styles, text]);

  const showStatus = useCallback((message: string) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(outputs[activeOutput]);
      showStatus(`${OUTPUTS.find((output) => output.key === activeOutput)?.label} copied`);
    } catch {
      showStatus("Copy failed — select the output manually");
    }
  };

  const setStyle = (key: keyof TextStyles) => {
    setStyles((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="generator-shell server-tool text-generator" id="generator">
      <div className="server-tool-layout">
        <section className="server-preview-card" aria-labelledby="text-preview-title">
          <div className="server-card-heading">
            <h2 id="text-preview-title" className="preview-heading">PREVIEW</h2>
            <span>{text.length} / 500</span>
          </div>
          <div className="minecraft-chat-preview">
            <strong style={{ color: color.hex, ...previewStyle(styles) }}>
              {styles.obfuscated ? text.replace(/\S/g, "▒") : text || "Your text appears here"}
            </strong>
          </div>

          <section className="output-panel" aria-labelledby="text-output-title">
            <h3 id="text-output-title">Copy-ready output</h3>
            <div className="output-tabs" role="tablist" aria-label="Text output format">
              {OUTPUTS.map((output) => (
                <button
                  key={output.key}
                  type="button"
                  role="tab"
                  aria-selected={activeOutput === output.key}
                  onClick={() => setActiveOutput(output.key)}
                >
                  {output.label}
                </button>
              ))}
            </div>
            <pre tabIndex={0}><code>{outputs[activeOutput]}</code></pre>
            <p>{OUTPUTS.find((output) => output.key === activeOutput)?.hint}</p>
            <button type="button" className="primary-button" onClick={copy}>Copy output</button>
          </section>
        </section>

        <aside className="server-settings-card" aria-labelledby="text-settings-title">
          <p className="section-label">TEXT SETTINGS</p>
          <h2 id="text-settings-title">Format your message</h2>
          <label className="server-text-field">
            <span>Enter your text</span>
            <textarea
              value={text}
              maxLength={500}
              rows={4}
              onChange={(event) => setText(event.target.value)}
            />
          </label>
          <fieldset className="server-color-fieldset">
            <legend>Text color</legend>
            <div className="server-color-grid">
              {MINECRAFT_COLORS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={colorCode === item.code ? "is-active" : ""}
                  aria-label={`${item.name}, section ${item.code}`}
                  aria-pressed={colorCode === item.code}
                  onClick={() => setColorCode(item.code)}
                >
                  <span style={{ background: item.hex }} aria-hidden="true" />
                  <small>§{item.code}</small>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="server-format-fieldset">
            <legend>Formatting</legend>
            <div className="server-format-grid">
              {FORMATTING_CODES.filter((format) => format.key !== "reset").map((format) => {
                const key = format.key as keyof TextStyles;
                return (
                  <button
                    key={format.code}
                    type="button"
                    aria-pressed={styles[key]}
                    onClick={() => setStyle(key)}
                  >
                    <code>§{format.code}</code> {format.name}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <button
            type="button"
            className="secondary-button server-reset"
            onClick={() => {
              setText("Welcome to My Server");
              setColorCode("a");
              setStyles(DEFAULT_TEXT_STYLES);
              showStatus("Text reset");
            }}
          >
            Reset
          </button>
        </aside>
      </div>
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}
