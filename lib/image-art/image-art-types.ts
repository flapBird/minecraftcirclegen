import type { MinecraftBlockColor } from "@/lib/gradient/gradient-types";

export type ImageArtMode = "pixel" | "map";
export type ImageFit = "contain" | "cover";

export interface RasterImage {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export interface ImageArtResult {
  width: number;
  height: number;
  cells: Array<Array<MinecraftBlockColor | null>>;
  blockCount: number;
  emptyCount: number;
  materials: Array<{ block: MinecraftBlockColor; count: number }>;
}
