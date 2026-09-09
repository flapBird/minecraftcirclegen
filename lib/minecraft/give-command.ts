import { getJavaItem } from "@/data/minecraft/java-items";

export type GiveCommandVersion = "java-latest" | "java-components" | "java-legacy";
export type GiveAttributeComponentVersion = "1.20.5" | "1.21" | "1.21.2";
export type GiveAttributeOperation = "add_value" | "add_multiplied_base" | "add_multiplied_total";
export type GiveEquipmentSlot = "any" | "mainhand" | "offhand" | "head" | "chest" | "legs" | "feet";

export interface GiveTextStyle {
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underlined?: boolean;
  strikethrough?: boolean;
}

export interface GiveEnchantment {
  id: string;
  level: number;
}

export interface GiveAttributeModifier {
  attribute: string;
  amount: number;
  operation: GiveAttributeOperation;
  slot: GiveEquipmentSlot;
}

export interface GiveCommandInput {
  version: GiveCommandVersion;
  target: string;
  itemId: string;
  amount: number;
  customName: string;
  customNameStyle?: GiveTextStyle;
  lore: string[];
  loreStyles?: GiveTextStyle[];
  enchantments: GiveEnchantment[];
  attributes?: GiveAttributeModifier[];
  attributeComponentVersion?: GiveAttributeComponentVersion;
  unbreakable: boolean;
}

export interface GiveCommandResult {
  command: string | null;
  errors: string[];
}

type EnchantmentItemGroup =
  | "armor" | "helmet" | "chestplate" | "leggings" | "boots"
  | "sword" | "axe" | "mining_tool" | "bow" | "crossbow" | "trident"
  | "fishing_rod" | "mace" | "damageable" | "enchanted_book";

export interface EnchantmentOption {
  id: string;
  name: string;
  maxLevel: number;
  compatibleWith: readonly EnchantmentItemGroup[];
}

export interface AttributeOption {
  id: string;
  legacyId: string;
  name: string;
}

export const GIVE_COMMAND_VERSIONS: Array<{
  id: GiveCommandVersion;
  label: string;
  detail: string;
}> = [
  { id: "java-latest", label: "Java 1.21.5–26.2", detail: "Current item components with inline SNBT text components." },
  { id: "java-components", label: "Java 1.20.5–1.21.4", detail: "First-generation item components with JSON text strings." },
  { id: "java-legacy", label: "Java 1.20.4", detail: "Legacy item NBT with the Java 1.20.4 item catalogue." },
];

export const ATTRIBUTE_COMPONENT_VERSIONS: Array<{
  id: GiveAttributeComponentVersion;
  label: string;
  detail: string;
}> = [
  { id: "1.21.2", label: "1.21.2–1.21.4", detail: "Namespaced modifier IDs and shortened attribute IDs." },
  { id: "1.21", label: "1.21–1.21.1", detail: "Namespaced modifier IDs with prefixed attribute IDs." },
  { id: "1.20.5", label: "1.20.5–1.20.6", detail: "UUID and name based item-component modifiers." },
];

export const TEXT_COLORS = [
  "black", "dark_blue", "dark_green", "dark_aqua", "dark_red", "dark_purple",
  "gold", "gray", "dark_gray", "blue", "green", "aqua", "red", "light_purple",
  "yellow", "white",
] as const;

export const ATTRIBUTE_OPERATIONS: Array<{ id: GiveAttributeOperation; name: string }> = [
  { id: "add_value", name: "Add value" },
  { id: "add_multiplied_base", name: "Multiply base" },
  { id: "add_multiplied_total", name: "Multiply total" },
];

export const EQUIPMENT_SLOTS: Array<{ id: GiveEquipmentSlot; name: string }> = [
  { id: "any", name: "Any slot" },
  { id: "mainhand", name: "Main hand" },
  { id: "offhand", name: "Off hand" },
  { id: "head", name: "Head" },
  { id: "chest", name: "Chest" },
  { id: "legs", name: "Legs" },
  { id: "feet", name: "Feet" },
];

