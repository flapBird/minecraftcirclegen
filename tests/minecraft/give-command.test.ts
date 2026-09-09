import { describe, expect, it } from "vitest";
import { JAVA_ITEMS } from "@/data/minecraft/java-items";
import {
  ENCHANTMENTS,
  generateGiveCommand,
  getCompatibleEnchantments,
} from "@/lib/minecraft/give-command";

const baseInput = {
  version: "java-latest" as const,
  target: "@p",
  itemId: "diamond_sword",
  amount: 1,
  customName: "",
  lore: [] as string[],
  enchantments: [] as Array<{ id: string; level: number }>,
  unbreakable: false,
};

describe("Java give command generator", () => {
  it("ships a broad, unique, stack-aware item catalogue", () => {
    expect(JAVA_ITEMS.length).toBeGreaterThan(500);
    expect(new Set(JAVA_ITEMS.map((item) => item.id)).size).toBe(JAVA_ITEMS.length);
    expect(JAVA_ITEMS.find((item) => item.id === "diamond_sword")?.maxStack).toBe(1);
    expect(JAVA_ITEMS.find((item) => item.id === "stone")?.maxStack).toBe(64);
  });

  it("generates current component syntax", () => {
    const result = generateGiveCommand({
      ...baseInput,
      customName: "Skybreaker",
      lore: ["Forged for the End"],
      enchantments: [{ id: "sharpness", level: 5 }],
      unbreakable: true,
    });

    expect(result.errors).toEqual([]);
    expect(result.command).toBe(
      "/give @p minecraft:diamond_sword[minecraft:custom_name={text:'Skybreaker',italic:false},minecraft:lore=[{text:'Forged for the End',italic:false}],minecraft:enchantments={'minecraft:sharpness':5},minecraft:unbreakable={}] 1",
    );
  });

  it("escapes quotes, apostrophes, backslashes, control characters, and Unicode", () => {
    const text = "O'Brien says \\\"hi\\\"\\path\n雪";
    const current = generateGiveCommand({ ...baseInput, customName: text });
    const components = generateGiveCommand({ ...baseInput, version: "java-components", customName: text, lore: [text] });
    const legacy = generateGiveCommand({ ...baseInput, version: "java-legacy", customName: text, lore: [text] });

    expect(current.command).toContain("O\\'Brien");
    expect(current.command).toContain("hi");
    expect(current.command).toContain("\\\\path\\n雪");
    expect(current.command).not.toContain("\n");
    expect(components.command).toContain("minecraft:custom_name='");
    expect(components.command).toContain('{"text":');
    expect(legacy.command).toContain("display:{Name:");
    expect(legacy.command).toContain("Lore:[");
  });

  it("generates first-generation component and Java 1.20.4 legacy syntax", () => {
    const components = generateGiveCommand({
      ...baseInput,
      version: "java-components",
      enchantments: [{ id: "mending", level: 1 }],
    });
    const legacy = generateGiveCommand({
      ...baseInput,
      version: "java-legacy",
      enchantments: [{ id: "mending", level: 1 }],
      unbreakable: true,
    });

    expect(components.command).toContain("minecraft:enchantments={levels:{'minecraft:mending':1}}");
    expect(legacy.command).toContain("{Enchantments:[{id:'minecraft:mending',lvl:1s}],Unbreakable:1b}");
  });

  it("withholds invalid amounts and duplicate or out-of-range enchantments", () => {
    const amount = generateGiveCommand({ ...baseInput, amount: 2 });
    const enchantments = generateGiveCommand({
      ...baseInput,
      enchantments: [
        { id: "sharpness", level: 6 },
        { id: "sharpness", level: 5 },
      ],
    });

    expect(amount.command).toBeNull();
    expect(amount.errors).toContain("Diamond Sword stacks to 1; lower the amount.");
    expect(enchantments.command).toBeNull();
    expect(enchantments.errors).toContain("Sharpness level must be between 1 and 5.");
    expect(enchantments.errors).toContain("Sharpness can only be added once.");
  });

  it("ships the complete enchantment list and filters it by item", () => {
    expect(ENCHANTMENTS).toHaveLength(42);
    expect(getCompatibleEnchantments("diamond_sword").map(({ id }) => id)).toContain("sharpness");
    expect(getCompatibleEnchantments("diamond_sword").map(({ id }) => id)).not.toContain("power");
    expect(getCompatibleEnchantments("bow").map(({ id }) => id)).toContain("power");
    expect(getCompatibleEnchantments("elytra").map(({ id }) => id)).toContain("binding_curse");
    expect(getCompatibleEnchantments("stone")).toEqual([]);

    const invalid = generateGiveCommand({
      ...baseInput,
      enchantments: [{ id: "power", level: 5 }],
    });
    expect(invalid.command).toBeNull();
    expect(invalid.errors).toContain("Power is not compatible with Diamond Sword in the selected version.");
  });

  it("generates styled text and version-aware attribute modifiers", () => {
    const attributes = [{
      attribute: "attack_damage",
      amount: 3,
      operation: "add_value" as const,
      slot: "mainhand" as const,
    }];
    const latest = generateGiveCommand({
      ...baseInput,
      customName: "Blade",
      customNameStyle: { color: "aqua", bold: true, underlined: true },
      attributes,
    });
    const earlyComponents = generateGiveCommand({
      ...baseInput,
      version: "java-components",
      attributeComponentVersion: "1.20.5",
      attributes,
    });
    const midComponents = generateGiveCommand({
      ...baseInput,
      version: "java-components",
      attributeComponentVersion: "1.21",
      attributes,
    });
    const legacy = generateGiveCommand({ ...baseInput, version: "java-legacy", attributes });

    expect(latest.command).toContain("color:'aqua',bold:true,italic:false,underlined:true");
    expect(latest.command).toContain("minecraft:attribute_modifiers=[{type:'minecraft:attack_damage',id:'minecraft:mcg_modifier_1'");
    expect(earlyComponents.command).toContain("type:'minecraft:generic.attack_damage',uuid:[I;");
    expect(midComponents.command).toContain("type:'minecraft:generic.attack_damage',id:'minecraft:mcg_modifier_1'");
    expect(legacy.command).toContain("AttributeName:'minecraft:generic.attack_damage'");
    expect(legacy.command).toContain("Operation:0");
  });

  it("uses stored enchantments for enchanted books", () => {
    const book = generateGiveCommand({
      ...baseInput,
      itemId: "enchanted_book",
      enchantments: [{ id: "power", level: 5 }],
    });
    expect(book.errors).toEqual([]);
    expect(book.command).toContain("minecraft:stored_enchantments={'minecraft:power':5}");
  });

  it("filters enchantments introduced after the chosen release", () => {
    const book = { ...baseInput, itemId: "enchanted_book", enchantments: [{ id: "wind_burst", level: 1 }] };
    expect(generateGiveCommand({ ...book, version: "java-legacy" }).command).toBeNull();
    expect(generateGiveCommand({ ...book, version: "java-components", attributeComponentVersion: "1.20.5" }).command).toBeNull();
    expect(generateGiveCommand({ ...book, version: "java-components", attributeComponentVersion: "1.21" }).errors).toEqual([]);
    expect(getCompatibleEnchantments("enchanted_book", "java-legacy").map(({ id }) => id)).not.toContain("wind_burst");
  });

  it.each(["1.20.5", "1.21", "1.21.2"] as const)("uses the jump attribute ID for %s", (attributeComponentVersion) => {
    const result = generateGiveCommand({ ...baseInput, version: "java-components", attributeComponentVersion, attributes: [{ attribute: "jump_strength", amount: 1, operation: "add_value", slot: "mainhand" }] });
    expect(result.errors).toEqual([]);
    expect(result.command).toContain(`type:'minecraft:${attributeComponentVersion === "1.21.2" ? "" : "generic."}jump_strength'`);
  });
});
