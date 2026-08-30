import type { Metadata } from "next";
import Link from "next/link";
import { ToolsDirectoryBrowser } from "@/components/tools-directory/tools-directory-browser";
import { TOOL_PAGES } from "@/lib/site/tools";

const title = "Minecraft Tools – Free Generators & Player Utilities";
const description = "Browse free Minecraft generators for circles, shapes, pixel art, banners, server text, item commands, player names, UUIDs, and more.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-tools" },
  openGraph: { title, description, url: "/minecraft-tools", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function MinecraftToolsPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Minecraft Tools",
    url: "https://minecraftcirclegen.com/minecraft-tools",
    description,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: TOOL_PAGES.length,
      itemListElement: TOOL_PAGES.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.title,
        url: `https://minecraftcirclegen.com${tool.href}`,
      })),
    },
  };

  return (
    <main id="main-content" className="tools-index-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <section className="hero tools-index-hero">
        <div className="page-container">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <ol><li><Link href="/">Home</Link></li><li aria-current="page">Minecraft Tools</li></ol>
          </nav>
          <p className="section-label">ALL TOOLS</p>
          <h1>Minecraft Tools</h1>
          <p className="hero-subtitle">Find the right generator for building, artwork, server text, commands, or Java player data.</p>
        </div>
      </section>
      <section className="tools-index-section" aria-label="Minecraft tools directory">
        <div className="page-container">
          <ToolsDirectoryBrowser />
        </div>
      </section>
      <article className="seo-content tools-index-content">
        <div className="content-container">
          <section>
            <p className="section-label">ONE USEFUL COLLECTION</p>
            <h2>Free Minecraft generators in one place</h2>
            <p>Use the category filters to browse by task, or search by a tool name such as circle, pixel art, banner, give command, username, or UUID. Each tool opens as a focused workspace with its own controls and instructions.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
