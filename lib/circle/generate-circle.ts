import type { CircleOptions, CircleResult } from "./circle-types";
import {
  DEFAULT_MODE,
  normalizeDiameter,
  normalizeThickness,
} from "./circle-utils";
import { generateRowPatterns } from "./generate-row-patterns";

function generateFilledGrid(diameter: number): boolean[][] {
  const center = (diameter - 1) / 2;
  const radius = diameter / 2;
  const radiusSquared = radius * radius;

  return Array.from({ length: diameter }, (_, y) =>
    Array.from({ length: diameter }, (_, x) => {
      const dx = x - center;
      const dy = y - center;
      return dx * dx + dy * dy <= radiusSquared;
    }),
  );
}

function getBoundaryDistances(grid: boolean[][]): number[][] {
  const size = grid.length;
  const distances = Array.from({ length: size }, () =>
    Array<number>(size).fill(0),
  );
  const queueX = new Int32Array(size * size);
  const queueY = new Int32Array(size * size);
  let head = 0;
  let tail = 0;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!grid[y][x]) continue;
      const boundary =
        y === 0 ||
        y === size - 1 ||
        x === 0 ||
        x === size - 1 ||
        !grid[y - 1][x] ||
        !grid[y + 1][x] ||
        !grid[y][x - 1] ||
        !grid[y][x + 1];
      if (!boundary) continue;
      distances[y][x] = 1;
      queueX[tail] = x;
      queueY[tail] = y;
      tail += 1;
    }
  }

  const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ] as const;

  while (head < tail) {
    const x = queueX[head];
    const y = queueY[head];
    const nextDistance = distances[y][x] + 1;
    head += 1;

    for (const [dx, dy] of directions) {
      const nextX = x + dx;
      const nextY = y + dy;
      if (
        nextX < 0 ||
        nextX >= size ||
        nextY < 0 ||
        nextY >= size ||
        !grid[nextY][nextX] ||
        distances[nextY][nextX] !== 0
      ) {
        continue;
      }
      distances[nextY][nextX] = nextDistance;
      queueX[tail] = nextX;
      queueY[tail] = nextY;
      tail += 1;
    }
  }

  return distances;
}

export function generateCircle(options: CircleOptions): CircleResult {
  const diameter = normalizeDiameter(options.diameter);
  const mode = ["hollow", "thick", "filled"].includes(options.mode)
    ? options.mode
    : DEFAULT_MODE;
  const thickness = normalizeThickness(options.thickness, diameter);
  const filledGrid = generateFilledGrid(diameter);

  let grid = filledGrid;
  let isEffectivelyFilled = mode === "filled";

  if (mode !== "filled") {
    const layers = mode === "hollow" ? 1 : thickness;
    const distances = getBoundaryDistances(filledGrid);
    grid = filledGrid.map((row, y) =>
      row.map((filled, x) => filled && distances[y][x] <= layers),
    );
    isEffectivelyFilled = filledGrid.every((row, y) =>
      row.every((filled, x) => !filled || distances[y][x] <= layers),
    );
  }

  const totalBlocks = grid.reduce(
    (sum, row) => sum + row.filter(Boolean).length,
    0,
  );

  return {
    diameter,
    mode,
    thickness,
    grid,
    totalBlocks,
    rows: generateRowPatterns(grid),
    isEffectivelyFilled,
  };
}
