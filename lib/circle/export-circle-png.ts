import type {
  CircleResult,
  ExportOptions,
} from "./circle-types";
import { formatCoordinate, formatMode } from "./circle-utils";

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  if (typeof context.roundRect === "function") {
    context.roundRect(x, y, width, height, radius);
  } else {
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
    context.closePath();
  }
  context.fill();
}

export function renderExportCanvas(
  result: CircleResult,
  options: ExportOptions,
): HTMLCanvasElement {
  const maxGridSize = 1536;
  const cellSize = Math.max(3, Math.floor(maxGridSize / result.diameter));
  const gridSize = cellSize * result.diameter;
  const margin = 72;
  const headerHeight = 150;
  const footerHeight = 86;
  const canvas = document.createElement("canvas");
  canvas.width = gridSize + margin * 2;
  canvas.height = gridSize + headerHeight + footerHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas export is unavailable in this browser.");

  if (!options.transparentBackground) {
    context.fillStyle = "#f4f7f2";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.fillStyle = "#18231b";
  context.font = "700 38px system-ui, sans-serif";
  context.fillText("Minecraft Circle Gen", margin, 54);
  context.font = "500 24px system-ui, sans-serif";
  context.fillStyle = "#536158";
  const modeText =
    result.mode === "thick"
      ? `${formatMode(result.mode)} · ${result.thickness} blocks thick`
      : formatMode(result.mode);
  context.fillText(
    `${result.diameter} × ${result.diameter} blocks · ${modeText} · ${result.totalBlocks} blocks`,
    margin,
    98,
  );

  const originX = margin;
  const originY = headerHeight;
  if (!options.transparentBackground) {
    context.fillStyle = "#ffffff";
    roundedRect(context, originX - 12, originY - 12, gridSize + 24, gridSize + 24, 16);
    context.fillStyle = "#edf1eb";
    context.fillRect(originX, originY, gridSize, gridSize);
  }

  for (let y = 0; y < result.diameter; y += 1) {
    for (let x = 0; x < result.diameter; x += 1) {
      if (!result.grid[y][x]) continue;
      context.fillStyle = "#3e7f4c";
      const inset = options.showGrid ? Math.min(0.5, cellSize * 0.08) : 0;
      context.fillRect(
        originX + x * cellSize + inset,
        originY + y * cellSize + inset,
        Math.max(1, cellSize - inset * 2),
        Math.max(1, cellSize - inset * 2),
      );
    }
  }

  if (options.showGrid) {
    context.strokeStyle = "rgba(40,58,45,.22)";
    context.lineWidth = 1;
    context.beginPath();
    for (let i = 0; i <= result.diameter; i += 1) {
      const position = i * cellSize;
      context.moveTo(originX + position, originY);
      context.lineTo(originX + position, originY + gridSize);
      context.moveTo(originX, originY + position);
      context.lineTo(originX + gridSize, originY + position);
    }
    context.stroke();
  }

  if (options.showAxes) {
    context.strokeStyle = "rgba(194,106,45,.8)";
    context.lineWidth = Math.max(2, cellSize * 0.08);
    context.beginPath();
    context.moveTo(originX + gridSize / 2, originY);
    context.lineTo(originX + gridSize / 2, originY + gridSize);
    context.moveTo(originX, originY + gridSize / 2);
    context.lineTo(originX + gridSize, originY + gridSize / 2);
    context.stroke();
  }

  if (options.showCoordinates) {
    const interval = Math.max(1, Math.ceil(34 / cellSize));
    const indices: number[] = [];
    for (let i = 0; i < result.diameter; i += interval) indices.push(i);
    if (indices.at(-1) !== result.diameter - 1) indices.push(result.diameter - 1);
    context.font = `${Math.max(9, Math.min(14, cellSize * 0.7))}px ui-monospace, monospace`;
    context.fillStyle = "rgba(24,35,27,.72)";
    context.textAlign = "center";
    context.textBaseline = "bottom";
    for (const i of indices) {
      const coordinate = formatCoordinate(i - (result.diameter - 1) / 2);
      context.fillText(
        coordinate,
        originX + (i + 0.5) * cellSize,
        originY - 7,
      );
    }
    context.textAlign = "right";
    context.textBaseline = "middle";
    for (const i of indices) {
      const coordinate = formatCoordinate(i - (result.diameter - 1) / 2);
      context.fillText(
        coordinate,
        originX - 8,
        originY + (i + 0.5) * cellSize,
      );
    }
    context.textBaseline = "alphabetic";
  }

  context.fillStyle = "#536158";
  context.font = "500 20px system-ui, sans-serif";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.fillText(
    `Diameter ${result.diameter} · ${result.totalBlocks} total blocks`,
    margin,
    canvas.height - 35,
  );
  context.textAlign = "right";
  context.fillText("minecraftcirclegen.com", canvas.width - margin, canvas.height - 35);
  return canvas;
}

export function exportFileName(result: CircleResult): string {
  const suffix =
    result.mode === "thick"
      ? `-${result.mode}-${result.thickness}`
      : `-${result.mode}`;
  return `minecraft-circle-${result.diameter}x${result.diameter}${suffix}.png`;
}

export async function downloadCirclePng(
  result: CircleResult,
  options: ExportOptions,
): Promise<"downloaded" | "shared" | "opened"> {
  const canvas = renderExportCanvas(result, options);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("The blueprint image could not be created.");
  const filename = exportFileName(result);
  const file = new File([blob], filename, { type: "image/png" });

  if (
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] }) &&
    /iPhone|iPad|Android/i.test(navigator.userAgent)
  ) {
    await navigator.share({ files: [file], title: "Minecraft circle blueprint" });
    return "shared";
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  if ("download" in link) {
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return "downloaded";
  }

  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    URL.revokeObjectURL(url);
    throw new Error("Your browser blocked the image. Please allow pop-ups and try again.");
  }
  return "opened";
}
