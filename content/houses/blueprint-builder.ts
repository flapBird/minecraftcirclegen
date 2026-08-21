import type { BlueprintCell, BlueprintLayer } from "./types";

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
    { code: "D", label: "Door opening", color: colors.door },
    { code: "R", label: names.roof, color: colors.roof },
  ];
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

function walls(width: number, length: number, level: number, upperFloor: boolean) {
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

  if (!upperFloor && level < 3) grid[length - 1][doorX] = "D";
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
  grid[Math.max(1, length - 3)][stairX] = ".";
  grid[Math.max(1, length - 4)][stairX] = ".";
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
          ? "Add the second door block and the marked glass panes."
          : "Complete the wall plate above the openings so the roof has continuous support.",
      walls(spec.width, spec.length, level, false),
    );
  }

  if (spec.floors === 2) {
    add("Upper floor", "Fill the second-floor deck, leaving the two marked empty cells for the staircase opening.", deck(spec.width, spec.length));
    for (let level = 1; level <= 3; level += 1) {
      add(
        level === 1 ? "Upper walls" : level === 2 ? "Upper windows" : "Upper wall plate",
        "Continue the corner posts and copy the marked upper-level wall pattern.",
        walls(spec.width, spec.length, level, true),
      );
    }
  }

  if (spec.roof === "flat") {
    add("Flat roof", "Cover the full footprint with slabs or full blocks and keep the outside edge continuous.", roof(spec.width, spec.length, 0, true));
  } else {
    const roofLayerCount = Math.ceil(spec.length / 2);
    for (let inset = 0; inset < roofLayerCount; inset += 1) {
      add(
        inset === 0 ? "Roof base" : inset === roofLayerCount - 1 ? "Roof ridge" : `Roof tier ${inset + 1}`,
        inset === 0
          ? "Place the first roof tier across the full depth of the house."
          : "Move one block inward from both long eaves and repeat the roof tier.",
        roof(spec.width, spec.length, inset, false),
      );
    }
  }

  return layers;
}

