import { describe, expect, it } from "vitest";
import { JAVA_ITEMS } from "@/data/minecraft/java-items";
import { generateGiveCommand } from "@/lib/minecraft/give-command";

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
});
