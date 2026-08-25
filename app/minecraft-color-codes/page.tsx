import type { Metadata } from "next";
import Link from "next/link";
import { ColorCodesTool } from "@/components/color-codes/color-codes-tool";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import { ToolStructuredData } from "@/components/layout/tool-structured-data";

const title = "Minecraft Color Codes – Picker, Palette & Code Reference";
const description = "Pick custom RGB palettes or copy all 16 legacy Minecraft colors, formatting codes, plugin aliases, MOTD escapes, MiniMessage colors, and exact HEX values.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-color-codes" },
  openGraph: { title, description, url: "/minecraft-color-codes", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function MinecraftColorCodesPage() {
  return (
    <main id="main-content">
      <ToolStructuredData name="Minecraft Color Codes" description={description} path="/minecraft-color-codes" />
      <section className="hero server-tool-hero">
        <div className="page-container">
          <PageBreadcrumb toolKey="color-codes" />
          <h1>Minecraft Color Codes</h1>
          <p className="hero-subtitle">Pick any modern RGB text color, export a usable palette, or copy the complete legacy §, plugin, MOTD, and HEX reference.</p>
        </div>
      </section>
      <section className="tool-section" aria-label="Minecraft color codes tool">
        <div className="page-container"><ColorCodesTool /></div>
      </section>
      <article className="seo-content">
        <div className="content-container">
          <section>
            <p className="section-label">HOW CODES WORK</p>
            <h2>What are Minecraft color codes?</h2>
            <p>
              Minecraft&apos;s 16 legacy colors use a formatting marker followed by one hexadecimal-style
              character. The section sign (<code>§</code>) is the native legacy marker. Many server
              plugins accept an ampersand (<code>&amp;</code>) as an easier-to-type alias and translate it before display.
            </p>
          </section>
          <section>
            <h2>Java and Bedrock compatibility</h2>
            <p>
              Color support varies by edition, version, command, and input field. Modern Java commands
              such as <code>/tellraw</code> use structured text components, while server plugins may support
              ampersand codes, MiniMessage, or RGB colors. Bedrock has related formatting codes but not
              every Java server format. A code working in chat does not guarantee it will work in a sign,
              book, item name, or configuration file.
            </p>
          </section>
          <section>
            <h2>Where color codes are commonly used</h2>
            <p>
              Common uses include server MOTDs, plugin messages, scoreboards, signs, books, and chat.
              If a code appears literally, the field probably expects another syntax, the plugin&apos;s
              color-code translation is disabled, or the section sign was stripped during copy and paste.
            </p>
            <p>
              Build full commands with the <Link href="/minecraft-text-generator">Minecraft Text Generator</Link>, or create per-character RGB output with the <Link href="/minecraft-gradient-generator">Minecraft Gradient Generator</Link>.
            </p>
          </section>
          <ToolPageEnd toolKey="color-codes" />
        </div>
      </article>
    </main>
  );
}
