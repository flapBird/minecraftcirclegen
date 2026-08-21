import type { Metadata } from "next";
import Link from "next/link";
import { ContentBreadcrumbs, type BreadcrumbItem } from "@/components/layout/content-breadcrumbs";
import { HouseGrid } from "@/components/house/house-card";
import { HouseFaqList, RelatedTools } from "@/components/house/house-support";
import { StructuredData, breadcrumbSchema, collectionSchema, faqSchema, schemaGraph } from "@/components/house/structured-data";
import { getHouseBlueprints } from "@/content/houses/blueprints";
import type { HouseFaq } from "@/content/houses/types";
import { createHouseMetadata } from "@/lib/site/house-seo";

const title = "Minecraft House Blueprints: Exact Plans & Material Lists";
const description = "Follow Minecraft house blueprints with exact footprints, block counts, materials, construction steps, and downloadable layer-by-layer layouts.";
const path = "/house-blueprints";
export const metadata: Metadata = createHouseMetadata({ title, description, path, image: "/house-designs/9x11-minecraft-cottage-house.webp", imageAlt: "Original voxel illustration representing a buildable Minecraft house blueprint" });

const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", href: "/" }, { name: "House Blueprints" }];
const faqs: HouseFaq[] = [
  { question: "How do Minecraft house blueprints work?", answer: "Start with Layer 1 at ground level, then build each numbered top-down layer at the next height. The legend maps each colored square to a material role, and every square represents one block." },
  { question: "What does each square represent?", answer: "Each square is one horizontal block position. Empty squares are left open. The width and length shown on the plan are the outside dimensions, so a 9×9 blueprint occupies nine blocks in both ground directions." },
  { question: "Can I use these blueprints in Bedrock Edition?", answer: "Yes. These layouts use normal block placement and work in both Java and Bedrock. They do not rely on commands, redstone timing, or version-specific behavior." },
  { question: "Are Minecraft blueprints the same as schematics?", answer: "No. A blueprint is a visual layer plan you follow while building. A .schem or .schematic file is an importable data file used by tools such as WorldEdit or Litematica. This library provides visual blueprints, not importable schematic files." },
];

const groups = [
  { id: "starter-blueprints", label: "STARTER BLUEPRINTS", title: "Starter house blueprints", copy: "Low-cost plans with simple footprints and early-game materials.", slugs: ["7x7-starter-house", "9x9-oak-house"] },
  { id: "small-blueprints", label: "SMALL HOUSE BLUEPRINTS", title: "Small and cottage blueprints", copy: "Compact layouts that create usable rooms without a large building plot.", slugs: ["9x9-small-house", "9x11-cottage-house", "compact-two-story-house"] },
  { id: "modern-blueprints", label: "MODERN HOUSE BLUEPRINTS", title: "Modern house blueprints", copy: "Concrete, glass, flat roofs, and clearer separation between structural frames and infill.", slugs: ["11x9-modern-house", "11x11-modern-house"] },
  { id: "survival-blueprints", label: "SURVIVAL HOUSE BLUEPRINTS", title: "Survival house blueprints", copy: "Efficient bases that prioritize storage, safety, and future expansion.", slugs: ["7x9-small-survival-house"] },
];

export default function HouseBlueprintsPage() {
  return (
    <main id="main-content" className="house-content-page">
      <StructuredData data={schemaGraph([collectionSchema({ name: title, description, path }), breadcrumbSchema(breadcrumbs), faqSchema(faqs)])} />
      <section className="house-hero">
        <div className="page-container">
          <ContentBreadcrumbs items={breadcrumbs} />
          <p className="section-label">EXACT BLOCK-BY-BLOCK PLANS</p>
          <h1>Minecraft House Blueprints</h1>
          <p>Know what you want to build? These plans show the exact outside dimensions, footprint, materials, block count, construction order, and every top-down layer. They are visual blueprints for both Java and Bedrock—not importable schematic files.</p>
          <div className="house-hero-actions"><a href="#blueprint-gallery" className="house-primary-button">Choose a blueprint</a><Link href="/house-designs" className="house-secondary-button">Need inspiration?</Link></div>
        </div>
      </section>
      <div id="blueprint-gallery" className="page-container house-page-body">
        {groups.map((group) => (
          <section className="house-section" id={group.id} key={group.id}>
            <div className="house-section-heading">
              <div><p className="section-label">{group.label}</p><h2>{group.title}</h2></div>
              <p>{group.copy}</p>
            </div>
            <HouseGrid blueprints={getHouseBlueprints(group.slugs)} />
          </section>
        ))}
        <section className="house-section house-reading-section">
          <p className="section-label">FROM PLAN TO BLOCKS</p>
          <h2>How Minecraft house blueprints work</h2>
          <p>A blueprint is a sequence of horizontal slices. Layer 1 establishes the foundation and floor. The next layers mark the corner frame, walls, doors, and windows. Two-story plans include an upper deck with a stair opening; the last layers close the roof.</p>
          <ol className="house-numbered-steps">
            <li><strong>Prepare the footprint.</strong><span>Clear a level area at least two blocks wider than the stated outside dimensions so you can move around the walls.</span></li>
            <li><strong>Match the legend.</strong><span>Each color and letter identifies a material role. Equal-count substitutions are fine when you prefer another wood or stone.</span></li>
            <li><strong>Build upward in order.</strong><span>Finish and verify each top-down grid before moving to the next layer.</span></li>
            <li><strong>Decorate after the shell.</strong><span>Furniture, planters, paths, chimneys, and lighting are easier to adjust once the exact structure is closed.</span></li>
          </ol>
        </section>
        <section className="house-section house-reading-section">
          <p className="section-label">READING THE GRID</p>
          <h2>How to read a house blueprint</h2>
          <p>Face the same direction for every layer: the front door appears along the bottom edge of the grid. The displayed width runs left to right, while length runs from the back wall at the top to the front wall at the bottom. Empty cells stay unoccupied.</p>
          <p>Use Previous and Next to compare adjoining layers. The active layer can be downloaded as a scalable SVG, which stays sharp on a phone, tablet, or printed reference sheet. Material totals include the illustrated shell and specified details; bring a small reserve for scaffolding and accidental placements.</p>
        </section>
        <RelatedTools toolKeys={["circle", "oval", "dome", "gradient"]} title="Tools for custom foundations, roofs, and palettes" />
        <HouseFaqList faqs={faqs} />
      </div>
    </main>
  );
}
