import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CircleChartPage from "@/app/minecraft-circle-chart/page";
import { CIRCLE_CHART_DIAMETERS, CIRCLE_CHART_GROUPS } from "@/content/circle-chart";
import { generateCircle } from "@/lib/circle/generate-circle";
import { MAX_DIAMETER, MIN_DIAMETER } from "@/lib/circle/circle-utils";

describe("circle chart data", () => {
  it("covers every diameter from the generator minimum to 101 exactly once", () => {
    const expected = Array.from({ length: 99 }, (_, index) => index + 3);
    expect(CIRCLE_CHART_DIAMETERS).toEqual(expected);
    for (const diameter of CIRCLE_CHART_DIAMETERS) {
      expect(diameter).toBeGreaterThanOrEqual(MIN_DIAMETER);
      expect(diameter).toBeLessThanOrEqual(Math.min(MAX_DIAMETER, 101));
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

  it("keeps group size ranges contiguous without gaps between groups", () => {
    const flattened = CIRCLE_CHART_GROUPS.flatMap((group) => group.sizes.map((size) => size.diameter));
    for (let index = 1; index < flattened.length; index += 1) {
      expect(flattened[index]).toBe(flattened[index - 1] + 1);
    }
  });
});

function chartAssetPath(diameter: number) {
  return `/circle-charts/circle-chart-${String(diameter).padStart(2, "0")}.svg`;
}

describe("circle chart page", () => {
  it("deep-links every chart size into the generator", () => {
    const { container } = render(<CircleChartPage />);
    for (const diameter of CIRCLE_CHART_DIAMETERS) {
      expect(container.querySelector(`a[href="/?diameter=${diameter}"]`)).not.toBeNull();
      expect(container.querySelector(`a[href="/?diameter=${diameter}&mode=filled"]`)).not.toBeNull();
    }
  });

  it("gives every size an anchor card with a lazy static chart image", () => {
    const { container } = render(<CircleChartPage />);
    for (const diameter of CIRCLE_CHART_DIAMETERS) {
      const card = container.querySelector(`#size-${diameter}`);
      expect(card, `missing anchor card for ${diameter}`).not.toBeNull();
      const image = card!.querySelector("img");
      expect(image?.getAttribute("src")).toBe(chartAssetPath(diameter));
      expect(image?.getAttribute("loading")).toBe("lazy");
    }
  });

  it("keeps the headline, quick-reference table, and FAQ reachable", () => {
    render(<CircleChartPage />);
    expect(screen.getByRole("heading", { level: 1, name: /Minecraft Circle Chart/ })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Outline blocks" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Filled blocks" })).toBeInTheDocument();
    expect(screen.getByText(/What is a Minecraft circle chart\?/)).toBeInTheDocument();
  });

  it("lists every diameter in the quick-reference table with counts", () => {
    const { container } = render(<CircleChartPage />);
    for (const diameter of CIRCLE_CHART_DIAMETERS) {
      expect(container.querySelector(`#ref-${diameter}`)).not.toBeNull();
    }
    const hollow51 = generateCircle({ diameter: 51, mode: "hollow", thickness: 1 }).totalBlocks;
    expect(hollow51).toBeGreaterThan(64);
    const row51 = container.querySelector("#ref-51");
    expect(row51?.textContent).toContain(`${hollow51.toLocaleString("en-US")} (2 stacks + 16)`);
  });

  it("renders a share button per size card", () => {
    const { container } = render(<CircleChartPage />);
    const shareButtons = container.querySelectorAll(".chart-copy-link");
    expect(shareButtons.length).toBe(CIRCLE_CHART_DIAMETERS.length);
  });
});
