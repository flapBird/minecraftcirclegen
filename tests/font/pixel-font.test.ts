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
});
