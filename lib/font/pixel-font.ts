export type PixelTextCell = 0 | 1 | 2 | 3;
export type PixelTextAlignment = "left" | "center" | "right";

export interface PixelTextStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
}

export interface PixelTextOptions {
  text: string;
  letterSpacing: number;
  lineSpacing: number;
  shadow: boolean;
  shadowDistance?: number;
  outline?: boolean;
  alignment?: PixelTextAlignment;
  style?: Partial<PixelTextStyle>;
}

export interface PixelTextResult {
  cells: PixelTextCell[][];
  width: number;
  height: number;
  mainBlocks: number;
  shadowBlocks: number;
  outlineBlocks: number;
  cellColors: (string | null)[][];
  shadowDistance: number;
}

export const MINECRAFT_COLORS = [
  { code: "0", name: "Black", value: "#000000" },
  { code: "1", name: "Dark Blue", value: "#0000aa" },
  { code: "2", name: "Dark Green", value: "#00aa00" },
  { code: "3", name: "Dark Aqua", value: "#00aaaa" },
  { code: "4", name: "Dark Red", value: "#aa0000" },
  { code: "5", name: "Dark Purple", value: "#aa00aa" },
  { code: "6", name: "Gold", value: "#ffaa00" },
  { code: "7", name: "Gray", value: "#aaaaaa" },
  { code: "8", name: "Dark Gray", value: "#555555" },
  { code: "9", name: "Blue", value: "#5555ff" },
  { code: "a", name: "Green", value: "#55ff55" },
  { code: "b", name: "Aqua", value: "#55ffff" },
  { code: "c", name: "Red", value: "#ff5555" },
  { code: "d", name: "Light Purple", value: "#ff55ff" },
  { code: "e", name: "Yellow", value: "#ffff55" },
  { code: "f", name: "White", value: "#ffffff" },
] as const;

const COLOR_CODES = new Map<string, string>(MINECRAFT_COLORS.map((color) => [color.code, color.value]));
const DEFAULT_STYLE: PixelTextStyle = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
};

const GLYPHS: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  "!": ["00100", "00100", "00100", "00100", "00100", "00000", "00100"],
  "?": ["01110", "10001", "00001", "00010", "00100", "00000", "00100"],
  ".": ["00000", "00000", "00000", "00000", "00000", "00110", "00110"],
  ",": ["00000", "00000", "00000", "00000", "00110", "00100", "01000"],
  ":": ["00000", "00110", "00110", "00000", "00110", "00110", "00000"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  "+": ["00000", "00100", "00100", "11111", "00100", "00100", "00000"],
  " ": ["000", "000", "000", "000", "000", "000", "000"],
};

const FALLBACK = ["11111", "10001", "00010", "00100", "00100", "00000", "00100"];

export function normalizePixelText(value: string) {
  return value
    .replace(/\r\n?/g, "\n")
    .toUpperCase()
    .replace(/[^A-Z0-9 !?.,:+\-\n]/g, "?");
}

interface StyledCharacter {
  character: string;
  color: string | null;
  style: PixelTextStyle;
}

interface PixelPoint {
  x: number;
  y: number;
  color: string | null;
}

function parseStyledLines(value: string, baseStyle: PixelTextStyle) {
  const normalized = value.replace(/\r\n?/g, "\n") || "MINECRAFT";
  const lines: StyledCharacter[][] = [[]];
  let currentStyle = { ...baseStyle };
  let color: string | null = null;
  let obfuscated = false;

  for (let index = 0; index < normalized.length; index += 1) {
    const character = normalized[index];
    const next = normalized[index + 1]?.toLowerCase();
    if ((character === "&" || character === "§") && next) {
      if (COLOR_CODES.has(next)) {
        color = COLOR_CODES.get(next) ?? null;
        currentStyle = { ...baseStyle };
        obfuscated = false;
        index += 1;
        continue;
      }
      if (next === "l" || next === "o" || next === "n" || next === "m" || next === "r" || next === "k") {
        if (next === "l") currentStyle.bold = true;
        if (next === "o") currentStyle.italic = true;
        if (next === "n") currentStyle.underline = true;
        if (next === "m") currentStyle.strikethrough = true;
        if (next === "k") obfuscated = true;
        if (next === "r") {
          color = null;
          currentStyle = { ...baseStyle };
          obfuscated = false;
        }
        index += 1;
        continue;
      }
    }
    if (character === "\n") {
      lines.push([]);
      continue;
    }
    const printable = normalizePixelText(character);
    lines[lines.length - 1].push({
      character: obfuscated ? "?" : printable || "?",
      color,
      style: { ...currentStyle },
    });
  }

  return lines;
}

function renderedCharacterWidth(character: StyledCharacter) {
  const glyph = GLYPHS[character.character] ?? FALLBACK;
  return glyph[0].length + (character.style.bold ? 1 : 0) + (character.style.italic ? 2 : 0);
}

