"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { downloadGradientPng } from "@/lib/gradient/export-gradient-png";
import {
  generateBlockGradient,
  MAX_GRADIENT_STEPS,
  MIN_GRADIENT_STEPS,
  normalizeGradientOptions,
  normalizeHex,
} from "@/lib/gradient/generate-gradient";
import { MINECRAFT_BLOCK_COLORS } from "@/lib/gradient/minecraft-block-colors";
import type {
  GradientEndpointMode,
  GradientOptions,
  GradientPalette,
  GradientStep,
  MinecraftBlockColor,
} from "@/lib/gradient/gradient-types";

const PRESETS: Array<{ label: string; start: string; end: string }> = [
  { label: "Stone", start: "#eee5cf", end: "#24282b" },
  { label: "Forest", start: "#d8d39a", end: "#25412d" },
  { label: "Ocean", start: "#d5eee6", end: "#183d64" },
  { label: "Nether", start: "#e1a15f", end: "#30151d" },
];

const PALETTES: Array<{ value: GradientPalette; label: string; hint: string }> = [
  {
    value: "all",
    label: "All building blocks",
    hint: "Best color match across the full block list.",
  },
  {
    value: "common",
    label: "Common survival blocks",
    hint: "Avoids costly mineral and light-source blocks.",
  },
  {
    value: "stone",
    label: "Stone masonry",
    hint: "Keeps intermediate blocks inside the stone family.",
  },
  {
    value: "wood",
    label: "Wood materials",
    hint: "Uses planks from different wood families.",
  },
  {
    value: "terrain",
    label: "Terrain & paths",
    hint: "Stone, earth, and ocean materials for outdoor transitions.",
  },
  {
    value: "colorful",
    label: "Concrete & terracotta",
    hint: "Clean color-led gradients for bold builds.",
  },
  {
    value: "natural",
    label: "All natural materials",
    hint: "Stone, wood, earth, and ocean block families.",
  },
];

type BuildPreviewMode = "wall" | "path";

function ColorControl({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value.toUpperCase());

  const commit = () => {
    const next = normalizeHex(draft, value);
    setDraft(next.toUpperCase());
    onChange(next);
  };

  return (
    <div className="gradient-color-field">
      <label htmlFor={`${id}-hex`}>{label}</label>
      <div className="gradient-color-inputs">
        <input
          id={`${id}-picker`}
          type="color"
          aria-label={`${label} color picker`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          id={`${id}-hex`}
          type="text"
          inputMode="text"
          aria-label={`${label} hex value`}
          value={draft}
          maxLength={7}
          spellCheck={false}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
        />
      </div>
    </div>
  );
}

function BlockControl({
  id,
  label,
  helper,
  blockId,
  onChange,
}: {
  id: string;
  label: string;
  helper: string;
  blockId: string;
  onChange: (block: MinecraftBlockColor) => void;
}) {
  const block = MINECRAFT_BLOCK_COLORS.find((candidate) => candidate.id === blockId)
    ?? MINECRAFT_BLOCK_COLORS[0];

  return (
    <div className="gradient-block-field">
      <label htmlFor={id}>{label}</label>
      <div className="gradient-block-select">
        <span
          className="gradient-block-select-swatch"
          style={{ "--block-color": block.hex } as CSSProperties}
          aria-hidden="true"
        />
        <select
          id={id}
          value={block.id}
          onChange={(event) => {
            const selected = MINECRAFT_BLOCK_COLORS.find(
              (candidate) => candidate.id === event.target.value,
            );
            if (selected) onChange(selected);
          }}
        >
          {MINECRAFT_BLOCK_COLORS.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
          ))}
        </select>
      </div>
      <p>{helper}</p>
    </div>
  );
}

