import { render, screen } from "@testing-library/react";
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
