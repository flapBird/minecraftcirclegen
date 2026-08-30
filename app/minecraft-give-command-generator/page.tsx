import type { Metadata } from "next";
import Link from "next/link";
import { GiveCommandGenerator } from "@/components/give-command-generator/give-command-generator";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import { ToolStructuredData } from "@/components/layout/tool-structured-data";

const title = "Minecraft Give Command Generator – Create Item Commands";
const description = "Create valid Java Edition /give commands with searchable items, styled names and lore, item-compatible enchantments, attributes, and version-aware syntax.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-give-command-generator" },
  openGraph: { title, description, url: "/minecraft-give-command-generator", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function MinecraftGiveCommandGeneratorPage() {
  return <main id="main-content">
    <ToolStructuredData name="Minecraft Give Command Generator" description={description} path="/minecraft-give-command-generator" />
    <section className="hero command-tool-hero"><div className="page-container">
      <h1>Minecraft Give Command Generator</h1>
      <p className="hero-subtitle">Configure a Java Edition item and copy a version-aware <code>/give</code> command that is ready to run.</p>
    </div></section>
    <section className="tool-section" aria-label="Minecraft give command generator tool"><div className="page-container"><GiveCommandGenerator /></div></section>
    <article className="seo-content"><div className="content-container">
      <section><h2>What is the Minecraft Give Command Generator?</h2><p>The Minecraft Give Command Generator is a visual tool for creating Java Edition <code>/give</code> commands without writing item-component or legacy NBT syntax by hand. It combines a player target, a searchable vanilla item, a legal stack amount, and optional names, lore, compatible enchantments, and attribute modifiers in one validated command.</p></section>
      <section id="how-to-use"><h2>How to use the Give Command Generator</h2><ol className="guide-steps"><li><strong>Choose a Java version.</strong><span>Select the command format used by the Minecraft version running your world or server.</span></li><li><strong>Select the target and item.</strong><span>Enter a player name or selector, search for an item, and set a valid stack amount.</span></li><li><strong>Add optional item data.</strong><span>Style the custom name and lore, then add compatible enchantments or attribute modifiers when needed.</span></li><li><strong>Check the command preview.</strong><span>Correct any highlighted validation message before using the generated command.</span></li><li><strong>Copy or download it.</strong><span>Paste the command into chat, a command block, or download it as a <code>.mcfunction</code> file.</span></li></ol></section>
      <section><h2>Build a valid Minecraft item command</h2><p>The preview updates immediately, but it is withheld when a field is invalid so an obvious bad command is never presented as ready. The item catalogue uses a Java 1.20.4 baseline, keeping every listed item available across all three supported command-format choices instead of showing newer IDs that fail in the legacy option.</p></section>
      <section id="versions"><h2>Java modern components and legacy NBT</h2><p>Java 1.20.5 replaced the old item <code>tag</code> format with item components. Java 1.21.5 then moved text components from JSON wrapped in an SNBT string to inline SNBT, and simplified enchantment component data. Choose the exact syntax family for your world: Java 1.21.5–26.2, Java 1.20.5–1.21.4, or Java 1.20.4 and earlier legacy NBT.</p><p>Attribute modifiers changed again inside the middle syntax family, so the generator asks for a narrower sub-version only when attributes are present. Bedrock Edition is intentionally not included because its item command capabilities and syntax do not match Java Edition.</p></section>
      <section><h2>Names, lore, and special characters are escaped safely</h2><p>Custom names and lore are encoded for the selected component or NBT format. Quotes, apostrophes, backslashes, line breaks, and Unicode are treated as text rather than pasted directly into command syntax. Enchantment levels and item stack limits are validated before copying.</p></section>
      <section><h2>Continue your command workflow</h2><p>Design a layered flag with the <Link href="/minecraft-banner-maker">Minecraft Banner Maker</Link>, or create structured chat and tellraw output in the <Link href="/minecraft-text-generator">Minecraft Text Generator</Link>.</p></section>
      <ToolPageEnd toolKey="give-command" />
    </div></article>
  </main>;
}
