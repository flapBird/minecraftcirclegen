import { describe, expect, it } from "vitest";
import { convertRasterToBlocks, resizeRasterImage } from "@/lib/image-art/convert-image-art";
import type { RasterImage } from "@/lib/image-art/image-art-types";

function raster(width: number, height: number, values: number[]): RasterImage {
  return { width, height, data: new Uint8ClampedArray(values) };
}

describe("image art conversion", () => {
  it("matches opaque source pixels to Minecraft building blocks", () => {
    const result = convertRasterToBlocks({
      raster: raster(2, 1, [255, 0, 0, 255, 0, 0, 255, 255]),
      mode: "pixel",
      palette: "colorful",
      dither: false,
      backgroundColor: "#ffffff",
      transparentPixels: true,
    });
    expect(result.blockCount).toBe(2);
    expect(result.emptyCount).toBe(0);
    expect(result.cells[0][0]?.family).toBe("color");
    expect(result.materials.reduce((total, item) => total + item.count, 0)).toBe(2);
  });

  it("keeps transparent pixels empty for wall pixel art", () => {
    const result = convertRasterToBlocks({
      raster: raster(1, 1, [255, 0, 0, 0]),
      mode: "pixel",
      palette: "all",
      dither: true,
      backgroundColor: "#ffffff",
      transparentPixels: true,
    });
    expect(result.cells[0][0]).toBeNull();
    expect(result.emptyCount).toBe(1);
  });

  it("uses the dedicated flat map palette for map art", () => {
    const result = convertRasterToBlocks({
      raster: raster(1, 1, [255, 255, 255, 255]),
      mode: "map",
      palette: "all",
      dither: false,
      backgroundColor: "#ffffff",
      transparentPixels: false,
    });
    expect(result.cells[0][0]?.id).toMatch(/^map_/);
  });

  it("letterboxes contained images with transparent pixels", () => {
    const resized = resizeRasterImage(
      raster(2, 1, [255, 0, 0, 255, 255, 0, 0, 255]),
      4,
      4,
      "contain",
    );
    expect(resized.width).toBe(4);
    expect(resized.height).toBe(4);
    expect(resized.data[3]).toBe(0);
    expect([...resized.data].some((value, index) => index % 4 === 3 && value === 255)).toBe(true);
  });
});
