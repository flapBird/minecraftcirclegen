import type { Metadata } from "next";
import { FontGenerator } from "@/components/font-generator/font-generator";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolPageEnd } from "@/components/layout/tool-page-end";

const title = "Minecraft Font Generator – Pixel Text & Block Letters";
const description =
  "Create Minecraft-style pixel text with colour codes, gradients, text effects, alignment, transparent PNG export, and buildable block blueprints.";

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
            Style multi-line pixel text, preview it instantly, and export a transparent PNG or buildable block blueprint.
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
            <h2>What is the Minecraft Font Generator?</h2>
            <p>
              The Minecraft Font Generator is a browser-based text-to-image and building-planner tool.
              It converts letters, numbers, spaces, and common punctuation into an original Builder
              5×7 pixel alphabet, then renders the result as both a live image and an exact block grid.
              Multi-line input is supported without a three-line limit, and the preview grows vertically
              with the text instead of cutting later lines off.
            </p>
            <p>
              Use the image for server banners, thumbnails, overlays, signs, and project graphics, or
              copy the block blueprint to build the same lettering on a Minecraft wall. Everything runs
              locally in the browser; the tool does not upload the text or generated image to a server.
            </p>
          </section>

          <section id="features">
            <p className="section-label">COMPLETE FEATURE SET</p>
            <h2>Colours, styles, effects, layout, and exports</h2>
            <ul className="tips-grid">
              <li><strong>Unlimited multi-line text</strong>The canvas and preview area expand automatically for every entered line.</li>
              <li><strong>Minecraft colour codes</strong>Choose any of the 16 presets or use codes from §0–§f and &amp;0–&amp;f inside the text.</li>
              <li><strong>Solid, gradient, or rainbow fill</strong>Use one colour, blend between two custom colours, or generate a full rainbow.</li>
              <li><strong>Text formatting</strong>Apply bold, italic, underline, strikethrough, and obfuscated styles globally or with inline codes.</li>
              <li><strong>Outline and drop shadow</strong>Add a custom outline, use Minecraft-style 25% shadow colouring, and adjust the shadow distance.</li>
              <li><strong>Full spacing controls</strong>Change image padding, pixel scale, letter spacing, and line spacing independently.</li>
              <li><strong>Multi-line alignment</strong>Align shorter lines to the left, centre, or right of the widest line.</li>
              <li><strong>PNG and blueprint output</strong>Copy a PNG, download a transparent or solid-background PNG, or copy the exact block grid.</li>
            </ul>
          </section>

          <section id="formatting-codes">
            <p className="section-label">COLOUR AND FORMATTING CODES</p>
            <h2>Style individual words inside the same message</h2>
            <p>
              Codes can start with either the section sign (§) or an ampersand (&amp;). Colour codes
              0–9 and a–f change the following characters to one of Minecraft&apos;s 16 standard colours.
              Formatting codes add <strong>&amp;l bold</strong>, <strong>&amp;o italic</strong>,
              <strong>&amp;n underline</strong>, <strong>&amp;m strikethrough</strong>, or
              <strong>&amp;k obfuscated</strong> text. Use <strong>&amp;r</strong> to reset the inline
              colour and formatting. The codes control the preview but do not appear as visible letters
              or increase the blueprint width.
            </p>
          </section>

          <section id="layout-and-effects">
            <p className="section-label">LAYOUT AND EFFECTS</p>
            <h2>Control the complete exported image</h2>
            <p>
              Pixel block size controls how many image pixels are used for each Minecraft block without
              changing the blueprint dimensions. Padding adds transparent or background space around the
              finished text. Letter and line spacing change the block grid itself, while alignment positions
              shorter lines within the widest line. Drop shadow, shadow distance, outline, and background
              settings are applied consistently to the live preview, copied PNG, and downloaded PNG.
            </p>
          </section>

          <section id="how-to-use">
            <p className="section-label">USING THE GENERATOR</p>
            <h2>How to make Minecraft pixel text</h2>
            <ol className="guide-steps">
              <li><strong>Type your text.</strong><span>Use letters, numbers, punctuation, and as many lines as you need.</span></li>
              <li><strong>Choose colours and styles.</strong><span>Use presets, gradients, rainbow fill, effects, or inline § and &amp; codes.</span></li>
              <li><strong>Adjust the layout.</strong><span>Set padding, letter and line spacing, shadow distance, and text alignment.</span></li>
              <li><strong>Check the size.</strong><span>The blueprint statistics show the exact width, height, and block count.</span></li>
              <li><strong>Export the result.</strong><span>Download a PNG or copy the text-grid blueprint.</span></li>
            </ol>
          </section>

          <section id="export-options">
            <p className="section-label">EXPORT OPTIONS</p>
            <h2>Choose an image or a block-by-block plan</h2>
            <p>
              <strong>Copy PNG</strong> places the rendered image on the clipboard for pasting into a
              compatible graphics or messaging app. <strong>Download PNG</strong> saves the same result
              at the selected pixel scale, padding, colours, and background setting. With Transparent enabled,
              the checkerboard is only a preview marker and is not included in the PNG. <strong>Copy block
              blueprint</strong> produces a text grid where solid blocks, shadow blocks, outline blocks, and
              empty spaces can be distinguished while planning an in-game build.
            </p>
          </section>
          <ToolPageEnd toolKey="font" />
        </div>
      </article>
    </main>
  );
}
