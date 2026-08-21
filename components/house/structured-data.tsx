import type { BreadcrumbItem } from "@/components/layout/content-breadcrumbs";
import type { HouseFaq } from "@/content/houses/types";
import { absoluteUrl } from "@/lib/site/house-seo";

export function StructuredData({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function faqSchema(faqs: HouseFaq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function collectionSchema({ name, description, path }: { name: string; description: string; path: string }) {
  return { "@type": "CollectionPage", name, description, url: absoluteUrl(path) };
}

export function schemaGraph(nodes: unknown[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

