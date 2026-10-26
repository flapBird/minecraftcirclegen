import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ShapeGenerator } from "@/components/shape-generator/shape-generator";
import {
  isHeavyGeometryWork,
  isHeavyShapeWork,
  loadGeometry,
  loadShapeLayers,
} from "@/lib/generation/generation-client";
import { generateGeometry } from "@/lib/geometry/generate-geometry";
import type { GeometryOptions } from "@/lib/geometry/geometry-types";
import { generateShapeLayers, normalizeShapeOptions, type ShapeOptions } from "@/lib/shape/generate-shape";
import { buildVolumeData } from "@/lib/shape/volume-data";

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const GEOMETRY_DEFAULTS: GeometryOptions = { diameter: 21, width: 21, height: 15, mode: "hollow", thickness: 1, layer: 1 };

describe("volume data extraction", () => {
  it("marks occupancy for every block and finds the true surface", () => {
    const options: ShapeOptions = { shape: "sphere", width: 7, height: 7, depth: 7, sides: 6, thickness: 1, filled: true, layer: 4 };
    const layers = generateShapeLayers(options);
    const volume = buildVolumeData(layers);
    const totalBlocks = layers.reduce((sum, layer) => sum + layer.currentBlocks, 0);

    let occupiedCount = 0;
    volume.occupancy.forEach((flag) => {
      if (flag === 1) occupiedCount += 1;
    });
    expect(occupiedCount).toBe(totalBlocks);

    const surfaceTriples: Array<[number, number, number]> = [];
    for (let index = 0; index < volume.surface.length; index += 3) {
      surfaceTriples.push([volume.surface[index], volume.surface[index + 1], volume.surface[index + 2]]);
    }
    const surfaceKeys = new Set(surfaceTriples.map(([x, y, z]) => `${x},${y},${z}`));

    const center = 3;
    const centerIndex = center + volume.width * (center + volume.depth * center);
    // The exact middle of a filled odd sphere is enclosed on all six sides.
    expect(volume.occupancy[centerIndex]).toBe(1);
    expect(surfaceKeys.has(`${center},${center},${center}`)).toBe(false);

    const insideButNotCenter: Array<[number, number, number]> = [];
    surfaceTriples.forEach(([x, y, z]) => {
      if (Math.abs(x - center) <= 1 && Math.abs(y - center) <= 1 && Math.abs(z - center) <= 1) insideButNotCenter.push([x, y, z]);
    });
    expect(insideButNotCenter.length).toBe(0);
  });

  it("treats every hollow shell block as surface", () => {
    const options: ShapeOptions = { shape: "sphere", width: 9, height: 9, depth: 9, sides: 6, thickness: 1, filled: false, layer: 5 };
    const layers = generateShapeLayers(options);
    const volume = buildVolumeData(layers);
    const totalBlocks = layers.reduce((sum, layer) => sum + layer.currentBlocks, 0);
    expect(volume.surface.length / 3).toBe(totalBlocks);
  });
});

describe("heavy work thresholds", () => {
  it("keeps default sizes on the main thread", () => {
    expect(isHeavyShapeWork(normalizeShapeOptions({ shape: "sphere", width: 21, height: 15, depth: 21, sides: 6, thickness: 1, filled: false, layer: 11 }))).toBe(false);
    expect(isHeavyShapeWork({ shape: "rectangle", width: 256, height: 256, depth: 1, sides: 6, thickness: 1, filled: true, layer: 1 })).toBe(false);
    expect(isHeavyGeometryWork("sphere", GEOMETRY_DEFAULTS)).toBe(false);
    expect(isHeavyGeometryWork("circle", { ...GEOMETRY_DEFAULTS, diameter: 512 })).toBe(false);
  });

  it("moves oversized volumes to the worker", () => {
    expect(isHeavyShapeWork({ shape: "sphere", width: 128, height: 128, depth: 128, sides: 6, thickness: 1, filled: true, layer: 64 })).toBe(true);
    expect(isHeavyShapeWork({ shape: "sphere", width: 96, height: 96, depth: 96, sides: 6, thickness: 1, filled: false, layer: 48 })).toBe(true);
    expect(isHeavyShapeWork({ shape: "cylinder", width: 128, height: 128, depth: 128, sides: 6, thickness: 1, filled: true, layer: 128 })).toBe(true);
    expect(isHeavyGeometryWork("sphere", { ...GEOMETRY_DEFAULTS, diameter: 128, mode: "filled" })).toBe(true);
    expect(isHeavyGeometryWork("dome", { ...GEOMETRY_DEFAULTS, diameter: 128, mode: "hollow" })).toBe(true);
  });
});

describe("generation client fallbacks", () => {
  // jsdom has no Worker, so the facade must compute synchronously with the same results.
  it("returns the same layer volume as direct generation", async () => {
    const options: ShapeOptions = { shape: "sphere", width: 21, height: 15, depth: 21, sides: 6, thickness: 1, filled: false, layer: 11 };
    const payload = await loadShapeLayers(options);
    expect(payload.layers).toEqual(generateShapeLayers(options));
    expect(payload.volume).not.toBeNull();
    expect(payload.volume?.layerCount).toBe(21);
  });

  it("returns null volume data for planar shapes", async () => {
    const payload = await loadShapeLayers({ shape: "rectangle", width: 32, height: 32, depth: 1, sides: 6, thickness: 1, filled: true, layer: 1 });
    expect(payload.volume).toBeNull();
  });

  it("returns the same geometry result as direct generation", async () => {
    const options: GeometryOptions = { ...GEOMETRY_DEFAULTS, diameter: 128, mode: "filled", layer: 64 };
    const result = await loadGeometry("sphere", options);
    expect(result).toEqual(generateGeometry("sphere", options));
    expect(result.totalBlocks).toBe(1_099_136);
  });

  it("serves repeat requests from cache", async () => {
    const options: ShapeOptions = { shape: "sphere", width: 21, height: 15, depth: 21, sides: 6, thickness: 1, filled: false, layer: 5 };
    const first = await loadShapeLayers(options);
    const second = await loadShapeLayers(options);
    expect(second).toBe(first);
  });
});

describe("ShapeGenerator with oversized volumes", () => {
  // Without a Worker the component still reaches the exact total through the fallback path.
  it("shows the full 128-block sphere total after the deferred load", async () => {
    render(<ShapeGenerator />);
    fireEvent.change(screen.getByRole("spinbutton", { name: "Diameter" }), { target: { value: "128" } });
    fireEvent.click(screen.getByLabelText("Filled"));
    await waitFor(() => expect(screen.getAllByText("1,099,136").length).toBeGreaterThan(0), { timeout: 10_000 });
  });
});
