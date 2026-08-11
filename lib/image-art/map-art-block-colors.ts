import type { MinecraftBlockColor } from "@/lib/gradient/gradient-types";

// Flat-map colors paired with practical representative blocks. Biome-tinted
// foliage and water are intentionally omitted because their appearance changes
// with world location.
export const MAP_ART_BLOCK_COLORS: MinecraftBlockColor[] = [
  { id: "map_snow", name: "Snow Block", hex: "#ffffff", family: "stone", common: true },
  { id: "map_quartz", name: "Quartz Block", hex: "#d1b1a1", family: "stone", common: true },
  { id: "map_light_gray", name: "Light Gray Concrete", hex: "#999999", family: "color", common: true },
  { id: "map_gray", name: "Gray Concrete", hex: "#4c4c4c", family: "color", common: true },
  { id: "map_black", name: "Black Concrete", hex: "#191919", family: "color", common: true },
  { id: "map_red", name: "Red Concrete", hex: "#993333", family: "color", common: true },
  { id: "map_orange", name: "Orange Concrete", hex: "#d87f33", family: "color", common: true },
  { id: "map_yellow", name: "Yellow Concrete", hex: "#e5e533", family: "color", common: true },
  { id: "map_lime", name: "Lime Concrete", hex: "#7fcc19", family: "color", common: true },
  { id: "map_green", name: "Green Concrete", hex: "#667f33", family: "color", common: true },
  { id: "map_cyan", name: "Cyan Concrete", hex: "#4c7f99", family: "color", common: true },
  { id: "map_light_blue", name: "Light Blue Concrete", hex: "#6699d8", family: "color", common: true },
  { id: "map_blue", name: "Blue Concrete", hex: "#334cb2", family: "color", common: true },
  { id: "map_purple", name: "Purple Concrete", hex: "#7f3fb2", family: "color", common: true },
  { id: "map_magenta", name: "Magenta Concrete", hex: "#b24cd8", family: "color", common: true },
  { id: "map_pink", name: "Pink Concrete", hex: "#f27fa5", family: "color", common: true },
  { id: "map_brown", name: "Brown Concrete", hex: "#664c33", family: "color", common: true },
  { id: "map_sand", name: "Sand", hex: "#f7e9a3", family: "earth", common: true },
  { id: "map_dirt", name: "Dirt", hex: "#976d4d", family: "earth", common: true },
  { id: "map_stone", name: "Stone", hex: "#707070", family: "stone", common: true },
  { id: "map_deepslate", name: "Deepslate", hex: "#3a3a3a", family: "stone", common: true },
  { id: "map_netherrack", name: "Netherrack", hex: "#700200", family: "earth", common: true },
  { id: "map_crimson_nylium", name: "Crimson Nylium", hex: "#bd3031", family: "earth", common: true },
  { id: "map_warped_nylium", name: "Warped Nylium", hex: "#167e86", family: "earth", common: true },
  { id: "map_oak", name: "Oak Planks", hex: "#8f7748", family: "wood", common: true },
  { id: "map_spruce", name: "Spruce Planks", hex: "#5c3f24", family: "wood", common: true },
  { id: "map_acacia", name: "Acacia Planks", hex: "#9f5224", family: "wood", common: true },
  { id: "map_cherry", name: "Cherry Planks", hex: "#d7a0a0", family: "wood", common: true },
  { id: "map_prismarine", name: "Prismarine Bricks", hex: "#5cdbd5", family: "ocean", common: true },
  { id: "map_gold", name: "Gold Block", hex: "#faee4d", family: "metal", common: false },
  { id: "map_lapis", name: "Lapis Lazuli Block", hex: "#4a80ff", family: "metal", common: false },
  { id: "map_emerald", name: "Emerald Block", hex: "#00d93a", family: "metal", common: false },
];
