export type UniversalShape =
  | "circle"
  | "ellipse"
  | "triangle"
  | "rectangle"
  | "polygon"
  | "star"
  | "sphere"
  | "dome"
  | "cylinder"
  | "cone"
  | "pyramid";

export interface ShapeOptions {
  shape: UniversalShape;
  width: number;
  height: number;
  depth: number;
  sides: number;
  thickness: number;
  filled: boolean;
  layer: number;
}

export interface ShapeBlueprint {
  label: string;
  grid: boolean[][];
  width: number;
  height: number;
  currentBlocks: number;
  totalBlocks: number;
  layer: number;
  layerCount: number;
  is3d: boolean;
}

export const SHAPE_LABELS: Record<UniversalShape, string> = {
  circle: "Circle",
  ellipse: "Ellipse / Oval",
  triangle: "Triangle",
  rectangle: "Rectangle / Square",
  polygon: "Polygon",
  star: "Star",
  sphere: "Sphere",
  dome: "Dome",
  cylinder: "Cylinder",
  cone: "Cone",
  pyramid: "Pyramid",
};

export const THREE_D_SHAPES: UniversalShape[] = ["sphere", "dome", "cylinder", "cone", "pyramid"];

function clamp(value: number, min: number, max: number) {
  const finite = Number.isFinite(value) ? Math.round(value) : min;
  return Math.max(min, Math.min(max, finite));
}

export function normalizeShapeOptions(raw: ShapeOptions): ShapeOptions {
  const is3d = THREE_D_SHAPES.includes(raw.shape);
  const width = clamp(raw.width, 3, is3d ? 128 : 256);
  const height = clamp(raw.height, 3, is3d ? 128 : 256);
  const depth = clamp(raw.depth, 3, 128);
  const layerCount = getShapeLayerCount(raw.shape, width, height, depth);
  return {
    ...raw,
    width,
    height,
    depth,
    sides: clamp(raw.sides, 3, 12),
    thickness: clamp(raw.thickness, 1, Math.max(1, Math.floor(Math.min(width, height) / 2))),
    filled: Boolean(raw.filled),
    layer: clamp(raw.layer, 1, layerCount),
  };
}

export function getShapeLayerCount(shape: UniversalShape, width: number, height: number, depth: number) {
  if (shape === "sphere") return width;
  if (shape === "dome") return Math.ceil(width / 2);
  if (shape === "cylinder" || shape === "cone" || shape === "pyramid") return height;
  return Math.max(1, depth * 0 + 1);
}

function countGrid(grid: boolean[][]) {
  return grid.reduce((total, row) => total + row.reduce((sum, cell) => sum + Number(cell), 0), 0);
}

function boundaryDepths(grid: boolean[][]) {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  const depths = Array.from({ length: height }, () => Array<number>(width).fill(0));
  const queue: Array<[number, number]> = [];
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]] as const;
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    if (!grid[y][x]) continue;
    if (directions.some(([dx, dy]) => !grid[y + dy]?.[x + dx])) {
      depths[y][x] = 1;
      queue.push([x, y]);
    }
  }
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const [x, y] = queue[cursor];
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (grid[ny]?.[nx] && depths[ny][nx] === 0) {
        depths[ny][nx] = depths[y][x] + 1;
        queue.push([nx, ny]);
      }
    }
  }
  return depths;
}

function outline(grid: boolean[][], thickness: number) {
  const depths = boundaryDepths(grid);
  return grid.map((row, y) => row.map((cell, x) => cell && depths[y][x] <= thickness));
}

function ellipseGrid(width: number, height: number) {
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const rx = width / 2;
  const ry = height / 2;
  return Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => {
    const dx = (x - cx) / rx;
    const dy = (y - cy) / ry;
    return dx * dx + dy * dy <= 1;
  }));
}

type Point = [number, number];

function pointInPolygon(x: number, y: number, points: Point[]) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    const crosses = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || 1) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
}

function polygonGrid(width: number, height: number, vertices: Point[]) {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => pointInPolygon(x + 0.5, y + 0.5, vertices)),
  );
}

function regularVertices(width: number, height: number, sides: number, star = false): Point[] {
  const cx = width / 2;
  const cy = height / 2;
  const count = star ? sides * 2 : sides;
  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / count;
    const scale = star && index % 2 === 1 ? 0.43 : 0.94;
    return [cx + Math.cos(angle) * (width / 2) * scale, cy + Math.sin(angle) * (height / 2) * scale];
  });
}

