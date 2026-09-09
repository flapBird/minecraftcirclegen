import { DEFAULT_SOCIAL_IMAGES } from "@/lib/site/social-metadata";
import type { Metadata } from "next";
import { ImageArtGenerator } from "@/components/image-art/image-art-generator";
import { ToolPageEnd } from "@/components/layout/tool-page-end";

const title = "Minecraft Map Art Generator – Image to Map Blueprint";
const description =
  "Convert an image into a flat Minecraft map-art blueprint from 128×128 to 256×256 blocks, with map colors, dithering, tiles, and materials.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-map-art-generator" },
  openGraph: { images: DEFAULT_SOCIAL_IMAGES, title, description, url: "/minecraft-map-art-generator", type: "website" },
  twitter: { images: DEFAULT_SOCIAL_IMAGES, card: "summary_large_image", title, description },
};

export default function MinecraftMapArtGeneratorPage() {
  return (
    <main id="main-content">
      <section className="hero">
        <div className="page-container">
          <h1>Minecraft Map Art Generator</h1>
          <p className="hero-subtitle">
            Convert an image into a tiled, flat-map block blueprint using Minecraft map colors.
          </p>
        </div>
      </section>
      <section className="tool-section" aria-label="Minecraft map art generator tool">
        <div className="page-container"><ImageArtGenerator mode="map" /></div>
      </section>
      <article className="seo-content">
        <div className="content-container">
          <section>
            <h2>What is the Minecraft Map Art Generator?</h2>
            <p>
              The Minecraft Map Art Generator converts an image into a flat, buildable block blueprint
              designed for in-game maps. A scale-0 (unzoomed) map represents a 128×128 block area, so the tool
              matches the image to practical map colors and divides larger designs into clear map-sized
              sections for building and capture.
            </p>
            <p>
              The first version focuses on human-buildable flat blueprints and material planning.
              It does not modify a world save or generate schematic, Litematica, or map.dat files.
            </p>
          </section>
          <section id="how-to-use">
            <h2>How to make Minecraft map art</h2>
            <ol className="guide-steps">
              <li><strong>Upload an image.</strong><span>Square artwork fits one map most naturally, but other ratios can be cropped or contained.</span></li>
              <li><strong>Choose a layout.</strong><span>Use one 128×128 map or expand the design across two or four maps.</span></li>
              <li><strong>Check the preview.</strong><span>Terracotta-colored divider lines mark the edge of each individual map tile.</span></li>
              <li><strong>Prepare materials.</strong><span>Copy the exact block counts and stack estimates.</span></li>
              <li><strong>Build and capture.</strong><span>Use scale-0 maps to locate each 128×128 tile boundary before building. Match the top of the blueprint to north, keep the surface level, then capture and lock each map.</span></li>
            </ol>
          </section>
          <ToolPageEnd toolKey="map-art" />
        </div>
      </article>
    </main>
  );
}
