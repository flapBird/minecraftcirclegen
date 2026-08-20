import type { GradientOptions, GradientStep } from "./gradient-types";

interface OklabColor {
  l: number;
  a: number;
  b: number;
}

const EXPORT_WIDTH = 1600;
const EXPORT_MARGIN = 80;
const CONTENT_WIDTH = EXPORT_WIDTH - EXPORT_MARGIN * 2;

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#ffffff";
  return [
    Number.parseInt(normalized.slice(1, 3), 16) / 255,
    Number.parseInt(normalized.slice(3, 5), 16) / 255,
    Number.parseInt(normalized.slice(5, 7), 16) / 255,
  ];
}

function linearize(value: number) {
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function delinearize(value: number) {
  return value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055;
}

function hexToOklab(hex: string): OklabColor {
  const [red, green, blue] = hexToRgb(hex).map(linearize) as [number, number, number];
  const l = 0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue;
  const m = 0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue;
  const s = 0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue;
  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);

  return {
    l: 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot,
    a: 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot,
    b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot,
  };
}

function oklabToCss(color: OklabColor) {
  const lRoot = color.l + 0.3963377774 * color.a + 0.2158037573 * color.b;
  const mRoot = color.l - 0.1055613458 * color.a - 0.0638541728 * color.b;
  const sRoot = color.l - 0.0894841775 * color.a - 1.291485548 * color.b;
  const l = lRoot ** 3;
  const m = mRoot ** 3;
  const s = sRoot ** 3;
  const red = clamp(delinearize(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s));
  const green = clamp(delinearize(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s));
  const blue = clamp(delinearize(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s));
  return `rgb(${Math.round(red * 255)} ${Math.round(green * 255)} ${Math.round(blue * 255)})`;
}

function addOklabStops(gradient: CanvasGradient, startHex: string, endHex: string) {
  const start = hexToOklab(startHex);
  const end = hexToOklab(endHex);
  const stopCount = 32;
  for (let index = 0; index <= stopCount; index += 1) {
    const amount = index / stopCount;
    gradient.addColorStop(amount, oklabToCss({
      l: start.l + (end.l - start.l) * amount,
      a: start.a + (end.a - start.a) * amount,
      b: start.b + (end.b - start.b) * amount,
    }));
  }
}

function roundedPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function fillRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string | CanvasGradient,
  strokeStyle?: string,
) {
  roundedPath(context, x, y, width, height, radius);
  context.fillStyle = fillStyle;
  context.fill();
  if (strokeStyle) {
    context.strokeStyle = strokeStyle;
    context.lineWidth = 2;
    context.stroke();
  }
}

function endpointColors(steps: GradientStep[], options: GradientOptions) {
  if (options.endpointMode === "block") {
    return {
      start: steps[0]?.block.hex ?? options.startColor,
      end: steps.at(-1)?.block.hex ?? options.endColor,
    };
  }
  return { start: options.startColor, end: options.endColor };
}

