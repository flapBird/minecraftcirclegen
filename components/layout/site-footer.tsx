import Link from "next/link";
import { TOOL_PAGES } from "@/lib/site/tools";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-grid">
        <div>
          <Link href="/" className="footer-brand">
            Minecraft Circle Gen
          </Link>
          <p>
            Practical Minecraft building tools for cleaner shapes, palettes, and block plans.
          </p>
        </div>
        <section className="footer-column">
          <h2>Tools</h2>
          <nav aria-label="Footer tools">
            {TOOL_PAGES.map((tool) => (
              <Link key={tool.key} href={tool.href}>{tool.title}</Link>
            ))}
          </nav>
        </section>
        <section className="footer-column">
          <h2>Build Resources</h2>
          <nav aria-label="Minecraft building resources">
            <Link href="/house-designs">House Designs</Link>
            <Link href="/house-blueprints">House Blueprints</Link>
            <Link href="/house-designs/starter">Starter Houses</Link>
            <Link href="/house-designs/staircases">Staircase Designs</Link>
          </nav>
        </section>
        <section className="footer-column">
          <h2>Site</h2>
          <nav aria-label="Site information">
            <Link href="/about">About</Link>
            <Link href="/about#contact">Contact</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
          </nav>
        </section>
      </div>
      <div className="page-container footer-bottom">
        <p>
          Minecraft Circle Gen is an independent fan-made tool and is not
          affiliated with, endorsed by, or associated with Mojang Studios or
          Microsoft.
        </p>
        <span>© {new Date().getFullYear()} Minecraft Circle Gen</span>
      </div>
    </footer>
  );
}
