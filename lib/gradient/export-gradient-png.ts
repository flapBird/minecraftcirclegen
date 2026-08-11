import type { GradientOptions, GradientStep } from "./gradient-types";

export function downloadGradientPng(steps: GradientStep[], options: GradientOptions) {
  const columns = steps.length <= 8 ? 2 : steps.length <= 15 ? 3 : 4;
  const cardWidth = 310;
  const cardHeight = 104;
  const gap = 18;
  const margin = 64;
  const header = 170;
  const rows = Math.ceil(steps.length / columns);
  const canvas = document.createElement("canvas");
  canvas.width = margin * 2 + columns * cardWidth + (columns - 1) * gap;
  canvas.height = header + rows * cardHeight + (rows - 1) * gap + margin;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas export is unavailable in this browser.");

  context.fillStyle = "#f8f5ed";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#273229";
  context.font = "700 38px system-ui, sans-serif";
  context.fillText("Minecraft Block Gradient", margin, 56);
  context.fillStyle = "#667066";
  context.font = "500 22px system-ui, sans-serif";
  context.fillText(
    `${options.startColor.toUpperCase()} → ${options.endColor.toUpperCase()} · ${steps.length} blocks`,
    margin,
    96,
  );

  const stripY = 122;
  const stripWidth = canvas.width - margin * 2;
  const segmentWidth = stripWidth / steps.length;
  steps.forEach((step, index) => {
    context.fillStyle = step.block.hex;
    context.fillRect(margin + index * segmentWidth, stripY, Math.ceil(segmentWidth), 24);
  });

  steps.forEach((step, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = margin + column * (cardWidth + gap);
    const y = header + row * (cardHeight + gap);
    context.fillStyle = "#fffdf6";
    context.strokeStyle = "#d4d0c3";
    context.lineWidth = 2;
    context.fillRect(x, y, cardWidth, cardHeight);
    context.strokeRect(x, y, cardWidth, cardHeight);
    context.fillStyle = step.block.hex;
    context.fillRect(x + 14, y + 14, 76, 76);
    context.fillStyle = "#273229";
    context.font = "700 18px system-ui, sans-serif";
    context.fillText(`${step.index}. ${step.block.name}`, x + 105, y + 42, cardWidth - 118);
    context.fillStyle = "#667066";
    context.font = "500 15px ui-monospace, monospace";
    context.fillText(step.block.hex.toUpperCase(), x + 105, y + 69);
  });

  const anchor = document.createElement("a");
  anchor.download = `minecraft-gradient-${options.startColor.slice(1)}-${options.endColor.slice(1)}.png`;
  anchor.href = canvas.toDataURL("image/png");
  anchor.click();
}
