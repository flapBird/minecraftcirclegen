import type { CircleMode } from "@/lib/circle/circle-types";

export type GeometryShape = "circle" | "oval" | "sphere" | "dome";

export interface GeometryOptions {
  diameter: number;
  width: number;
  height: number;
  mode: CircleMode;
  thickness: number;
  layer: number;
}

export interface GeometryResult {
  shape: GeometryShape;
  label: string;
  width: number;
  height: number;
  grid: boolean[][];
  mode: CircleMode;
  thickness: number;
  currentBlocks: number;
  totalBlocks: number;
  layer: number;
  layerCount: number;
}

