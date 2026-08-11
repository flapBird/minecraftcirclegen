import type { Metadata } from "next";
import { ImageArtGenerator } from "@/components/image-art/image-art-generator";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolPageEnd } from "@/components/layout/tool-page-end";

const title = "Minecraft Map Art Generator – Image to Map Blueprint";
const description =
  "Convert an image into a flat Minecraft map-art blueprint from 128×128 to 256×256 blocks, with map colors, dithering, tiles, and materials.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-map-art-generator" },
  openGraph: { title, description, url: "/minecraft-map-art-generator", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function MinecraftMapArtGeneratorPage() {
  return (
    <main>
      <section className="hero">
        <div className="page-container">
          <PageBreadcrumb toolKey="map-art" />
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
            <p className="section-label">ABOUT THE TOOL</p>
            <h2>Plan flat Minecraft map art in 128×128 tiles</h2>
            <p>
              A standard Minecraft map represents a 128×128 block area. This generator resizes and
              matches an image to practical flat-map colors, then divides larger designs into clear
              map-sized sections so you can build them on the ground and capture each tile in game.
            </p>
            <p>
              The first version focuses on human-buildable flat blueprints and material planning.
              It does not modify a world save or generate schematic, Litematica, or map.dat files.
            </p>
          </section>
          <section id="how-to-use">
            <p className="section-label">USING THE GENERATOR</p>
            <h2>How to make Minecraft map art</h2>
            <ol className="guide-steps">
              <li><strong>Upload an image.</strong><span>Square artwork fits one map most naturally, but other ratios can be cropped or contained.</span></li>
              <li><strong>Choose a layout.</strong><span>Use one 128×128 map or expand the design across two or four maps.</span></li>
              <li><strong>Check the preview.</strong><span>Terracotta divider lines mark the edge of each individual map tile.</span></li>
              <li><strong>Prepare materials.</strong><span>Copy the exact block counts and stack estimates.</span></li>
              <li><strong>Build and capture.</strong><span>Place the blueprint flat, create each map in the correct area, and lock the finished maps.</span></li>
            </ol>
          </section>
          <ToolPageEnd toolKey="map-art" />
        </div>
      </article>
    </main>
  );
}
