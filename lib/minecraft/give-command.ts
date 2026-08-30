import { getJavaItem } from "@/data/minecraft/java-items";

export type GiveCommandVersion = "java-latest" | "java-components" | "java-legacy";

export interface GiveEnchantment {
  id: string;
  level: number;
}

export interface GiveCommandInput {
  version: GiveCommandVersion;
  target: string;
  itemId: string;
  amount: number;
  customName: string;
  lore: string[];
  enchantments: GiveEnchantment[];
  unbreakable: boolean;
}

export interface GiveCommandResult {
  command: string | null;
  errors: string[];
}

export interface EnchantmentOption {
  id: string;
  name: string;
  maxLevel: number;
}

export const GIVE_COMMAND_VERSIONS: Array<{
  id: GiveCommandVersion;
  label: string;
  detail: string;
}> = [
  {
    id: "java-latest",
    label: "Java 1.21.5–26.2",
    detail: "Current item components with inline SNBT text components.",
  },
  {
    id: "java-components",
    label: "Java 1.20.5–1.21.4",
    detail: "First-generation item components with JSON text strings.",
  },
  {
    id: "java-legacy",
    label: "Java 1.20.4",
    detail: "Legacy item NBT used immediately before item components.",
  },
];

export const ENCHANTMENTS: EnchantmentOption[] = [
  { id: "sharpness", name: "Sharpness", maxLevel: 5 },
  { id: "efficiency", name: "Efficiency", maxLevel: 5 },
  { id: "unbreaking", name: "Unbreaking", maxLevel: 3 },
  { id: "fortune", name: "Fortune", maxLevel: 3 },
  { id: "silk_touch", name: "Silk Touch", maxLevel: 1 },
  { id: "protection", name: "Protection", maxLevel: 4 },
  { id: "power", name: "Power", maxLevel: 5 },
  { id: "mending", name: "Mending", maxLevel: 1 },
  { id: "looting", name: "Looting", maxLevel: 3 },
  { id: "knockback", name: "Knockback", maxLevel: 2 },
  { id: "fire_aspect", name: "Fire Aspect", maxLevel: 2 },
  { id: "feather_falling", name: "Feather Falling", maxLevel: 4 },
  { id: "respiration", name: "Respiration", maxLevel: 3 },
  { id: "aqua_affinity", name: "Aqua Affinity", maxLevel: 1 },
  { id: "thorns", name: "Thorns", maxLevel: 3 },
  { id: "flame", name: "Flame", maxLevel: 1 },
  { id: "infinity", name: "Infinity", maxLevel: 1 },
];

const SELECTORS = new Set(["@p", "@a", "@s"]);
const PLAYER_NAME_PATTERN = /^[A-Za-z0-9_]{3,16}$/;

function lengthOf(value: string) {
  return [...value].length;
}

/** Quote a user string for an SNBT single-quoted literal. */
export function quoteSnbtString(value: string) {
  const escaped = value
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'")
    .replaceAll("\b", "\\b")
    .replaceAll("\f", "\\f")
    .replaceAll("\n", "\\n")
    .replaceAll("\r", "\\r")
    .replaceAll("\t", "\\t");
  return `'${escaped}'`;
}

function jsonTextString(text: string) {
  return quoteSnbtString(JSON.stringify({ text, italic: false }));
}

function inlineTextComponent(text: string) {
  return `{text:${quoteSnbtString(text)},italic:false}`;
}

