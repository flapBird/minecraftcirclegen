import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CircleChartSvg } from "@/components/circle-chart/circle-chart-svg";
import CircleChartPage from "@/app/minecraft-circle-chart/page";
import { CIRCLE_CHART_DIAMETERS, CIRCLE_CHART_GROUPS } from "@/content/circle-chart";
import { generateCircle } from "@/lib/circle/generate-circle";
import { MAX_DIAMETER, MIN_DIAMETER } from "@/lib/circle/circle-utils";

describe("circle chart data", () => {
  it("uses unique diameters within the generator limits", () => {
    expect(new Set(CIRCLE_CHART_DIAMETERS).size).toBe(CIRCLE_CHART_DIAMETERS.length);
    for (const diameter of CIRCLE_CHART_DIAMETERS) {
      expect(diameter).toBeGreaterThanOrEqual(MIN_DIAMETER);
      expect(diameter).toBeLessThanOrEqual(MAX_DIAMETER);
    }
  });

  it("keeps sizes ascending inside each group with non-empty copy", () => {
    for (const group of CIRCLE_CHART_GROUPS) {
      const sizes = group.sizes.map((size) => size.diameter);
      expect([...sizes].sort((a, b) => a - b)).toEqual(sizes);
      for (const size of group.sizes) {
        expect(size.bestFor.length).toBeGreaterThan(10);
      }
    }
  });
});

describe("CircleChartSvg", () => {
  it("renders exactly one block rect per generated cell", () => {
    const { container } = render(<CircleChartSvg diameter={9} />);
    const expected = generateCircle({ diameter: 9, mode: "hollow", thickness: 1 }).totalBlocks;
    expect(container.querySelectorAll(".chart-block").length).toBe(expected);
  });

  it("renders filled mode on request", () => {
    const { container } = render(<CircleChartSvg diameter={7} mode="filled" />);
    const expected = generateCircle({ diameter: 7, mode: "filled", thickness: 1 }).totalBlocks;
    expect(container.querySelectorAll(".chart-block").length).toBe(expected);
  });

  it("labels the chart for assistive technology", () => {
    render(<CircleChartSvg diameter={15} />);
    expect(
      screen.getByRole("img", { name: /Hollow Minecraft circle blueprint, 15 by 15 blocks/ }),
    ).toBeInTheDocument();
  });
});

describe("circle chart page", () => {
  it("deep-links every chart size into the generator", () => {
    const { container } = render(<CircleChartPage />);
    for (const diameter of CIRCLE_CHART_DIAMETERS) {
      expect(container.querySelector(`a[href="/?diameter=${diameter}"]`)).not.toBeNull();
      expect(container.querySelector(`a[href="/?diameter=${diameter}&mode=filled"]`)).not.toBeNull();
    }
  });

  it("keeps the headline, quick-reference table, and FAQ reachable", () => {
    render(<CircleChartPage />);
    expect(screen.getByRole("heading", { level: 1, name: /Minecraft Circle Chart/ })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Outline blocks" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Filled blocks" })).toBeInTheDocument();
    expect(screen.getByText(/What is a Minecraft circle chart\?/)).toBeInTheDocument();
  });
});
