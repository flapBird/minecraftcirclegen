import { describe, expect, it } from "vitest";
import { normalizePixelText, renderPixelText } from "@/lib/font/pixel-font";

describe("renderPixelText", () => {
  it("renders letters into a compact buildable grid", () => {
    const result = renderPixelText({ text: "HI", letterSpacing: 1, lineSpacing: 2, shadow: false });
    expect(result.width).toBe(11);
    expect(result.height).toBe(7);
    expect(result.mainBlocks).toBeGreaterThan(0);
    expect(result.shadowBlocks).toBe(0);
  });

  it("keeps the full supported line spacing in multi-line text", () => {
    const result = renderPixelText({
      text: "A\nB",
      letterSpacing: 1,
      lineSpacing: 10,
      shadow: true,
    });

    expect(result.height).toBe(25);
  });

  it("adds only visible shadow cells behind the main glyphs", () => {
    const result = renderPixelText({ text: "A", letterSpacing: 1, lineSpacing: 2, shadow: true });
    expect(result.width).toBe(6);
    expect(result.height).toBe(8);
    expect(result.mainBlocks).toBeGreaterThan(0);
    expect(result.shadowBlocks).toBeGreaterThan(0);
  });

  it("supports multiple lines and replaces unsupported characters", () => {
    expect(normalizePixelText("Hi\n世界")).toBe("HI\n??");
    const result = renderPixelText({ text: "A\nB", letterSpacing: 0, lineSpacing: 2, shadow: false });
    expect(result.height).toBe(16);
  });

  it("renders every line instead of truncating after the third", () => {
    const result = renderPixelText({
      text: "A\nB\nC\nD\nE\nF",
      letterSpacing: 1,
      lineSpacing: 2,
      shadow: false,
    });

    expect(result.height).toBe(52);
    expect(result.mainBlocks).toBeGreaterThan(0);
  });

  it("normalizes Windows line endings without creating fallback glyphs", () => {
    expect(normalizePixelText("A\r\nB\rC")).toBe("A\nB\nC");
  });

  it("parses Minecraft colour and formatting codes without adding visible characters", () => {
    const coloured = renderPixelText({ text: "&aA", letterSpacing: 1, lineSpacing: 2, shadow: false });
    const bold = renderPixelText({ text: "§lA", letterSpacing: 1, lineSpacing: 2, shadow: false });

    expect(coloured.width).toBe(5);
    expect(coloured.cellColors.flat()).toContain("#55ff55");
    expect(bold.width).toBe(6);
  });

  it("renders global styles, outlines, and configurable shadow distance", () => {
    const result = renderPixelText({
      text: "A",
      letterSpacing: 1,
      lineSpacing: 2,
      shadow: true,
      shadowDistance: 3,
      outline: true,
      style: { italic: true, underline: true },
    });

    expect(result.width).toBe(12);
    expect(result.height).toBe(13);
    expect(result.outlineBlocks).toBeGreaterThan(0);
    expect(result.shadowBlocks).toBeGreaterThan(0);
  });

  it("aligns shorter lines inside the widest line", () => {
    const result = renderPixelText({
      text: "A\nAA",
      letterSpacing: 1,
      lineSpacing: 2,
      shadow: false,
      alignment: "center",
    });
    const firstLineMinimum = Math.min(...result.cells.slice(0, 7).flatMap((row) => row
      .map((cell, x) => cell === 1 ? x : Number.POSITIVE_INFINITY)));
    const secondLineMinimum = Math.min(...result.cells.slice(9).flatMap((row) => row
      .map((cell, x) => cell === 1 ? x : Number.POSITIVE_INFINITY)));

    expect(firstLineMinimum).toBe(3);
    expect(secondLineMinimum).toBe(0);
  });
});
