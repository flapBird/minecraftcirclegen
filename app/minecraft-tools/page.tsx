import { DEFAULT_SOCIAL_IMAGES } from "@/lib/site/social-metadata";
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
  openGraph: { images: DEFAULT_SOCIAL_IMAGES, title, description, url: "/minecraft-tools", type: "website" },
  twitter: { images: DEFAULT_SOCIAL_IMAGES, card: "summary_large_image", title, description },
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
            <h2>What this tools page is for</h2>
            <p>
              Minecraft projects often start with a practical question: how wide
              should a circle be, what does the next sphere layer look like, or
              which blocks will match an image? This page keeps the site&apos;s
              generators in one directory so you can search by name or narrow
              the list to the job in front of you.
            </p>
            <p>
              Open any tool to get its working controls, preview, and instructions.
              Nothing needs to be installed, and the planning tools work directly
              in the browser.
            </p>
          </section>
          <section>
            <h2>Choose a category by the job</h2>
            <div className="tools-index-category-guide">
              <div>
                <h3>Build &amp; Shape</h3>
                <p>
                  Use these for circles, ovals, spheres, domes, and other 2D or 3D
                  forms when you need exact rows, layers, and block counts.
                </p>
              </div>
              <div>
                <h3>Art &amp; Design</h3>
                <p>
                  Start here for pixel art, map art, block lettering, and banners.
                  These tools turn an image or design idea into something you can
                  rebuild block by block.
                </p>
              </div>
              <div>
                <h3>Text &amp; Server</h3>
                <p>
                  Format chat, MOTDs, MiniMessage text, color codes, and gradients,
                  or translate Standard Galactic Alphabet text used by enchanting
                  tables.
                </p>
              </div>
              <div>
                <h3>Command &amp; Data</h3>
                <p>
                  Build Java Edition item commands with names, lore, quantities,
                  and enchantments without assembling the command by hand.
                </p>
              </div>
              <div>
                <h3>Player</h3>
                <p>
                  Check a current Java username or look up the UUID attached to a
                  player profile when you are working with server records or
                  commands.
                </p>
              </div>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
