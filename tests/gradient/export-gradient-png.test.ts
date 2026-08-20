import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderGradientExportCanvas } from "@/lib/gradient/export-gradient-png";
import { generateBlockGradient } from "@/lib/gradient/generate-gradient";
import { DEFAULT_GRADIENT_OPTIONS } from "@/lib/gradient/gradient-url-state";

describe("gradient PNG export rendering", () => {
  const drawImage = vi.fn();
  const fillText = vi.fn();
  const addColorStop = vi.fn();

  beforeEach(() => {
    drawImage.mockClear();
    fillText.mockClear();
    addColorStop.mockClear();
    const context = {
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      clip: vi.fn(),
      fillRect: vi.fn(),
      fillText,
      drawImage,
      createLinearGradient: vi.fn(() => ({ addColorStop })),
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      font: "",
      textAlign: "left",
      textBaseline: "alphabetic",
      imageSmoothingEnabled: true,
    } as unknown as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
  });

  afterEach(() => vi.restoreAllMocks());

  it("exports the same continuous color ribbon and real texture sequence as the preview", () => {
    const steps = generateBlockGradient(DEFAULT_GRADIENT_OPTIONS);
    const texture = {} as CanvasImageSource;
    const textures = new Map(steps.map((step) => [step.block.id, texture]));

    renderGradientExportCanvas(steps, DEFAULT_GRADIENT_OPTIONS, textures);

    expect(addColorStop).toHaveBeenCalledTimes(33);
    expect(drawImage).toHaveBeenCalledTimes(steps.length * 2);
    expect(fillText).toHaveBeenCalledWith("Your gradient", 80, 82);
    expect(fillText).toHaveBeenCalledWith("Actual block textures · place from left to right", 1520, 500);
  });
});
