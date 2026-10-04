import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ImageArtGenerator } from "@/components/image-art/image-art-generator";

vi.mock("@/lib/image-art/convert-image-art", () => ({
  resizeRasterImage: vi.fn(),
  convertRasterToBlocks: () => {
    const blocks = Array.from({ length: 13 }, (_, i) => ({ id: `block_${i}`, name: `Material ${i + 1}`, hex: "#ffffff", family: "color", common: true }));
    return { width: 129, height: 1, cells: [Array.from({ length: 129 }, (_, x) => x === 128 ? null : blocks[x % 13])], materials: blocks.map((block) => ({ block, count: 10 })), blockCount: 128, emptyCount: 1 };
  },
}));

beforeEach(() => {
  vi.stubGlobal("Image", class {
    naturalWidth = 1; naturalHeight = 1; onload?: () => void;
    set src(_value: string) { this.onload?.(); }
  });
  vi.stubGlobal("URL", class extends URL { static createObjectURL = vi.fn(() => "blob:fixture"); static revokeObjectURL = vi.fn(); });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(function (this: HTMLCanvasElement) {
    return { canvas: this, drawImage: vi.fn(), getImageData: () => ({ data: new Uint8ClampedArray([255, 255, 255, 255]) }), clearRect: vi.fn(), fillRect: vi.fn(), strokeRect: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), stroke: vi.fn() } as unknown as CanvasRenderingContext2D;
  });
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it("inspects scaled canvas clicks and map boundaries with a keyboard-accessible full material list", () => {
  const { container } = render(<ImageArtGenerator mode="map" />);
  fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [new File(["fixture"], "fixture.png", { type: "image/png" })] } });
  expect(screen.getByText("#13 Material 13")).toBeInTheDocument();
  const canvas = screen.getByLabelText("Generated Minecraft map art preview");
  vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({ left: 10, top: 20, width: 258, height: 2 } as DOMRect);
  fireEvent.click(canvas, { clientX: 35, clientY: 21 });
  expect(screen.getByRole("spinbutton", { name: "X" })).toHaveValue(12);
  expect(screen.getByText(/X 12, Z 0:/)).toHaveTextContent("#13 Material 13");
  fireEvent.change(screen.getByRole("spinbutton", { name: "X" }), { target: { value: "128" } });
  expect(screen.getByText(/X 128, Z 0:/)).toHaveTextContent("Empty");
  expect(screen.getByText(/X 128, Z 0:/)).toHaveTextContent("Map column 2, row 1 · local (0, 0)");
  expect(screen.getByRole("button", { name: "Download coordinate CSV" })).toBeEnabled();
});
