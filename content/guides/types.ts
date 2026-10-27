import type { ToolKey } from "@/lib/site/tools";

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  ordered?: string[];
  tips?: { title: string; text: string }[];
};

export type Guide = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  datePublished: string;
  toolKeys: ToolKey[];
  contentLinks: { label: string; href: string }[];
  illustration?: { src: string; alt: string; landscape?: boolean };
  sections: GuideSection[];
};

export function guideReadingMinutes(guide: Guide): number {
  const words = [
    guide.description,
    ...guide.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.ordered ?? []),
      ...(section.tips ?? []).map((tip) => `${tip.title} ${tip.text}`),
    ]),
  ].join(" ").split(/\s+/).length;
  return Math.max(3, Math.round(words / 200));
}
