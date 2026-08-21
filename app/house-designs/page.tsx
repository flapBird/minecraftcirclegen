import type { Metadata } from "next";
import Link from "next/link";
import { ContentBreadcrumbs, type BreadcrumbItem } from "@/components/layout/content-breadcrumbs";
import { HouseGrid } from "@/components/house/house-card";
import { HouseFaqList, RelatedTools } from "@/components/house/house-support";
import { StructuredData, breadcrumbSchema, collectionSchema, faqSchema, schemaGraph } from "@/components/house/structured-data";
import { HOUSE_BLUEPRINTS } from "@/content/houses/blueprints";
import { HOUSE_DESIGNS_FAQS } from "@/content/houses/collections";
import { createHouseMetadata } from "@/lib/site/house-seo";

const title = "Minecraft House Designs: Ideas, Blueprints & Easy Builds";
const description = "Explore buildable Minecraft house designs and ideas with dimensions, material lists, block counts, build times, and layer-by-layer blueprints.";
const path = "/house-designs";

export const metadata: Metadata = createHouseMetadata({
  title,
  description,
  path,
  image: "/house-designs/9x9-oak-minecraft-starter-house.webp",
  imageAlt: "Original voxel illustration of a buildable oak Minecraft house design",
});

const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", href: "/" }, { name: "House Designs" }];

const categories = [
  { href: "/house-designs/starter", name: "Starter Houses", copy: "Quick early-game homes from 7×7 to compact two-story layouts.", marker: "7×7" },
  { href: "/house-designs/small", name: "Small Houses", copy: "Efficient footprints that keep storage and walking routes usable.", marker: "9×9" },
  { href: "/house-designs/modern", name: "Modern Houses", copy: "Concrete, glass, clean frames, and practical room divisions.", marker: "11×9" },
  { href: "/house-designs/survival", name: "Survival Houses", copy: "Safe bases planned around storage, smelting, and expansion.", marker: "7×9" },
  { href: "/house-designs/staircases", name: "Staircase Designs", copy: "Straight, L-shaped, spiral, hidden, and basement stair plans.", marker: "8 types" },
  { href: "/house-blueprints", name: "House Blueprints", copy: "Exact top-down layers, material counts, and downloadable SVG grids.", marker: "8 plans" },
];

export default function HouseDesignsPage() {
  return (
    <main id="main-content" className="house-content-page">
      <StructuredData data={schemaGraph([
        collectionSchema({ name: title, description, path }),
        breadcrumbSchema(breadcrumbs),
        faqSchema(HOUSE_DESIGNS_FAQS),
      ])} />
      <section className="house-hero house-hub-hero">
        <div className="page-container">
          <ContentBreadcrumbs items={breadcrumbs} />
          <div className="house-hero-layout">
            <div>
              <p className="section-label">BUILDABLE HOUSE INSPIRATION</p>
              <h1>Minecraft House Designs &amp; Ideas</h1>
              <p>Find a house you can actually build. Every featured design includes its footprint, difficulty, materials, approximate block count, and a blueprint you can follow in Java or Bedrock.</p>
              <div className="house-hero-actions">
                <a href="#featured-designs" className="house-primary-button">Browse designs</a>
                <Link href="/house-blueprints" className="house-secondary-button">Open blueprints</Link>
              </div>
            </div>
            <div className="house-hero-blueprint" aria-label="Decorative 9 by 9 house footprint preview">
              {Array.from({ length: 81 }, (_, index) => {
                const x = index % 9;
                const z = Math.floor(index / 9);
                const edge = x === 0 || z === 0 || x === 8 || z === 8;
                const door = z === 8 && x === 4;
                return <span key={index} className={door ? "is-door" : edge ? "is-wall" : "is-floor"} />;
              })}
              <p><strong>9×9 footprint</strong><span>Each square = 1 block</span></p>
            </div>
          </div>
        </div>
      </section>
      <div className="page-container house-page-body">
        <section className="house-section" aria-labelledby="house-categories-title">
          <div className="house-section-heading">
            <div><p className="section-label">CHOOSE A DIRECTION</p><h2 id="house-categories-title">House ideas by build type</h2></div>
            <p>Start from play style or footprint, then compare exact designs inside each collection.</p>
          </div>
          <div className="house-category-grid">
            {categories.map((category) => (
              <Link key={category.href} href={category.href}>
                <span>{category.marker}</span><h3>{category.name}</h3><p>{category.copy}</p><i aria-hidden="true">→</i>
              </Link>
            ))}
          </div>
        </section>
        <section id="featured-designs" className="house-section">
          <div className="house-section-heading">
            <div><p className="section-label">FEATURED HOUSE DESIGNS</p><h2>Compare complete, buildable houses</h2></div>
            <p>These are distinct plans—not recolored copies. Open a card for its full material table, construction order, and layer controls.</p>
          </div>
          <HouseGrid blueprints={HOUSE_BLUEPRINTS} />
        </section>
        <section className="house-blueprint-cta">
          <div>
            <p className="section-label">READY TO PLACE BLOCKS?</p>
            <h2>Move from inspiration to an exact blueprint</h2>
            <p>The blueprint library separates the footprint, doors and windows, upper floor, and roof into clear top-down layers. Download any active layer as an SVG for a second-screen reference.</p>
          </div>
          <Link href="/house-blueprints">Browse Minecraft house blueprints <span aria-hidden="true">→</span></Link>
        </section>
        <section className="house-section house-reading-section">
          <p className="section-label">DESIGN DECISIONS</p>
          <h2>How to choose a Minecraft house design</h2>
          <p>Choose from the inside out. List the blocks you need—bed, storage, furnaces, crafting, enchanting, brewing—then select a footprint that leaves a clear route between them. A 7×7 outside wall creates a 5×5 interior; a 9×9 wall creates a 7×7 interior, which is almost twice the usable floor area.</p>
          <p>Next, match the shell to the place. A narrow 7×9 house fits a slope or riverbank, a broad 11×9 facade supports modern windows, and a taller compact house suits crowded villages. Use local materials first, then refine the palette with trim, stairs, slabs, and lighting.</p>
          <div className="house-tip-grid">
            <article><h3>Depth beats decoration</h3><p>Offset posts, overhangs, window frames, and recessed doors by one block before adding small details.</p></article>
            <article><h3>Plan the roof early</h3><p>Roof stairs can outnumber wall blocks. Check the material list before committing to a steep profile.</p></article>
            <article><h3>Use three material roles</h3><p>Pick a wall block, a darker or lighter frame, and a roof material. Add accents only where they clarify the structure.</p></article>
            <article><h3>Leave a next step</h3><p>Reserve one side for a workshop, farm connection, tower, or storage wing instead of enclosing every edge.</p></article>
          </div>
        </section>
        <RelatedTools toolKeys={["circle", "oval", "dome", "gradient"]} title="Shape and palette tools for house builds" />
        <HouseFaqList faqs={HOUSE_DESIGNS_FAQS} />
      </div>
    </main>
  );
}
