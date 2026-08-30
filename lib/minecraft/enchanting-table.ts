export type EnchantingTranslationDirection = "english-to-glyphs" | "glyphs-to-english";

// Copyable Unicode approximations of the Standard Galactic Alphabet glyphs.
// Some letters use a short grapheme sequence because SGA has no dedicated
// Unicode block. Longest-token matching keeps reverse translation deterministic.
export const ENCHANTING_TABLE_ALPHABET = [
  ["a", "ᔑ"], ["b", "ʖ"], ["c", "ᓵ"], ["d", "↸"], ["e", "ᒷ"], ["f", "⎓"],
  ["g", "⊣"], ["h", "⍑"], ["i", "╎"], ["j", "⋮"], ["k", "ꖌ"], ["l", "ꖎ"],
  ["m", "ᒲ"], ["n", "リ"], ["o", "𝙹"], ["p", "!¡"], ["q", "ᑑ"], ["r", "∷"],
  ["s", "ᓭ"], ["t", "ℸ̣"], ["u", "⚍"], ["v", "⍊"], ["w", "∴"], ["x", "/̇"],
  ["y", "||"], ["z", "⨅"],
] as const;

const ENGLISH_TO_GLYPH = new Map<string, string>(ENCHANTING_TABLE_ALPHABET);
const GLYPH_TO_ENGLISH = [...ENCHANTING_TABLE_ALPHABET]
  .map(([letter, glyph]) => ({ letter, glyph }))
  .sort((left, right) => right.glyph.length - left.glyph.length);

export function englishToEnchantingTable(value: string) {
  return [...value].map((character) =>
    ENGLISH_TO_GLYPH.get(character.toLowerCase()) ?? character,
  ).join("");
}

export function enchantingTableToEnglish(value: string) {
  let output = "";
  let offset = 0;
  while (offset < value.length) {
    const match = GLYPH_TO_ENGLISH.find(({ glyph }) => value.startsWith(glyph, offset));
    if (match) {
      output += match.letter;
      offset += match.glyph.length;
    } else {
      const codePoint = value.codePointAt(offset);
      if (codePoint === undefined) break;
      const character = String.fromCodePoint(codePoint);
      output += character;
      offset += character.length;
    }
  }
  return output;
}

export function translateEnchantingTable(value: string, direction: EnchantingTranslationDirection) {
  return direction === "english-to-glyphs"
    ? englishToEnchantingTable(value)
    : enchantingTableToEnglish(value);
}
