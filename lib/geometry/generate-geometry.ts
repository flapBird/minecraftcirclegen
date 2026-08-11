import { generateCircle } from "@/lib/circle/generate-circle";
import type { CircleMode } from "@/lib/circle/circle-types";
import type {
  GeometryOptions,
  GeometryResult,
  GeometryShape,
} from "./geometry-types";

export const MIN_GEOMETRY_SIZE = 3;
export const MAX_PLANAR_SIZE = 512;
export const MAX_VOLUME_SIZE = 128;

export function maxSizeForShape(shape: GeometryShape) {
  return shape === "sphere" || shape === "dome"
    ? MAX_VOLUME_SIZE
    : MAX_PLANAR_SIZE;
}

export function normalizeSize(value: number, shape: GeometryShape) {
  const fallback = 21;
  const whole = Number.isFinite(value) ? Math.round(value) : fallback;
  return Math.max(MIN_GEOMETRY_SIZE, Math.min(maxSizeForShape(shape), whole));
}

function boundaryDepths(grid: boolean[][]) {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  const depths = Array.from({ length: height }, () => Array<number>(width).fill(0));
  const queue: Array<[number, number]> = [];
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]] as const;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!grid[y][x]) continue;
      const boundary = directions.some(([dx, dy]) => {
        const nextX = x + dx;
        const nextY = y + dy;
        return nextX < 0 || nextX >= width || nextY < 0 || nextY >= height || !grid[nextY][nextX];
      });
      if (boundary) {
        depths[y][x] = 1;
        queue.push([x, y]);
      }
    }
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const [x, y] = queue[cursor];
    for (const [dx, dy] of directions) {
      const nextX = x + dx;
      const nextY = y + dy;
      if (
        nextX < 0 || nextX >= width || nextY < 0 || nextY >= height ||
        !grid[nextY][nextX] || depths[nextY][nextX] !== 0
      ) continue;
      depths[nextY][nextX] = depths[y][x] + 1;
      queue.push([nextX, nextY]);
    }
  }
  return depths;
}

function applyPlanarMode(grid: boolean[][], mode: CircleMode, thickness: number) {
  if (mode === "filled") return grid;
  const depth = mode === "hollow" ? 1 : Math.max(1, thickness);
  const depths = boundaryDepths(grid);
  return grid.map((row, y) => row.map((filled, x) => filled && depths[y][x] <= depth));
}

function generateOvalGrid(width: number, height: number, mode: CircleMode, thickness: number) {
  const centerX = (width - 1) / 2;
  const centerY = (height - 1) / 2;
  const radiusX = width / 2;
  const radiusY = height / 2;
  const filled = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const dx = (x - centerX) / radiusX;
      const dy = (y - centerY) / radiusY;
      return dx * dx + dy * dy <= 1;
    }),
  );
  return applyPlanarMode(filled, mode, thickness);
}

function isInsideSphere(x: number, y: number, z: number, diameter: number) {
  const center = (diameter - 1) / 2;
  const radius = diameter / 2;
  const dx = x - center;
  const dy = y - center;
  const dz = z - center;
  return dx * dx + dy * dy + dz * dz <= radius * radius;
}

function sphereSlice(diameter: number, fullY: number, mode: CircleMode) {
  const directions = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0],
    [0, -1, 0], [0, 0, 1], [0, 0, -1],
  ] as const;
  return Array.from({ length: diameter }, (_, z) =>
    Array.from({ length: diameter }, (_, x) => {
      if (!isInsideSphere(x, fullY, z, diameter)) return false;
      if (mode === "filled") return true;
      return directions.some(([dx, dy, dz]) =>
        !isInsideSphere(x + dx, fullY + dy, z + dz, diameter),
      );
    }),
  );
}

function countGrid(grid: boolean[][]) {
  return grid.reduce((total, row) => total + row.filter(Boolean).length, 0);
}

const volumeTotalCache = new Map<string, number>();

export function getLayerCount(shape: GeometryShape, diameter: number) {
  if (shape === "sphere") return diameter;
  if (shape === "dome") return Math.ceil(diameter / 2);
  return 1;
}

function fullYForLayer(shape: "sphere" | "dome", diameter: number, layer: number) {
  if (shape === "sphere") return diameter - layer;
  const baseY = Math.floor((diameter - 1) / 2);
  return baseY - (layer - 1);
}

export function generateGeometry(
  shape: GeometryShape,
  rawOptions: GeometryOptions,
): GeometryResult {
  const diameter = normalizeSize(rawOptions.diameter, shape);
  const width = normalizeSize(rawOptions.width, shape);
  const height = normalizeSize(rawOptions.height, shape);
  const thickness = Math.max(1, Math.round(rawOptions.thickness || 1));

  if (shape === "circle") {
    const circle = generateCircle({ diameter, mode: rawOptions.mode, thickness });
    return {
      shape,
      label: "Circle",
      width: diameter,
      height: diameter,
      grid: circle.grid,
      mode: circle.mode,
      thickness: circle.thickness,
      currentBlocks: circle.totalBlocks,
      totalBlocks: circle.totalBlocks,
      layer: 1,
      layerCount: 1,
    };
  }

  if (shape === "oval") {
    const grid = generateOvalGrid(width, height, rawOptions.mode, thickness);
    const blocks = countGrid(grid);
    return {
      shape,
      label: "Oval",
      width,
      height,
      grid,
      mode: rawOptions.mode,
      thickness,
      currentBlocks: blocks,
      totalBlocks: blocks,
      layer: 1,
      layerCount: 1,
    };
  }

  const mode = rawOptions.mode === "filled" ? "filled" : "hollow";
  const layerCount = getLayerCount(shape, diameter);
  const layer = Math.max(1, Math.min(layerCount, Math.round(rawOptions.layer || 1)));
  const currentY = fullYForLayer(shape, diameter, layer);
  const grid = sphereSlice(diameter, currentY, mode);
  const totalKey = `${shape}:${diameter}:${mode}`;
  let totalBlocks = volumeTotalCache.get(totalKey);
  if (totalBlocks === undefined) {
    totalBlocks = 0;
    for (let index = 1; index <= layerCount; index += 1) {
      totalBlocks += countGrid(sphereSlice(diameter, fullYForLayer(shape, diameter, index), mode));
    }
    volumeTotalCache.set(totalKey, totalBlocks);
  }

  return {
    shape,
    label: shape === "sphere" ? "Sphere" : "Dome",
    width: diameter,
    height: diameter,
    grid,
    mode,
    thickness: 1,
    currentBlocks: countGrid(grid),
    totalBlocks,
    layer,
    layerCount,
  };
}
