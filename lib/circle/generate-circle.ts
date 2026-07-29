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

function erode(grid: boolean[][]): boolean[][] {
  const size = grid.length;
  return grid.map((row, y) =>
    row.map((filled, x) => {
      if (!filled) return false;
      return (
        y > 0 &&
        y < size - 1 &&
        x > 0 &&
        x < size - 1 &&
        grid[y - 1][x] &&
        grid[y + 1][x] &&
        grid[y][x - 1] &&
        grid[y][x + 1]
      );
    }),
  );
}

function subtractGrid(
  outer: boolean[][],
  inner: boolean[][],
): boolean[][] {
  return outer.map((row, y) =>
    row.map((filled, x) => filled && !inner[y][x]),
  );
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
    let inner = filledGrid;
    const layers = mode === "hollow" ? 1 : thickness;
    for (let layer = 0; layer < layers; layer += 1) {
      inner = erode(inner);
    }
    grid = subtractGrid(filledGrid, inner);
    isEffectivelyFilled = grid.every((row, y) =>
      row.every((cell, x) => cell === filledGrid[y][x]),
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
