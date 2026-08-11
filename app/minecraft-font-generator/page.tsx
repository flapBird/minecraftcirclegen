import type { Metadata } from "next";
import { FontGenerator } from "@/components/font-generator/font-generator";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolPageEnd } from "@/components/layout/tool-page-end";

const title = "Minecraft Font Generator – Pixel Text & Block Letters";
const description =
  "Create Minecraft-style pixel text, customize colors and block shadows, download a transparent PNG, or copy a buildable block blueprint.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-font-generator" },
  openGraph: { title, description, url: "/minecraft-font-generator", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function MinecraftFontGeneratorPage() {
  return (
    <main>
      <section className="hero">
        <div className="page-container">
          <PageBreadcrumb toolKey="font" />
          <h1>Minecraft Font Generator</h1>
          <p className="hero-subtitle">
            Turn words into crisp pixel text and buildable block-letter blueprints.
          </p>
        </div>
      </section>
      <section className="tool-section" aria-label="Minecraft font generator tool">
        <div className="page-container"><FontGenerator /></div>
      </section>
      <article className="seo-content">
        <div className="content-container">
          <section>
            <p className="section-label">ABOUT THE TOOL</p>
            <h2>Create block text for builds, signs, and graphics</h2>
            <p>
              Enter a name, title, or short message and the generator converts every character into
              a compact block grid. Use the blueprint to build wall lettering in Minecraft, or export
              a clean PNG for a server banner, thumbnail, or project plan.
            </p>
            <p>
              The Builder 5×7 alphabet is designed specifically for this tool, so the result stays
              readable without copying the game&apos;s original font texture.
            </p>
          </section>
          <section id="how-to-use">
            <p className="section-label">USING THE GENERATOR</p>
            <h2>How to make Minecraft pixel text</h2>
            <ol className="guide-steps">
              <li><strong>Type your text.</strong><span>Use letters, numbers, punctuation, and up to three lines.</span></li>
              <li><strong>Choose colors.</strong><span>Set the main blocks, optional shadow, and background.</span></li>
              <li><strong>Adjust spacing.</strong><span>Make letters compact or leave extra blocks between them.</span></li>
              <li><strong>Check the size.</strong><span>The blueprint statistics show the exact width, height, and block count.</span></li>
              <li><strong>Export the result.</strong><span>Download a PNG or copy the text-grid blueprint.</span></li>
            </ol>
          </section>
          <ToolPageEnd toolKey="font" />
        </div>
      </article>
    </main>
  );
}
