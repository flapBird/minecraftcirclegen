import type { Metadata } from "next";
import Link from "next/link";
import { BannerMaker } from "@/components/banner-maker/banner-maker";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
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
        <PageBreadcrumb toolKey="banner" />
        <h1>Minecraft Banner Maker</h1>
        <p className="hero-subtitle">Choose a color and click a pattern to add one layer, or randomize a design, then save, download, or reproduce it in a loom.</p>
      </div></section>
      <section className="tool-section" aria-label="Minecraft banner maker tool"><div className="page-container"><BannerMaker /></div></section>
      <article className="seo-content"><div className="content-container">
        <section><p className="section-label">DESIGN IN LAYERS</p><h2>Create a banner you can reproduce in game</h2><p>Choose one of the 16 standard dye colors for the base, then add up to six common loom patterns. Layers are applied from Layer 1 upward, so moving a layer higher places it later in the recipe and visually in front of earlier patterns.</p></section>
        <section><h2>Clear instructions, loom recipes, and Java commands</h2><p>The three-step guide explains how to use the editor. Once you add a pattern, a compact loom recipe lists the actual base banner, pattern, and dye sequence. Give creates a banner item with Java Edition&apos;s <code>minecraft:banner_patterns</code> component, while SetBlock places the current design at your position with banner block-entity pattern data. Both outputs target Java 1.20.5 and later; Bedrock uses different command behavior.</p></section>
        <section><h2>Use your colors across a larger design</h2><p>Use the <Link href="/minecraft-color-codes">Minecraft Color Codes</Link> reference for server text that matches your banner, or turn an image into a block plan with the <Link href="/minecraft-pixel-art-generator">Minecraft Pixel Art Generator</Link>.</p></section>
        <ToolPageEnd toolKey="banner" />
      </div></article>
    </main>
  );
}
