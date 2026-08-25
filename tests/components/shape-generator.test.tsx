import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ShapeGenerator } from "@/components/shape-generator/shape-generator";

describe("ShapeGenerator preview", () => {
  beforeEach(() => {
    class ResizeObserverMock { observe() {} disconnect() {} }
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      clearRect: vi.fn(), fillRect: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), closePath: vi.fn(), fill: vi.fn(), stroke: vi.fn(), fillText: vi.fn(), setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
  });

  it("uses an interactive volume view and switches to the exact 2D layer", () => {
    render(<ShapeGenerator />);

    expect(screen.getByRole("heading", { name: "PREVIEW" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "3D" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("application", { name: /Interactive 3D preview of Sphere/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "2D Layers" }));
    expect(screen.getByRole("img", { name: "Sphere block blueprint" })).toBeInTheDocument();
  });
});
