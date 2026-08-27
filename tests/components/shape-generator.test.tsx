import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ShapeGenerator } from "@/components/shape-generator/shape-generator";

describe("ShapeGenerator preview", () => {
  beforeEach(() => {
    class ResizeObserverMock { observe() {} disconnect() {} }
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      clearRect: vi.fn(), fillRect: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), closePath: vi.fn(), fill: vi.fn(), stroke: vi.fn(), fillText: vi.fn(), setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("uses an interactive volume view and switches to the exact 2D layer", () => {
    render(<ShapeGenerator />);

    expect(screen.queryByRole("heading", { name: "PREVIEW" })).not.toBeInTheDocument();
    expect(screen.getByTestId("shape-canvas-stat")).toHaveTextContent("1,082 blocks");
    expect(screen.getByText("Drag to rotate · Scroll to zoom · Layer 11 highlighted")).toHaveClass("shape-view-tip");
    const controls = screen.getByRole("group", { name: "Shape preview controls" });
    expect(within(controls).getByRole("tab", { name: "3D" })).toHaveAttribute("aria-selected", "true");
    expect(within(controls).getByRole("button", { name: "Enter fullscreen" })).toHaveClass("shape-fullscreen-button");
    expect(screen.getByRole("application", { name: /Interactive 3D preview of Sphere/ })).toBeInTheDocument();
    fireEvent.click(within(controls).getByRole("tab", { name: "2D Layers" }));
    expect(screen.getByRole("img", { name: "Sphere block blueprint" })).toBeInTheDocument();
    expect(screen.getAllByText("Point at the grid to inspect relative coordinates")).toHaveLength(2);
  });

  it("zooms the 3D preview without scrolling the page", () => {
    render(<ShapeGenerator />);

    const canvas = screen.getByRole("application", { name: /Interactive 3D preview of Sphere/ });
    expect(fireEvent.wheel(canvas, { deltaY: -10 })).toBe(false);
    expect(screen.getByText("110%")).toBeInTheDocument();
  });

  it("starts and pauses automatic rotation", () => {
    const requestFrame = vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
    render(<ShapeGenerator />);

    fireEvent.click(screen.getByRole("button", { name: "Auto rotate" }));
    expect(screen.getByRole("button", { name: "Pause" })).toHaveAttribute("aria-pressed", "true");
    expect(requestFrame).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(screen.getByRole("button", { name: "Auto rotate" })).toHaveAttribute("aria-pressed", "false");
  });

  it("lets mobile users replace a multi-digit dimension without clamping the first digit", () => {
    render(<ShapeGenerator />);
    const input = screen.getByRole("spinbutton", { name: "Diameter" });

    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveValue(null);
    fireEvent.change(input, { target: { value: "101" } });

    expect(input).toHaveValue(101);
    expect(screen.getByRole("slider", { name: "Diameter slider" })).toHaveValue("101");
  });

  it("places a fullscreen control after Fit and opens the preview", async () => {
    const requestFullscreen = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, "fullscreenEnabled", { configurable: true, value: true });
    Object.defineProperty(HTMLElement.prototype, "requestFullscreen", { configurable: true, value: requestFullscreen });
    render(<ShapeGenerator />);

    const fit = screen.getByRole("button", { name: "Fit" });
    const fullscreen = await screen.findByRole("button", { name: "Enter fullscreen" });
    await waitFor(() => expect(fullscreen).toBeEnabled());
    expect(fit.nextElementSibling).toBe(fullscreen);
    fireEvent.click(fullscreen);
    expect(requestFullscreen).toHaveBeenCalledOnce();
  });

  it("uses an in-page fullscreen fallback when the mobile browser lacks the API", async () => {
    Object.defineProperty(document, "fullscreenEnabled", { configurable: true, value: false });
    render(<ShapeGenerator />);

    const fullscreen = screen.getByRole("button", { name: "Enter fullscreen" });
    expect(fullscreen).toBeEnabled();
    fireEvent.click(fullscreen);

    const preview = screen.getByRole("region", { name: "Shape preview" });
    expect(preview).toHaveClass("is-fallback-fullscreen");
    expect(screen.getByRole("button", { name: "Exit fullscreen" })).toHaveAttribute("aria-pressed", "true");
    expect(document.body).toHaveStyle({ overflow: "hidden" });

    fireEvent.click(screen.getByRole("button", { name: "Exit fullscreen" }));
    expect(preview).not.toHaveClass("is-fallback-fullscreen");
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });
});
