export type ToolKey =
  | "circle"
  | "oval"
  | "sphere"
  | "dome"
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
    key: "gradient",
    href: "/minecraft-gradient-generator",
    navLabel: "Gradient",
    title: "Gradient Generator",
    description: "Match colors to smooth, buildable vanilla block palettes.",
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
];

export function getToolPage(key: ToolKey) {
  const tool = TOOL_PAGES.find((item) => item.key === key);
  if (!tool) throw new Error(`Unknown tool page: ${key}`);
  return tool;
}
