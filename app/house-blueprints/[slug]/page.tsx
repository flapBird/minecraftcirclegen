import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentBreadcrumbs, type BreadcrumbItem } from "@/components/layout/content-breadcrumbs";
import { BlueprintLayerViewer } from "@/components/house/blueprint-layer-viewer";
import { DifficultyBadge, HouseGrid } from "@/components/house/house-card";
import { MaterialTable, RelatedTools } from "@/components/house/house-support";
import { StructuredData, breadcrumbSchema, schemaGraph } from "@/components/house/structured-data";
import { HOUSE_BLUEPRINTS, getHouseBlueprint, getHouseBlueprints } from "@/content/houses/blueprints";
import { absoluteUrl, createHouseMetadata } from "@/lib/site/house-seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return HOUSE_BLUEPRINTS.map((blueprint) => ({ slug: blueprint.slug }));
}

type BlueprintPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: BlueprintPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blueprint = getHouseBlueprint(slug);
  if (!blueprint) return {};
  return createHouseMetadata({
    title: `${blueprint.name} Blueprint: Layers & Material List`,
    description: `Build the ${blueprint.name} with a ${blueprint.width}×${blueprint.length} footprint, exact material counts, construction steps, and downloadable layer-by-layer grids.`,
    path: `/house-blueprints/${blueprint.slug}`,
    image: blueprint.image,
    imageAlt: blueprint.imageAlt,
  });
}

export default async function HouseBlueprintDetailPage({ params }: BlueprintPageProps) {
  const { slug } = await params;
  const blueprint = getHouseBlueprint(slug);
  if (!blueprint) notFound();
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "House Blueprints", href: "/house-blueprints" },
    { name: blueprint.name },
  ];
  const howToSchema = {
    "@type": "HowTo",
    name: `How to build the ${blueprint.name}`,
    description: blueprint.description,
    image: absoluteUrl(blueprint.image),
    supply: blueprint.materials.map((material) => ({ "@type": "HowToSupply", name: `${material.count} ${material.name}` })),
    step: blueprint.steps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: `Step ${index + 1}`, text: step })),
  };

  return (
    <main id="main-content" className="house-content-page blueprint-detail-page">
      <StructuredData data={schemaGraph([breadcrumbSchema(breadcrumbs), howToSchema])} />
      <section className="house-detail-hero">
        <div className="page-container">
          <ContentBreadcrumbs items={breadcrumbs} />
          <div className="house-detail-layout">
            <div className="house-detail-copy">
              <p className="section-label">LAYER-BY-LAYER HOUSE PLAN</p>
              <h1>{blueprint.name} Blueprint</h1>
              <p>{blueprint.description}</p>
              <p className="house-use-case">{blueprint.useCase}</p>
              <div className="house-detail-badges"><DifficultyBadge difficulty={blueprint.difficulty} /><span>{blueprint.floors} {blueprint.floors === 1 ? "floor" : "floors"}</span><span>Java + Bedrock</span></div>
            </div>
            <figure className="house-detail-image">
              <Image src={blueprint.image} alt={blueprint.imageAlt} width={1200} height={899} sizes="(max-width: 850px) 100vw, 52vw" priority />
              <figcaption>Original voxel illustration — a design reference, not an in-game screenshot.</figcaption>
            </figure>
          </div>
          <dl className="house-detail-stats">
            <div><dt>Footprint</dt><dd>{blueprint.width}×{blueprint.length}</dd></div>
            <div><dt>Blueprint height</dt><dd>{blueprint.height} layers</dd></div>
            <div><dt>Build time</dt><dd>{blueprint.estimatedBuildTime}</dd></div>
            <div><dt>Approx. blocks</dt><dd>{blueprint.blockCount.toLocaleString("en-US")}</dd></div>
            <div><dt>Style</dt><dd>{blueprint.style}</dd></div>
          </dl>
        </div>
      </section>
      <div className="page-container house-page-body">
        <section className="house-section blueprint-detail-intro">
          <p className="section-label">MATERIAL CHECKLIST</p>
          <h2>Blocks to collect</h2>
          <p>Counts cover the structural plan and listed details. Bring a small reserve for temporary scaffolding or substitutions.</p>
          <div className="blueprint-prep-grid">
            <MaterialTable blueprint={blueprint} />
            <aside className="house-layout-notes">
              <p className="section-label">BEFORE YOU START</p>
              <h3>Layout notes</h3>
              <ul className="house-check-list">
                <li>The bottom edge of every grid is the front-door side.</li>
                <li>Each colored square represents one block at the active height.</li>
                <li>Empty squares stay open; do not fill the inside of wall layers.</li>
                <li>Equal-count material swaps work in both Java and Bedrock.</li>
              </ul>
            </aside>
          </div>
        </section>
        <section className="house-section blueprint-layer-section">
          <div className="house-section-heading"><div><p className="section-label">INTERACTIVE BLUEPRINT</p><h2>Build the layers in order</h2></div><p>Finish one grid before moving upward. Use the buttons or keyboard focus controls, then download any active layer as SVG.</p></div>
          <BlueprintLayerViewer name={blueprint.name} slug={blueprint.slug} width={blueprint.width} length={blueprint.length} layers={blueprint.layers} palette={blueprint.palette} />
        </section>
        <section className="house-section house-reading-section">
          <p className="section-label">CONSTRUCTION ORDER</p>
          <h2>How to build the {blueprint.shortName}</h2>
          <ol className="house-numbered-steps">
            {blueprint.steps.map((step, index) => <li key={step}><strong>Step {index + 1}</strong><span>{step}</span></li>)}
          </ol>
        </section>
        <section className="house-section house-reading-section">
          <p className="section-label">BUILDING TIPS</p>
          <h2>Make the plan work in your world</h2>
          <div className="house-tip-grid">{blueprint.tips.map((tip, index) => <article key={tip}><h3>Tip {index + 1}</h3><p>{tip}</p></article>)}</div>
        </section>
        <RelatedTools toolKeys={blueprint.relatedTools} />
        <section className="house-section">
          <div className="house-section-heading"><div><p className="section-label">RELATED HOUSE DESIGNS</p><h2>Compare another blueprint</h2></div><p>These plans share a footprint, category, or useful next level of complexity.</p></div>
          <HouseGrid blueprints={getHouseBlueprints(blueprint.relatedSlugs)} />
          <p className="house-back-link"><Link href="/house-blueprints">← View all house blueprints</Link></p>
        </section>
      </div>
    </main>
  );
}
