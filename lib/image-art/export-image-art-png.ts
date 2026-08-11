import type { ImageArtMode, ImageArtResult } from "./image-art-types";

export function drawImageArt(
  context: CanvasRenderingContext2D,
  result: ImageArtResult,
  cell: number,
  showGrid: boolean,
  mode: ImageArtMode,
) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  result.cells.forEach((row, y) => row.forEach((block, x) => {
    if (!block) return;
    context.fillStyle = block.hex;
    context.fillRect(x * cell, y * cell, cell, cell);
  }));
  if (showGrid && cell >= 4) {
    context.strokeStyle = "rgba(55, 65, 56, .17)";
    context.lineWidth = 1;
    context.beginPath();
    for (let x = 0; x <= result.width; x += 1) {
      context.moveTo(x * cell, 0);
      context.lineTo(x * cell, result.height * cell);
    }
    for (let y = 0; y <= result.height; y += 1) {
      context.moveTo(0, y * cell);
      context.lineTo(result.width * cell, y * cell);
    }
    context.stroke();
  }
  if (mode === "map") {
    context.strokeStyle = "rgba(183, 103, 63, .8)";
    context.lineWidth = Math.max(2, cell * 0.7);
    context.beginPath();
    for (let x = 128; x < result.width; x += 128) {
      context.moveTo(x * cell, 0);
      context.lineTo(x * cell, result.height * cell);
    }
    for (let y = 128; y < result.height; y += 128) {
      context.moveTo(0, y * cell);
      context.lineTo(result.width * cell, y * cell);
    }
    context.stroke();
  }
}

export function downloadImageArtPng(
  result: ImageArtResult,
  mode: ImageArtMode,
  showGrid: boolean,
) {
  const maxSide = mode === "map" ? 2048 : 1600;
  const cell = Math.max(1, Math.min(16, Math.floor(maxSide / Math.max(result.width, result.height))));
  const canvas = document.createElement("canvas");
  canvas.width = result.width * cell;
  canvas.height = result.height * cell;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas export is unavailable in this browser.");
  context.imageSmoothingEnabled = false;
  drawImageArt(context, result, cell, showGrid, mode);
  const anchor = document.createElement("a");
  anchor.download = `minecraft-${mode === "map" ? "map-art" : "pixel-art"}-blueprint.png`;
  anchor.href = canvas.toDataURL("image/png");
  anchor.click();
}
