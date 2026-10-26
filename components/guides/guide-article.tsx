import Link from "next/link";
import { getToolPage } from "@/lib/site/tools";
import { guideReadingMinutes, otherGuides, type Guide } from "@/content/guides/registry";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function GuideToolsRow({ guide }: { guide: Guide }) {
  const tools = guide.toolKeys.map(getToolPage);
  return (
    <aside className="guide-tools-row" aria-label="Tools used in this guide">
      <p className="section-label">TOOLS USED IN THIS GUIDE</p>
      <div className="related-tools-grid">
        {tools.map((tool) => (
          <Link key={tool.key} href={tool.href}>
            <strong>{tool.title}</strong>
            <span>{tool.description}</span>
            <i aria-hidden="true">→</i>
          </Link>
        ))}
        {guide.contentLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <strong>{link.label}</strong>
            <span>Ready-to-copy reference for every common diameter.</span>
            <i aria-hidden="true">→</i>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function GuideArticle({ guide }: { guide: Guide }) {
  return (
    <article className="seo-content guide-article">
      <div className="content-container">
        <header className="guide-header">
          <p className="section-label">{guide.eyebrow}</p>
          <h1>{guide.title}</h1>
          <p className="guide-meta">
            <time dateTime={guide.datePublished}>{formatDate(guide.datePublished)}</time>
            <span aria-hidden="true"> · </span>
            {guideReadingMinutes(guide)} min read
          </p>
        </header>
        {guide.sections.map((section, index) => (
          <section key={section.heading}>
            {index > 0 || <span id="guide-start" />}
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.ordered && (
              <ol className="guide-steps">
                {section.ordered.map((step) => {
                  const [lead, ...rest] = step.split(/(?<=\.)\s/);
                  return (
                    <li key={step}>
                      <strong>{lead}</strong>
                      <span>{rest.join(" ")}</span>
                    </li>
                  );
                })}
              </ol>
            )}
            {section.tips && (
              <ul className="tips-grid">
                {section.tips.map((tip) => (
                  <li key={tip.title}>
                    <strong>{tip.title}</strong>
                    {tip.text}
                  </li>
                ))}
              </ul>
            )}
            {index === 0 && <GuideToolsRow guide={guide} />}
          </section>
        ))}
        <section className="guide-next">
          <h2>Keep reading</h2>
          <div className="tool-directory-grid guide-next-grid">
            {otherGuides(guide.slug).map((next) => (
              <Link key={next.slug} href={`/guides/${next.slug}`}>
                <strong>{next.title}</strong>
                <span>{next.description}</span>
                <i aria-hidden="true">→</i>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
