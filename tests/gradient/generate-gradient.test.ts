import { describe, expect, it } from "vitest";
import {
  blocksForPalette,
  generateBlockGradient,
  normalizeGradientOptions,
} from "@/lib/gradient/generate-gradient";

describe("generateBlockGradient", () => {
  it("creates the requested number of unique ordered block matches", () => {
    const result = generateBlockGradient({
      startColor: "#f2ead7",
      endColor: "#26352c",
      steps: 10,
      palette: "all",
    });

    expect(result).toHaveLength(10);
    expect(result.map((step) => step.index)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(new Set(result.map((step) => step.block.id))).toHaveProperty("size", 10);
  });

  it("keeps colorful results inside the concrete and terracotta family", () => {
    const result = generateBlockGradient({
      startColor: "#ffce2e",
      endColor: "#32368f",
      steps: 8,
      palette: "colorful",
    });

    expect(result.every((step) => step.block.family === "color")).toBe(true);
    expect(blocksForPalette("colorful").length).toBeGreaterThanOrEqual(32);
  });

  it("normalizes invalid colors, palettes, and out-of-range lengths", () => {
    expect(normalizeGradientOptions({
      startColor: "not-a-color",
      endColor: "ffffff",
      steps: 100,
      palette: "unknown" as "all",
    })).toEqual({
      startColor: "#eee5cf",
      endColor: "#ffffff",
      steps: 24,
      palette: "all",
    });
  });
});
