import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-grid">
        <div>
          <Link href="/" className="footer-brand">
            Minecraft Circle Gen
          </Link>
          <p>
            A practical, free blueprint tool for building cleaner block circles.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
          <Link href="/about#contact">Contact</Link>
        </nav>
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
