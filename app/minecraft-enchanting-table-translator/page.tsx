import type { Metadata } from "next";
import Link from "next/link";
import { EnchantingTableTranslator } from "@/components/enchanting-table-translator/enchanting-table-translator";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import { ToolStructuredData } from "@/components/layout/tool-structured-data";

const title = "Minecraft Enchanting Table Translator";
const description = "Translate English to Minecraft enchanting table glyphs and back with a copyable Standard Galactic Alphabet tool and complete A–Z chart.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-enchanting-table-translator" },
  openGraph: { title, description, url: "/minecraft-enchanting-table-translator", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function MinecraftEnchantingTableTranslatorPage() {
  return <main id="main-content">
    <ToolStructuredData name="Minecraft Enchanting Table Translator" description={description} path="/minecraft-enchanting-table-translator" />
    <section className="hero enchanting-tool-hero"><div className="page-container">
      <PageBreadcrumb toolKey="enchanting-translator" />
      <h1>Minecraft Enchanting Table Translator</h1>
      <p className="hero-subtitle">Convert English to copyable enchanting table glyphs, translate them back, and learn the complete A–Z alphabet.</p>
    </div></section>
    <section className="tool-section" aria-label="Minecraft enchanting table translator tool"><div className="page-container"><EnchantingTableTranslator /></div></section>
    <article className="seo-content"><div className="content-container">
      <section><p className="section-label">THE ENCHANTING TABLE LANGUAGE</p><h2>What language is used on Minecraft enchanting tables?</h2><p>The symbols are based on the Standard Galactic Alphabet, a substitution alphabet that gives each Latin letter from A to Z a matching glyph. This translator uses copyable Unicode approximations because the alphabet does not have its own dedicated Unicode block.</p></section>
      <section><h2>What is the Standard Galactic Alphabet?</h2><p>The Standard Galactic Alphabet predates Minecraft and became widely recognized by players after its glyphs appeared around the enchanting interface. It is a letter-for-letter cipher rather than a separate spoken language, so spacing and punctuation can remain unchanged while letters are substituted.</p></section>
      <section><h2>Does translating the text reveal the enchantment?</h2><p>No. The decorative words shown in the enchanting table interface do not encode the actual enchantments that will be applied. Translating the glyphs can reveal readable words or fragments, but those words are not a reliable prediction of the result.</p></section>
      <section><h2>How to read Minecraft enchanting table text</h2><p>Compare each symbol with the A–Z table, or paste copyable glyphs into the reverse tab. For other Minecraft lettering and server text, try the <Link href="/minecraft-font-generator">Minecraft Font Generator</Link>, <Link href="/minecraft-text-generator">Minecraft Text Generator</Link>, or <Link href="/minecraft-color-codes">Minecraft Color Codes</Link>.</p></section>
      <ToolPageEnd toolKey="enchanting-translator" />
    </div></article>
  </main>;
}
