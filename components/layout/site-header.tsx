import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <Link href="/" className="brand" aria-label="Minecraft Circle Gen home">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>Minecraft Circle Gen</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/#generator">Circle Generator</Link>
          <Link href="/#how-to-use">How to Use</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Open navigation menu">
            <span />
            <span />
            <span />
          </summary>
          <nav aria-label="Mobile navigation">
            <Link href="/#generator">Circle Generator</Link>
            <Link href="/#how-to-use">How to Use</Link>
            <Link href="/#faq">FAQ</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
