import type { Metadata } from "next";
import { ImageArtGenerator } from "@/components/image-art/image-art-generator";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolPageEnd } from "@/components/layout/tool-page-end";

const title = "Minecraft Pixel Art Generator – Image to Blocks";
const description =
  "Upload an image and convert it into a buildable Minecraft block grid with palette controls, dithering, material counts, and PNG export.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-pixel-art-generator" },
  openGraph: { title, description, url: "/minecraft-pixel-art-generator", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function MinecraftPixelArtGeneratorPage() {
  return (
    <main>
      <section className="hero">
        <div className="page-container">
          <PageBreadcrumb toolKey="pixel-art" />
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
            <p className="section-label">ABOUT THE TOOL</p>
            <h2>Turn pictures into buildable Minecraft pixel art</h2>
            <p>
              Upload a photo, logo, sprite, or drawing and the converter reduces it to a practical
              block grid. Every output pixel is matched to a vanilla building block, producing both
              a visual blueprint and an exact shopping list for survival or creative builds.
            </p>
            <p>
              Images are decoded and converted in your browser. The source file is not uploaded or
              stored, and replacing or closing the page removes it from the tool.
            </p>
          </section>
          <section id="how-to-use">
            <p className="section-label">USING THE GENERATOR</p>
            <h2>How to convert an image to Minecraft blocks</h2>
            <ol className="guide-steps">
              <li><strong>Choose an image.</strong><span>Bold shapes and clear contrast usually create the easiest builds.</span></li>
              <li><strong>Set the size.</strong><span>The longest side controls the finished mural dimensions in blocks.</span></li>
              <li><strong>Choose materials.</strong><span>Use all blocks, common survival materials, colorful blocks, or natural blocks.</span></li>
              <li><strong>Adjust the conversion.</strong><span>Toggle color dithering, transparent pixels, and grid lines.</span></li>
              <li><strong>Build the result.</strong><span>Download the blueprint and copy the material list before gathering blocks.</span></li>
            </ol>
          </section>
          <ToolPageEnd toolKey="pixel-art" />
        </div>
      </article>
    </main>
  );
}
