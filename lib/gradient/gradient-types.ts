export type BlockFamily = "color" | "stone" | "wood" | "earth" | "ocean" | "metal";

export type BlockCategory =
  | "aquatic"
  | "concrete"
  | "copper"
  | "deepslate"
  | "end"
  | "glass"
  | "mineral"
  | "misc"
  | "nature"
  | "nether"
  | "prismarine"
  | "sand"
  | "sculk"
  | "shulker"
  | "stone"
  | "terracotta"
  | "tuff"
  | "wood"
  | "wool";

export type GradientPalette =
  | "all"
  | "common"
  | "colorful"
  | "natural"
  | "stone"
  | "wood"
  | "terrain";

export type GradientEndpointMode = "block" | "color";

export interface MinecraftBlockColor {
  id: string;
  name: string;
  hex: string;
  family: BlockFamily;
  category?: BlockCategory;
  texture?: string;
  common: boolean;
}

export interface GradientOptions {
  startColor: string;
  endColor: string;
  steps: number;
  palette: GradientPalette;
  endpointMode?: GradientEndpointMode;
  startBlockId?: string;
  endBlockId?: string;
}

export interface GradientStep {
  index: number;
  targetColor: string;
  block: MinecraftBlockColor;
}
