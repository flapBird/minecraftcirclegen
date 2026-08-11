import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateCircle } from "@/lib/circle/generate-circle";
import { renderExportCanvas } from "@/lib/circle/export-circle-png";

describe("PNG export rendering", () => {
  let fillStyle = "";
  let fillCalls: Array<{ style: string; args: number[] }>;
  const fillText = vi.fn();
  const stroke = vi.fn();

  beforeEach(() => {
    fillCalls = [];
    fillText.mockClear();
    stroke.mockClear();
    const context = {
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      arcTo: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      fill: vi.fn(),
      stroke,
      fillText,
      fillRect: (...args: number[]) => fillCalls.push({ style: fillStyle, args }),
      get fillStyle() {
        return fillStyle;
      },
      set fillStyle(value: string) {
        fillStyle = value;
      },
      strokeStyle: "",
      lineWidth: 1,
      font: "",
      textAlign: "start",
      textBaseline: "alphabetic",
    } as unknown as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
  });

  afterEach(() => vi.restoreAllMocks());

  it("keeps empty cells transparent when transparent background is selected", () => {
    const result = generateCircle({ diameter: 5, mode: "hollow", thickness: 1 });
    renderExportCanvas(result, {
      showGrid: false,
      showAxes: false,
      showCoordinates: false,
      transparentBackground: true,
    });

    expect(fillCalls.some((call) => call.style === "#3e7f4c")).toBe(true);
    expect(fillCalls.some((call) => ["#f4f7f2", "#ffffff", "#edf1eb"].includes(call.style))).toBe(false);
  });

  it("renders grid and spaced coordinates for the maximum diameter", () => {
    const result = generateCircle({ diameter: 512, mode: "hollow", thickness: 1 });
    renderExportCanvas(result, {
      showGrid: true,
      showAxes: false,
      showCoordinates: true,
      transparentBackground: false,
    });

    expect(stroke).toHaveBeenCalled();
    expect(fillText).toHaveBeenCalledWith(
      "-255.5",
      expect.any(Number),
      expect.any(Number),
    );
  });
});