function planarGrid(options: ShapeOptions) {
  const { shape, width, height, sides } = options;
  let filled: boolean[][];
  if (shape === "circle" || shape === "ellipse") filled = ellipseGrid(width, shape === "circle" ? width : height);
  else if (shape === "rectangle") filled = Array.from({ length: height }, () => Array<boolean>(width).fill(true));
  else if (shape === "triangle") filled = polygonGrid(width, height, [[width / 2, 0], [width, height], [0, height]]);
  else if (shape === "star") filled = polygonGrid(width, height, regularVertices(width, height, 5, true));
  else filled = polygonGrid(width, height, regularVertices(width, height, sides));
  return options.filled ? filled : outline(filled, options.thickness);
}

function sphereInside(x: number, y: number, z: number, size: number) {
  const center = (size - 1) / 2;
  const radius = size / 2;
  const dx = x - center;
  const dy = y - center;
  const dz = z - center;
  return dx * dx + dy * dy + dz * dz <= radius * radius;
}

function sphereLayer(size: number, y: number, filled: boolean) {
  const directions = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]] as const;
  return Array.from({ length: size }, (_, z) => Array.from({ length: size }, (_, x) => {
    if (!sphereInside(x, y, z, size)) return false;
    return filled || directions.some(([dx, dy, dz]) => !sphereInside(x + dx, y + dy, z + dz, size));
  }));
}

function centeredEllipseGrid(canvasSize: number, diameter: number, filled: boolean, thickness: number) {
  const source = ellipseGrid(diameter, diameter);
  const shaped = filled ? source : outline(source, thickness);
  const offset = Math.floor((canvasSize - diameter) / 2);
  return Array.from({ length: canvasSize }, (_, y) => Array.from({ length: canvasSize }, (_, x) => shaped[y - offset]?.[x - offset] ?? false));
}

function volumeLayer(options: ShapeOptions, layer: number) {
  const { shape, width, height, filled, thickness } = options;
  if (shape === "sphere") return sphereLayer(width, layer - 1, filled);
  if (shape === "dome") {
    const middle = Math.floor((width - 1) / 2);
    return sphereLayer(width, middle + layer - 1, filled);
  }
  if (shape === "cylinder") return centeredEllipseGrid(width, width, filled, thickness);
  if (shape === "cone") {
    const ratio = height <= 1 ? 0 : (layer - 1) / (height - 1);
    const diameter = Math.max(1, Math.round(width * (1 - ratio)));
    return centeredEllipseGrid(width, diameter, filled, Math.min(thickness, Math.max(1, Math.floor(diameter / 2))));
  }
  const inset = Math.floor(((layer - 1) / Math.max(1, height - 1)) * (width - 1) / 2);
  const size = Math.max(1, width - inset * 2);
  const grid = Array.from({ length: width }, (_, z) => Array.from({ length: width }, (_, x) => x >= inset && x < inset + size && z >= inset && z < inset + size));
  return filled ? grid : outline(grid, Math.min(thickness, Math.max(1, Math.floor(size / 2))));
}

export function generateShape(raw: ShapeOptions): ShapeBlueprint {
  const options = normalizeShapeOptions(raw);
  const is3d = THREE_D_SHAPES.includes(options.shape);
  const layerCount = getShapeLayerCount(options.shape, options.width, options.height, options.depth);
  const layer = Math.min(options.layer, layerCount);
  const grid = is3d ? volumeLayer(options, layer) : planarGrid(options);
  const totalBlocks = is3d
    ? Array.from({ length: layerCount }, (_, index) => countGrid(volumeLayer(options, index + 1))).reduce((a, b) => a + b, 0)
    : countGrid(grid);
  return {
    label: SHAPE_LABELS[options.shape],
    grid,
    width: grid[0]?.length ?? options.width,
    height: grid.length,
    currentBlocks: countGrid(grid),
    totalBlocks,
    layer,
    layerCount,
    is3d,
  };
}

export function generateShapeLayers(raw: ShapeOptions): ShapeBlueprint[] {
  const options = normalizeShapeOptions(raw);
  if (!THREE_D_SHAPES.includes(options.shape)) return [generateShape(options)];
  const layerCount = getShapeLayerCount(options.shape, options.width, options.height, options.depth);
  const grids = Array.from({ length: layerCount }, (_, index) => volumeLayer(options, index + 1));
  const totalBlocks = grids.reduce((total, grid) => total + countGrid(grid), 0);
  return grids.map((grid, index) => ({
    label: SHAPE_LABELS[options.shape],
    grid,
    width: grid[0]?.length ?? options.width,
    height: grid.length,
    currentBlocks: countGrid(grid),
    totalBlocks,
    layer: index + 1,
    layerCount,
    is3d: true,
  }));
}

export function shapeCoordinates(blueprint: ShapeBlueprint) {
  const centerX = (blueprint.width - 1) / 2;
  const centerZ = (blueprint.height - 1) / 2;
  const y = blueprint.is3d ? blueprint.layer - 1 : 0;
  return blueprint.grid.flatMap((row, z) => row.flatMap((cell, x) =>
    cell ? [{ x: x - centerX, y, z: z - centerZ }] : [],
  ));
}
