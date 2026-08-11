import { beforeEach, describe, expect, it } from "vitest";
import {
  getProgressKey,
  loadProgress,
} from "@/lib/circle/circle-storage";

const options = { diameter: 21, mode: "hollow" as const, thickness: 1 };

describe("circle progress storage", () => {
  beforeEach(() => window.localStorage.clear());

  it("rejects a fractional current row", () => {
    window.localStorage.setItem(
      getProgressKey(options),
      JSON.stringify({ currentRow: 1.5, completedRows: [], active: true }),
    );
    expect(loadProgress(options, 21)?.currentRow).toBe(0);
  });

  it("clamps rows from stale saved progress", () => {
    window.localStorage.setItem(
      getProgressKey(options),
      JSON.stringify({ currentRow: 99, completedRows: [0, 20, 99], active: true }),
    );
    expect(loadProgress(options, 21)).toEqual({
      currentRow: 20,
      completedRows: [0, 20],
      active: true,
    });
  });
});
