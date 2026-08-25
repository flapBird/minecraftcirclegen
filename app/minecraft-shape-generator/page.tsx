import type { Metadata } from "next";
import Link from "next/link";
import { ShapeGenerator } from "@/components/shape-generator/shape-generator";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import { ToolStructuredData } from "@/components/layout/tool-structured-data";

const title = "Minecraft Shape Generator – Build Circles, Spheres & More";
const description = "Generate block-by-block Minecraft blueprints for circles, polygons, stars, spheres, cylinders, cones, pyramids, and more with coordinates and PNG export.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-shape-generator" },
  openGraph: { title, description, url: "/minecraft-shape-generator", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function MinecraftShapeGeneratorPage() {
  return (
    <main id="main-content">
      <ToolStructuredData name="Minecraft Shape Generator" description={description} path="/minecraft-shape-generator" />
      <section className="hero shape-hero"><div className="page-container">
        <PageBreadcrumb toolKey="shape" />
        <h1>Minecraft Shape Generator</h1>
        <p className="hero-subtitle">Rotate a real block-volume preview, switch to exact 2D build layers, and export centered coordinates and blueprints.</p>
      </div></section>
      <section className="tool-section" aria-label="Minecraft shape generator tool"><div className="page-container"><ShapeGenerator /></div></section>
      <article className="seo-content"><div className="content-container">
        <section><p className="section-label">UNIVERSAL BLUEPRINTS</p><h2>More than a collection of circle links</h2><p>This shape generator uses one consistent block-grid workflow for circles, ellipses, triangles, rectangles, regular polygons, stars, spheres, domes, cylinders, cones, and pyramids. Two-dimensional shapes create a footprint; three-dimensional shapes are split into practical horizontal layers.</p></section>
        <section id="how-to-use"><h2>How to use a Minecraft shape blueprint</h2><ol className="guide-steps"><li><strong>Choose a shape.</strong><span>Select a 2D plan or a 3D building form.</span></li><li><strong>Set dimensions.</strong><span>Enter the diameter, width, and height relevant to that shape.</span></li><li><strong>Choose filled or hollow.</strong><span>Where available, use Thickness to make a wider outline while Hollow is active.</span></li><li><strong>Build each grid.</strong><span>Every green cell is a block; center axes and relative coordinates keep the plan aligned.</span></li><li><strong>Move through 3D layers.</strong><span>Start at Y 0, then build the next blueprint one block higher.</span></li></ol></section>
        <section><h2>Dedicated tools remain available</h2><p>The universal tool is designed for comparing shapes and planning mixed builds. For focused URLs and controls, open the dedicated <Link href="/">Minecraft Circle Generator</Link>, <Link href="/oval-generator">Oval Generator</Link>, <Link href="/sphere-generator">Sphere Generator</Link>, or <Link href="/dome-generator">Dome Generator</Link>.</p></section>
        <ToolPageEnd toolKey="shape" />
      </div></article>
    </main>
  );
}
