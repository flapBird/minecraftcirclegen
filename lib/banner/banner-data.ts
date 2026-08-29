export interface DyeColor {
  id: string;
  name: string;
  hex: string;
}

export const DYE_COLORS: DyeColor[] = [
  { id: "white", name: "White", hex: "#F9FFFE" },
  { id: "orange", name: "Orange", hex: "#F9801D" },
  { id: "magenta", name: "Magenta", hex: "#C74EBD" },
  { id: "light_blue", name: "Light Blue", hex: "#3AB3DA" },
  { id: "yellow", name: "Yellow", hex: "#FED83D" },
  { id: "lime", name: "Lime", hex: "#80C71F" },
  { id: "pink", name: "Pink", hex: "#F38BAA" },
  { id: "gray", name: "Gray", hex: "#474F52" },
  { id: "light_gray", name: "Light Gray", hex: "#9D9D97" },
  { id: "cyan", name: "Cyan", hex: "#169C9C" },
  { id: "purple", name: "Purple", hex: "#8932B8" },
  { id: "blue", name: "Blue", hex: "#3C44AA" },
  { id: "brown", name: "Brown", hex: "#835432" },
  { id: "green", name: "Green", hex: "#5E7C16" },
  { id: "red", name: "Red", hex: "#B02E26" },
  { id: "black", name: "Black", hex: "#1D1D21" },
];

export interface BannerPattern {
  id: string;
  name: string;
  loomName: string;
}

export const BANNER_PATTERNS: BannerPattern[] = [
  { id: "stripe_center", name: "Vertical Stripe", loomName: "Pale" },
  { id: "stripe_middle", name: "Horizontal Stripe", loomName: "Fess" },
  { id: "cross", name: "Diagonal Cross", loomName: "Saltire" },
  { id: "straight_cross", name: "Cross", loomName: "Cross" },
  { id: "border", name: "Border", loomName: "Bordure" },
  { id: "gradient", name: "Gradient", loomName: "Gradient" },
  { id: "half_horizontal", name: "Top Half", loomName: "Per Fess" },
  { id: "half_vertical", name: "Left Half", loomName: "Per Pale" },
  { id: "diagonal_left", name: "Diagonal", loomName: "Per Bend Sinister" },
  { id: "circle", name: "Circle", loomName: "Roundel" },
  { id: "rhombus", name: "Rhombus", loomName: "Lozenge" },
  { id: "triangle_bottom", name: "Chevron", loomName: "Chevron" },
  { id: "small_stripes", name: "Vertical Stripes", loomName: "Paly" },
];

export interface BannerLayer {
  uid: number;
  patternId: string;
  colorId: string;
}

export const BANNER_JAVA_VERSION = "Java 1.20.5+";

export function getDye(id: string) {
  return DYE_COLORS.find((color) => color.id === id) ?? DYE_COLORS[0];
}

export function getPattern(id: string) {
  return BANNER_PATTERNS.find((pattern) => pattern.id === id) ?? BANNER_PATTERNS[0];
}

export function makeBannerCommand(baseColorId: string, layers: BannerLayer[]) {
  const patterns = layers.map((layer) =>
    `{pattern:'minecraft:${layer.patternId}',color:'${layer.colorId}'}`,
  ).join(",");
  const component = patterns ? `[minecraft:banner_patterns=[${patterns}]]` : "";
  return `/give @p minecraft:${baseColorId}_banner${component} 1`;
}

export function makeBannerSetblockCommand(baseColorId: string, layers: BannerLayer[]) {
  const patterns = layers.map((layer) =>
    `{pattern:'minecraft:${layer.patternId}',color:'${layer.colorId}'}`,
  ).join(",");
  const blockEntityData = patterns ? `{patterns:[${patterns}]}` : "";
  return `/setblock ~ ~ ~ minecraft:${baseColorId}_banner${blockEntityData}`;
}

export function encodeBannerDesign(baseColorId: string, layers: BannerLayer[]) {
  return [baseColorId, ...layers.slice(0, 6).map((layer) => `${layer.patternId},${layer.colorId}`)].join("|");
}

export function decodeBannerDesign(value: string | null) {
  if (!value) return null;
  const [baseColorId, ...encodedLayers] = value.split("|");
  if (!DYE_COLORS.some((color) => color.id === baseColorId)) return null;
  const layers = encodedLayers.slice(0, 6).flatMap((item, index) => {
    const [patternId, colorId] = item.split(",");
    if (!BANNER_PATTERNS.some((pattern) => pattern.id === patternId) || !DYE_COLORS.some((color) => color.id === colorId)) return [];
    return [{ uid: index + 1, patternId, colorId }];
  });
  return { baseColorId, layers };
}
