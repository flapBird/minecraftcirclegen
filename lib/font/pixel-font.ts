export type PixelTextCell = 0 | 1 | 2;

export interface PixelTextOptions {
  text: string;
  letterSpacing: number;
  lineSpacing: number;
  shadow: boolean;
}

export interface PixelTextResult {
  cells: PixelTextCell[][];
  width: number;
  height: number;
  mainBlocks: number;
  shadowBlocks: number;
}

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
  return value.toUpperCase().replace(/[^A-Z0-9 !?.,:+\-\n]/g, "?").slice(0, 80);
}

export function renderPixelText(options: PixelTextOptions): PixelTextResult {
  const text = normalizePixelText(options.text) || "MINECRAFT";
  const letterSpacing = Math.max(0, Math.min(3, Math.round(options.letterSpacing)));
  const lineSpacing = Math.max(0, Math.min(12, Math.round(options.lineSpacing)));
  const lines = text.split("\n").slice(0, 3);
  const lineWidths = lines.map((line) =>
    [...line].reduce((total, character, index) => {
      const glyph = GLYPHS[character] ?? FALLBACK;
      return total + glyph[0].length + (index === line.length - 1 ? 0 : letterSpacing);
    }, 0),
  );
  const contentWidth = Math.max(1, ...lineWidths);
  const contentHeight = lines.length * 7 + Math.max(0, lines.length - 1) * lineSpacing;
  const shadowOffset = options.shadow ? 1 : 0;
  const width = contentWidth + shadowOffset;
  const height = contentHeight + shadowOffset;
  const cells: PixelTextCell[][] = Array.from({ length: height }, () => Array(width).fill(0));

  lines.forEach((line, lineIndex) => {
    const yOffset = lineIndex * (7 + lineSpacing);
    let xOffset = 0;
    [...line].forEach((character) => {
      const glyph = GLYPHS[character] ?? FALLBACK;
      glyph.forEach((row, y) => [...row].forEach((pixel, x) => {
        if (pixel !== "1") return;
        if (options.shadow && yOffset + y + 1 < height && xOffset + x + 1 < width) {
          cells[yOffset + y + 1][xOffset + x + 1] = 2;
        }
      }));
      xOffset += glyph[0].length + letterSpacing;
    });
  });

  lines.forEach((line, lineIndex) => {
    const yOffset = lineIndex * (7 + lineSpacing);
    let xOffset = 0;
    [...line].forEach((character) => {
      const glyph = GLYPHS[character] ?? FALLBACK;
      glyph.forEach((row, y) => [...row].forEach((pixel, x) => {
        if (pixel === "1") cells[yOffset + y][xOffset + x] = 1;
      }));
      xOffset += glyph[0].length + letterSpacing;
    });
  });

  let mainBlocks = 0;
  let shadowBlocks = 0;
  cells.forEach((row) => row.forEach((cell) => {
    if (cell === 1) mainBlocks += 1;
    if (cell === 2) shadowBlocks += 1;
  }));
  return { cells, width, height, mainBlocks, shadowBlocks };
}
