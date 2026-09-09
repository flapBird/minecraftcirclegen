import { DEFAULT_SOCIAL_IMAGES } from "@/lib/site/social-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { EnchantingTableTranslator } from "@/components/enchanting-table-translator/enchanting-table-translator";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import { ToolStructuredData } from "@/components/layout/tool-structured-data";

const title = "Minecraft Enchanting Table Translator";
const description = "Auto-detect and translate English or Minecraft enchanting table glyphs, then copy, share, or download the result with a complete A–Z chart.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-enchanting-table-translator" },
  openGraph: { images: DEFAULT_SOCIAL_IMAGES, title, description, url: "/minecraft-enchanting-table-translator", type: "website" },
  twitter: { images: DEFAULT_SOCIAL_IMAGES, card: "summary_large_image", title, description },
};

export default async function MinecraftEnchantingTableTranslatorPage({ searchParams }: {
  searchParams: Promise<{ text?: string | string[]; direction?: string | string[] }>;
}) {
  const query = await searchParams;
  const initialInput = typeof query.text === "string" ? query.text : undefined;
  const direction = typeof query.direction === "string" ? query.direction : "auto";
  const initialDirection = direction === "english-to-glyphs" || direction === "glyphs-to-english" ? direction : "auto";
  return <main id="main-content">
    <ToolStructuredData name="Minecraft Enchanting Table Translator" description={description} path="/minecraft-enchanting-table-translator" />
    <section className="hero enchanting-tool-hero"><div className="page-container">
      <h1>Minecraft Enchanting Table Translator</h1>
      <p className="hero-subtitle">Convert English to copyable enchanting table glyphs, translate them back, and learn the complete A–Z alphabet.</p>
    </div></section>
    <section className="tool-section" aria-label="Minecraft enchanting table translator tool"><div className="page-container"><EnchantingTableTranslator initialInput={initialInput} initialDirection={initialDirection} /></div></section>
    <article className="seo-content"><div className="content-container">
      <section><h2>What is the Minecraft Enchanting Table Translator?</h2><p>The Minecraft Enchanting Table Translator converts ordinary English letters into copyable approximations of enchanting table symbols and translates those symbols back into English. It also includes the complete A–Z alphabet so you can compare individual letters without entering a full message.</p></section>
      <section id="how-to-use"><h2>How to use the Enchanting Table Translator</h2><ol className="guide-steps"><li><strong>Choose a direction.</strong><span>Leave Auto Detect selected, or explicitly choose English to Glyphs or Glyphs to English.</span></li><li><strong>Enter or paste text.</strong><span>The translated result and character counts update immediately while punctuation and unsupported characters stay unchanged.</span></li><li><strong>Check the capacity hints.</strong><span>Use the sign and book indicators when preparing text for a Minecraft build or written book.</span></li><li><strong>Copy, share, or download.</strong><span>Copy the result, create a shareable URL, or save the translated text as a PNG.</span></li></ol></section>
      <section><h2>What language is used on Minecraft enchanting tables?</h2><p>The symbols are based on the Standard Galactic Alphabet, a substitution alphabet that gives each Latin letter from A to Z a matching glyph. This translator uses copyable Unicode approximations because the alphabet does not have its own dedicated Unicode block.</p></section>
      <section><h2>What is the Standard Galactic Alphabet?</h2><p>The Standard Galactic Alphabet predates Minecraft and became widely recognized by players after its glyphs appeared around the enchanting interface. It is a letter-for-letter cipher rather than a separate spoken language, so spacing and punctuation can remain unchanged while letters are substituted.</p></section>
      <section><h2>Does translating the text reveal the enchantment?</h2><p>No. The decorative words shown in the enchanting table interface do not encode the actual enchantments that will be applied. Translating the glyphs can reveal readable words or fragments, but those words are not a reliable prediction of the result.</p></section>
      <section><h2>How to read Minecraft enchanting table text</h2><p>Compare each symbol with the A–Z table, or paste copyable glyphs into the reverse tab. For other Minecraft lettering and server text, try the <Link href="/minecraft-font-generator">Minecraft Font Generator</Link>, <Link href="/minecraft-text-generator">Minecraft Text Generator</Link>, or <Link href="/minecraft-color-codes">Minecraft Color Codes</Link>.</p></section>
      <ToolPageEnd toolKey="enchanting-translator" />
    </div></article>
  </main>;
}