export const ATTRIBUTES: AttributeOption[] = [
  { id: "max_health", legacyId: "generic.max_health", name: "Max Health" },
  { id: "follow_range", legacyId: "generic.follow_range", name: "Follow Range" },
  { id: "knockback_resistance", legacyId: "generic.knockback_resistance", name: "Knockback Resistance" },
  { id: "movement_speed", legacyId: "generic.movement_speed", name: "Movement Speed" },
  { id: "flying_speed", legacyId: "generic.flying_speed", name: "Flying Speed" },
  { id: "attack_damage", legacyId: "generic.attack_damage", name: "Attack Damage" },
  { id: "attack_knockback", legacyId: "generic.attack_knockback", name: "Attack Knockback" },
  { id: "attack_speed", legacyId: "generic.attack_speed", name: "Attack Speed" },
  { id: "armor", legacyId: "generic.armor", name: "Armor" },
  { id: "armor_toughness", legacyId: "generic.armor_toughness", name: "Armor Toughness" },
  { id: "luck", legacyId: "generic.luck", name: "Luck" },
  { id: "jump_strength", legacyId: "horse.jump_strength", name: "Jump Strength" },
  { id: "spawn_reinforcements", legacyId: "zombie.spawn_reinforcements", name: "Spawn Reinforcements" },
];

export const ENCHANTMENTS: EnchantmentOption[] = [
  { id: "aqua_affinity", name: "Aqua Affinity", maxLevel: 1, compatibleWith: ["helmet"] },
  { id: "bane_of_arthropods", name: "Bane of Arthropods", maxLevel: 5, compatibleWith: ["sword", "axe"] },
  { id: "binding_curse", name: "Curse of Binding", maxLevel: 1, compatibleWith: ["armor"] },
  { id: "blast_protection", name: "Blast Protection", maxLevel: 4, compatibleWith: ["armor"] },
  { id: "breach", name: "Breach", maxLevel: 4, compatibleWith: ["mace"] },
  { id: "channeling", name: "Channeling", maxLevel: 1, compatibleWith: ["trident"] },
  { id: "density", name: "Density", maxLevel: 5, compatibleWith: ["mace"] },
  { id: "depth_strider", name: "Depth Strider", maxLevel: 3, compatibleWith: ["boots"] },
  { id: "efficiency", name: "Efficiency", maxLevel: 5, compatibleWith: ["mining_tool"] },
  { id: "feather_falling", name: "Feather Falling", maxLevel: 4, compatibleWith: ["boots"] },
  { id: "fire_aspect", name: "Fire Aspect", maxLevel: 2, compatibleWith: ["sword"] },
  { id: "fire_protection", name: "Fire Protection", maxLevel: 4, compatibleWith: ["armor"] },
  { id: "flame", name: "Flame", maxLevel: 1, compatibleWith: ["bow"] },
  { id: "fortune", name: "Fortune", maxLevel: 3, compatibleWith: ["mining_tool"] },
  { id: "frost_walker", name: "Frost Walker", maxLevel: 2, compatibleWith: ["boots"] },
  { id: "impaling", name: "Impaling", maxLevel: 5, compatibleWith: ["trident"] },
  { id: "infinity", name: "Infinity", maxLevel: 1, compatibleWith: ["bow"] },
  { id: "knockback", name: "Knockback", maxLevel: 2, compatibleWith: ["sword"] },
  { id: "looting", name: "Looting", maxLevel: 3, compatibleWith: ["sword"] },
  { id: "loyalty", name: "Loyalty", maxLevel: 3, compatibleWith: ["trident"] },
  { id: "luck_of_the_sea", name: "Luck of the Sea", maxLevel: 3, compatibleWith: ["fishing_rod"] },
  { id: "lure", name: "Lure", maxLevel: 3, compatibleWith: ["fishing_rod"] },
  { id: "mending", name: "Mending", maxLevel: 1, compatibleWith: ["damageable"] },
  { id: "multishot", name: "Multishot", maxLevel: 1, compatibleWith: ["crossbow"] },
  { id: "piercing", name: "Piercing", maxLevel: 4, compatibleWith: ["crossbow"] },
  { id: "power", name: "Power", maxLevel: 5, compatibleWith: ["bow"] },
  { id: "projectile_protection", name: "Projectile Protection", maxLevel: 4, compatibleWith: ["armor"] },
  { id: "protection", name: "Protection", maxLevel: 4, compatibleWith: ["armor"] },
  { id: "punch", name: "Punch", maxLevel: 2, compatibleWith: ["bow"] },
  { id: "quick_charge", name: "Quick Charge", maxLevel: 3, compatibleWith: ["crossbow"] },
  { id: "respiration", name: "Respiration", maxLevel: 3, compatibleWith: ["helmet"] },
  { id: "riptide", name: "Riptide", maxLevel: 3, compatibleWith: ["trident"] },
  { id: "sharpness", name: "Sharpness", maxLevel: 5, compatibleWith: ["sword", "axe"] },
  { id: "silk_touch", name: "Silk Touch", maxLevel: 1, compatibleWith: ["mining_tool"] },
  { id: "smite", name: "Smite", maxLevel: 5, compatibleWith: ["sword", "axe"] },
  { id: "soul_speed", name: "Soul Speed", maxLevel: 3, compatibleWith: ["boots"] },
  { id: "sweeping_edge", name: "Sweeping Edge", maxLevel: 3, compatibleWith: ["sword"] },
  { id: "swift_sneak", name: "Swift Sneak", maxLevel: 3, compatibleWith: ["leggings"] },
  { id: "thorns", name: "Thorns", maxLevel: 3, compatibleWith: ["armor"] },
  { id: "unbreaking", name: "Unbreaking", maxLevel: 3, compatibleWith: ["damageable"] },
  { id: "vanishing_curse", name: "Curse of Vanishing", maxLevel: 1, compatibleWith: ["damageable"] },
  { id: "wind_burst", name: "Wind Burst", maxLevel: 3, compatibleWith: ["mace"] },
];

