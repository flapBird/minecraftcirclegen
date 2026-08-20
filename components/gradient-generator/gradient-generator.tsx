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
  BlockCategory,
  GradientEndpointMode,
  GradientOptions,
  GradientPalette,
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
    label: "Colored building blocks",
    hint: "Concrete, terracotta, wool, glass, and other dyed blocks.",
  },
  {
    value: "natural",
    label: "All natural materials",
    hint: "Stone, wood, earth, and ocean block families.",
  },
];

type BlockPickerCategory = "all" | BlockCategory;

const BLOCK_PICKER_PAGE_SIZE = 72;

const BLOCK_PICKER_CATEGORIES: Array<{
  value: BlockPickerCategory;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "concrete", label: "Color blocks" },
  { value: "stone", label: "Stone" },
  { value: "wood", label: "Wood" },
  { value: "nature", label: "Nature" },
  { value: "copper", label: "Copper" },
  { value: "deepslate", label: "Deepslate" },
  { value: "nether", label: "Nether" },
  { value: "end", label: "End" },
  { value: "glass", label: "Glass" },
  { value: "mineral", label: "Mineral" },
  { value: "aquatic", label: "Aquatic" },
  { value: "prismarine", label: "Prismarine" },
  { value: "terracotta", label: "Terracotta" },
  { value: "wool", label: "Wool" },
  { value: "sand", label: "Sand" },
  { value: "tuff", label: "Tuff" },
  { value: "sculk", label: "Sculk" },
  { value: "shulker", label: "Shulker" },
  { value: "misc", label: "Misc" },
];

function BlockVisual({
  block,
  className = "",
}: {
  block: MinecraftBlockColor;
  className?: string;
}) {
  return (
    <span
      className={`gradient-block-visual ${className}`.trim()}
      style={{
        "--block-color": block.hex,
        "--block-texture": `url("/minecraft-blocks/${block.texture ?? `${block.id}.png`}")`,
      } as CSSProperties}
      aria-hidden="true"
    />
  );
}

