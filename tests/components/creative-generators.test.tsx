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
    expect(screen.getByRole("heading", { name: "Preview" })).toBeInTheDocument();
    expect(screen.queryByText("LIVE PIXEL PREVIEW")).not.toBeInTheDocument();
    expect(screen.queryByText("Your block text")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Your text")).toHaveValue("MINE\nCRAFT");
    expect(screen.getByText("30 × 17")).toBeInTheDocument();

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
    expect(screen.getByText("30 × 25")).toBeInTheDocument();
    expect(screen.getByText(/Spacing is measured in build blocks/)).toBeInTheDocument();
    expect(canvas.height).toBe(580);
  });

  it("expands the preview canvas for more than three text lines", () => {
    render(<FontGenerator />);
    const textInput = screen.getByLabelText("Your text");
    const canvas = screen.getByLabelText("Generated Minecraft pixel text preview") as HTMLCanvasElement;

    fireEvent.change(textInput, { target: { value: "ONE\nTWO\nTHREE\nFOUR\nFIVE" } });

    expect(screen.getByText("5 lines · 23 characters")).toBeInTheDocument();
    expect(screen.getByText("30 × 44")).toBeInTheDocument();
    expect(canvas.height).toBe(576);
  });

  it("places text controls before the preview and exposes the complete style controls", () => {
    const { container } = render(<FontGenerator />);
    const settings = container.querySelector(".font-settings");
    const preview = container.querySelector(".font-preview");

    expect(Boolean(settings && preview && (settings.compareDocumentPosition(preview) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    expect(container.querySelectorAll(".font-panel")).toHaveLength(4);
    expect(screen.getByRole("group", { name: "Minecraft colour presets" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gradient" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Bold &l" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Outline" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Padding" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Text alignment" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy PNG" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Minecraft colour codes" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Set text colour to/ })).toHaveLength(16);
    fireEvent.click(screen.getByRole("button", { name: "Set text colour to Blue (§9)" }));
    expect(screen.getByLabelText("Text colour")).toHaveValue("#5555ff");
  });

  it("updates the canvas when styles, outline, padding, and fill mode change", () => {
    render(<FontGenerator />);
    const canvas = screen.getByLabelText("Generated Minecraft pixel text preview") as HTMLCanvasElement;

    fireEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(screen.getByText("35 × 17")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Outline" }));
    expect(screen.getByText("37 × 19")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("slider", { name: "Padding" }), { target: { value: "4" } });
    expect(canvas.width).toBe(540);
    fireEvent.click(screen.getByRole("button", { name: "Gradient" }));
    expect(screen.getByRole("button", { name: "Gradient" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Gradient end colour")).toBeInTheDocument();
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