const SELECTORS = new Set(["@p", "@a", "@s"]);
const PLAYER_NAME_PATTERN = /^[A-Za-z0-9_]{3,16}$/;
const OPERATIONS = new Set(ATTRIBUTE_OPERATIONS.map(({ id }) => id));
const SLOTS = new Set(EQUIPMENT_SLOTS.map(({ id }) => id));

function itemGroups(itemId: string): Set<EnchantmentItemGroup> {
  const groups = new Set<EnchantmentItemGroup>();
  const suffix = (value: string) => itemId.endsWith(`_${value}`);
  const armor = ["helmet", "chestplate", "leggings", "boots"].some(suffix) || itemId === "turtle_helmet";
  const sword = suffix("sword");
  const axe = suffix("axe");
  const miningTool = ["pickaxe", "axe", "shovel", "hoe"].some(suffix) || itemId === "shears";
  const damageable = armor || sword || axe || miningTool || [
    "bow", "crossbow", "trident", "shield", "elytra", "fishing_rod", "flint_and_steel",
    "brush", "carrot_on_a_stick", "warped_fungus_on_a_stick", "mace",
  ].includes(itemId);

  if (armor || itemId === "elytra") groups.add("armor");
  if (suffix("helmet") || itemId === "turtle_helmet") groups.add("helmet");
  if (suffix("chestplate") || itemId === "elytra") groups.add("chestplate");
  if (suffix("leggings")) groups.add("leggings");
  if (suffix("boots")) groups.add("boots");
  if (sword) groups.add("sword");
  if (axe) groups.add("axe");
  if (miningTool) groups.add("mining_tool");
  if (["bow", "crossbow", "trident", "fishing_rod", "mace"].includes(itemId)) groups.add(itemId as EnchantmentItemGroup);
  if (damageable) groups.add("damageable");
  if (itemId === "enchanted_book") groups.add("enchanted_book");
  return groups;
}

export function getCompatibleEnchantments(itemId: string, version: GiveCommandVersion = "java-latest", subVersion: GiveAttributeComponentVersion = "1.21.2") {
  const groups = itemGroups(itemId);
  const supportsMaceEnchantments = version === "java-latest" || (version === "java-components" && subVersion !== "1.20.5");
  return ENCHANTMENTS.filter((enchantment) =>
    (supportsMaceEnchantments || !["breach", "density", "wind_burst"].includes(enchantment.id)) &&
    (groups.has("enchanted_book") || enchantment.compatibleWith.some((group) => groups.has(group))),
  );
}

export function isEnchantmentCompatible(itemId: string, enchantmentId: string, version: GiveCommandVersion = "java-latest", subVersion: GiveAttributeComponentVersion = "1.21.2") {
  return getCompatibleEnchantments(itemId, version, subVersion).some(({ id }) => id === enchantmentId);
}

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

function textObject(text: string, style: GiveTextStyle = {}) {
  return {
    text,
    ...(style.color ? { color: style.color } : {}),
    ...(style.bold ? { bold: true } : {}),
    italic: Boolean(style.italic),
    ...(style.underlined ? { underlined: true } : {}),
    ...(style.strikethrough ? { strikethrough: true } : {}),
  };
}

function jsonTextString(text: string, style?: GiveTextStyle) {
  return quoteSnbtString(JSON.stringify(textObject(text, style)));
}

function inlineTextComponent(text: string, style?: GiveTextStyle) {
  const component = textObject(text, style);
  return `{text:${quoteSnbtString(component.text)}${component.color ? `,color:${quoteSnbtString(component.color)}` : ""}${component.bold ? ",bold:true" : ""},italic:${component.italic}${component.underlined ? ",underlined:true" : ""}${component.strikethrough ? ",strikethrough:true" : ""}}`;
}