export function renderGradientExportCanvas(
  steps: GradientStep[],
  options: GradientOptions,
  textures: ReadonlyMap<string, CanvasImageSource> = new Map(),
) {
  const cardColumns = 2;
  const cardGap = 16;
  const cardHeight = 108;
  const listTop = 560;
  const rows = Math.ceil(steps.length / cardColumns);
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_WIDTH;
  canvas.height = listTop + rows * cardHeight + Math.max(0, rows - 1) * cardGap + 72;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas export is unavailable in this browser.");

  context.imageSmoothingEnabled = false;
  context.fillStyle = "#f8f5ed";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#273229";
  context.font = "700 46px system-ui, sans-serif";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.fillText("Your gradient", EXPORT_MARGIN, 82);
  context.fillStyle = "#687168";
  context.font = "500 24px ui-monospace, monospace";
  context.textAlign = "right";
  context.fillText(`${steps.length} blocks · build in order`, EXPORT_WIDTH - EXPORT_MARGIN, 80);

  const colors = endpointColors(steps, options);
  const colorTop = 126;
  const colorHeight = 112;
  const colorGradient = context.createLinearGradient(EXPORT_MARGIN, 0, EXPORT_WIDTH - EXPORT_MARGIN, 0);
  addOklabStops(colorGradient, colors.start, colors.end);
  fillRoundedRect(
    context,
    EXPORT_MARGIN,
    colorTop,
    CONTENT_WIDTH,
    colorHeight,
    28,
    colorGradient,
    "#aaa99d",
  );

  const textureTop = 270;
  const textureHeight = 190;
  const segmentWidth = CONTENT_WIDTH / steps.length;
  context.save();
  roundedPath(context, EXPORT_MARGIN, textureTop, CONTENT_WIDTH, textureHeight, 28);
  context.clip();
  steps.forEach((step, index) => {
    const x = EXPORT_MARGIN + index * segmentWidth;
    context.fillStyle = step.block.hex;
    context.fillRect(x, textureTop, Math.ceil(segmentWidth), textureHeight);
    const texture = textures.get(step.block.id);
    if (texture) context.drawImage(texture, x, textureTop, Math.ceil(segmentWidth), Math.ceil(segmentWidth));
    fillRoundedRect(
      context,
      x + segmentWidth - 38,
      textureTop + textureHeight - 38,
      28,
      28,
      4,
      "rgba(16, 20, 17, 0.78)",
      "rgba(255, 255, 255, 0.42)",
    );
    context.fillStyle = "#ffffff";
    context.font = "800 16px ui-monospace, monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(String(step.index), x + segmentWidth - 24, textureTop + textureHeight - 24);
  });
  context.restore();
  roundedPath(context, EXPORT_MARGIN, textureTop, CONTENT_WIDTH, textureHeight, 28);
  context.strokeStyle = "#aaa99d";
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = "#777d75";
  context.font = "500 20px system-ui, sans-serif";
  context.textAlign = "right";
  context.textBaseline = "alphabetic";
  context.fillText("Actual block textures · place from left to right", EXPORT_WIDTH - EXPORT_MARGIN, 500);

  const cardWidth = (CONTENT_WIDTH - cardGap) / cardColumns;
  steps.forEach((step, index) => {
    const column = index % cardColumns;
    const row = Math.floor(index / cardColumns);
    const x = EXPORT_MARGIN + column * (cardWidth + cardGap);
    const y = listTop + row * (cardHeight + cardGap);
    fillRoundedRect(context, x, y, cardWidth, cardHeight, 10, "#fffdf6", "#d4d0c3");

    const texture = textures.get(step.block.id);
    context.fillStyle = step.block.hex;
    context.fillRect(x + 14, y + 14, 80, 80);
    if (texture) context.drawImage(texture, x + 14, y + 14, 80, 80);

    context.fillStyle = "#273229";
    context.font = "700 22px system-ui, sans-serif";
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
    context.fillText(`${step.index}. ${step.block.name}`, x + 112, y + 45, cardWidth - 130);
    context.fillStyle = "#6d756d";
    context.font = "500 17px ui-monospace, monospace";
    context.fillText(
      `${step.block.hex.toUpperCase()} · ${step.block.category ?? step.block.family}`,
      x + 112,
      y + 75,
      cardWidth - 130,
    );
  });

  return canvas;
}

function loadTexture(step: GradientStep) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = `/minecraft-blocks/${step.block.texture ?? `${step.block.id}.png`}`;
  });
}

async function loadTextures(steps: GradientStep[]) {
  const entries = await Promise.all(steps.map(async (step) => [
    step.block.id,
    await loadTexture(step),
  ] as const));
  return new Map(entries.filter((entry): entry is [string, HTMLImageElement] => entry[1] !== null));
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("The PNG could not be encoded."));
    }, "image/png");
  });
}

export async function downloadGradientPng(steps: GradientStep[], options: GradientOptions) {
  const textures = await loadTextures(steps);
  const canvas = renderGradientExportCanvas(steps, options, textures);
  const blob = await canvasToBlob(canvas);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const start = options.endpointMode === "block" ? steps[0]?.block.id : options.startColor.slice(1);
  const end = options.endpointMode === "block" ? steps.at(-1)?.block.id : options.endColor.slice(1);
  anchor.download = `minecraft-gradient-${start}-${end}.png`;
  anchor.href = url;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
