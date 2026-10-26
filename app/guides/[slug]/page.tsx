import { DEFAULT_SOCIAL_IMAGES } from "@/lib/site/social-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/guides/guide-article";
import { GUIDES, getGuide } from "@/content/guides/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

type GuidePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} – Minecraft Circle Gen Guides`,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      images: DEFAULT_SOCIAL_IMAGES,
      title: guide.title,
      description: guide.description,
      url: `/guides/${guide.slug}`,
      type: "article",
    },
    twitter: { images: DEFAULT_SOCIAL_IMAGES, card: "summary_large_image", title: guide.title, description: guide.description },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://minecraftcirclegen.com/" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://minecraftcirclegen.com/guides" },
      { "@type": "ListItem", position: 3, name: guide.title, item: `https://minecraftcirclegen.com/guides/${guide.slug}` },
    ],
  };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.datePublished,
    author: { "@type": "Organization", name: "Minecraft Circle Gen" },
    publisher: { "@type": "Organization", name: "Minecraft Circle Gen" },
    mainEntityOfPage: `https://minecraftcirclegen.com/guides/${guide.slug}`,
  };

  return (
    <main id="main-content" className="guide-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className="page-container guide-back-nav">
        <nav className="page-breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/guides">Guides</Link></li>
            <li aria-current="page">{guide.title}</li>
          </ol>
        </nav>
      </div>
      <GuideArticle guide={guide} />
    </main>
  );
}