function BuildPreview({
  steps,
  mode,
  onModeChange,
}: {
  steps: GradientStep[];
  mode: BuildPreviewMode;
  onModeChange: (mode: BuildPreviewMode) => void;
}) {
  const style = { "--preview-step-count": steps.length } as CSSProperties;

  return (
    <section className="gradient-build-preview" aria-labelledby="gradient-build-preview-title">
      <div className="gradient-build-preview-heading">
        <div>
          <p className="section-label">BUILD PREVIEW</p>
          <h3 id="gradient-build-preview-title">See the transition in context</h3>
        </div>
        <div className="gradient-preview-tabs" aria-label="Build preview type">
          <button
            type="button"
            aria-pressed={mode === "wall"}
            onClick={() => onModeChange("wall")}
          >
            Wall
          </button>
          <button
            type="button"
            aria-pressed={mode === "path"}
            onClick={() => onModeChange("path")}
          >
            Path
          </button>
        </div>
      </div>

      <figure className="gradient-build-figure">
        <div className={`gradient-build-surface is-${mode}`} style={style} aria-hidden="true">
          {mode === "wall"
            ? [...steps].reverse().map((step, rowIndex) => (
                <div className="gradient-build-row" key={`wall-${step.index}`}>
                  {Array.from({ length: 10 }, (_, cellIndex) => (
                    <span
                      key={`${rowIndex}-${cellIndex}`}
                      style={{ "--block-color": step.block.hex } as CSSProperties}
                    />
                  ))}
                </div>
              ))
            : Array.from({ length: 5 }, (_, rowIndex) => (
                <div className="gradient-build-row" key={`path-${rowIndex}`}>
                  {steps.map((step) => (
                    <span
                      key={`${rowIndex}-${step.index}`}
                      style={{ "--block-color": step.block.hex } as CSSProperties}
                    />
                  ))}
                </div>
              ))}
        </div>
        <figcaption>
          {mode === "wall"
            ? "Start at the bottom and move upward. Break up each boundary in-game for a softer blend."
            : "Move from the start block at one edge to the end block at the other. Use wider bands on large paths."}
        </figcaption>
      </figure>
    </section>
  );
}