function renderCharacter(character: StyledCharacter, xOffset: number, yOffset: number) {
  const glyph = GLYPHS[character.character] ?? FALLBACK;
  const points: PixelPoint[] = [];
  const width = renderedCharacterWidth(character);
  const addPoint = (x: number, y: number) => points.push({ x: xOffset + x, y: yOffset + y, color: character.color });

  glyph.forEach((row, y) => [...row].forEach((pixel, x) => {
    if (pixel !== "1") return;
    const italicShift = character.style.italic ? Math.floor((6 - y) / 3) : 0;
    addPoint(x + italicShift, y);
    if (character.style.bold) addPoint(x + italicShift + 1, y);
  }));

  if (character.style.underline) {
    for (let x = 0; x < width; x += 1) addPoint(x, 7);
  }
  if (character.style.strikethrough) {
    for (let x = 0; x < width; x += 1) addPoint(x, 3);
  }

  return points;
}

function pointKey(x: number, y: number) {
  return `${x},${y}`;
}

export function renderPixelText(options: PixelTextOptions): PixelTextResult {
  const letterSpacing = Math.max(0, Math.min(3, Math.round(options.letterSpacing)));
  const lineSpacing = Math.max(0, Math.min(12, Math.round(options.lineSpacing)));
  const shadowDistance = Math.max(1, Math.min(4, Math.round(options.shadowDistance ?? 1)));
  const alignment = options.alignment ?? "left";
  const baseStyle: PixelTextStyle = { ...DEFAULT_STYLE, ...options.style };
  const lines = parseStyledLines(options.text, baseStyle);
  const lineWidths = lines.map((line) => line.reduce(
    (total, character, index) => total + renderedCharacterWidth(character) + (index === line.length - 1 ? 0 : letterSpacing),
    0,
  ));
  const lineHeights = lines.map((line) => line.some((character) => character.style.underline) ? 8 : 7);
  const contentWidth = Math.max(1, ...lineWidths);
  const contentHeight = lineHeights.reduce((total, height) => total + height, 0)
    + Math.max(0, lines.length - 1) * lineSpacing;
  const effectInset = options.outline ? 1 : 0;
  const effectOutset = effectInset + (options.shadow ? shadowDistance : 0);
  const width = contentWidth + effectInset + effectOutset;
  const height = contentHeight + effectInset + effectOutset;
  const cells: PixelTextCell[][] = Array.from({ length: height }, () => Array(width).fill(0));
  const cellColors: (string | null)[][] = Array.from({ length: height }, () => Array(width).fill(null));
  const mainPoints = new Map<string, PixelPoint>();
  const outlinePoints = new Map<string, PixelPoint>();
  let lineYOffset = effectInset;

  lines.forEach((line, lineIndex) => {
    const availableSpace = contentWidth - lineWidths[lineIndex];
    const alignmentOffset = alignment === "right" ? availableSpace : alignment === "center" ? Math.floor(availableSpace / 2) : 0;
    let xOffset = effectInset + alignmentOffset;
    line.forEach((character, characterIndex) => {
      renderCharacter(character, xOffset, lineYOffset).forEach((point) => mainPoints.set(pointKey(point.x, point.y), point));
      xOffset += renderedCharacterWidth(character) + (characterIndex === line.length - 1 ? 0 : letterSpacing);
    });
    lineYOffset += lineHeights[lineIndex] + lineSpacing;
  });

  if (options.outline) {
    mainPoints.forEach((point) => {
      for (let y = point.y - 1; y <= point.y + 1; y += 1) {
        for (let x = point.x - 1; x <= point.x + 1; x += 1) {
          if (x < 0 || y < 0 || x >= width || y >= height || mainPoints.has(pointKey(x, y))) continue;
          outlinePoints.set(pointKey(x, y), { x, y, color: point.color });
        }
      }
    });
  }

  if (options.shadow) {
    const shadowSource = options.outline ? [...mainPoints.values(), ...outlinePoints.values()] : [...mainPoints.values()];
    shadowSource.forEach((point) => {
      const x = point.x + shadowDistance;
      const y = point.y + shadowDistance;
      cells[y][x] = 2;
      cellColors[y][x] = point.color;
    });
  }

  outlinePoints.forEach((point) => {
    cells[point.y][point.x] = 3;
  });

  mainPoints.forEach((point) => {
    cells[point.y][point.x] = 1;
    cellColors[point.y][point.x] = point.color;
  });

  let mainBlocks = 0;
  let shadowBlocks = 0;
  let outlineBlocks = 0;
  cells.forEach((row) => row.forEach((cell) => {
    if (cell === 1) mainBlocks += 1;
    if (cell === 2) shadowBlocks += 1;
    if (cell === 3) outlineBlocks += 1;
  }));
  return { cells, width, height, mainBlocks, shadowBlocks, outlineBlocks, cellColors, shadowDistance };
}
