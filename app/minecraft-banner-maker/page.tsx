import type { Metadata } from "next";
import Link from "next/link";
import { BannerMaker } from "@/components/banner-maker/banner-maker";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import { ToolStructuredData } from "@/components/layout/tool-structured-data";

const title = "Minecraft Banner Maker – Design Custom Minecraft Banners";
const description = "Create or randomize layered Minecraft banners, save designs locally, follow clear loom steps, and copy Java /give or /setblock commands.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-banner-maker" },
  openGraph: { title, description, url: "/minecraft-banner-maker", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function MinecraftBannerMakerPage() {
  return (
    <main id="main-content">
      <ToolStructuredData name="Minecraft Banner Maker" description={description} path="/minecraft-banner-maker" />
      <section className="hero banner-hero"><div className="page-container">
        <h1>Minecraft Banner Maker</h1>
        <p className="hero-subtitle">Choose a color and click a pattern to add one layer, or randomize a design, then save, download, or reproduce it in a loom.</p>
      </div></section>
      <section className="tool-section" aria-label="Minecraft banner maker tool"><div className="page-container"><BannerMaker /></div></section>
      <article className="seo-content"><div className="content-container">
        <section><h2>What is a Minecraft Banner Maker?</h2><p>A Minecraft Banner Maker is a visual editor for combining a base banner color with layered loom patterns before you build the design in game. This tool previews the finished banner as you work and keeps the matching layer order, loom recipe, share link, PNG, and Java commands together.</p></section>
        <section id="how-to-use"><h2>How to use the Minecraft Banner Maker</h2><ol className="banner-how-to-list"><li><strong>Choose the base color</strong><span>Select the starting color of the banner.</span></li><li><strong>Pick a layer color</strong><span>This dye color will be used by the next pattern you add.</span></li><li><strong>Click a pattern</strong><span>Add up to six layers, then reorder or recolor them to change the finished design.</span></li><li><strong>Use the finished banner</strong><span>Follow the loom recipe, copy a Java command, save the design, share it, or download its PNG.</span></li></ol></section>
        <section><h2>Create a banner you can reproduce in game</h2><p>Choose one of the 16 standard dye colors for the base, then add up to six common loom patterns. Layers are applied from Layer 1 upward, so moving a layer higher places it later in the recipe and visually in front of earlier patterns.</p></section>
        <section><h2>Clear instructions, loom recipes, and Java commands</h2><p>The three-step guide explains how to use the editor. Once you add a pattern, a compact loom recipe lists the actual base banner, pattern, and dye sequence. <code>/give</code> creates a banner item with Java Edition&apos;s <code>minecraft:banner_patterns</code> component and supports Java 1.20.5+. <code>/setblock</code> places the current design at your position with banner block-entity pattern data and also supports Java 1.20.5+. Bedrock uses different command behavior.</p></section>
        <section><h2>Use your banner in a larger command workflow</h2><p>Need custom names, lore, or enchantments on other items? Open the <Link href="/minecraft-give-command-generator">Minecraft Give Command Generator</Link>. You can also use the <Link href="/minecraft-color-codes">Minecraft Color Codes</Link> reference for matching server text, or turn an image into a block plan with the <Link href="/minecraft-pixel-art-generator">Minecraft Pixel Art Generator</Link>.</p></section>
        <ToolPageEnd toolKey="banner" />
      </div></article>
    </main>
  );
}
