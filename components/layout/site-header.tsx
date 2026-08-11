"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    if (detailsRef.current) detailsRef.current.open = false;
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!detailsRef.current?.contains(event.target as Node)) closeMenu();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, menuOpen]);

  const goToSection =
    (id: string) => (event: ReactMouseEvent<HTMLAnchorElement>) => {
      closeMenu();
      if (window.location.pathname !== "/") return;
      event.preventDefault();
      const hash = `#${id}`;
      window.history.pushState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${hash}`,
      );
      document.getElementById(id)?.scrollIntoView();
    };

  const goHome = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    closeMenu();
    if (window.location.pathname !== "/") return;
    event.preventDefault();
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <Link
          href="/"
          className="brand"
          aria-label="Minecraft Circle Gen home"
          onClick={goHome}
        >
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
          <Link href="/#generator" onClick={goToSection("generator")}>Circle Generator</Link>
          <Link href="/#how-to-use" onClick={goToSection("how-to-use")}>How to Use</Link>
          <Link href="/#faq" onClick={goToSection("faq")}>FAQ</Link>
        </nav>
        <details
          ref={detailsRef}
          className="mobile-nav"
          open={menuOpen}
          onToggle={(event) => setMenuOpen(event.currentTarget.open)}
        >
          <summary aria-label={`${menuOpen ? "Close" : "Open"} navigation menu`}>
            <span />
            <span />
            <span />
          </summary>
          <nav aria-label="Mobile navigation">
            <Link href="/#generator" onClick={goToSection("generator")}>Circle Generator</Link>
            <Link href="/#how-to-use" onClick={goToSection("how-to-use")}>How to Use</Link>
            <Link href="/#faq" onClick={goToSection("faq")}>FAQ</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
