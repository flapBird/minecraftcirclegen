import { describe, expect, it } from "vitest";
import {
  blocksForPalette,
  generateBlockGradient,
  normalizeGradientOptions,
} from "@/lib/gradient/generate-gradient";
import { MINECRAFT_BLOCK_COLORS } from "@/lib/gradient/minecraft-block-colors";

describe("generateBlockGradient", () => {
  it("uses the complete Java Edition block catalog", () => {
    expect(MINECRAFT_BLOCK_COLORS).toHaveLength(586);
    expect(new Set(MINECRAFT_BLOCK_COLORS.map((block) => block.texture)).size).toBe(414);
  });

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
      endpointMode: "color",
      startBlockId: undefined,
      endBlockId: undefined,
    });
  });

  it("keeps selected start and end blocks as exact anchors", () => {
    const result = generateBlockGradient({
      startColor: "#000000",
      endColor: "#ffffff",
      steps: 7,
      palette: "stone",
      endpointMode: "block",
      startBlockId: "red_concrete",
      endBlockId: "yellow_concrete",
    });

    expect(result[0].block.id).toBe("red_concrete");
    expect(result.at(-1)?.block.id).toBe("yellow_concrete");
    expect(result.slice(1, -1).every((step) => step.block.family === "stone")).toBe(true);
  });

  it("keeps a blue-to-green block path chromatic instead of detouring through gray", () => {
    const result = generateBlockGradient({
      startColor: "#000000",
      endColor: "#ffffff",
      steps: 8,
      palette: "all",
      endpointMode: "block",
      startBlockId: "lapis_block",
      endBlockId: "lime_concrete",
    });

    expect(result[0].block.id).toBe("lapis_block");
    expect(result.at(-1)?.block.id).toBe("lime_concrete");
    expect(result.slice(1, -1).every((step) => step.block.family !== "stone")).toBe(true);
    expect(result.map((step) => step.block.id)).toContain("deepslate_lapis_ore");
    expect(result.map((step) => step.block.id)).toContain("green_glazed_terracotta");
  });
});
