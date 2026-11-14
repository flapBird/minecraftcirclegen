"use client";

import { useMemo, useState } from "react";
import {
  BOOKSHELF_POSITIONS,
  MAX_ENCHANT_POWER,
  bottomSlotRange,
  countEnchantPower,
  gapBlockerKey,
  shelfKey,
} from "@/lib/minecraft/enchant-power";

type SimulatorState = {
  shelves: Set<string>;
  blockers: Set<string>;
};

type Cell = readonly [number, number, number];

const EAST_COLUMN = [[2, -1], [2, 0], [2, 1]];
const NORTH_ROW = [[-1, -2], [0, -2], [1, -2]];
const NORTH_EAST_CORNER = [2, -2];

function buildLayout(shelfCells: ReadonlyArray<Cell>, blockerCells: ReadonlyArray<Cell> = []): SimulatorState {
  return {
    shelves: new Set(shelfCells.map(([x, z, level]) => shelfKey(x, z, level))),
    blockers: new Set(blockerCells.map(([x, z, level]) => gapBlockerKey(x, z, level))),
  };
}

const RING_AT_TABLE_LEVEL: Array<readonly [number, number, number]> = BOOKSHELF_POSITIONS.map(({ x, z }) => [x, z, 0] as const);

const PRESETS: Array<{ id: string; label: string; title: string; build: () => SimulatorState }> = [
  {
    id: "classic-ring",
    label: "Classic ring",
    title: "Full ring with one opening: 15 shelves, level 30",
    build: () => buildLayout(RING_AT_TABLE_LEVEL.filter(([x, z]) => !(x === 0 && z === -2))),
  },
  {
    id: "full-ring",
    label: "Full ring (16)",
    title: "All 16 ring slots filled: the cap wastes one shelf but still reaches level 30",
    build: () => buildLayout(RING_AT_TABLE_LEVEL),
  },
  {
    id: "torch-demo",
    label: "Torch demo",
    title: "Classic ring with a torch blocking the north gap, hiding two shelves",
    build: () => buildLayout(
      RING_AT_TABLE_LEVEL.filter(([x, z]) => !(x === 0 && z === -2)),
      [[0, -1, 0]],
    ),
  },
  {
    id: "corner-stack",
    label: "Corner stack",
    title: "Two-sided column layout stacked one block higher: 14 shelves",
    build: () => buildLayout([
      ...NORTH_ROW.map(([x, z]) => [x, z, 0] as const),
      ...EAST_COLUMN.map(([x, z]) => [x, z, 0] as const),
      [NORTH_EAST_CORNER[0], NORTH_EAST_CORNER[1], 0],
      ...NORTH_ROW.map(([x, z]) => [x, z, 1] as const),
      ...EAST_COLUMN.map(([x, z]) => [x, z, 1] as const),
      [NORTH_EAST_CORNER[0], NORTH_EAST_CORNER[1], 1],
    ]),
  },
  {
    id: "clear",
    label: "Clear",
    title: "Empty the simulator and plan your own layout",
    build: () => buildLayout([]),
  },
];

function describeOffset(x: number, z: number) {
  const parts: string[] = [];
  if (x !== 0) parts.push(`${Math.abs(x)} ${x > 0 ? "east" : "west"}`);
  if (z !== 0) parts.push(`${Math.abs(z)} ${z > 0 ? "south" : "north"}`);
  return parts.length > 0 ? parts.join(", ") : "table center";
}

const GRID_CELLS: Array<{ x: number; z: number; kind: "table" | "gap" | "ring" }> = (() => {
  const cells: Array<{ x: number; z: number; kind: "table" | "gap" | "ring" }> = [];
  for (let z = -2; z <= 2; z += 1) {
    for (let x = -2; x <= 2; x += 1) {
      const reach = Math.max(Math.abs(x), Math.abs(z));
      cells.push({ x, z, kind: reach === 0 ? "table" : reach === 1 ? "gap" : "ring" });
    }
  }
  return cells;
})();

