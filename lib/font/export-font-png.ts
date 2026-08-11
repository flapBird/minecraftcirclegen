import type { PixelTextResult } from "./pixel-font";

export interface FontExportOptions {
  blockSize: number;
  mainColor: string;
  shadowColor: string;
  backgroundColor: string;
  transparent: boolean;
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
    context.fillStyle = cell === 1 ? options.mainColor : options.shadowColor;
    context.fillRect(
      padding + x * options.blockSize,
      padding + y * options.blockSize,
      options.blockSize,
      options.blockSize,
    );
  }));
}

export function downloadFontPng(result: PixelTextResult, options: FontExportOptions) {
  const padding = options.blockSize * 2;
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
