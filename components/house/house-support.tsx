import Link from "next/link";
import type { HouseBlueprint, HouseCollection, HouseFaq } from "@/content/houses/types";
import { TOOL_PAGES, type ToolKey } from "@/lib/site/tools";

type HouseDesignPageKey = HouseCollection["slug"] | "staircases";

const HOUSE_DESIGN_PAGES: Array<{
  key: HouseDesignPageKey;
  href: string;
  title: string;
  description: string;
}> = [
  {
    key: "starter",
    href: "/house-designs/starter",
    title: "Starter Houses",
    description: "Simple survival-ready homes with low material costs and clear blueprints.",
  },
  {
    key: "small",
    href: "/house-designs/small",
    title: "Small Houses",
    description: "Compact layouts that fit useful rooms into a modest footprint.",
  },
  {
    key: "modern",
    href: "/house-designs/modern",
    title: "Modern Houses",
    description: "Clean shapes, open plans, and contemporary block palettes.",
  },
  {
    key: "survival",
    href: "/house-designs/survival",
    title: "Survival Houses",
    description: "Practical bases planned around storage, crafting, farming, and defense.",
  },
  {
    key: "staircases",
    href: "/house-designs/staircases",
    title: "Staircase Designs",
    description: "Space-efficient stair layouts for lofts, towers, basements, and full second floors.",
  },
];

export function HouseDesignDirectory({ currentPage }: { currentPage: HouseDesignPageKey }) {
  const otherPages = HOUSE_DESIGN_PAGES.filter((page) => page.key !== currentPage);

  return (
    <section className="house-section house-design-directory" aria-labelledby={`${currentPage}-house-directory-title`}>
      <p className="section-label">KEEP BUILDING</p>
      <h2 id={`${currentPage}-house-directory-title`}>Explore more Minecraft house designs</h2>
      <div className="tool-directory-grid house-design-directory-grid">
        {otherPages.map((page) => (
          <Link href={page.href} key={page.key}>
            <strong>{page.title}</strong>
            <span>{page.description}</span>
            <i aria-hidden="true">→</i>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HouseFaqList({ faqs }: { faqs: HouseFaq[] }) {
  return (
    <section id="faq" className="house-section faq-section">
      <p className="section-label">COMMON QUESTIONS</p>
      <h2>Frequently asked questions</h2>
      <div className="faq-list">
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function RelatedTools({ toolKeys, title = "Tools for the next building step" }: { toolKeys: ToolKey[]; title?: string }) {
  const tools = toolKeys.flatMap((key) => {
    const tool = TOOL_PAGES.find((item) => item.key === key);
    return tool ? [tool] : [];
  });
  return (
    <section className="house-section related-tools">
      <p className="section-label">RELATED BUILDING TOOLS</p>
      <h2>{title}</h2>
      <div className="related-tools-grid">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.key}>
            <strong>{tool.title}</strong>
            <span>{tool.description}</span>
            <i aria-hidden="true">→</i>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function MaterialTable({ blueprint }: { blueprint: HouseBlueprint }) {
  return (
    <div className="house-table-wrap">
      <table>
        <caption className="sr-only">Material list for {blueprint.name}</caption>
        <thead><tr><th scope="col">Material</th><th scope="col">Count</th></tr></thead>
        <tbody>
          {blueprint.materials.map((material) => (
            <tr key={material.name}><th scope="row">{material.name}</th><td>{material.count.toLocaleString("en-US")}</td></tr>
          ))}
        </tbody>
        <tfoot><tr><th scope="row">Approximate total</th><td>{blueprint.blockCount.toLocaleString("en-US")}</td></tr></tfoot>
      </table>
    </div>
  );
}
