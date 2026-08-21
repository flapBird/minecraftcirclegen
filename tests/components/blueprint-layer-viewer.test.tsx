import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BlueprintLayerViewer } from "@/components/house/blueprint-layer-viewer";

const palette = [
  { code: "S", label: "Stone", color: "#666666" },
  { code: "F", label: "Floor", color: "#aa8855" },
];

const layers = [
  { number: 1, title: "Foundation", description: "Build the base.", rows: ["SS", "FF"] },
  { number: 2, title: "Floor", description: "Fill the floor.", rows: ["FF", "FF"] },
];

describe("BlueprintLayerViewer", () => {
  afterEach(() => vi.restoreAllMocks());

  it("moves through layers with real buttons", async () => {
    render(<BlueprintLayerViewer name="Test House" slug="test-house" width={2} length={2} layers={layers} palette={palette} />);
    const previous = screen.getByRole("button", { name: "← Previous" });
    const next = screen.getByRole("button", { name: "Next →" });

    expect(previous).toBeDisabled();
    expect(screen.getByText("Layer 1 / 2")).toBeInTheDocument();
    await userEvent.click(next);
    expect(screen.getByText("Layer 2 / 2")).toBeInTheDocument();
    expect(next).toBeDisabled();
  });

  it("creates a named SVG download for the active layer", async () => {
    const createObjectURL = vi.fn(() => "blob:test-blueprint");
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);

    render(<BlueprintLayerViewer name="Test House" slug="test-house" width={2} length={2} layers={layers} palette={palette} />);
    await userEvent.click(screen.getByRole("button", { name: "Download current layer SVG" }));

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(click.mock.instances[0]).toHaveProperty("download", "test-house-blueprint-layer-1.svg");
  });
});

