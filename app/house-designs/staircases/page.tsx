import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContentBreadcrumbs, type BreadcrumbItem } from "@/components/layout/content-breadcrumbs";
import { HouseDesignDirectory, HouseFaqList, RelatedTools } from "@/components/house/house-support";
import { StructuredData, breadcrumbSchema, collectionSchema, faqSchema, schemaGraph } from "@/components/house/structured-data";
import { STAIRCASE_DESIGNS, STAIRCASE_FAQS } from "@/content/houses/staircases";
import { createHouseMetadata } from "@/lib/site/house-seo";

const title = "Minecraft House Staircase Designs: 8 Buildable Layouts";
const description = "Compare 8 Minecraft house staircase designs with footprints, dimensions, materials, use cases, and compact top-down layout previews.";
const path = "/house-designs/staircases";
export const metadata: Metadata = createHouseMetadata({ title, description, path, image: "/house-designs/compact-two-story-minecraft-house.webp", imageAlt: "Original voxel illustration of a two-story Minecraft house that uses an interior staircase" });

const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", href: "/" }, { name: "House Designs", href: "/house-designs" }, { name: "Staircase Designs" }];

export default function StaircaseDesignsPage() {
  return (
    <main id="main-content" className="house-content-page">
      <StructuredData data={schemaGraph([collectionSchema({ name: title, description, path }), breadcrumbSchema(breadcrumbs), faqSchema(STAIRCASE_FAQS)])} />
      <section className="house-hero">
        <div className="page-container">
          <ContentBreadcrumbs items={breadcrumbs} />
          <p className="section-label">STAIRS THAT FIT THE FLOOR PLAN</p>
          <h1>Minecraft House Staircase Designs</h1>
          <p>Compare straight, turning, spiral, compact, grand, hidden, and basement stairs before cutting a hole in the upper floor. Each layout includes its minimum footprint, best use, and a simple top-down route.</p>
        </div>
      </section>
      <div className="page-container house-page-body">
        <section className="house-section">
          <div className="house-section-heading"><div><p className="section-label">8 PRACTICAL OPTIONS</p><h2>Choose a staircase by footprint</h2></div><p>Numbers in each preview show the direction of travel from the lower step upward. C marks a center column and # marks a retaining wall.</p></div>
          <div className="staircase-grid">
            {STAIRCASE_DESIGNS.map((staircase) => (
              <article key={staircase.name} className="staircase-card">
                <div className="staircase-preview" style={{ "--stair-columns": staircase.dimensions.width } as CSSProperties} role="img" aria-label={`${staircase.name} top-down ${staircase.footprint} footprint`}>
                  {staircase.pattern.flatMap((row, z) => row.split("").map((cell, x) => <span key={`${x}-${z}`} className={cell === "." ? "is-empty" : cell === "#" ? "is-wall" : cell === "C" ? "is-column" : "is-step"}>{![".", "#", "C"].includes(cell) ? cell : ""}</span>))}
                </div>
                <div className="staircase-card-copy">
                  <span className="staircase-footprint">{staircase.footprint} footprint</span>
                  <h3>{staircase.name}</h3>
                  <dl><div><dt>Materials</dt><dd>{staircase.materials}</dd></div><div><dt>Best use</dt><dd>{staircase.bestFor}</dd></div></dl>
                  <p>{staircase.buildNote}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="house-section house-reading-section staircase-planning">
          <p className="section-label">PLANNING CLEARANCE</p>
          <h2>Place the staircase before furnishing</h2>
          <p>A stair affects both floors. Mark the lower run, the landing, and the complete ceiling opening before adding walls or storage above it. Two blocks of headroom should remain over the walking surface at every step.</p>
          <p>Straight stairs are easiest to count but consume a long wall. L-shaped and U-shaped stairs fit central plans better because their landings change direction. Spiral stairs save horizontal space inside a tower, but they need careful head-clearance testing at every turn.</p>
          <aside><strong>Building a spiral staircase or round tower?</strong><span>Use the <Link href="/">Minecraft Circle Generator</Link> to set a symmetrical tower wall before rotating the steps around its center.</span></aside>
        </section>
        <section className="house-section house-reading-section">
          <p className="section-label">MATERIAL CHOICES</p>
          <h2>Make the stair readable and safe</h2>
          <div className="house-tip-grid">
            <article><h3>Contrast the treads</h3><p>A stair that differs slightly from the floor is easier to read in low light and helps define the route.</p></article>
            <article><h3>Light the landing</h3><p>Place lighting beside or above the turn instead of on the narrow walking surface.</p></article>
            <article><h3>Protect open edges</h3><p>Walls, fences, trapdoors, or slabs can act as rails without making a compact staircase bulky.</p></article>
            <article><h3>Test both directions</h3><p>Walk up and down before closing the ceiling; a route that works upward may catch on a beam when descending.</p></article>
          </div>
        </section>
        <RelatedTools toolKeys={["circle", "gradient"]} title="Tools for tower stairs and coordinated materials" />
        <HouseFaqList faqs={STAIRCASE_FAQS} />
        <HouseDesignDirectory currentPage="staircases" />
      </div>
    </main>
  );
}
