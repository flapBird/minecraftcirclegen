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

interface LabColor {
  l: number;
  a: number;
  b: number;
}

interface BlockCandidate {
  block: MinecraftBlockColor;
  color: LabColor;
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

function labPivot(value: number) {
  return value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116;
}

function inverseLabPivot(value: number) {
  const cube = value ** 3;
  return cube > 0.008856 ? cube : (value - 16 / 116) / 7.787;
}

function hexToLab(hex: string): LabColor {
  const rgb = hexToRgb(hex);
  const r = linearChannel(rgb.r);
  const g = linearChannel(rgb.g);
  const b = linearChannel(rgb.b);
  const x = labPivot((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047);
  const y = labPivot(0.2126729 * r + 0.7151522 * g + 0.072175 * b);
  const z = labPivot((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883);
  return {
    l: 116 * y - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
  };
}

function labToHex(color: LabColor) {
  const yRoot = (color.l + 16) / 116;
  const x = 0.95047 * inverseLabPivot(yRoot + color.a / 500);
  const y = inverseLabPivot(yRoot);
  const z = 1.08883 * inverseLabPivot(yRoot - color.b / 200);
  const r = gammaChannel(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
  const g = gammaChannel(-0.969266 * x + 1.8760108 * y + 0.041556 * z);
  const b = gammaChannel(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);
  return `#${[r, g, b]
    .map((channel) => Math.round(channel * 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

function interpolate(start: LabColor, end: LabColor, amount: number): LabColor {
  return {
    l: start.l + (end.l - start.l) * amount,
    a: start.a + (end.a - start.a) * amount,
    b: start.b + (end.b - start.b) * amount,
  };
}

function distance(left: LabColor, right: LabColor) {
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
    color: hexToLab(block.hex),
  }));
  const start = hexToLab(options.startColor);
  const end = hexToLab(options.endColor);
  const used = new Set(
    [startAnchor?.id, endAnchor?.id].filter(Boolean) as string[],
  );

  return Array.from({ length: options.steps }, (_, index) => {
    const amount = options.steps === 1 ? 0 : index / (options.steps - 1);
    const target = interpolate(start, end, amount);
    const anchor = index === 0 ? startAnchor : index === options.steps - 1 ? endAnchor : undefined;
    let chosen = anchor
      ? { block: anchor, color: hexToLab(anchor.hex) }
      : undefined;
    let bestDistance = Number.POSITIVE_INFINITY;

    if (!chosen) {
      for (const candidate of candidates) {
        if (used.has(candidate.block.id)) continue;
        const candidateDistance = distance(target, candidate.color);
        if (candidateDistance < bestDistance) {
          chosen = candidate;
          bestDistance = candidateDistance;
        }
      }
    }

    if (!chosen) {
      chosen = candidates.reduce((nearest, candidate) => (
        distance(target, candidate.color) < distance(target, nearest.color)
          ? candidate
          : nearest
      ));
    }

    used.add(chosen.block.id);
    return {
      index: index + 1,
      targetColor: labToHex(target),
      block: chosen.block,
    };
  });
}
