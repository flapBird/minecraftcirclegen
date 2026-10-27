import { DEFAULT_SOCIAL_IMAGES } from "@/lib/site/social-metadata";
import type { Metadata } from "next";
import { ImageArtGenerator } from "@/components/image-art/image-art-generator";
import { ToolPageEnd } from "@/components/layout/tool-page-end";

const title = "Minecraft Pixel Art Generator – Image to Blocks";
const description =
  "Convert an image into Minecraft pixel art with a block grid, numbered material list, coordinate lookup, and PNG or coordinate CSV downloads.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-pixel-art-generator" },
  openGraph: { images: DEFAULT_SOCIAL_IMAGES, title, description, url: "/minecraft-pixel-art-generator", type: "website" },
  twitter: { images: DEFAULT_SOCIAL_IMAGES, card: "summary_large_image", title, description },
};

export default function MinecraftPixelArtGeneratorPage() {
  return (
    <main id="main-content">
      <section className="hero">
        <div className="page-container">
          <h1>Minecraft Pixel Art Generator</h1>
          <p className="hero-subtitle">
            Convert any image into a block-by-block Minecraft mural and exact material list.
          </p>
        </div>
      </section>
      <section className="tool-section" aria-label="Minecraft pixel art generator tool">
        <div className="page-container"><ImageArtGenerator mode="pixel" /></div>
      </section>
      <article className="seo-content">
        <div className="content-container">
          <section>
            <h2>What is the Minecraft Pixel Art Generator?</h2>
            <p>
              The Minecraft Pixel Art Generator converts a photo, logo, sprite, or drawing into a
              practical block-by-block mural. Every output pixel is matched to a vanilla building
              block, producing a visual blueprint, exact dimensions, and a complete numbered material
              list for survival or creative builds. Transparent cells can be left empty.
            </p>
            <p>
              Images are decoded and converted in your browser. The source file is not uploaded or
              stored, and replacing or closing the page removes it from the tool.
            </p>
          </section>
          <section id="how-to-use">
            <h2>How to convert an image to Minecraft blocks</h2>
            <ol className="guide-steps">
              <li><strong>Choose an image.</strong><span>Bold shapes and clear contrast usually create the easiest builds.</span></li>
              <li><strong>Set the size.</strong><span>The longest side controls the finished mural dimensions in blocks.</span></li>
              <li><strong>Choose materials.</strong><span>Use all blocks, common survival materials, colorful blocks, or natural blocks.</span></li>
              <li><strong>Adjust the conversion.</strong><span>Toggle color dithering, transparent pixels, and grid lines.</span></li>
              <li><strong>Build the result.</strong><span>Inspect each cell to identify its numbered material, then download the PNG or coordinate CSV and copy the material list.</span></li>
            </ol>
            <p>
              Click a block in the preview or enter its X/Z coordinates. The top-left cell is (0, 0),
              with X increasing to the right and Z down the blueprint. The CSV lists every cell,
              including empty spaces, so you can follow the plan row by row.
            </p>
          </section>
          <ToolPageEnd toolKey="pixel-art" />
        </div>
      </article>
    </main>
  );
}
