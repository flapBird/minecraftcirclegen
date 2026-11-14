/**
 * Java Edition 1.18.2+ bookshelf boosting rules for the enchanting table.
 *
 * A bookshelf counts toward enchant power when it sits on the ring around the
 * table (one horizontal axis exactly 2 blocks away, the other 0-2 blocks) at
 * the table's height or one block above, and the block between it and the
 * table — at the shelf's own height — is a power transmitter such as air,
 * a snow layer, or short grass. Torches, carpets, and solid blocks in that
 * gap block every shelf they stand in front of. Counted shelves cap at 15.
 */

export const MAX_ENCHANT_POWER = 15;

/** Ring cells around the table: max(|x|, |z|) === 2. */
export const BOOKSHELF_POSITIONS: ReadonlyArray<{ x: number; z: number }> =
  [-2, -1, 0, 1, 2].flatMap((z) =>
    [-2, -1, 0, 1, 2].flatMap((x) =>
      Math.max(Math.abs(x), Math.abs(z)) === 2 ? [{ x, z }] : [],
    ),
  );

/** Gap cells between the table and the ring: max(|x|, |z|) === 1. */
export const GAP_POSITIONS: ReadonlyArray<{ x: number; z: number }> =
  [-1, 0, 1].flatMap((z) =>
    [-1, 0, 1].flatMap((x) =>
      Math.max(Math.abs(x), Math.abs(z)) === 1 ? [{ x, z }] : [],
    ),
  );

/** Shelf and blocker state keys: "<x>,<z>,<level>" with level 0 = table height, 1 = one above. */
export type EnchantPowerKey = `${number},${number},${number}`;

export function shelfKey(x: number, z: number, level: number): EnchantPowerKey {
  return `${x},${z},${level}` as EnchantPowerKey;
}

/** The gap cell a shelf depends on: integer-halved offset, e.g. (2,1) checks the east gap. */
export function shelfGap(x: number, z: number): { x: number; z: number } {
  return { x: Math.trunc(x / 2), z: Math.trunc(z / 2) };
}

export function gapBlockerKey(x: number, z: number, level: number): EnchantPowerKey {
  return `${x},${z},${level}` as EnchantPowerKey;
}

export interface EnchantPowerResult {
  /** Shelves placed on valid ring slots. */
  placed: number;
  /** Shelves that actually count, capped at MAX_ENCHANT_POWER. */
  counted: number;
  /** Placed shelves whose gap is blocked. */
  blocked: number;
}

export function countEnchantPower(
  shelves: ReadonlySet<string>,
  blockers: ReadonlySet<string>,
): EnchantPowerResult {
  let placed = 0;
  let counted = 0;
  for (const key of shelves) {
    const [x, z, level] = key.split(",").map(Number);
    if (!Number.isInteger(x) || !Number.isInteger(z) || (level !== 0 && level !== 1)) continue;
    if (!BOOKSHELF_POSITIONS.some((position) => position.x === x && position.z === z)) continue;
    placed += 1;
    const gap = shelfGap(x, z);
    if (blockers.has(`${gap.x},${gap.z},${level}`)) continue;
    counted += 1;
  }
  return { placed, counted: Math.min(counted, MAX_ENCHANT_POWER), blocked: placed - counted };
}

/**
 * Level cost the table's bottom slot offers for a given count of counted shelves.
 * xpBase = 1 + rand(0..7) + floor(shelves / 2) + rand(0..shelves) and the bottom
 * slot costs max(xpBase, 2 * shelves), clamped to the table's 1-30 range.
 */
export function bottomSlotRange(countedShelves: number): { min: number; max: number } {
  const shelves = Math.max(0, Math.min(MAX_ENCHANT_POWER, Math.floor(countedShelves)));
  const min = Math.min(30, Math.max(1, 2 * shelves));
  const max = Math.min(30, 8 + shelves + Math.floor(shelves / 2));
  return { min, max: Math.max(min, max) };
}
