import type { BlueprintCell, BlueprintLayer, HouseMaterial } from "./types";

type BlueprintSpec = {
  width: number;
  length: number;
  floors: 1 | 2;
  roof: "gable" | "flat";
  paletteNames: {
    foundation: string;
    floor: string;
    wall: string;
    frame: string;
    roof: string;
    door: string;
    stairs?: string;
  };
};

const colors = {
  foundation: "#687168",
  floor: "#c79a5b",
  wall: "#9a6a38",
  frame: "#5b3b22",
  glass: "#9ed4d8",
  door: "#7c4d2a",
  roof: "#3f4a40",
};

export function createPalette(names: BlueprintSpec["paletteNames"]): BlueprintCell[] {
  return [
    { code: "S", label: names.foundation, color: colors.foundation },
    { code: "F", label: names.floor, color: colors.floor },
    { code: "W", label: names.wall, color: colors.wall },
    { code: "L", label: names.frame, color: colors.frame },
    { code: "G", label: "Glass pane", color: colors.glass },
    { code: "D", label: `${names.door} — lower half, opens toward front`, material: names.door, color: colors.door },
    { code: "U", label: "Door upper half — placed with D below", material: names.door, itemsPerCell: 0, color: colors.door },
    { code: "R", label: names.roof, color: colors.roof },
    ...(names.stairs ? [{ code: "T", label: `${names.stairs} — bottom half, ascending toward grid top`, material: names.stairs, color: colors.floor }] : []),
  ];
}

export function countBlueprintMaterials(layers: BlueprintLayer[], palette: BlueprintCell[]): HouseMaterial[] {
  const cells = new Map(palette.map((cell) => [cell.code, cell]));
  const counts = new Map<string, number>();
  for (const layer of layers) for (const row of layer.rows) for (const code of row) {
    if (code === ".") continue;
    const cell = cells.get(code);
    if (!cell) throw new Error(`Unknown blueprint cell: ${code}`);
    const count = cell.itemsPerCell ?? 1;
    if (count === 0) continue;
    const name = cell.material ?? cell.label;
    counts.set(name, (counts.get(name) ?? 0) + count);
  }
  return [...counts].map(([name, count]) => ({ name, count }));
}

function blank(width: number, length: number) {
  return Array.from({ length }, () => Array.from({ length: width }, () => "."));
}

function serialize(grid: string[][]) {
  return grid.map((row) => row.join(""));
}

function foundation(width: number, length: number) {
  const grid = blank(width, length);
  for (let z = 0; z < length; z += 1) {
    for (let x = 0; x < width; x += 1) {
      grid[z][x] = x === 0 || z === 0 || x === width - 1 || z === length - 1 ? "S" : "F";
    }
  }
  return serialize(grid);
}

function walls(width: number, length: number, level: number, upperFloor: boolean, stairs = false) {
  const grid = blank(width, length);
  const doorX = Math.floor(width / 2);
  const midZ = Math.floor(length / 2);

  for (let z = 0; z < length; z += 1) {
    for (let x = 0; x < width; x += 1) {
      const border = x === 0 || z === 0 || x === width - 1 || z === length - 1;
      if (!border) continue;
      const corner = (x === 0 || x === width - 1) && (z === 0 || z === length - 1);
      grid[z][x] = corner ? "L" : "W";
    }
  }

  if (!upperFloor && level < 3) grid[length - 1][doorX] = level === 1 ? "D" : "U";
  if (stairs && !upperFloor) grid[length - 2 - level][width - 3] = "T";
  if (level === 2) {
    const frontWindows = [2, width - 3].filter((x) => x > 0 && x < width - 1 && x !== doorX);
    frontWindows.forEach((x) => { grid[length - 1][x] = "G"; });
    grid[midZ][0] = "G";
    grid[midZ][width - 1] = "G";
    if (upperFloor) {
      grid[0][Math.floor(width / 2)] = "G";
    }
  }
  return serialize(grid);
}

function deck(width: number, length: number) {
  const grid = blank(width, length);
  for (let z = 0; z < length; z += 1) {
    for (let x = 0; x < width; x += 1) grid[z][x] = "F";
  }
  const stairX = Math.max(1, width - 3);
  grid[length - 4][stairX] = ".";
  grid[length - 5][stairX] = ".";
  grid[length - 6][stairX] = "T";
  return serialize(grid);
}

function roof(width: number, length: number, inset: number, flat: boolean) {
  const grid = blank(width, length);
  const start = flat ? 0 : inset;
  const end = flat ? length - 1 : length - 1 - inset;
  for (let z = start; z <= end; z += 1) {
    for (let x = 0; x < width; x += 1) grid[z][x] = "R";
  }
  return serialize(grid);
}

export function buildBlueprintLayers(spec: BlueprintSpec): BlueprintLayer[] {
  const layers: BlueprintLayer[] = [];
  const add = (title: string, description: string, rows: string[]) => {
    layers.push({ number: layers.length + 1, title, description, rows });
  };

  add("Foundation", "Set the exact footprint, then fill the interior floor before raising any walls.", foundation(spec.width, spec.length));
  for (let level = 1; level <= 3; level += 1) {
    add(
      level === 1 ? "Lower walls" : level === 2 ? "Doors and windows" : "Wall plate",
      level === 1
        ? "Place the door opening and corner posts while building the first wall course."
        : level === 2
          ? "Leave U for the upper half of the door already placed at D below; add the marked glass panes."
          : "Complete the wall plate above the openings so the roof has continuous support.",
      walls(spec.width, spec.length, level, false, spec.floors === 2),
    );
  }

  if (spec.floors === 2) {
    add("Upper floor", "Leave the two empty stairwell cells open for headroom. Place T as a bottom-half stair rising toward the top of the grid; the next floor cell is the landing.", deck(spec.width, spec.length));
    for (let level = 1; level <= 3; level += 1) {
      add(
        level === 1 ? "Upper walls" : level === 2 ? "Upper windows" : "Upper wall plate",
        "Continue the corner posts and copy the marked upper-level wall pattern.",
        walls(spec.width, spec.length, level, true),
      );
    }
  }

  if (spec.roof === "flat") {
    add("Flat roof", "Cover the full footprint with the full blocks named R in the legend. The count assumes full blocks, not slabs.", roof(spec.width, spec.length, 0, true));
  } else {
    const roofLayerCount = Math.ceil(spec.length / 2);
    for (let inset = 0; inset < roofLayerCount; inset += 1) {
      add(
        inset === 0 ? "Roof base" : inset === roofLayerCount - 1 ? "Roof ridge" : `Roof tier ${inset + 1}`,
        inset === 0
          ? "Place the full-block roof base across the footprint. This is a solid stepped roof, not a stair or slab roof."
          : "Move one row inward from the front and rear edges, then fill the marked tier with full blocks. The ridge runs left to right in the grid.",
        roof(spec.width, spec.length, inset, false),
      );
    }
  }

  return layers;
}