function BlockPicker({
  id,
  label,
  selectedBlockId,
  onSelect,
  onClose,
}: {
  id: string;
  label: string;
  selectedBlockId: string;
  onSelect: (block: MinecraftBlockColor) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<BlockPickerCategory>("all");
  const [page, setPage] = useState(1);
  const titleId = `${id}-picker-title`;

  const blocks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return MINECRAFT_BLOCK_COLORS.filter((block) => {
      const isInCategory = category === "all" || block.category === category;
      const matchesQuery = !normalizedQuery
        || `${block.name} ${block.id}`.toLowerCase().includes(normalizedQuery);
      return isInCategory && matchesQuery;
    }).sort((left, right) => (
      Number(right.id === selectedBlockId) - Number(left.id === selectedBlockId)
    ));
  }, [category, query, selectedBlockId]);
  const pageCount = Math.max(1, Math.ceil(blocks.length / BLOCK_PICKER_PAGE_SIZE));
  const visibleBlocks = blocks.slice(
    (page - 1) * BLOCK_PICKER_PAGE_SIZE,
    page * BLOCK_PICKER_PAGE_SIZE,
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="gradient-block-picker-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="gradient-block-picker"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="gradient-block-picker-header">
          <div>
            <p className="section-label">{label.toUpperCase()}</p>
            <h2 id={titleId}>Pick a Minecraft block</h2>
          </div>
          <button type="button" aria-label="Close block picker" onClick={onClose}>×</button>
        </header>

        <label className="gradient-block-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            aria-label="Search blocks"
            placeholder="Search blocks by name…"
            value={query}
            autoFocus
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </label>

        <div className="gradient-block-categories" aria-label="Block categories">
          {BLOCK_PICKER_CATEGORIES.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={category === item.value}
              onClick={() => {
                setCategory(item.value);
                setPage(1);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="gradient-block-picker-summary" aria-live="polite">
          <strong>{blocks.length} {blocks.length === 1 ? "block" : "blocks"}</strong>
          <span>Java Edition 26.1.2 textures</span>
        </div>

        {blocks.length > 0 ? (
          <div className="gradient-block-picker-grid">
            {visibleBlocks.map((block) => (
              <button
                key={block.id}
                type="button"
                className="gradient-block-option"
                aria-label={`Select ${block.name}`}
                aria-pressed={selectedBlockId === block.id}
                onClick={() => onSelect(block)}
              >
                <BlockVisual block={block} className="gradient-block-option-visual" />
                <span className="gradient-block-option-tooltip" role="tooltip">
                  {block.name}
                </span>
                {selectedBlockId === block.id && (
                  <span className="gradient-block-option-check" aria-hidden="true">✓</span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="gradient-block-picker-empty">
            <strong>No blocks found</strong>
            <p>Try another name or choose a different material category.</p>
          </div>
        )}
        {blocks.length > BLOCK_PICKER_PAGE_SIZE && (
          <nav className="gradient-block-picker-pagination" aria-label="Block picker pages">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </button>
            <span>Page {page} of {pageCount}</span>
            <button
              type="button"
              disabled={page === pageCount}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}

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
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const block = MINECRAFT_BLOCK_COLORS.find((candidate) => candidate.id === blockId)
    ?? MINECRAFT_BLOCK_COLORS[0];
  const closePicker = () => {
    setIsPickerOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <div className="gradient-block-field">
      <label htmlFor={id}>{label}</label>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className="gradient-block-trigger"
        aria-label={`${label}: ${block.name}`}
        aria-haspopup="dialog"
        aria-expanded={isPickerOpen}
        onClick={() => setIsPickerOpen(true)}
      >
        <BlockVisual block={block} className="gradient-block-trigger-visual" />
        <span className="gradient-block-trigger-copy">
          <strong>{block.name}</strong>
          <small>{block.category ?? block.family}</small>
        </span>
        <span className="gradient-block-trigger-chevron" aria-hidden="true">⌄</span>
      </button>
      <p>{helper}</p>
      {isPickerOpen && (
        <BlockPicker
          id={id}
          label={label}
          selectedBlockId={block.id}
          onClose={closePicker}
          onSelect={(selected) => {
            onChange(selected);
            closePicker();
          }}
        />
      )}
    </div>
  );
}

export function GradientGenerator({ initialOptions }: { initialOptions: GradientOptions }) {
  const [options, setOptions] = useState(() => normalizeGradientOptions(initialOptions));
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);
  const steps = useMemo(() => generateBlockGradient(options), [options]);
  const palette = PALETTES.find((item) => item.value === options.palette) ?? PALETTES[0];
  const endpointMode = options.endpointMode ?? "color";
  const ribbonStart = endpointMode === "block" ? steps[0].block.hex : options.startColor;
  const ribbonEnd = endpointMode === "block"
    ? (steps.at(-1)?.block.hex ?? options.endColor)
    : options.endColor;

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

  const download = async () => {
    try {
      await downloadGradientPng(steps, options);
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

          <div
            className="gradient-ribbon"
            aria-label={`Continuous gradient from ${ribbonStart} to ${ribbonEnd}`}
            style={{
              "--gradient-start": ribbonStart,
              "--gradient-end": ribbonEnd,
            } as CSSProperties}
          />

          <div className="gradient-texture-ribbon" aria-label="Generated Minecraft block sequence">
            {steps.map((step) => (
              <span
                key={`texture-${step.index}-${step.block.id}`}
                aria-label={`${step.index}. ${step.block.name}`}
                title={`${step.index}. ${step.block.name}`}
              >
                <BlockVisual block={step.block} />
                <span aria-hidden="true">{step.index}</span>
              </span>
            ))}
          </div>
          <p className="gradient-texture-ribbon-note">
            Actual block textures · place from left to right
          </p>

          <ol className="gradient-block-list">
            {steps.map((step) => {
              const endpoint = step.index === 1
                ? "START"
                : step.index === steps.length
                  ? "END"
                  : "";
              return (
                <li key={`${step.index}-${step.block.id}`}>
                  <BlockVisual block={step.block} className="gradient-block-swatch" />
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
                  blockId={options.startBlockId ?? "lapis_block"}
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
                  blockId={options.endBlockId ?? "lime_concrete"}
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
