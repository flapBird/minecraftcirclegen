export interface MinecraftColor {
  code: string;
  name: string;
  hex: string;
  miniMessage: string;
}

export const MINECRAFT_COLORS: MinecraftColor[] = [
  { code: "0", name: "Black", hex: "#000000", miniMessage: "black" },
  { code: "1", name: "Dark Blue", hex: "#0000AA", miniMessage: "dark_blue" },
  { code: "2", name: "Dark Green", hex: "#00AA00", miniMessage: "dark_green" },
  { code: "3", name: "Dark Aqua", hex: "#00AAAA", miniMessage: "dark_aqua" },
  { code: "4", name: "Dark Red", hex: "#AA0000", miniMessage: "dark_red" },
  { code: "5", name: "Dark Purple", hex: "#AA00AA", miniMessage: "dark_purple" },
  { code: "6", name: "Gold", hex: "#FFAA00", miniMessage: "gold" },
  { code: "7", name: "Gray", hex: "#AAAAAA", miniMessage: "gray" },
  { code: "8", name: "Dark Gray", hex: "#555555", miniMessage: "dark_gray" },
  { code: "9", name: "Blue", hex: "#5555FF", miniMessage: "blue" },
  { code: "a", name: "Green", hex: "#55FF55", miniMessage: "green" },
  { code: "b", name: "Aqua", hex: "#55FFFF", miniMessage: "aqua" },
  { code: "c", name: "Red", hex: "#FF5555", miniMessage: "red" },
  { code: "d", name: "Light Purple", hex: "#FF55FF", miniMessage: "light_purple" },
  { code: "e", name: "Yellow", hex: "#FFFF55", miniMessage: "yellow" },
  { code: "f", name: "White", hex: "#FFFFFF", miniMessage: "white" },
];

export interface TextStyles {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  obfuscated: boolean;
}

export const DEFAULT_TEXT_STYLES: TextStyles = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  obfuscated: false,
};

export const FORMATTING_CODES = [
  { key: "obfuscated", name: "Obfuscated", code: "k" },
  { key: "bold", name: "Bold", code: "l" },
  { key: "strikethrough", name: "Strikethrough", code: "m" },
  { key: "underline", name: "Underline", code: "n" },
  { key: "italic", name: "Italic", code: "o" },
  { key: "reset", name: "Reset", code: "r" },
] as const;

export function getMinecraftColor(code: string) {
  return MINECRAFT_COLORS.find((color) => color.code === code) ?? MINECRAFT_COLORS[10];
}

function enabledStyleCodes(styles: TextStyles) {
  return FORMATTING_CODES.filter(
    (format) => format.key !== "reset" && styles[format.key],
  );
}

export function makeLegacyText(
  text: string,
  colorCode: string,
  styles: TextStyles,
  marker: "§" | "&",
) {
  const codes = [colorCode, ...enabledStyleCodes(styles).map((style) => style.code)];
  return `${codes.map((code) => `${marker}${code}`).join("")}${text}`;
}

export function makeMotdText(text: string, colorCode: string, styles: TextStyles) {
  return makeLegacyText(text, colorCode, styles, "§").replaceAll("§", "\\u00A7");
}

export function makeMiniMessage(text: string, colorCode: string, styles: TextStyles) {
  const color = getMinecraftColor(colorCode);
  const escapedText = text.replaceAll("\\", "\\\\").replaceAll("<", "\\<");
  const tags = [
    color.miniMessage,
    ...(styles.bold ? ["bold"] : []),
    ...(styles.italic ? ["italic"] : []),
    ...(styles.underline ? ["underlined"] : []),
    ...(styles.strikethrough ? ["strikethrough"] : []),
    ...(styles.obfuscated ? ["obfuscated"] : []),
  ];
  return `${tags.map((tag) => `<${tag}>`).join("")}${escapedText}${[...tags].reverse().map((tag) => `</${tag}>`).join("")}`;
}

export function makeTellraw(text: string, colorCode: string, styles: TextStyles) {
  const color = getMinecraftColor(colorCode);
  const component = {
    text,
    color: color.miniMessage,
    ...(styles.bold ? { bold: true } : {}),
    ...(styles.italic ? { italic: true } : {}),
    ...(styles.underline ? { underlined: true } : {}),
    ...(styles.strikethrough ? { strikethrough: true } : {}),
    ...(styles.obfuscated ? { obfuscated: true } : {}),
  };
  return `/tellraw @a ${JSON.stringify(component)}`;
}

export function previewStyle(styles: TextStyles) {
  return {
    fontWeight: styles.bold ? 800 : 500,
    fontStyle: styles.italic ? "italic" : "normal",
    textDecoration: [
      styles.underline ? "underline" : "",
      styles.strikethrough ? "line-through" : "",
    ].filter(Boolean).join(" ") || "none",
  } as const;
}
