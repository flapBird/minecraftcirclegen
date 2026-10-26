// One-off generator for public/circle-charts/*.svg assets and verified block counts.
// The circle/sphere math mirrors lib/circle/generate-circle.ts and lib/shape/generate-shape.ts;
// tests/components/circle-chart-assets.test.tsx guards the exported files against drift.
import { mkdirSync, writeFileSync } from "node:fs";

const CELL = 10;
const BLOCK = "#4d7f47";
const GRID = "#d7ddd4";

function filledCircleGrid(diameter) {
  const center = (diameter - 1) / 2;
  const radius = diameter / 2;
  const grid = [];
  for (let y = 0; y < diameter; y += 1) {
    const row = [];
    for (let x = 0; x < diameter; x += 1) {
      const dx = x - center;
      const dy = y - center;
      row.push(dx * dx + dy * dy <= radius * radius);
    }
    grid.push(row);
  }
  return grid;
}

function boundaryDepths(grid) {
  const size = grid.length;
  const depths = Array.from({ length: size }, () => Array(size).fill(0));
  const queue = [];
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!grid[y][x]) continue;
      const boundary = directions.some(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        return nx < 0 || nx >= size || ny < 0 || ny >= size || !grid[ny][nx];
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
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= size || ny < 0 || ny >= size || !grid[ny][nx] || depths[ny][nx] !== 0) continue;
      depths[ny][nx] = depths[y][x] + 1;
      queue.push([nx, ny]);
    }
  }
  return depths;
}

function circleBlocks(diameter, mode) {
  const filled = filledCircleGrid(diameter);
  if (mode === "filled") return filled.flat().filter(Boolean).length;
  const depths = boundaryDepths(filled);
  return filled.reduce((total, row, y) => total + row.filter((cell, x) => cell && depths[y][x] <= 1).length, 0);
}

function circleSvg(diameter) {
  const filled = filledCircleGrid(diameter);
  const depths = boundaryDepths(filled);
  const size = diameter * CELL;
  const rects = [];
  filled.forEach((row, y) => row.forEach((cell, x) => {
    if (cell && depths[y][x] <= 1) {
      rects.push(`<rect class="chart-block" x="${x * CELL}" y="${y * CELL}" width="${CELL}" height="${CELL}" fill="${BLOCK}"/>`);
    }
  }));
  const label = `Hollow Minecraft circle blueprint, ${diameter} by ${diameter} blocks, ${rects.length} blocks`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="${label}" shape-rendering="crispEdges">
<title>${label}</title>
<defs><pattern id="grid" width="${CELL}" height="${CELL}" patternUnits="userSpaceOnUse"><path d="M ${CELL} 0 L 0 0 0 ${CELL}" fill="none" stroke="${GRID}" stroke-width="1"/></pattern></defs>
<rect width="${size}" height="${size}" fill="#ffffff"/>
<rect width="${size}" height="${size}" fill="url(#grid)"/>
${rects.join("\n")}
</svg>
`;
}

function isInsideSphere(x, y, z, size) {
  const center = (size - 1) / 2;
  const radius = size / 2;
  const dx = x - center;
  const dy = y - center;
  const dz = z - center;
  return dx * dx + dy * dy + dz * dz <= radius * radius;
}

function sphereLayerBlocks(size, y, filled) {
  const directions = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  let count = 0;
  for (let z = 0; z < size; z += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!isInsideSphere(x, y, z, size)) continue;
      if (filled || directions.some(([dx, dy, dz]) => !isInsideSphere(x + dx, y + dy, z + dz, size))) count += 1;
    }
  }
  return count;
}

function sphereTotals(size, filled) {
  let total = 0;
  for (let y = 0; y < size; y += 1) total += sphereLayerBlocks(size, y, filled);
  return total;
}

function domeTotals(size, filled) {
  const layerCount = Math.ceil(size / 2);
  const baseY = Math.floor((size - 1) / 2);
  let total = 0;
  for (let layer = 1; layer <= layerCount; layer += 1) {
    total += sphereLayerBlocks(size, baseY - (layer - 1), filled);
  }
  return total;
}

const diameters = [7, 11, 15, 21, 31, 51];
mkdirSync("public/circle-charts", { recursive: true });
for (const diameter of diameters) {
  writeFileSync(`public/circle-charts/circle-chart-${String(diameter).padStart(2, "0")}.svg`, circleSvg(diameter));
}

// Cross-check against the value verified in the live tool earlier (21 hollow sphere = 1,082).
const anchor = sphereTotals(21, false);
if (anchor !== 1082) {
  console.error(`ANCHOR MISMATCH: 21 hollow sphere computed ${anchor}, expected 1082. Aborting.`);
  process.exit(1);
}

console.log("circle charts:", diameters.map((d) => `${d}:${circleBlocks(d, "hollow")}`).join(" "));
console.log(
  [11, 15, 21, 31].map((size) =>
    `sphere ${size}: hollow ${sphereTotals(size, false)}, filled ${sphereTotals(size, true)}; dome ${size}: hollow ${domeTotals(size, false)}, filled ${domeTotals(size, true)}`
  ).join("\n"),
);
console.log("dome 15 layers:", Math.ceil(15 / 2), "| dome 21 layers:", Math.ceil(21 / 2));
