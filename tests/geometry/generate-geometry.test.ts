import { describe, expect, it } from "vitest";
import { generateGeometry, getLayerCount } from "@/lib/geometry/generate-geometry";
import type { GeometryOptions } from "@/lib/geometry/geometry-types";

const defaults: GeometryOptions = {
  diameter: 11,
  width: 21,
  height: 13,
  mode: "hollow",
  thickness: 2,
  layer: 1,
};

describe("generateGeometry", () => {
  it("generates an oval with independent width and height", () => {
    const result = generateGeometry("oval", defaults);
    expect(result.width).toBe(21);
    expect(result.height).toBe(13);
    expect(result.grid).toHaveLength(13);
    expect(result.grid[0]).toHaveLength(21);
    expect(result.currentBlocks).toBeGreaterThan(0);
  });

  it("keeps sphere layers vertically symmetrical", () => {
    const bottom = generateGeometry("sphere", { ...defaults, layer: 1 });
    const top = generateGeometry("sphere", { ...defaults, layer: 11 });
    expect(bottom.layerCount).toBe(11);
    expect(bottom.grid).toEqual(top.grid);
    expect(bottom.totalBlocks).toBe(top.totalBlocks);
  });

  it("starts a dome at the widest sphere layer", () => {
    const dome = generateGeometry("dome", { ...defaults, diameter: 10, layer: 1 });
    const domeTop = generateGeometry("dome", { ...defaults, diameter: 10, layer: 5 });
    expect(getLayerCount("dome", 10)).toBe(5);
    expect(dome.layerCount).toBe(5);
    expect(dome.currentBlocks).toBeGreaterThan(domeTop.currentBlocks);
    expect(dome.totalBlocks).toBeGreaterThanOrEqual(dome.currentBlocks);
  });

  it("shows the full dome footprint while preserving the exact selected layer", () => {
    const circle = generateGeometry("circle", defaults);
    const dome = generateGeometry("dome", defaults);

    expect(dome.layerGrid).toEqual(circle.grid);
    expect(dome.grid).not.toEqual(circle.grid);
    expect(dome.grid[5][5]).toBe(true);
    expect(dome.layerMap?.[5][5]).toBeGreaterThan(1);
    expect(dome.label).toBe("Dome");
    expect(dome.layer).toBe(1);
    expect(dome.layerCount).toBe(6);
    expect(circle.layerCount).toBe(1);
  });

  it("keeps the dome overview stable while the selected building layer changes", () => {
    const base = generateGeometry("dome", defaults);
    const peak = generateGeometry("dome", { ...defaults, layer: 6 });

    expect(base.grid).toEqual(peak.grid);
    expect(base.layerGrid).not.toEqual(peak.layerGrid);
    expect(base.currentBlocks).toBeGreaterThan(peak.currentBlocks);
  });

  it("uses only hollow and filled modes for volume shapes", () => {
    const result = generateGeometry("sphere", { ...defaults, mode: "thick" });
    expect(result.mode).toBe("hollow");
  });
});
