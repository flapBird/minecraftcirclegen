import { describe, expect, it } from "vitest";
import {
  ENCHANTING_TABLE_ALPHABET,
  enchantingTableToEnglish,
  englishToEnchantingTable,
  translateEnchantingTable,
} from "@/lib/minecraft/enchanting-table";

describe("enchanting table translator", () => {
  it("maps all lowercase and uppercase A–Z letters", () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = lowercase.toUpperCase();
    const glyphs = ENCHANTING_TABLE_ALPHABET.map(([, glyph]) => glyph).join("");

    expect(englishToEnchantingTable(lowercase)).toBe(glyphs);
    expect(englishToEnchantingTable(uppercase)).toBe(glyphs);
    expect(enchantingTableToEnglish(glyphs)).toBe(lowercase);
  });

  it("preserves spaces, punctuation, numbers, and unsupported characters", () => {
    const value = "Abc 123!? 雪";
    const translated = englishToEnchantingTable(value);
    expect(translated).toContain(" 123!? 雪");
    expect(enchantingTableToEnglish(translated)).toBe("abc 123!? 雪");
  });

  it("supports both translation directions", () => {
    const glyphs = translateEnchantingTable("Minecraft", "english-to-glyphs");
    expect(translateEnchantingTable(glyphs, "glyphs-to-english")).toBe("minecraft");
  });
});
