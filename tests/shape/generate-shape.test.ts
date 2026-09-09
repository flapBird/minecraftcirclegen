import { describe, expect, it } from "vitest";
import { generateShape, generateShapeLayers, shapeCoordinates, type ShapeOptions } from "@/lib/shape/generate-shape";
import { generateGeometry } from "@/lib/geometry/generate-geometry";

const base: ShapeOptions = { shape: "circle", width: 21, height: 15, depth: 21, sides: 6, thickness: 1, filled: false, layer: 1 };

describe("generateShape", () => {
  it("matches independent dome layer grids for odd/even and filled/hollow plans", () => {
    for (const size of [3, 4, 6, 10, 20, 21]) for (const filled of [false, true]) {
      const layers = generateShapeLayers({ ...base, shape: "dome", width: size, filled });
      for (const layer of layers) {
        const dedicated = generateGeometry("dome", { diameter: size, width: size, height: size, mode: filled ? "filled" : "hollow", thickness: 1, layer: layer.layer });
        expect(layer.grid).toEqual(dedicated.layerGrid);
        expect(layer.totalBlocks).toBe(dedicated.totalBlocks);
      }
    }
  });
  it("generates every requested MVP shape", () => {
    for (const shape of ["circle", "ellipse", "triangle", "rectangle", "polygon", "star", "sphere", "dome", "cylinder", "cone", "pyramid"] as const) {
      const result = generateShape({ ...base, shape });
      expect(result.currentBlocks).toBeGreaterThan(0);
      expect(result.grid.length).toBeGreaterThan(0);
      expect(result.totalBlocks).toBeGreaterThanOrEqual(result.currentBlocks);
    }
  });

  it("keeps copied coordinates aligned with occupied cells", () => {
    const result = generateShape({ ...base, shape: "rectangle", width: 9, height: 7 });
    expect(shapeCoordinates(result)).toHaveLength(result.currentBlocks);
  });

  it("creates layer-by-layer cylinders with an exact total", () => {
    const result = generateShape({ ...base, shape: "cylinder", width: 11, height: 8, filled: true, layer: 3 });
    expect(result.layerCount).toBe(8);
    expect(result.totalBlocks).toBe(result.currentBlocks * 8);
  });

  it("builds one shared 3D volume from the exact layer blueprints", () => {
    const layers = generateShapeLayers({ ...base, shape: "pyramid", width: 11, height: 7, layer: 4 });
    expect(layers).toHaveLength(7);
    expect(layers[3].layer).toBe(4);
    expect(layers.every((layer) => layer.totalBlocks === layers[0].totalBlocks)).toBe(true);
  });
});
