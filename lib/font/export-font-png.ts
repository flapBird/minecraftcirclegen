import type { PixelTextResult } from "./pixel-font";

export interface FontExportOptions {
  blockSize: number;
  mainColor: string;
  gradientColor?: string;
  fillMode?: "solid" | "gradient" | "rainbow";
  shadowColor: string;
  gameShadow?: boolean;
  outlineColor?: string;
  backgroundColor: string;
  transparent: boolean;
  padding?: number;
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((part) => part + part).join("") : value;
  const numeric = Number.parseInt(normalized, 16);
  return {
    red: (numeric >> 16) & 255,
    green: (numeric >> 8) & 255,
    blue: numeric & 255,
  };
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue].map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`;
}

function mixColors(start: string, end: string, progress: number) {
  const from = hexToRgb(start);
  const to = hexToRgb(end);
  return rgbToHex(
    from.red + (to.red - from.red) * progress,
    from.green + (to.green - from.green) * progress,
    from.blue + (to.blue - from.blue) * progress,
  );
}

function darkenColor(color: string) {
  const { red, green, blue } = hexToRgb(color);
  return rgbToHex(red * 0.25, green * 0.25, blue * 0.25);
}

function mainPixelColor(result: PixelTextResult, options: FontExportOptions, x: number, y: number) {
  const inlineColor = result.cellColors[y]?.[x];
  if (inlineColor) return inlineColor;
  if (options.fillMode === "rainbow") {
    const hue = ((x / Math.max(1, result.width - 1)) * 300 + (y / Math.max(1, result.height - 1)) * 35) % 360;
    return `hsl(${hue} 88% 58%)`;
  }
  if (options.fillMode === "gradient") {
    return mixColors(options.mainColor, options.gradientColor ?? "#55ffff", x / Math.max(1, result.width - 1));
  }
  return options.mainColor;
}

function pixelColor(result: PixelTextResult, options: FontExportOptions, cell: number, x: number, y: number) {
  if (cell === 1) return mainPixelColor(result, options, x, y);
  if (cell === 3) return options.outlineColor ?? "#111111";
  if (!options.gameShadow) return options.shadowColor;
  const sourceX = Math.max(0, x - result.shadowDistance);
  const sourceY = Math.max(0, y - result.shadowDistance);
  const sourceColor = result.cellColors[y]?.[x] ?? mainPixelColor(result, options, sourceX, sourceY);
  if (sourceColor.startsWith("hsl")) return "rgba(0, 0, 0, 0.72)";
  return darkenColor(sourceColor);
}

export function paintPixelText(
  context: CanvasRenderingContext2D,
  result: PixelTextResult,
  options: FontExportOptions,
  padding: number,
) {
  if (!options.transparent) {
    context.fillStyle = options.backgroundColor;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  } else {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }
  result.cells.forEach((row, y) => row.forEach((cell, x) => {
    if (cell === 0) return;
    context.fillStyle = pixelColor(result, options, cell, x, y);
    context.fillRect(
      padding + x * options.blockSize,
      padding + y * options.blockSize,
      options.blockSize,
      options.blockSize,
    );
  }));
}

export function downloadFontPng(result: PixelTextResult, options: FontExportOptions) {
  const padding = options.blockSize * (options.padding ?? 2);
  const canvas = document.createElement("canvas");
  canvas.width = result.width * options.blockSize + padding * 2;
  canvas.height = result.height * options.blockSize + padding * 2;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas export is unavailable in this browser.");
  context.imageSmoothingEnabled = false;
  paintPixelText(context, result, options, padding);
  const anchor = document.createElement("a");
  anchor.download = "minecraft-pixel-text.png";
  anchor.href = canvas.toDataURL("image/png");
  anchor.click();
}

export async function copyFontPng(result: PixelTextResult, options: FontExportOptions) {
  if (!("ClipboardItem" in window) || !navigator.clipboard?.write) {
    throw new Error("PNG clipboard copying is unavailable in this browser.");
  }
  const padding = options.blockSize * (options.padding ?? 2);
  const canvas = document.createElement("canvas");
  canvas.width = result.width * options.blockSize + padding * 2;
  canvas.height = result.height * options.blockSize + padding * 2;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas export is unavailable in this browser.");
  context.imageSmoothingEnabled = false;
  paintPixelText(context, result, options, padding);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("The PNG could not be created.");
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}
