import type { Metadata } from "next";
import { FontGenerator } from "@/components/font-generator/font-generator";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolPageEnd } from "@/components/layout/tool-page-end";

const title = "Minecraft Font Generator – Pixel Text & PNG Export";
const description =
  "Turn text into crisp Minecraft-style pixel art with colour codes, gradients, outlines, drop shadows, transparent PNG export, and buildable block blueprints.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-font-generator" },
  openGraph: { title, description, url: "/minecraft-font-generator", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function MinecraftFontGeneratorPage() {
  return (
    <main id="main-content">
      <section className="hero font-hero">
        <div className="page-container">
          <PageBreadcrumb toolKey="font" />
          <h1>Minecraft Font Generator</h1>
          <p className="hero-subtitle">
            Turn any text into crisp Minecraft-style pixel lettering. Add colour codes, gradients,
            outlines and drop shadows, then download a transparent PNG or copy a block-by-block blueprint.
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
            <h2>Make Minecraft-style text images</h2>
            <p>
              Regular fonts are designed to stay smooth at many sizes, which makes it difficult to create
              clean block lettering one pixel at a time. This generator builds each character from an
              original 5×7 pixel grid, giving you crisp Minecraft-inspired text for thumbnails, server
              banners, signs, overlays, and in-game build ideas.
            </p>
            <p>
              Type your text, choose one of the 16 familiar Minecraft colours or a custom colour, then
              adjust the scale, fill, spacing, shadow, outline, and background while the preview updates.
              Download a clean PNG or copy the pixel grid as a building blueprint. The generator runs in
              your browser, so your text is not uploaded and the exported image has no watermark.
            </p>
          </section>

          <section id="features">
            <p className="section-label">PIXEL LETTERING</p>
            <h2>Built on a consistent pixel grid</h2>
            <p>
              Every supported letter, number, and punctuation mark is drawn as a small bitmap instead of
              being rasterised from a normal font. Characters use consistent grid measurements, while
              spaces are narrower and bold or italic styles expand the rendered width when needed. Letter
              spacing adds an exact number of grid cells between characters, so the layout remains
              predictable at every export scale.
            </p>
            <p>
              Line breaks create a single multi-line image, with independent controls for line spacing and
              left, centre, or right alignment. The default drop shadow starts one grid cell from the text
              and can use a darker version of each text colour; outline and background controls are applied
              to the same pixel grid, keeping the preview, PNG, and blueprint in sync.
            </p>
          </section>

          <section id="formatting-codes">
            <p className="section-label">COLOUR AND FORMATTING CODES</p>
            <h2>Use familiar Minecraft colour codes</h2>
            <p>
              Codes can start with either the section sign (§) or an ampersand (&amp;). Colour codes
              0–9 and a–f apply one of the 16 preset colours to the text that follows. Formatting codes add
              <strong> &amp;l bold</strong>, <strong>&amp;o italic</strong>, <strong>&amp;n underline</strong>,
              <strong>&amp;m strikethrough</strong>, or <strong>&amp;k obfuscated</strong> text, while
              <strong> &amp;r</strong> resets the colour and formatting. These codes affect the preview and
              export without appearing as visible characters or taking up space in the pixel grid.
            </p>
          </section>

          <section id="how-to-use">
            <p className="section-label">USING THE GENERATOR</p>
            <h2>How to make Minecraft pixel text</h2>
            <ol className="guide-steps">
              <li><strong>Type your text.</strong><span>Use supported letters, numbers, punctuation, and line breaks.</span></li>
              <li><strong>Choose colours and styles.</strong><span>Use presets, gradients, rainbow fill, effects, or inline § and &amp; codes.</span></li>
              <li><strong>Adjust the layout.</strong><span>Set the scale, padding, spacing, shadow distance, and alignment.</span></li>
              <li><strong>Export the result.</strong><span>Copy or download the PNG, or copy the block blueprint.</span></li>
            </ol>
          </section>

          <section id="export-options">
            <p className="section-label">EXPORT OPTIONS</p>
            <h2>Export an image or a building plan</h2>
            <p>
              <strong>Copy PNG</strong> places the rendered image on the clipboard for pasting into a
              compatible graphics or messaging app. <strong>Download PNG</strong> saves the same result
              using the selected scale, padding, colours, and background. When Transparent bg is enabled,
              the checkerboard only marks transparent areas in the preview and is not included in the file.
              <strong> Copy blueprint</strong> creates a character grid that distinguishes text, shadow,
              outline, and empty cells for planning a block-by-block build.
            </p>
          </section>
          <ToolPageEnd toolKey="font" />
        </div>
      </article>
    </main>
  );
}