export function GradientGenerator({ initialOptions }: { initialOptions: GradientOptions }) {
  const [options, setOptions] = useState(() => normalizeGradientOptions(initialOptions));
  const [previewMode, setPreviewMode] = useState<BuildPreviewMode>("wall");
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);
  const steps = useMemo(() => generateBlockGradient(options), [options]);
  const families = useMemo(() => new Set(steps.map((step) => step.block.family)).size, [steps]);
  const palette = PALETTES.find((item) => item.value === options.palette) ?? PALETTES[0];
  const endpointMode = options.endpointMode ?? "color";

  const showStatus = useCallback((message: string) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const update = (updates: Partial<GradientOptions>) => {
    setOptions((current) => normalizeGradientOptions({ ...current, ...updates }));
  };

  const copyBlocks = async () => {
    const text = steps
      .map((step) => `${step.index}. ${step.block.name} (${step.block.hex.toUpperCase()})`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      showStatus("Block list copied");
    } catch {
      showStatus("Copy failed — select the block names manually");
    }
  };

  const download = () => {
    try {
      downloadGradientPng(steps, options);
      showStatus("PNG downloaded");
    } catch {
      showStatus("The PNG could not be created");
    }
  };

  const reverse = () => {
    update({
      startColor: options.endColor,
      endColor: options.startColor,
      startBlockId: options.endBlockId,
      endBlockId: options.startBlockId,
    });
  };

  const progress = ((options.steps - MIN_GRADIENT_STEPS) /
    (MAX_GRADIENT_STEPS - MIN_GRADIENT_STEPS)) * 100;

  return (
    <div className="generator-shell gradient-generator" id="generator">
      <div className="gradient-workbench">
        <section className="gradient-preview" aria-labelledby="gradient-preview-title">
          <div className="gradient-preview-heading">
            <div>
              <p className="section-label">LIVE BLOCK PALETTE</p>
              <h2 id="gradient-preview-title">Your gradient</h2>
            </div>
            <span>{steps.length} blocks · build in order</span>
          </div>

          <div className="gradient-ribbon" aria-label="Generated block gradient">
            {steps.map((step) => (
              <span
                key={step.index}
                style={{ backgroundColor: step.block.hex }}
                title={`${step.index}. ${step.block.name}`}
              />
            ))}
          </div>

          <ol className="gradient-block-list">
            {steps.map((step) => {
              const endpoint = step.index === 1
                ? "START"
                : step.index === steps.length
                  ? "END"
                  : "";
              return (
                <li key={`${step.index}-${step.block.id}`}>
                  <span
                    className="gradient-block-swatch"
                    style={{ "--block-color": step.block.hex } as CSSProperties}
                    aria-hidden="true"
                  />
                  <span className="gradient-block-copy">
                    <strong>{step.block.name}</strong>
                    <small>{step.block.family} · {step.block.hex.toUpperCase()}</small>
                  </span>
                  {endpoint
                    ? <span className="gradient-endpoint-badge">{endpoint}</span>
                    : (
                      <span className="gradient-step-number">
                        {String(step.index).padStart(2, "0")}
                      </span>
                    )}
                </li>
              );
            })}
          </ol>

          <BuildPreview steps={steps} mode={previewMode} onModeChange={setPreviewMode} />
        </section>

        <aside className="gradient-settings" aria-labelledby="gradient-settings-title">
          <div className="gradient-settings-intro">
            <p className="section-label">GRADIENT SETUP</p>
            <h2 id="gradient-settings-title">Choose both ends of the build</h2>
            <p>Anchor the gradient to blocks already in your plan, or switch to exact colors.</p>
          </div>

          <div className="gradient-endpoint-mode" aria-label="Gradient endpoint type">
            {(["block", "color"] as GradientEndpointMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={endpointMode === mode}
                onClick={() => update({ endpointMode: mode })}
              >
                {mode === "block" ? "Minecraft blocks" : "Exact colors"}
              </button>
            ))}
          </div>

          {endpointMode === "color" && (
            <div className="gradient-preset-row" aria-label="Gradient presets">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => update({ startColor: preset.start, endColor: preset.end })}
                >
                  <span
                    aria-hidden="true"
                    style={{ background: `linear-gradient(90deg, ${preset.start}, ${preset.end})` }}
                  />
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          <div className="gradient-settings-card">
            {endpointMode === "block" ? (
              <div className="gradient-block-endpoints">
                <BlockControl
                  id="gradient-start-block"
                  label="Start block"
                  helper="The material already in your build."
                  blockId={options.startBlockId ?? "quartz_block"}
                  onChange={(block) => update({ startBlockId: block.id, startColor: block.hex })}
                />
                <button
                  type="button"
                  className="gradient-reverse-button"
                  aria-label="Reverse gradient blocks"
                  title="Reverse blocks"
                  onClick={reverse}
                >
                  ⇄
                </button>
                <BlockControl
                  id="gradient-end-block"
                  label="End block"
                  helper="The material the transition should reach."
                  blockId={options.endBlockId ?? "deepslate"}
                  onChange={(block) => update({ endBlockId: block.id, endColor: block.hex })}
                />
              </div>
            ) : (
              <div className="gradient-color-grid">
                <ColorControl
                  key={`start-${options.startColor}`}
                  id="start-color"
                  label="Start color"
                  value={options.startColor}
                  onChange={(startColor) => update({ startColor })}
                />
                <button
                  type="button"
                  className="gradient-reverse-button"
                  aria-label="Reverse gradient colors"
                  title="Reverse colors"
                  onClick={reverse}
                >
                  ⇄
                </button>
                <ColorControl
                  key={`end-${options.endColor}`}
                  id="end-color"
                  label="End color"
                  value={options.endColor}
                  onChange={(endColor) => update({ endColor })}
                />
              </div>
            )}

            <div className="gradient-setting-group">
              <div className="setting-heading">
                <div>
                  <label htmlFor="gradient-steps">Gradient length</label>
                  <small>Use fewer steps on small builds and more on wide surfaces.</small>
                </div>
                <input
                  id="gradient-step-number"
                  className="setting-number-input"
                  type="number"
                  inputMode="numeric"
                  min={MIN_GRADIENT_STEPS}
                  max={MAX_GRADIENT_STEPS}
                  value={options.steps}
                  aria-label="Gradient length value"
                  onChange={(event) => update({ steps: Number(event.target.value) })}
                />
              </div>
              <input
                id="gradient-steps"
                className="gradient-range"
                type="range"
                min={MIN_GRADIENT_STEPS}
                max={MAX_GRADIENT_STEPS}
                value={options.steps}
                aria-label="Gradient length slider"
                style={{ "--range-progress": `${progress}%` } as CSSProperties}
                onChange={(event) => update({ steps: Number(event.target.value) })}
              />
            </div>

            <div className="gradient-setting-group">
              <label htmlFor="gradient-palette">Block palette</label>
              <select
                id="gradient-palette"
                value={options.palette}
                onChange={(event) => update({ palette: event.target.value as GradientPalette })}
              >
                {PALETTES.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
              <p>{palette.hint} Your chosen start and end blocks always stay fixed.</p>
            </div>
          </div>

          <section className="gradient-stats" aria-labelledby="gradient-stats-title">
            <h3 id="gradient-stats-title">Build plan</h3>
            <dl>
              <div><dt>Ordered blocks</dt><dd>{steps.length}</dd></div>
              <div><dt>Material families</dt><dd>{families}</dd></div>
              <div><dt>Start anchor</dt><dd>{steps[0].block.name}</dd></div>
              <div><dt>End anchor</dt><dd>{steps.at(-1)?.block.name}</dd></div>
            </dl>
          </section>

          <div className="settings-actions gradient-actions">
            <button type="button" className="primary-button" onClick={download}>
              ↓ Download as PNG
            </button>
            <button type="button" className="secondary-button" onClick={copyBlocks}>
              Copy block list
            </button>
          </div>
        </aside>
      </div>
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}