function validate(input: GiveCommandInput) {
  const errors: string[] = [];
  const item = getJavaItem(input.itemId);

  if (!SELECTORS.has(input.target) && !PLAYER_NAME_PATTERN.test(input.target)) errors.push("Choose @p, @a, @s, or enter a 3–16 character Java player name.");
  if (!item) errors.push("Choose an item from the Java item catalogue.");
  if (!Number.isInteger(input.amount) || input.amount < 1) errors.push("Amount must be a whole number of at least 1.");
  else if (item && input.amount > item.maxStack) errors.push(`${item.name} stacks to ${item.maxStack}; lower the amount.`);
  if (lengthOf(input.customName) > 128) errors.push("Custom name must be 128 characters or fewer.");

  const lore = input.lore.filter((line) => line.length > 0);
  if (lore.length > 16) errors.push("Use no more than 16 lore lines.");
  if (lore.some((line) => lengthOf(line) > 256)) errors.push("Each lore line must be 256 characters or fewer.");

  const seen = new Set<string>();
  input.enchantments.forEach((enchantment) => {
    const option = ENCHANTMENTS.find((candidate) => candidate.id === enchantment.id);
    if (!option) {
      errors.push("Choose a supported enchantment.");
      return;
    }
    if (seen.has(enchantment.id)) errors.push(`${option.name} can only be added once.`);
    seen.add(enchantment.id);
    if (!Number.isInteger(enchantment.level) || enchantment.level < 1 || enchantment.level > option.maxLevel) errors.push(`${option.name} level must be between 1 and ${option.maxLevel}.`);
    if (item && !isEnchantmentCompatible(item.id, enchantment.id, input.version, input.attributeComponentVersion)) errors.push(`${option.name} is not compatible with ${item.name} in the selected version.`);
  });

  const attributes = input.attributes ?? [];
  if (attributes.length > 16) errors.push("Use no more than 16 attribute modifiers.");
  attributes.forEach((modifier) => {
    if (!ATTRIBUTES.some(({ id }) => id === modifier.attribute)) errors.push("Choose a supported attribute.");
    if (!Number.isFinite(modifier.amount) || Math.abs(modifier.amount) > 1_000_000) errors.push("Attribute amounts must be finite numbers between -1,000,000 and 1,000,000.");
    if (!OPERATIONS.has(modifier.operation)) errors.push("Choose a supported attribute operation.");
    if (!SLOTS.has(modifier.slot)) errors.push("Choose a supported equipment slot.");
  });
  return errors;
}

function enchantmentComponent(input: GiveCommandInput, latest: boolean) {
  if (!input.enchantments.length) return null;
  const levels = input.enchantments.map((enchantment) => `${quoteSnbtString(`minecraft:${enchantment.id}`)}:${enchantment.level}`).join(",");
  const component = input.itemId === "enchanted_book" ? "stored_enchantments" : "enchantments";
  return `minecraft:${component}=${latest ? `{${levels}}` : `{levels:{${levels}}}`}`;
}

function formatDouble(value: number) {
  return Number.isInteger(value) ? `${value}.0` : String(value);
}

function modifierId(index: number) {
  return `minecraft:mcg_modifier_${index + 1}`;
}

function attributeType(modifier: GiveAttributeModifier, modernIds: boolean) {
  const option = ATTRIBUTES.find(({ id }) => id === modifier.attribute) ?? ATTRIBUTES[0];
  const prefixedId = option.id === "jump_strength" ? "generic.jump_strength" : option.legacyId;
  return `minecraft:${modernIds ? option.id : prefixedId}`;
}

function modernAttributeEntry(modifier: GiveAttributeModifier, index: number, modernIds: boolean) {
  return `{type:${quoteSnbtString(attributeType(modifier, modernIds))},id:${quoteSnbtString(modifierId(index))},amount:${formatDouble(modifier.amount)},operation:${quoteSnbtString(modifier.operation)}${modifier.slot === "any" ? "" : `,slot:${quoteSnbtString(modifier.slot)}`}}`;
}

function earlyComponentAttributeEntry(modifier: GiveAttributeModifier, index: number) {
  return `{type:${quoteSnbtString(attributeType(modifier, false))},uuid:[I;12648430,${index + 1},0,${1000 + index}],name:${quoteSnbtString(`mcg_modifier_${index + 1}`)},amount:${formatDouble(modifier.amount)},operation:${quoteSnbtString(modifier.operation)}${modifier.slot === "any" ? "" : `,slot:${quoteSnbtString(modifier.slot)}`}}`;
}

