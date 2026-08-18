import { describe, expect, it, vi } from "vitest";
import { paintPixelText, type FontExportOptions } from "@/lib/font/export-font-png";
import { renderPixelText } from "@/lib/font/pixel-font";

function createContext() {
  const fills: string[] = [];
  const context = {
    canvas: { width: 500, height: 500 },
    clearRect: vi.fn(),
    fillRect: vi.fn(() => fills.push(String(context.fillStyle))),
    fillStyle: "",
  } as unknown as CanvasRenderingContext2D;
  return { context, fills };
}

const baseOptions: FontExportOptions = {
  blockSize: 4,
  mainColor: "#ff0000",
  gradientColor: "#0000ff",
  fillMode: "solid",
  shadowColor: "#222222",
  outlineColor: "#111111",
  backgroundColor: "#ffffff",
  transparent: true,
};

describe("font PNG painting", () => {
  it("honours inline Minecraft colours over the selected base fill", () => {
    const result = renderPixelText({ text: "&aA", letterSpacing: 1, lineSpacing: 2, shadow: false });
    const { context, fills } = createContext();

    paintPixelText(context, result, baseOptions, 0);

    expect(fills).toContain("#55ff55");
    expect(fills).not.toContain("#ff0000");
  });

  it("paints gradients, outlines, and shadows as separate layers", () => {
    const result = renderPixelText({
      text: "AA",
      letterSpacing: 1,
      lineSpacing: 2,
      shadow: true,
      shadowDistance: 2,
      outline: true,
    });
    const { context, fills } = createContext();

    paintPixelText(context, result, { ...baseOptions, fillMode: "gradient", gameShadow: false }, 0);

    expect(new Set(fills.filter((color) => color !== "#111111" && color !== "#222222")).size).toBeGreaterThan(2);
    expect(fills).toContain("#111111");
    expect(fills).toContain("#222222");
  });
});