export function BookshelfSimulator() {
  const [state, setState] = useState<SimulatorState>(() => PRESETS[0].build());
  const [level, setLevel] = useState(0);

  const power = useMemo(() => countEnchantPower(state.shelves, state.blockers), [state]);
  const slot = useMemo(() => bottomSlotRange(power.counted), [power]);
  const missing = MAX_ENCHANT_POWER - power.counted;

  const toggleShelf = (x: number, z: number) => {
    const key = shelfKey(x, z, level);
    setState((current) => {
      const shelves = new Set(current.shelves);
      if (shelves.has(key)) shelves.delete(key); else shelves.add(key);
      return { ...current, shelves };
    });
  };

  const toggleBlocker = (x: number, z: number) => {
    const key = gapBlockerKey(x, z, level);
    setState((current) => {
      const blockers = new Set(current.blockers);
      if (blockers.has(key)) blockers.delete(key); else blockers.add(key);
      return { ...current, blockers };
    });
  };

  const hints: string[] = [];
  if (power.blocked > 0) {
    hints.push(
      `${power.blocked === 1 ? "1 shelf does" : `${power.blocked} shelves do`} not count because a torch or block sits in the gap in front of ${power.blocked === 1 ? "it" : "them"}. Tap the marked gap cell to clear it.`,
    );
  }
  if (power.counted === MAX_ENCHANT_POWER) {
    hints.push("Level 30 unlocked. Every enchantment in the bottom slot costs exactly 30 levels.");
  } else if (missing > 0) {
    hints.push(`Add ${missing} more ${missing === 1 ? "bookshelf" : "bookshelves"} to reach level 30.`);
  }

  const slotLine = slot.min === slot.max
    ? `Bottom slot offers level ${slot.min}`
    : `Bottom slot offers levels ${slot.min}–${slot.max}`;

  return (
    <div className="enchant-simulator">
      <div className="enchant-simulator-head">
        <div className="enchant-layer-switch" role="group" aria-label="Height layer being edited">
          <button
            type="button"
            className={level === 0 ? "is-active" : undefined}
            aria-pressed={level === 0}
            onClick={() => setLevel(0)}
          >
            Table level
          </button>
          <button
            type="button"
            className={level === 1 ? "is-active" : undefined}
            aria-pressed={level === 1}
            onClick={() => setLevel(1)}
          >
            One block above
          </button>
        </div>
        <div className="enchant-presets" role="group" aria-label="Preset layouts">
          {PRESETS.map((preset) => (
            <button key={preset.id} type="button" title={preset.title} onClick={() => setState(preset.build())}>
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="enchant-simulator-body">
        <div className="enchant-grid-wrap">
          <div className="enchant-grid" role="group" aria-label={`Bookshelf placement grid, ${level === 0 ? "table level" : "one block above the table"}`}>
            {GRID_CELLS.map((cell) => {
              if (cell.kind === "table") {
                return (
                  <span key={`${cell.x},${cell.z}`} className="enchant-cell is-table">
                    <span className="enchant-table-book" aria-hidden="true" />
                    <span className="enchant-table-label">Table</span>
                  </span>
                );
              }
              if (cell.kind === "gap") {
                const blocked = state.blockers.has(gapBlockerKey(cell.x, cell.z, level));
                const stateLabel = blocked ? "blocked by a torch" : "open air";
                return (
                  <button
                    key={`${cell.x},${cell.z}`}
                    type="button"
                    className={`enchant-cell is-gap${blocked ? " is-blocked" : ""}`}
                    aria-pressed={blocked}
                    aria-label={`Gap cell ${describeOffset(cell.x, cell.z)} — ${stateLabel}`}
                    title={`Gap cell (${describeOffset(cell.x, cell.z)}): ${stateLabel}. Click to ${blocked ? "clear" : "place a torch"}.`}
                    onClick={() => toggleBlocker(cell.x, cell.z)}
                  >
                    {blocked && <span className="enchant-torch" aria-hidden="true" />}
                  </button>
                );
              }
              const hasShelf = state.shelves.has(shelfKey(cell.x, cell.z, level));
              const stateLabel = hasShelf ? "bookshelf placed" : "empty";
              return (
                <button
                  key={`${cell.x},${cell.z}`}
                  type="button"
                  className={`enchant-cell is-ring${hasShelf ? " is-shelf" : ""}`}
                  aria-pressed={hasShelf}
                  aria-label={`Bookshelf slot ${describeOffset(cell.x, cell.z)} — ${stateLabel}`}
                  title={`Bookshelf slot (${describeOffset(cell.x, cell.z)}): ${stateLabel}. Click to ${hasShelf ? "remove" : "place"} a bookshelf.`}
                  onClick={() => toggleShelf(cell.x, cell.z)}
                />
              );
            })}
          </div>
          <p className="enchant-editing-note">
            Editing {level === 0 ? "the same height as the table" : "one block above the table"} — click a ring
            slot to place or remove a bookshelf, click a gap cell to place or clear a torch.
          </p>
        </div>

        <div className="enchant-readout" aria-live="polite">
          <p className="enchant-power-stat">
            <strong>{power.counted}</strong>
            <span className="enchant-power-cap">/ {MAX_ENCHANT_POWER} shelves counting</span>
          </p>
          <p className="enchant-slot-line">{slotLine}</p>
          {power.placed !== power.counted && (
            <p className="enchant-slot-detail">
              {power.placed} placed · {power.counted} counting{power.blocked > 0 ? ` · ${power.blocked} blocked` : ""}
            </p>
          )}
          <ul className="enchant-hints">
            {hints.map((hint) => <li key={hint}>{hint}</li>)}
          </ul>
        </div>
      </div>

      <div className="enchant-legend" aria-label="Simulator legend">
        <span><i className="is-legend-shelf" />Bookshelf</span>
        <span><i className="is-legend-empty" />Empty slot</span>
        <span><i className="is-legend-gap" />Gap (air)</span>
        <span><i className="is-legend-torch" />Torch blocks the gap</span>
        <span><i className="is-legend-table" />Enchanting table</span>
      </div>
    </div>
  );
}
