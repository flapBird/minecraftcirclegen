import { describe, expect, it } from "vitest";
import { generateCircle } from "../../lib/circle/generate-circle";

describe("row pattern generation", () => {
  it.each(["hollow", "thick", "filled"] as const)(
    "creates exact segments for %s circles",
    (mode) => {
      const result = generateCircle({ diameter: 21, mode, thickness: 3 });
      for (const row of result.rows) {
        expect(row.blockCount).toBe(
          row.segments.reduce((sum, segment) => sum + segment.length, 0),
        );
        for (const segment of row.segments) {
          expect(segment.length).toBe(segment.endX - segment.startX + 1);
          const indexes = result.grid[row.index]
            .map((filled, index) => ({ filled, index }))
            .filter(({ filled }) => filled)
            .map(({ index }) => index - (result.diameter - 1) / 2);
          for (let x = segment.startX; x <= segment.endX; x += 1) {
            expect(indexes).toContain(x);
          }
        }
      }
    },
  );

  it("does not merge separated runs", () => {
    const result = generateCircle({ diameter: 21, mode: "hollow", thickness: 1 });
    const row = result.rows[Math.floor(result.diameter / 2)];
    expect(row.segments).toHaveLength(2);
    expect(row.segments[0].endX).toBeLessThan(row.segments[1].startX - 1);
  });
});
