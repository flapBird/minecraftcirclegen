import { DEFAULT_SOCIAL_IMAGES } from "@/lib/site/social-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES, guideReadingMinutes } from "@/content/guides/registry";

const title = "Minecraft Building Guides – Circles, Portals, and Round Builds";
const description =
  "Experience-based Minecraft guides for circle building, Nether portal networks, and round towers, written around the tools on this site and the mechanics behind them.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guides" },
  openGraph: { images: DEFAULT_SOCIAL_IMAGES, title, description, url: "/guides", type: "website" },
  twitter: { images: DEFAULT_SOCIAL_IMAGES, card: "summary_large_image", title, description },
};

export default function GuidesIndexPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://minecraftcirclegen.com/" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://minecraftcirclegen.com/guides" },
    ],
  };
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Minecraft Building Guides",
    url: "https://minecraftcirclegen.com/guides",
    description,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: GUIDES.length,
      itemListElement: GUIDES.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: guide.title,
        url: `https://minecraftcirclegen.com/guides/${guide.slug}`,
      })),
    },
  };

  return (
    <main id="main-content" className="guides-index-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <section className="hero">
        <div className="page-container">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">Guides</li>
            </ol>
          </nav>
          <h1>Minecraft Building Guides</h1>
          <p className="hero-subtitle">
            Practical, experience-based guides for the shapes and systems this site&apos;s
            tools plan: circle building, portal networks, and round structures.
          </p>
        </div>
      </section>
      <article className="seo-content">
        <div className="content-container">
          <section className="tool-introduction">
            <h2>Guides that start where the tools end</h2>
            <p>
              Generators give you exact block plans; these guides cover the decisions around
              them. Each one is written from the mechanics that actually cause builds to
              fail — search radii, run patterns, wall thickness — and every tool mentioned
              is one click away.
            </p>
          </section>
          <div className="tool-directory-grid guides-index-grid">
            {GUIDES.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <strong>{guide.title}</strong>
                <span>{guide.description}</span>
                <small className="guide-card-meta">
                  <time dateTime={guide.datePublished}>{guide.datePublished}</time>
                  <span aria-hidden="true"> · </span>
                  {guideReadingMinutes(guide)} min read
                </small>
                <i aria-hidden="true">→</i>
              </Link>
            ))}
          </div>
          <section>
            <h2>Pair a guide with its tools</h2>
            <p>
              Start with the <Link href="/">Minecraft circle generator</Link> for any
              round footprint, check exact block counts on the{" "}
              <Link href="/minecraft-circle-chart">circle chart</Link>, and plan travel
              with the <Link href="/nether-portal-calculator">Nether portal calculator</Link>.
              The full collection lives in <Link href="/minecraft-tools">all tools</Link>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
