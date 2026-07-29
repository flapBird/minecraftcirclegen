import type { CircleRow, CircleSegment } from "./circle-types";
import { coordinateForIndex } from "./circle-utils";

export function generateRowPatterns(grid: boolean[][]): CircleRow[] {
  const diameter = grid.length;

  return grid.map((row, rowIndex) => {
    const segments: CircleSegment[] = [];
    let startIndex: number | null = null;

    for (let x = 0; x <= row.length; x += 1) {
      const filled = x < row.length && row[x];
      if (filled && startIndex === null) {
        startIndex = x;
      } else if (!filled && startIndex !== null) {
        const endIndex = x - 1;
        segments.push({
          startX: coordinateForIndex(startIndex, diameter),
          endX: coordinateForIndex(endIndex, diameter),
          length: endIndex - startIndex + 1,
        });
        startIndex = null;
      }
    }

    return {
      index: rowIndex,
      relativeY: coordinateForIndex(rowIndex, diameter),
      blockCount: row.filter(Boolean).length,
      segments,
    };
  });
}
