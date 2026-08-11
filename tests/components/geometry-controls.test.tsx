import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GeometryControls } from "@/components/geometry-generator/geometry-controls";

const options = {
  diameter: 21,
  width: 21,
  height: 15,
  mode: "hollow" as const,
  thickness: 2,
  layer: 1,
};

describe("GeometryControls", () => {
  it("provides draggable width and height sliders for ovals", () => {
    const onChange = vi.fn();
    render(
      <GeometryControls
        shape="oval"
        options={options}
        showGrid
        zoom={1}
        onChange={onChange}
        onShowGridChange={vi.fn()}
        onZoomChange={vi.fn()}
        onDownload={vi.fn()}
        onCopyLink={vi.fn()}
        currentBlocks={44}
        totalBlocks={44}
        blueprintWidth={21}
        blueprintHeight={15}
        layerCount={1}
      />,
    );
    fireEvent.change(screen.getByRole("slider", { name: "Width slider" }), { target: { value: "31" } });
    fireEvent.change(screen.getByRole("slider", { name: "Height slider" }), { target: { value: "17" } });
    expect(onChange).toHaveBeenCalledWith({ width: 31 });
    expect(onChange).toHaveBeenCalledWith({ height: 17 });
  });

  it("shows the simplified sphere controls and shape switcher", () => {
    const onChange = vi.fn();
    render(
      <GeometryControls
        shape="sphere"
        options={options}
        showGrid
        zoom={1}
        onChange={onChange}
        onShowGridChange={vi.fn()}
        onZoomChange={vi.fn()}
        onDownload={vi.fn()}
        onCopyLink={vi.fn()}
        currentBlocks={20}
        totalBlocks={500}
        blueprintWidth={21}
        blueprintHeight={21}
        layerCount={21}
      />,
    );
    expect(screen.getByRole("slider", { name: "Layer slider" })).toHaveAttribute("max", "21");
    expect(screen.getByRole("navigation", { name: "Shape generators" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sphere" })).toHaveAttribute("aria-current", "page");
    fireEvent.click(screen.getByRole("checkbox", { name: "Filled" }));
    expect(onChange).toHaveBeenCalledWith({ mode: "filled", thickness: 1 });
    expect(screen.getByRole("slider", { name: "Zoom slider" })).toHaveValue("1");
  });
});
