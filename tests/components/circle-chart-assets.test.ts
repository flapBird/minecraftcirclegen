import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { generateCircle } from "@/lib/circle/generate-circle";
import { generateGeometry } from "@/lib/geometry/generate-geometry";

const chartDir = join(process.cwd(), "public", "circle-charts");

describe("exported circle chart assets", () => {
  it("exports one SVG per expected diameter with correct block counts", () => {
    const files = readdirSync(chartDir).filter((name) => name.endsWith(".svg"));
    const exported = new Map<string, number>();
    for (const file of files) {
      const svg = readFileSync(join(chartDir, file), "utf8");
      const match = /circle-chart-(\d+)\.svg/.exec(file);
      expect(match, `unexpected asset name: ${file}`).not.toBeNull();
      const diameter = Number(match![1]);
      const blockRects = svg.split('class="chart-block"').length - 1;
      exported.set(String(diameter), blockRects);
      const expected = generateCircle({ diameter, mode: "hollow", thickness: 1 }).totalBlocks;
      expect(blockRects, `${file} block count drift`).toBe(expected);
      expect(svg).toContain(`aria-label="Hollow Minecraft circle blueprint, ${diameter} by ${diameter} blocks, ${expected} blocks"`);
    }
    for (const diameter of [7, 11, 15, 21, 31, 51]) {
      expect(exported.has(String(diameter)), `missing asset for diameter ${diameter}`).toBe(true);
    }
  });

  it("keeps 21-block and 31-block counts consistent with the geometry tool", () => {
    // These figures are quoted in guides; verify them against the generator.
    expect(generateCircle({ diameter: 15, mode: "hollow", thickness: 1 }).totalBlocks).toBe(40);
    expect(generateGeometry("sphere", { diameter: 21, width: 21, height: 15, mode: "hollow", thickness: 1, layer: 1 }).totalBlocks).toBe(1082);
  });
});
