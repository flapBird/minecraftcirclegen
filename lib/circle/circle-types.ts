export type CircleMode = "hollow" | "thick" | "filled";

export interface CircleOptions {
  diameter: number;
  mode: CircleMode;
  thickness: number;
}

export interface CircleSegment {
  startX: number;
  endX: number;
  length: number;
}

export interface CircleRow {
  index: number;
  relativeY: number;
  blockCount: number;
  segments: CircleSegment[];
}

export interface CircleResult {
  diameter: number;
  mode: CircleMode;
  thickness: number;
  grid: boolean[][];
  totalBlocks: number;
  rows: CircleRow[];
  isEffectivelyFilled: boolean;
}

export interface ExportOptions {
  showGrid: boolean;
  showAxes: boolean;
  showCoordinates: boolean;
  transparentBackground: boolean;
}
