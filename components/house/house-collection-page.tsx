import { ContentBreadcrumbs, type BreadcrumbItem } from "@/components/layout/content-breadcrumbs";
import { HouseGrid } from "./house-card";
import { HouseDesignDirectory, HouseFaqList, RelatedTools } from "./house-support";
import { StructuredData, breadcrumbSchema, collectionSchema, faqSchema, schemaGraph } from "./structured-data";
import { getHouseBlueprints } from "@/content/houses/blueprints";
import type { HouseCollection } from "@/content/houses/types";

export function HouseCollectionPage({ collection }: { collection: HouseCollection }) {
  const path = `/house-designs/${collection.slug}`;
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "House Designs", href: "/house-designs" },
    { name: collection.name },
  ];
  const blueprints = getHouseBlueprints(collection.designSlugs);

  return (
    <main id="main-content" className="house-content-page">
      <StructuredData data={schemaGraph([
        collectionSchema({ name: collection.title, description: collection.description, path }),
        breadcrumbSchema(breadcrumbs),
        faqSchema(collection.faqs),
      ])} />
      <section className="house-hero">
        <div className="page-container">
          <ContentBreadcrumbs items={breadcrumbs} />
          <p className="section-label">{collection.eyebrow}</p>
          <h1>{collection.title}</h1>
          <p>{collection.intro}</p>
        </div>
      </section>
      <div className="page-container house-page-body">
        <section className="house-section" aria-labelledby={`${collection.slug}-designs-heading`}>
          <div className="house-section-heading">
            <div><p className="section-label">BUILDABLE DESIGNS</p><h2 id={`${collection.slug}-designs-heading`}>{collection.name} with blueprints</h2></div>
            <p>Compare the footprint, block count, build time, and main materials before opening the exact layers.</p>
          </div>
          <HouseGrid blueprints={blueprints} />
        </section>
        <section className="house-section">
          <p className="section-label">SIZE GUIDE</p>
          <h2>Pick the right footprint</h2>
          <div className="house-table-wrap">
            <table>
              <thead><tr><th scope="col">Outside size</th><th scope="col">Best for</th><th scope="col">Planning note</th></tr></thead>
              <tbody>{collection.sizeGuide.map((row) => <tr key={row.size}><th scope="row">{row.size}</th><td>{row.bestFor}</td><td>{row.note}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
        <section className="house-section house-reading-section">
          <p className="section-label">DESIGN DECISIONS</p>
          <h2>{collection.selectionTitle}</h2>
          {collection.selectionParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="house-tip-grid">
            {collection.tips.map((tip) => <article key={tip.title}><h3>{tip.title}</h3><p>{tip.text}</p></article>)}
          </div>
        </section>
        <RelatedTools toolKeys={collection.relatedTools} />
        <HouseFaqList faqs={collection.faqs} />
        <HouseDesignDirectory currentPage={collection.slug} />
      </div>
    </main>
  );
}
