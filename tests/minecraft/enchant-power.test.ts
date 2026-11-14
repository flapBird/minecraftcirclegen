import { describe, expect, it } from "vitest";
import {
  BOOKSHELF_POSITIONS,
  GAP_POSITIONS,
  MAX_ENCHANT_POWER,
  bottomSlotRange,
  countEnchantPower,
  gapBlockerKey,
  shelfGap,
  shelfKey,
} from "@/lib/minecraft/enchant-power";

function layout(entries: Array<[number, number, number?]>, blockers: Array<[number, number, number?]> = []) {
  const shelves = new Set(entries.map(([x, z, level = 0]) => shelfKey(x, z, level)));
  const blocked = new Set(blockers.map(([x, z, level = 0]) => gapBlockerKey(x, z, level)));
  return { shelves, blockers: blocked };
}

describe("enchant power geometry", () => {
  it("defines a 16-slot ring, 8 gap cells, and a 15-shelf cap", () => {
    expect(BOOKSHELF_POSITIONS).toHaveLength(16);
    expect(GAP_POSITIONS).toHaveLength(8);
    expect(MAX_ENCHANT_POWER).toBe(15);
    expect(BOOKSHELF_POSITIONS.every(({ x, z }) => Math.max(Math.abs(x), Math.abs(z)) === 2)).toBe(true);
    expect(GAP_POSITIONS.every(({ x, z }) => Math.max(Math.abs(x), Math.abs(z)) === 1)).toBe(true);
  });

  it("routes edge shelves to the cardinal gap and corner shelves to the diagonal gap", () => {
    expect(shelfGap(2, 0)).toEqual({ x: 1, z: 0 });
    expect(shelfGap(2, 1)).toEqual({ x: 1, z: 0 });
    expect(shelfGap(1, -2)).toEqual({ x: 0, z: -1 });
    expect(shelfGap(2, -2)).toEqual({ x: 1, z: -1 });
    expect(shelfGap(-2, -2)).toEqual({ x: -1, z: -1 });
  });
});

describe("countEnchantPower", () => {
  it("counts a full ring at the table's height up to the 15-shelf cap", () => {
    const full = layout(BOOKSHELF_POSITIONS.map(({ x, z }) => [x, z]));
    expect(countEnchantPower(full.shelves, full.blockers)).toEqual({ placed: 16, counted: 15, blocked: 0 });
  });

  it("ignores shelves that are not on the ring", () => {
    const near = layout([[1, 0], [0, 1], [2, 2]]);
    expect(countEnchantPower(near.shelves, near.blockers)).toEqual({ placed: 1, counted: 1, blocked: 0 });
  });

  it("blocks every shelf standing behind a blocked gap at the shelf's height", () => {
    // East column (2,-1), (2,0), (2,1) all depend on the east gap.
    const east = layout([[2, -1], [2, 0], [2, 1]], [[1, 0]]);
    expect(countEnchantPower(east.shelves, east.blockers)).toEqual({ placed: 3, counted: 0, blocked: 3 });

    // A torch at table height does not reach shelves one block above.
    const stacked = layout([[2, -1], [2, 0], [2, 1]], [[1, 0]]);
    const shelvesAbove = new Set([[2, -1], [2, 0], [2, 1]].map(([x, z]) => shelfKey(x, z, 1)));
    expect(countEnchantPower(shelvesAbove, stacked.blockers)).toEqual({ placed: 3, counted: 3, blocked: 0 });
  });

  it("blocks corner shelves through the diagonal gap only", () => {
    const corner = layout([[2, 2]], [[1, 1]]);
    expect(countEnchantPower(corner.shelves, corner.blockers)).toEqual({ placed: 1, counted: 0, blocked: 1 });
  });

  it("reports zero power for an empty layout", () => {
    expect(countEnchantPower(new Set(), new Set())).toEqual({ placed: 0, counted: 0, blocked: 0 });
  });
});

describe("bottomSlotRange", () => {
  it("matches the vanilla reference points", () => {
    expect(bottomSlotRange(0)).toEqual({ min: 1, max: 8 });
    expect(bottomSlotRange(15)).toEqual({ min: 30, max: 30 });
    expect(bottomSlotRange(14)).toEqual({ min: 28, max: 29 });
    expect(bottomSlotRange(10)).toEqual({ min: 20, max: 23 });
  });

  it("clamps out-of-range counts", () => {
    expect(bottomSlotRange(-4)).toEqual({ min: 1, max: 8 });
    expect(bottomSlotRange(99)).toEqual({ min: 30, max: 30 });
  });

  it("never regresses as shelves are added", () => {
    for (let shelves = 1; shelves <= 15; shelves += 1) {
      const previous = bottomSlotRange(shelves - 1);
      const current = bottomSlotRange(shelves);
      expect(current.min).toBeGreaterThanOrEqual(previous.min);
      expect(current.max).toBeGreaterThanOrEqual(previous.max);
      expect(current.max).toBeLessThanOrEqual(30);
    }
  });
});
