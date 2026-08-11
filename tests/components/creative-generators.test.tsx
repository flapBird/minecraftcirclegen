import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FontGenerator } from "@/components/font-generator/font-generator";
import { ImageArtGenerator } from "@/components/image-art/image-art-generator";

describe("creative generators", () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(function (this: HTMLCanvasElement) {
      return {
        canvas: this,
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        imageSmoothingEnabled: false,
        fillStyle: "",
      } as unknown as CanvasRenderingContext2D;
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it("updates block size and line spacing in the live font preview", () => {
    render(<FontGenerator />);
    expect(screen.getByRole("heading", { name: "Your block text" })).toBeInTheDocument();
    expect(screen.getByLabelText("Your text")).toHaveValue("MINE\nCRAFT");
    expect(screen.getByText("30 × 17 blocks")).toBeInTheDocument();

    const canvas = screen.getByLabelText("Generated Minecraft pixel text preview") as HTMLCanvasElement;
    expect(canvas.parentElement).toHaveClass("font-canvas-stage");
    expect(canvas.width).toBe(408);
    expect(canvas.height).toBe(252);
    fireEvent.change(screen.getByRole("slider", { name: "Pixel block size" }), {
      target: { value: "20" },
    });
    expect(canvas.width).toBe(680);
    expect(canvas.height).toBe(420);

    fireEvent.change(screen.getByRole("slider", { name: "Line spacing" }), {
      target: { value: "10" },
    });
    expect(screen.getByText("30 × 25 blocks")).toBeInTheDocument();
    expect(screen.getByText("Adds space between text lines")).toBeInTheDocument();
    expect(canvas.height).toBe(580);
  });

  it("shows local upload controls for pixel art", () => {
    render(<ImageArtGenerator mode="pixel" />);
    expect(screen.getByText("Drop an image here")).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Longest side" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Block palette" })).toBeInTheDocument();
  });

  it("uses fixed map layouts and states the first-phase export boundary", () => {
    render(<ImageArtGenerator mode="map" />);
    expect(screen.getByRole("combobox", { name: "Map layout" })).toHaveValue("1x1");
    expect(screen.getByText(/No world file, schematic, or map.dat/)).toBeInTheDocument();
  });
});
