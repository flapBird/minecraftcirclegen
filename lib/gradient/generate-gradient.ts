import { MINECRAFT_BLOCK_COLORS } from "./minecraft-block-colors";
import type {
  GradientEndpointMode,
  GradientOptions,
  GradientPalette,
  GradientStep,
  MinecraftBlockColor,
} from "./gradient-types";

export const MIN_GRADIENT_STEPS = 3;
export const MAX_GRADIENT_STEPS = 24;

interface OklabColor {
  l: number;
  a: number;
  b: number;
}

const HEX_PATTERN = /^#[0-9a-f]{6}$/i;

export function normalizeHex(value: string, fallback = "#ffffff") {
  const candidate = value.trim();
  const withHash = candidate.startsWith("#") ? candidate : `#${candidate}`;
  return HEX_PATTERN.test(withHash) ? withHash.toLowerCase() : fallback;
}

export function normalizeGradientOptions(options: GradientOptions): GradientOptions {
  const endpointMode = (["block", "color"] as GradientEndpointMode[]).includes(
    options.endpointMode as GradientEndpointMode,
  )
    ? options.endpointMode
    : "color";
  const startBlock = MINECRAFT_BLOCK_COLORS.find((block) => block.id === options.startBlockId);
  const endBlock = MINECRAFT_BLOCK_COLORS.find((block) => block.id === options.endBlockId);

  return {
    startColor: endpointMode === "block" && startBlock
      ? startBlock.hex
      : normalizeHex(options.startColor, "#eee5cf"),
    endColor: endpointMode === "block" && endBlock
      ? endBlock.hex
      : normalizeHex(options.endColor, "#26352c"),
    steps: Math.max(MIN_GRADIENT_STEPS, Math.min(MAX_GRADIENT_STEPS, Math.round(options.steps))),
    palette: (["all", "common", "colorful", "natural", "stone", "wood", "terrain"] as GradientPalette[]).includes(options.palette)
      ? options.palette
      : "all",
    endpointMode,
    startBlockId: startBlock?.id,
    endBlockId: endBlock?.id,
  };
}

export function blocksForPalette(palette: GradientPalette): MinecraftBlockColor[] {
  if (palette === "common") return MINECRAFT_BLOCK_COLORS.filter((block) => block.common);
  if (palette === "colorful") return MINECRAFT_BLOCK_COLORS.filter((block) => block.family === "color");
  if (palette === "natural") {
    return MINECRAFT_BLOCK_COLORS.filter((block) =>
      (["stone", "wood", "earth", "ocean"] as const).includes(
        block.family as "stone" | "wood" | "earth" | "ocean",
      ),
    );
  }
  if (palette === "stone") {
    return MINECRAFT_BLOCK_COLORS.filter((block) => block.family === "stone");
  }
  if (palette === "wood") {
    return MINECRAFT_BLOCK_COLORS.filter((block) => block.family === "wood");
  }
  if (palette === "terrain") {
    return MINECRAFT_BLOCK_COLORS.filter((block) =>
      (["stone", "earth", "ocean"] as const).includes(
        block.family as "stone" | "earth" | "ocean",
      ),
    );
  }
  return MINECRAFT_BLOCK_COLORS;
}

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex);
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16) / 255,
    g: Number.parseInt(normalized.slice(3, 5), 16) / 255,
    b: Number.parseInt(normalized.slice(5, 7), 16) / 255,
  };
}

function linearChannel(value: number) {
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function gammaChannel(value: number) {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * clamped ** (1 / 2.4) - 0.055;
}

function hexToOklab(hex: string): OklabColor {
  const rgb = hexToRgb(hex);
  const r = linearChannel(rgb.r);
  const g = linearChannel(rgb.g);
  const b = linearChannel(rgb.b);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);
  return {
    l: 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot,
    a: 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot,
    b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot,
  };
}

function oklabToHex(color: OklabColor) {
  const lRoot = color.l + 0.3963377774 * color.a + 0.2158037573 * color.b;
  const mRoot = color.l - 0.1055613458 * color.a - 0.0638541728 * color.b;
  const sRoot = color.l - 0.0894841775 * color.a - 1.291485548 * color.b;
  const l = lRoot ** 3;
  const m = mRoot ** 3;
  const s = sRoot ** 3;
  const r = gammaChannel(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = gammaChannel(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const b = gammaChannel(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
  return `#${[r, g, b]
    .map((channel) => Math.round(channel * 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

function interpolate(start: OklabColor, end: OklabColor, amount: number): OklabColor {
  return {
    l: start.l + (end.l - start.l) * amount,
    a: start.a + (end.a - start.a) * amount,
    b: start.b + (end.b - start.b) * amount,
  };
}

function distance(left: OklabColor, right: OklabColor) {
  return Math.hypot(left.l - right.l, left.a - right.a, left.b - right.b);
}

export function generateBlockGradient(rawOptions: GradientOptions): GradientStep[] {
  const options = normalizeGradientOptions(rawOptions);
  const startAnchor = options.endpointMode === "block"
    ? MINECRAFT_BLOCK_COLORS.find((block) => block.id === options.startBlockId)
    : undefined;
  const endAnchor = options.endpointMode === "block"
    ? MINECRAFT_BLOCK_COLORS.find((block) => block.id === options.endBlockId)
    : undefined;
  const candidateBlocks = [...blocksForPalette(options.palette)];
  for (const anchor of [startAnchor, endAnchor]) {
    if (anchor && !candidateBlocks.some((block) => block.id === anchor.id)) candidateBlocks.push(anchor);
  }
  const candidates = candidateBlocks.map((block) => ({
    block,
    color: hexToOklab(block.hex),
  }));
  const start = hexToOklab(options.startColor);
  const end = hexToOklab(options.endColor);
  const used = new Set<string>([startAnchor?.id, endAnchor?.id].filter(Boolean) as string[]);

  return Array.from({ length: options.steps }, (_, index) => {
    const amount = options.steps === 1 ? 0 : index / (options.steps - 1);
    const target = interpolate(start, end, amount);
    const anchor = index === 0 ? startAnchor : index === options.steps - 1 ? endAnchor : undefined;
    const ranked = candidates
      .map((candidate) => ({ ...candidate, score: distance(target, candidate.color) }))
      .sort((left, right) => left.score - right.score);
    const chosen = anchor
      ? { block: anchor, color: hexToOklab(anchor.hex), score: 0 }
      : ranked.find((candidate) => !used.has(candidate.block.id)) ?? ranked[0];
    used.add(chosen.block.id);
    return {
      index: index + 1,
      targetColor: oklabToHex(target),
      block: chosen.block,
    };
  });
}