function attributeComponent(input: GiveCommandInput, latest: boolean) {
  const attributes = input.attributes ?? [];
  if (!attributes.length) return null;
  if (latest) return `minecraft:attribute_modifiers=[${attributes.map((modifier, index) => modernAttributeEntry(modifier, index, true)).join(",")}]`;
  const attributeVersion = input.attributeComponentVersion ?? "1.21.2";
  const entries = attributeVersion === "1.20.5"
    ? attributes.map(earlyComponentAttributeEntry)
    : attributes.map((modifier, index) => modernAttributeEntry(modifier, index, attributeVersion === "1.21.2"));
  return `minecraft:attribute_modifiers={modifiers:[${entries.join(",")}]}`;
}

function latestComponents(input: GiveCommandInput) {
  const components: string[] = [];
  if (input.customName) components.push(`minecraft:custom_name=${inlineTextComponent(input.customName, input.customNameStyle)}`);
  const lore = input.lore.map((line, index) => ({ line, style: input.loreStyles?.[index] })).filter(({ line }) => line.length > 0);
  if (lore.length) components.push(`minecraft:lore=[${lore.map(({ line, style }) => inlineTextComponent(line, style)).join(",")}]`);
  const enchantments = enchantmentComponent(input, true);
  if (enchantments) components.push(enchantments);
  const attributes = attributeComponent(input, true);
  if (attributes) components.push(attributes);
  if (input.unbreakable) components.push("minecraft:unbreakable={}");
  return components.length ? `[${components.join(",")}]` : "";
}

function firstGenerationComponents(input: GiveCommandInput) {
  const components: string[] = [];
  if (input.customName) components.push(`minecraft:custom_name=${jsonTextString(input.customName, input.customNameStyle)}`);
  const lore = input.lore.map((line, index) => ({ line, style: input.loreStyles?.[index] })).filter(({ line }) => line.length > 0);
  if (lore.length) components.push(`minecraft:lore=[${lore.map(({ line, style }) => jsonTextString(line, style)).join(",")}]`);
  const enchantments = enchantmentComponent(input, false);
  if (enchantments) components.push(enchantments);
  const attributes = attributeComponent(input, false);
  if (attributes) components.push(attributes);
  if (input.unbreakable) components.push("minecraft:unbreakable={}");
  return components.length ? `[${components.join(",")}]` : "";
}

function legacyNbt(input: GiveCommandInput) {
  const tags: string[] = [];
  const display: string[] = [];
  if (input.customName) display.push(`Name:${jsonTextString(input.customName, input.customNameStyle)}`);
  const lore = input.lore.map((line, index) => ({ line, style: input.loreStyles?.[index] })).filter(({ line }) => line.length > 0);
  if (lore.length) display.push(`Lore:[${lore.map(({ line, style }) => jsonTextString(line, style)).join(",")}]`);
  if (display.length) tags.push(`display:{${display.join(",")}}`);
  if (input.enchantments.length) {
    const enchantments = input.enchantments.map((enchantment) => `{id:${quoteSnbtString(`minecraft:${enchantment.id === "sweeping_edge" ? "sweeping" : enchantment.id}`)},lvl:${enchantment.level}s}`).join(",");
    tags.push(`${input.itemId === "enchanted_book" ? "StoredEnchantments" : "Enchantments"}:[${enchantments}]`);
  }
  const attributes = input.attributes ?? [];
  if (attributes.length) {
    const entries = attributes.map((modifier, index) => {
      const option = ATTRIBUTES.find(({ id }) => id === modifier.attribute) ?? ATTRIBUTES[0];
      const operation = ATTRIBUTE_OPERATIONS.findIndex(({ id }) => id === modifier.operation);
      return `{AttributeName:${quoteSnbtString(`minecraft:${option.legacyId}`)},Name:${quoteSnbtString(`mcg_modifier_${index + 1}`)},Amount:${formatDouble(modifier.amount)}d,Operation:${operation},UUID:[I;12648430,${index + 1},0,${1000 + index}]${modifier.slot === "any" ? "" : `,Slot:${quoteSnbtString(modifier.slot)}`}}`;
    });
    tags.push(`AttributeModifiers:[${entries.join(",")}]`);
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
  return { command: `/give ${input.target} minecraft:${input.itemId}${itemData} ${input.amount}`, errors: [] };
}

export function giveCommandFunctionFile(command: string) {
  return `${command.replace(/^\//, "")}\n`;
}
