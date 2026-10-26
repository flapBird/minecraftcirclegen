import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GuidesIndexPage from "@/app/guides/page";
import GuidePage from "@/app/guides/[slug]/page";
import { GUIDES, getGuide, otherGuides } from "@/content/guides/registry";
import { guideReadingMinutes } from "@/content/guides/types";
import { TOOL_PAGES } from "@/lib/site/tools";

describe("guide content", () => {
  it("has unique slugs, valid dates, and real section bodies", () => {
    const slugs = GUIDES.map((guide) => guide.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const guide of GUIDES) {
      expect(guide.title.length).toBeGreaterThan(20);
      expect(guide.description.length).toBeGreaterThan(60);
      expect(guide.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(guide.sections.length).toBeGreaterThanOrEqual(5);
      for (const section of guide.sections) {
        expect(section.paragraphs.length).toBeGreaterThanOrEqual(1);
        for (const paragraph of section.paragraphs) {
          expect(paragraph.length).toBeGreaterThan(40);
        }
      }
    }
  });

  it("only references registered tools and known content pages", () => {
    for (const guide of GUIDES) {
      for (const key of guide.toolKeys) {
        expect(TOOL_PAGES.some((tool) => tool.key === key)).toBe(true);
      }
      for (const link of guide.contentLinks) {
        expect(link.href.startsWith("/")).toBe(true);
      }
    }
  });

  it("cross-links every other guide from each article", () => {
    for (const guide of GUIDES) {
      expect(otherGuides(guide.slug).map((next) => next.slug).sort())
        .toEqual(GUIDES.map((item) => item.slug).filter((slug) => slug !== guide.slug).sort());
    }
  });

  it("computes a bounded reading time", () => {
    for (const guide of GUIDES) {
      const minutes = guideReadingMinutes(guide);
      expect(minutes).toBeGreaterThanOrEqual(3);
      expect(minutes).toBeLessThanOrEqual(20);
    }
  });

  it("resolves slugs through getGuide and rejects unknown ones", () => {
    expect(getGuide("circle-building-mistakes")).toBeDefined();
    expect(getGuide("not-a-guide")).toBeUndefined();
  });
});

describe("guides index page", () => {
  it("lists every guide with its metadata", () => {
    render(<GuidesIndexPage />);
    expect(screen.getByRole("heading", { level: 1, name: /Minecraft Building Guides/ })).toBeInTheDocument();
    for (const guide of GUIDES) {
      expect(screen.getByRole("link", { name: new RegExp(guide.title) })).toHaveAttribute(
        "href",
        `/guides/${guide.slug}`,
      );
    }
  });
});

describe("guide article page", () => {
  it("renders the article with schema, tools row, and keep-reading links", async () => {
    const { container } = render(await GuidePage({ params: Promise.resolve({ slug: "nether-portal-network" }) }));
    expect(screen.getByRole("heading", { level: 1, name: /Nether Portal Network/ })).toBeInTheDocument();
    const scripts = [...container.querySelectorAll('script[type="application/ld+json"]')].map((node) => node.textContent ?? "");
    expect(scripts.some((json) => json.includes('"BreadcrumbList"'))).toBe(true);
    expect(scripts.some((json) => json.includes('"Article"'))).toBe(true);
    expect(screen.getByRole("complementary", { name: "Tools used in this guide" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Nether Portal Calculator/ })).toHaveAttribute("href", "/nether-portal-calculator");
    expect(screen.getByText("Keep reading")).toBeInTheDocument();
    expect(container.querySelector('a[href="/guides/circle-building-mistakes"]')).not.toBeNull();
  });

  it("renders a different guide independently", async () => {
    render(await GuidePage({ params: Promise.resolve({ slug: "circle-building-mistakes" }) }));
    expect(screen.getByRole("heading", { level: 2, name: /Eyeballing turns instead of counting runs/ })).toBeInTheDocument();
  });
});