function validate(input: GiveCommandInput) {
  const errors: string[] = [];
  const item = getJavaItem(input.itemId);

  if (!SELECTORS.has(input.target) && !PLAYER_NAME_PATTERN.test(input.target)) {
    errors.push("Choose @p, @a, @s, or enter a 3–16 character Java player name.");
  }

  if (!item) errors.push("Choose an item from the Java item catalogue.");
  if (!Number.isInteger(input.amount) || input.amount < 1) {
    errors.push("Amount must be a whole number of at least 1.");
  } else if (item && input.amount > item.maxStack) {
    errors.push(`${item.name} stacks to ${item.maxStack}; lower the amount.`);
  }

  if (lengthOf(input.customName) > 128) {
    errors.push("Custom name must be 128 characters or fewer.");
  }

  const lore = input.lore.filter((line) => line.length > 0);
  if (lore.length > 16) errors.push("Use no more than 16 lore lines.");
  if (lore.some((line) => lengthOf(line) > 256)) {
    errors.push("Each lore line must be 256 characters or fewer.");
  }

  const seen = new Set<string>();
  input.enchantments.forEach((enchantment) => {
    const option = ENCHANTMENTS.find((candidate) => candidate.id === enchantment.id);
    if (!option) {
      errors.push("Choose a supported enchantment.");
      return;
    }
    if (seen.has(enchantment.id)) {
      errors.push(`${option.name} can only be added once.`);
    }
    seen.add(enchantment.id);
    if (!Number.isInteger(enchantment.level) || enchantment.level < 1 || enchantment.level > option.maxLevel) {
      errors.push(`${option.name} level must be between 1 and ${option.maxLevel}.`);
    }
  });

  return errors;
}

function latestComponents(input: GiveCommandInput) {
  const components: string[] = [];
  if (input.customName) {
    components.push(`minecraft:custom_name=${inlineTextComponent(input.customName)}`);
  }
  const lore = input.lore.filter((line) => line.length > 0);
  if (lore.length) {
    components.push(`minecraft:lore=[${lore.map(inlineTextComponent).join(",")}]`);
  }
  if (input.enchantments.length) {
    const enchantments = input.enchantments
      .map((enchantment) => `${quoteSnbtString(`minecraft:${enchantment.id}`)}:${enchantment.level}`)
      .join(",");
    components.push(`minecraft:enchantments={${enchantments}}`);
  }
  if (input.unbreakable) components.push("minecraft:unbreakable={}");
  return components.length ? `[${components.join(",")}]` : "";
}

function firstGenerationComponents(input: GiveCommandInput) {
  const components: string[] = [];
  if (input.customName) components.push(`minecraft:custom_name=${jsonTextString(input.customName)}`);
  const lore = input.lore.filter((line) => line.length > 0);
  if (lore.length) {
    components.push(`minecraft:lore=[${lore.map(jsonTextString).join(",")}]`);
  }
  if (input.enchantments.length) {
    const levels = input.enchantments
      .map((enchantment) => `${quoteSnbtString(`minecraft:${enchantment.id}`)}:${enchantment.level}`)
      .join(",");
    components.push(`minecraft:enchantments={levels:{${levels}}}`);
  }
  if (input.unbreakable) components.push("minecraft:unbreakable={}");
  return components.length ? `[${components.join(",")}]` : "";
}

function legacyNbt(input: GiveCommandInput) {
  const tags: string[] = [];
  const display: string[] = [];
  if (input.customName) display.push(`Name:${jsonTextString(input.customName)}`);
  const lore = input.lore.filter((line) => line.length > 0);
  if (lore.length) display.push(`Lore:[${lore.map(jsonTextString).join(",")}]`);
  if (display.length) tags.push(`display:{${display.join(",")}}`);
  if (input.enchantments.length) {
    const enchantments = input.enchantments
      .map((enchantment) => `{id:${quoteSnbtString(`minecraft:${enchantment.id}`)},lvl:${enchantment.level}s}`)
      .join(",");
    tags.push(`Enchantments:[${enchantments}]`);
  }
  if (input.unbreakable) tags.push("Unbreakable:1b");
  return tags.length ? `{${tags.join(",")}}` : "";
}

export function generateGiveCommand(input: GiveCommandInput): GiveCommandResult {
  const errors = validate(input);
  if (errors.length) return { command: null, errors: [...new Set(errors)] };

  const itemData = input.version === "java-latest"
    ? latestComponents(input)
    : input.version === "java-components"
      ? firstGenerationComponents(input)
      : legacyNbt(input);

  return {
    command: `/give ${input.target} minecraft:${input.itemId}${itemData} ${input.amount}`,
    errors: [],
  };
}
