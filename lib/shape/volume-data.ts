import type { ShapeBlueprint } from "./generate-shape";

export interface VolumeData {
  width: number;
  depth: number;
  layerCount: number;
  /** width * depth * layerCount flags; index = x + width * (z + depth * y). */
  occupancy: Uint8Array;
  /** Flat x,y,z triples of occupied cells with at least one empty 6-neighbor. */
  surface: Int32Array;
}

export function volumeIndex(x: number, y: number, z: number, width: number, depth: number): number {
  return x + width * (z + depth * y);
}

export function buildVolumeData(layers: ShapeBlueprint[]): VolumeData {
  const width = layers[0]?.width ?? 0;
  const depth = layers[0]?.height ?? 0;
  const layerCount = layers.length;
  const occupancy = new Uint8Array(width * depth * layerCount);

  layers.forEach((layer, y) => layer.grid.forEach((row, z) => row.forEach((filled, x) => {
    if (filled) occupancy[volumeIndex(x, y, z, width, depth)] = 1;
  })));

  const isOccupied = (x: number, y: number, z: number) =>
    x >= 0 && x < width && z >= 0 && z < depth && y >= 0 && y < layerCount &&
    occupancy[volumeIndex(x, y, z, width, depth)] === 1;

  const surface: number[] = [];
  layers.forEach((layer, y) => layer.grid.forEach((row, z) => row.forEach((filled, x) => {
    if (!filled) return;
    const exposed =
      !isOccupied(x + 1, y, z) || !isOccupied(x - 1, y, z) ||
      !isOccupied(x, y + 1, z) || !isOccupied(x, y - 1, z) ||
      !isOccupied(x, y, z + 1) || !isOccupied(x, y, z - 1);
    if (exposed) surface.push(x, y, z);
  })));

  return { width, depth, layerCount, occupancy, surface: Int32Array.from(surface) };
}
