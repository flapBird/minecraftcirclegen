export type ToolKey =
  | "circle"
  | "oval"
  | "sphere"
  | "dome"
  | "shape"
  | "banner"
  | "text"
  | "color-codes"
  | "gradient"
  | "pixel-art"
  | "map-art"
  | "font";

export interface ToolPage {
  key: ToolKey;
  href: string;
  navLabel: string;
  title: string;
  description: string;
}

export interface ContentPage {
  key: "house-designs" | "house-blueprints";
  href: string;
  navLabel: string;
  title: string;
  description: string;
}

export const TOOL_PAGES: ToolPage[] = [
  {
    key: "circle",
    href: "/",
    navLabel: "Circle",
    title: "Circle Generator",
    description: "Plan hollow or filled circular foundations, walls, and platforms.",
  },
  {
    key: "oval",
    href: "/oval-generator",
    navLabel: "Oval",
    title: "Oval Generator",
    description: "Create stretched circles with independent width and height controls.",
  },
  {
    key: "sphere",
    href: "/sphere-generator",
    navLabel: "Sphere",
    title: "Sphere Generator",
    description: "Build complete spheres from practical layer-by-layer blueprints.",
  },
  {
    key: "dome",
    href: "/dome-generator",
    navLabel: "Dome",
    title: "Dome Generator",
    description: "Plan hemisphere roofs with clear layers from the base to the peak.",
  },
  {
    key: "shape",
    href: "/minecraft-shape-generator",
    navLabel: "Shape",
    title: "Shape Generator",
    description: "Create 2D shapes and layer-by-layer 3D building blueprints.",
  },
  {
    key: "gradient",
    href: "/minecraft-gradient-generator",
    navLabel: "Gradient",
    title: "Gradient Generator",
    description: "Create RGB text and buildable vanilla block gradients.",
  },
  {
    key: "pixel-art",
    href: "/minecraft-pixel-art-generator",
    navLabel: "Pixel Art",
    title: "Pixel Art Generator",
    description: "Convert images into block grids and exact material lists.",
  },
  {
    key: "map-art",
    href: "/minecraft-map-art-generator",
    navLabel: "Map Art",
    title: "Map Art Generator",
    description: "Plan flat Minecraft map art in clear 128×128-block tiles.",
  },
  {
    key: "font",
    href: "/minecraft-font-generator",
    navLabel: "Font",
    title: "Font Generator",
    description: "Turn words into readable pixel text and block-letter blueprints.",
  },
  {
    key: "banner",
    href: "/minecraft-banner-maker",
    navLabel: "Banner",
    title: "Banner Maker",
    description: "Design, save, and share layered banners with clear loom steps and Java commands.",
  },
  {
    key: "text",
    href: "/minecraft-text-generator",
    navLabel: "Text",
    title: "Text Generator",
    description: "Format chat, MOTD, MiniMessage, and safe tellraw text.",
  },
  {
    key: "color-codes",
    href: "/minecraft-color-codes",
    navLabel: "Color Codes",
    title: "Color Codes",
    description: "Reference, preview, and copy Minecraft colors and formatting codes.",
  },
];

export type ToolCategoryKey = "build" | "art" | "text";

export interface ToolCategory {
  key: ToolCategoryKey;
  title: string;
  toolKeys: ToolKey[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    key: "build",
    title: "Build & Shape Tools",
    toolKeys: ["circle", "oval", "sphere", "dome", "shape"],
  },
  {
    key: "art",
    title: "Art & Design Tools",
    toolKeys: ["pixel-art", "map-art", "font", "banner"],
  },
  {
    key: "text",
    title: "Text & Server Tools",
    toolKeys: ["text", "gradient", "color-codes"],
  },
];

export const RELATED_TOOLS: Record<ToolKey, ToolKey[]> = {
  circle: ["shape", "oval", "sphere", "dome"],
  oval: ["shape", "circle", "sphere", "dome"],
  sphere: ["shape", "circle", "dome", "oval"],
  dome: ["shape", "sphere", "circle", "oval"],
  shape: ["circle", "oval", "sphere", "dome"],
  banner: ["pixel-art", "color-codes", "font"],
  text: ["color-codes", "gradient", "font"],
  "color-codes": ["text", "gradient", "banner"],
  gradient: ["color-codes", "text", "pixel-art"],
  "pixel-art": ["map-art", "font", "banner", "gradient"],
  "map-art": ["pixel-art", "gradient", "shape"],
  font: ["text", "banner", "pixel-art", "color-codes"],
};

export function getToolsForCategory(category: ToolCategory) {
  return category.toolKeys.map(getToolPage);
}

export const CONTENT_PAGES: ContentPage[] = [
  {
    key: "house-designs",
    href: "/house-designs",
    navLabel: "House Designs",
    title: "Minecraft House Designs",
    description: "Buildable house ideas with dimensions, materials, and exact blueprints.",
  },
  {
    key: "house-blueprints",
    href: "/house-blueprints",
    navLabel: "Blueprints",
    title: "Minecraft House Blueprints",
    description: "Exact house layers, material counts, and downloadable block plans.",
  },
];

export function getToolPage(key: ToolKey) {
  const tool = TOOL_PAGES.find((item) => item.key === key);
  if (!tool) throw new Error(`Unknown tool page: ${key}`);
  return tool;
}
