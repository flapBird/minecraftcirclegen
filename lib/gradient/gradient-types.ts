export type BlockFamily = "color" | "stone" | "wood" | "earth" | "ocean" | "metal";

export type GradientPalette = "all" | "common" | "colorful" | "natural";

export interface MinecraftBlockColor {
  id: string;
  name: string;
  hex: string;
  family: BlockFamily;
  common: boolean;
}

export interface GradientOptions {
  startColor: string;
  endColor: string;
  steps: number;
  palette: GradientPalette;
}

export interface GradientStep {
  index: number;
  targetColor: string;
  block: MinecraftBlockColor;
}
