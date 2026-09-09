import { DEFAULT_SOCIAL_IMAGES } from "@/lib/site/social-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { ShapeGenerator } from "@/components/shape-generator/shape-generator";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import { ToolStructuredData } from "@/components/layout/tool-structured-data";

const title = "Minecraft Shape Generator – Build Circles, Spheres & More";
const description = "Generate block-by-block Minecraft blueprints for circles, polygons, stars, spheres, cylinders, cones, pyramids, and more with coordinates and PNG export.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-shape-generator" },
  openGraph: { images: DEFAULT_SOCIAL_IMAGES, title, description, url: "/minecraft-shape-generator", type: "website" },
  twitter: { images: DEFAULT_SOCIAL_IMAGES, card: "summary_large_image", title, description },
};

export default function MinecraftShapeGeneratorPage() {
  return (
    <main id="main-content">
      <ToolStructuredData name="Minecraft Shape Generator" description={description} path="/minecraft-shape-generator" />
      <section className="hero shape-hero"><div className="page-container">
        <h1>Minecraft Shape Generator</h1>
        <p className="hero-subtitle">Rotate a real block-volume preview, switch to exact 2D build layers, and export centered coordinates and blueprints.</p>
      </div></section>
      <section className="tool-section" aria-label="Minecraft shape generator tool"><div className="page-container"><ShapeGenerator /></div></section>
      <article className="seo-content"><div className="content-container">
        <section><h2>What is the Minecraft Shape Generator?</h2><p>The Minecraft Shape Generator creates exact block-grid blueprints for circles, ellipses, triangles, rectangles, regular polygons, stars, spheres, domes, cylinders, cones, and pyramids. Two-dimensional shapes produce a buildable footprint, while three-dimensional forms are divided into horizontal layers with centered coordinates.</p></section>
        <section id="how-to-use"><h2>How to use a Minecraft shape blueprint</h2><ol className="guide-steps"><li><strong>Choose a shape.</strong><span>Select a 2D plan or a 3D building form.</span></li><li><strong>Set dimensions.</strong><span>Enter the diameter, width, and height relevant to that shape.</span></li><li><strong>Choose filled or hollow.</strong><span>Where available, use Thickness to make a wider outline while Hollow is active.</span></li><li><strong>Build each grid.</strong><span>Every green cell is a block; center axes and relative coordinates keep the plan aligned.</span></li><li><strong>Move through 3D layers.</strong><span>Start at Y 0, then build the next blueprint one block higher.</span></li></ol></section>
        <section><h2>Dedicated tools remain available</h2><p>The universal tool is designed for comparing shapes and planning mixed builds. For focused URLs and controls, open the dedicated <Link href="/">Minecraft Circle Generator</Link>, <Link href="/oval-generator">Oval Generator</Link>, <Link href="/sphere-generator">Sphere Generator</Link>, or <Link href="/dome-generator">Dome Generator</Link>.</p></section>
        <ToolPageEnd toolKey="shape" />
      </div></article>
    </main>
  );
}
