import Link from "next/link";
import { TOOL_FAQS } from "@/lib/site/tool-faqs";
import {
  RELATED_TOOLS,
  TOOL_CATEGORIES,
  getToolPage,
  getToolsForCategory,
  type ToolKey,
} from "@/lib/site/tools";

export function ToolPageEnd({ toolKey }: { toolKey: ToolKey }) {
  const faqs = TOOL_FAQS[toolKey];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section id="faq" className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <ToolDirectory toolKey={toolKey} />
    </>
  );
}

export function ToolDirectory({ toolKey }: { toolKey: ToolKey }) {
  const tools = RELATED_TOOLS[toolKey].map(getToolPage);
  return (
    <section className="tool-directory" aria-labelledby={`${toolKey}-tool-directory-title`}>
        <p className="section-label">KEEP BUILDING</p>
        <h2 id={`${toolKey}-tool-directory-title`}>Explore more Minecraft tools</h2>
        <div className="tool-directory-grid">
          {tools.map((tool) => (
            <Link
              key={tool.key}
              href={tool.href}
              className={tool.key === toolKey ? "is-current" : undefined}
              aria-current={tool.key === toolKey ? "page" : undefined}
            >
              <strong>{tool.title}</strong>
              <span>{tool.description}</span>
              <i aria-hidden="true">→</i>
            </Link>
          ))}
        </div>
    </section>
  );
}

export function HomeToolDirectory() {
  return (
    <section className="home-tool-directory" aria-labelledby="home-tool-directory-title">
      <div className="page-container">
        <p className="section-label">TOOL COLLECTION</p>
        <h2 id="home-tool-directory-title">Explore Minecraft Tools</h2>
        <p className="home-tool-directory-intro">
          Move from a single footprint to complete shape, artwork, banner, and server-text workflows.
        </p>
        <div className="home-tool-categories">
          {TOOL_CATEGORIES.map((category) => (
            <section key={category.key}>
              <h3>{category.title}</h3>
              <div className="home-tool-card-grid">
                {getToolsForCategory(category).map((tool) => (
                  <Link key={tool.key} href={tool.href}>
                    <strong>{tool.title}</strong>
                    <span>{tool.description}</span>
                    <i aria-hidden="true">Open tool →</i>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
