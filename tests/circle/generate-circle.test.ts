import { describe, expect, it } from "vitest";
import { generateCircle } from "../../lib/circle/generate-circle";

const diameters = [3, 4, 5, 7, 9, 10, 21, 22, 31, 100, 101, 512];

describe.each(diameters)("circle generation: diameter %i", (diameter) => {
  for (const mode of ["hollow", "thick", "filled"] as const) {
    it(`${mode} is symmetric, sized correctly, and counted from the grid`, () => {
      const result = generateCircle({ diameter, mode, thickness: 2 });
      expect(result.grid).toHaveLength(diameter);
      expect(result.grid.every((row) => row.length === diameter)).toBe(true);
      expect(result.totalBlocks).toBe(
        result.grid.flat().filter(Boolean).length,
      );

      for (let y = 0; y < diameter; y += 1) {
        for (let x = 0; x < diameter; x += 1) {
          if (result.grid[y][x] !== result.grid[y][diameter - 1 - x]) {
            throw new Error(`Horizontal asymmetry at ${x},${y}`);
          }
          if (result.grid[y][x] !== result.grid[diameter - 1 - y][x]) {
            throw new Error(`Vertical asymmetry at ${x},${y}`);
          }
        }
      }
    });
  }
});

describe("circle mode behavior", () => {
  it("matches the known five-block hollow blueprint", () => {
    const result = generateCircle({ diameter: 5, mode: "hollow", thickness: 1 });
    expect(
      result.grid.map((row) => row.map((cell) => (cell ? "#" : ".")).join("")),
    ).toEqual([".###.", "#...#", "#...#", "#...#", ".###."]);
    expect(result.totalBlocks).toBe(12);
  });

  it.each(diameters)("hollow %i has all four edges and an open interior", (diameter) => {
    const result = generateCircle({ diameter, mode: "hollow", thickness: 1 });
    expect(result.grid[0].some(Boolean)).toBe(true);
    expect(result.grid[diameter - 1].some(Boolean)).toBe(true);
    expect(result.grid.some((row) => row[0])).toBe(true);
    expect(result.grid.some((row) => row[diameter - 1])).toBe(true);
    if (diameter >= 5) {
      const center = Math.floor(diameter / 2);
      expect(result.grid[center][center]).toBe(false);
    }
  });

  it.each(diameters)("filled %i has continuous rows and a filled center", (diameter) => {
    const result = generateCircle({ diameter, mode: "filled", thickness: 1 });
    const center = Math.floor(diameter / 2);
    expect(result.grid[center][center]).toBe(true);
    for (const row of result.rows) {
      expect(row.segments.length).toBeLessThanOrEqual(1);
    }
  });

  it.each(diameters)("thick %i stays between hollow and filled", (diameter) => {
    const hollow = generateCircle({ diameter, mode: "hollow", thickness: 1 });
    const thick = generateCircle({ diameter, mode: "thick", thickness: 2 });
    const filled = generateCircle({ diameter, mode: "filled", thickness: 1 });
    expect(thick.totalBlocks).toBeGreaterThanOrEqual(hollow.totalBlocks);
    expect(thick.totalBlocks).toBeLessThanOrEqual(filled.totalBlocks);
  });

  it("never loses blocks as thickness increases", () => {
    let previous = 0;
    for (let thickness = 1; thickness <= 11; thickness += 1) {
      const result = generateCircle({
        diameter: 21,
        mode: "thick",
        thickness,
      });
      expect(result.totalBlocks).toBeGreaterThanOrEqual(previous);
      previous = result.totalBlocks;
    }
  });

  it("handles the maximum thick circle without repeated erosion", () => {
    const startedAt = performance.now();
    const result = generateCircle({ diameter: 512, mode: "thick", thickness: 256 });
    expect(result.isEffectivelyFilled).toBe(true);
    expect(performance.now() - startedAt).toBeLessThan(1500);
  });
});
