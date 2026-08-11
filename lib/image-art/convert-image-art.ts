import { blocksForPalette } from "@/lib/gradient/generate-gradient";
import type { GradientPalette, MinecraftBlockColor } from "@/lib/gradient/gradient-types";
import { MAP_ART_BLOCK_COLORS } from "./map-art-block-colors";
import type { ImageArtMode, ImageArtResult, ImageFit, RasterImage } from "./image-art-types";

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB {
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16),
  };
}

function nearestBlock(
  color: RGB,
  candidates: Array<{ block: MinecraftBlockColor; rgb: RGB }>,
) {
  let best = candidates[0];
  let bestScore = Number.POSITIVE_INFINITY;
  candidates.forEach((candidate) => {
    const red = color.r - candidate.rgb.r;
    const green = color.g - candidate.rgb.g;
    const blue = color.b - candidate.rgb.b;
    const score = red * red * 0.3 + green * green * 0.59 + blue * blue * 0.11;
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  });
  return best;
}

export function resizeRasterImage(
  source: RasterImage,
  targetWidth: number,
  targetHeight: number,
  fit: ImageFit,
): RasterImage {
  const width = Math.max(1, Math.round(targetWidth));
  const height = Math.max(1, Math.round(targetHeight));
  const output = new Uint8ClampedArray(width * height * 4);
  const scale = fit === "cover"
    ? Math.max(width / source.width, height / source.height)
    : Math.min(width / source.width, height / source.height);
  const drawnWidth = source.width * scale;
  const drawnHeight = source.height * scale;
  const offsetX = (width - drawnWidth) / 2;
  const offsetY = (height - drawnHeight) / 2;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sourceX = Math.floor((x - offsetX) / scale);
      const sourceY = Math.floor((y - offsetY) / scale);
      const outputIndex = (y * width + x) * 4;
      if (sourceX < 0 || sourceX >= source.width || sourceY < 0 || sourceY >= source.height) {
        output[outputIndex + 3] = 0;
        continue;
      }
      const sourceIndex = (sourceY * source.width + sourceX) * 4;
      output[outputIndex] = source.data[sourceIndex];
      output[outputIndex + 1] = source.data[sourceIndex + 1];
      output[outputIndex + 2] = source.data[sourceIndex + 2];
      output[outputIndex + 3] = source.data[sourceIndex + 3];
    }
  }
  return { width, height, data: output };
}

export function convertRasterToBlocks({
  raster,
  mode,
  palette,
  dither,
  backgroundColor,
  transparentPixels,
}: {
  raster: RasterImage;
  mode: ImageArtMode;
  palette: GradientPalette;
  dither: boolean;
  backgroundColor: string;
  transparentPixels: boolean;
}): ImageArtResult {
  const blocks = mode === "map" ? MAP_ART_BLOCK_COLORS : blocksForPalette(palette);
  const candidates = blocks.map((block) => ({ block, rgb: hexToRgb(block.hex) }));
  const background = hexToRgb(backgroundColor);
  const colors = new Float32Array(raster.width * raster.height * 3);
  const empty = new Uint8Array(raster.width * raster.height);

  for (let index = 0; index < raster.width * raster.height; index += 1) {
    const sourceIndex = index * 4;
    const alpha = raster.data[sourceIndex + 3] / 255;
    if (transparentPixels && alpha < 0.08) empty[index] = 1;
    colors[index * 3] = raster.data[sourceIndex] * alpha + background.r * (1 - alpha);
    colors[index * 3 + 1] = raster.data[sourceIndex + 1] * alpha + background.g * (1 - alpha);
    colors[index * 3 + 2] = raster.data[sourceIndex + 2] * alpha + background.b * (1 - alpha);
  }

  const cells: ImageArtResult["cells"] = Array.from(
    { length: raster.height },
    () => Array(raster.width).fill(null),
  );
  const counts = new Map<string, { block: MinecraftBlockColor; count: number }>();
  let blockCount = 0;

  const addError = (x: number, y: number, error: RGB, weight: number) => {
    if (x < 0 || x >= raster.width || y < 0 || y >= raster.height) return;
    const index = y * raster.width + x;
    if (empty[index]) return;
    const colorIndex = index * 3;
    colors[colorIndex] += error.r * weight;
    colors[colorIndex + 1] += error.g * weight;
    colors[colorIndex + 2] += error.b * weight;
  };

  for (let y = 0; y < raster.height; y += 1) {
    for (let x = 0; x < raster.width; x += 1) {
      const index = y * raster.width + x;
      if (empty[index]) continue;
      const colorIndex = index * 3;
      const current = {
        r: Math.max(0, Math.min(255, colors[colorIndex])),
        g: Math.max(0, Math.min(255, colors[colorIndex + 1])),
        b: Math.max(0, Math.min(255, colors[colorIndex + 2])),
      };
      const match = nearestBlock(current, candidates);
      cells[y][x] = match.block;
      blockCount += 1;
      const count = counts.get(match.block.id);
      counts.set(match.block.id, { block: match.block, count: (count?.count ?? 0) + 1 });

      if (dither) {
        const error = {
          r: current.r - match.rgb.r,
          g: current.g - match.rgb.g,
          b: current.b - match.rgb.b,
        };
        addError(x + 1, y, error, 7 / 16);
        addError(x - 1, y + 1, error, 3 / 16);
        addError(x, y + 1, error, 5 / 16);
        addError(x + 1, y + 1, error, 1 / 16);
      }
    }
  }

  return {
    width: raster.width,
    height: raster.height,
    cells,
    blockCount,
    emptyCount: raster.width * raster.height - blockCount,
    materials: [...counts.values()].sort((left, right) => right.count - left.count),
  };
}
