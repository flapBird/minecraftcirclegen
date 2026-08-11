import type { GeometryResult } from "./geometry-types";

export async function downloadGeometryPng(result: GeometryResult, showGrid: boolean) {
  const maxGridSize = 1536;
  const cell = Math.max(3, Math.floor(maxGridSize / Math.max(result.width, result.height)));
  const gridWidth = result.width * cell;
  const gridHeight = result.height * cell;
  const margin = 72;
  const header = 150;
  const footer = 82;
  const canvas = document.createElement("canvas");
  canvas.width = gridWidth + margin * 2;
  canvas.height = gridHeight + header + footer;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas export is unavailable in this browser.");

  context.fillStyle = "#f8f5ed";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#243027";
  context.font = "700 38px system-ui, sans-serif";
  context.fillText(`Minecraft ${result.label} Blueprint`, margin, 54);
  context.fillStyle = "#667066";
  context.font = "500 23px system-ui, sans-serif";
  const layerText = result.layerCount > 1 ? ` · Layer ${result.layer}/${result.layerCount}` : "";
  context.fillText(
    `${result.width} × ${result.height} blocks · ${result.mode}${layerText}`,
    margin,
    96,
  );

  const originX = margin;
  const originY = header;
  context.fillStyle = "#f2eee3";
  context.fillRect(originX, originY, gridWidth, gridHeight);
  result.grid.forEach((row, y) => row.forEach((filled, x) => {
    if (!filled) return;
    const inset = showGrid ? Math.min(0.7, cell * 0.08) : 0;
    context.fillStyle = "#4f8345";
    context.fillRect(
      originX + x * cell + inset,
      originY + y * cell + inset,
      Math.max(1, cell - inset * 2),
      Math.max(1, cell - inset * 2),
    );
  }));

  if (showGrid) {
    context.strokeStyle = "rgba(68,88,64,.16)";
    context.lineWidth = 1;
    context.beginPath();
    for (let x = 0; x <= result.width; x += 1) {
      context.moveTo(originX + x * cell, originY);
      context.lineTo(originX + x * cell, originY + gridHeight);
    }
    for (let y = 0; y <= result.height; y += 1) {
      context.moveTo(originX, originY + y * cell);
      context.lineTo(originX + gridWidth, originY + y * cell);
    }
    context.stroke();
  }

  context.strokeStyle = "rgba(183,103,63,.72)";
  context.lineWidth = Math.max(2, cell * 0.08);
  context.beginPath();
  context.moveTo(originX + gridWidth / 2, originY);
  context.lineTo(originX + gridWidth / 2, originY + gridHeight);
  context.moveTo(originX, originY + gridHeight / 2);
  context.lineTo(originX + gridWidth, originY + gridHeight / 2);
  context.stroke();

  context.fillStyle = "#667066";
  context.font = "500 20px system-ui, sans-serif";
  context.fillText(
    `${result.currentBlocks.toLocaleString()} blocks on this blueprint`,
    margin,
    canvas.height - 32,
  );

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("The blueprint image could not be created.");
  const suffix = result.layerCount > 1 ? `-layer-${result.layer}` : "";
  const filename = `minecraft-${result.shape}-${result.width}x${result.height}${suffix}.png`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
