import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GeometryGeneratorFromUrl } from "@/components/geometry-generator/geometry-generator-from-url";
import { GradientGeneratorFromUrl } from "@/components/gradient-generator/gradient-generator-from-url";

const navigationState = vi.hoisted(() => ({ query: "" }));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(navigationState.query),
}));

describe("generator URL boundaries", () => {
  beforeEach(() => {
    navigationState.query = "";
    window.history.replaceState(null, "", "/");
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  });

  it("restores shared geometry settings from the query string", () => {
    navigationState.query = "diameter=31&mode=filled&layer=4";

    render(<GeometryGeneratorFromUrl shape="sphere" />);

    expect(screen.getByRole("spinbutton", { name: "Diameter" })).toHaveValue(31);
    expect(screen.getByRole("slider", { name: "Layer slider" })).toHaveValue("4");
    expect(screen.getByRole("checkbox", { name: "Filled" })).toBeChecked();
  });

  it("does not remount a geometry input when its live URL state changes", () => {
    navigationState.query = "diameter=21";
    const view = render(<GeometryGeneratorFromUrl shape="circle" />);
    const input = screen.getByRole("spinbutton", { name: "Diameter" });
    input.focus();

    navigationState.query = "diameter=31";
    view.rerender(<GeometryGeneratorFromUrl shape="circle" />);

    expect(screen.getByRole("spinbutton", { name: "Diameter" })).toBe(input);
    expect(input).toHaveFocus();
  });

  it("switches geometry shapes in place and stores the active shape in the URL", async () => {
    navigationState.query = "diameter=31";
    render(<GeometryGeneratorFromUrl shape="circle" />);
    const canvas = screen.getByRole("img", { name: /circle blueprint/i });

    fireEvent.click(screen.getByRole("button", { name: "Dome" }));

    expect(screen.getByRole("button", { name: "Dome" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("img", { name: /dome blueprint/i })).toBe(canvas);
    expect(screen.getByRole("slider", { name: "Layer slider" })).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "Diameter" })).toHaveValue(31);
    await waitFor(() => expect(window.location.search).toContain("shape=dome"));
    expect(window.location.pathname).toBe("/");
  });

  it("restores a non-default geometry shape from the query string", () => {
    navigationState.query = "shape=sphere&diameter=27&layer=4";

    render(<GeometryGeneratorFromUrl shape="circle" />);

    expect(screen.getByRole("button", { name: "Sphere" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("spinbutton", { name: "Diameter" })).toHaveValue(27);
    expect(screen.getByRole("slider", { name: "Layer slider" })).toHaveValue("4");
  });

  it("keeps a dedicated page in place while its shared generator changes shape", async () => {
    window.history.replaceState(null, "", "/dome-generator");
    render(<GeometryGeneratorFromUrl shape="dome" />);

    fireEvent.click(screen.getByRole("button", { name: "Circle" }));

    await waitFor(() => expect(window.location.search).toContain("shape=circle"));
    expect(window.location.pathname).toBe("/dome-generator");
    expect(screen.getByRole("img", { name: /circle blueprint/i })).toBeInTheDocument();
  });

  it("restores shared gradient settings from the query string", () => {
    navigationState.query =
      "start=ffffff&end=000000&steps=5&palette=natural";

    render(<GradientGeneratorFromUrl />);

    expect(screen.getByRole("textbox", { name: "Start color hex value" })).toHaveValue(
      "#FFFFFF",
    );
    expect(screen.getByRole("textbox", { name: "End color hex value" })).toHaveValue(
      "#000000",
    );
    expect(screen.getByRole("spinbutton", { name: "Gradient length value" })).toHaveValue(5);
    expect(screen.getByRole("combobox", { name: "Block palette" })).toHaveValue("natural");
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });
});
