import type { Metadata } from "next";
import Link from "next/link";
import { TextGenerator } from "@/components/text-generator/text-generator";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import { ToolStructuredData } from "@/components/layout/tool-structured-data";

const title = "Minecraft Text Generator – Colors, MOTD & Tellraw";
const description = "Create copyable Minecraft colored text, plugin codes, MiniMessage, server MOTD text, and safely encoded Java tellraw commands.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-text-generator" },
  openGraph: { title, description, url: "/minecraft-text-generator", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function MinecraftTextGeneratorPage() {
  return (
    <main id="main-content">
      <ToolStructuredData name="Minecraft Text Generator" description={description} path="/minecraft-text-generator" />
      <section className="hero server-tool-hero">
        <div className="page-container">
          <PageBreadcrumb toolKey="text" />
          <h1>Minecraft Text Generator</h1>
          <p className="hero-subtitle">
            Format copyable Minecraft chat and server text, then export the syntax your command,
            plugin, or MOTD actually expects.
          </p>
        </div>
      </section>
      <section className="tool-section" aria-label="Minecraft text generator tool">
        <div className="page-container"><TextGenerator /></div>
      </section>
      <article className="seo-content">
        <div className="content-container">
          <section>
            <p className="section-label">COPYABLE GAME TEXT</p>
            <h2>Formatted text, not a font image</h2>
            <p>
              This generator prepares text for Minecraft chat, server configuration, plugins, and
              commands. Choose one color and any combination of bold, italic, underline,
              strikethrough, or obfuscated formatting, then copy the output format you need.
            </p>
            <p>
              Looking for a graphic or block-letter plan instead? The <Link href="/minecraft-font-generator">Minecraft Font Generator</Link> creates pixel-style image text; this page focuses on in-game text data.
            </p>
          </section>
          <section id="formats">
            <h2>Minecraft JSON text and server formats</h2>
            <p>
              Section-sign codes are Minecraft&apos;s legacy format. Ampersand codes are commonly
              translated by server plugins, while MiniMessage requires a compatible plugin. The MOTD
              output escapes section signs for <code>server.properties</code>. Tellraw uses a
              JSON-compatible structured text component and safely encodes quotes, line breaks, and other user input.
            </p>
            <p>This is also the site&apos;s Minecraft JSON text generator: choose Tellraw component to create structured Java command output without splitting the same workflow into a duplicate standalone page.</p>
          </section>
          <section id="compatibility">
            <h2>Java, Bedrock, and plugin compatibility</h2>
            <p>
              Formatting support depends on where the text is pasted. Modern Java commands generally
              use structured text components; many Java server plugins accept ampersand or MiniMessage syntax.
              Bedrock commands and UI fields do not share every Java format, so test output in the
              exact edition and server software you use.
            </p>
            <p>
              Use the <Link href="/minecraft-color-codes">Minecraft Color Codes reference</Link> to compare all colors, or make per-character RGB output with the <Link href="/minecraft-gradient-generator">Minecraft Gradient Generator</Link>.
            </p>
          </section>
          <ToolPageEnd toolKey="text" />
        </div>
      </article>
    </main>
  );
}
