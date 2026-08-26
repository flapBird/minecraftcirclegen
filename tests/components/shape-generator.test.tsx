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
});
