"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { CONTENT_PAGES, TOOL_PAGES, type ToolPage } from "@/lib/site/tools";

const circleTool = TOOL_PAGES[0];
const shapeTools = TOOL_PAGES.filter((tool) => ["oval", "sphere", "dome"].includes(tool.key));
const creativeTools = TOOL_PAGES.filter((tool) => ["gradient", "pixel-art", "map-art", "font"].includes(tool.key));
const groupedTools = [...shapeTools, ...creativeTools];
const TOOLS_OPEN_DELAY_MS = 260;
const TOOLS_CLOSE_DELAY_MS = 180;

function isCurrentPage(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function ToolGroup({ title, tools, onClick }: {
  title: string;
  tools: ToolPage[];
  onClick: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <section>
      <h2>{title}</h2>
      {tools.map((tool) => (
        <Link key={tool.key} href={tool.href} onClick={onClick}>
          <strong>{tool.navLabel}</strong>
          <span>{tool.description}</span>
        </Link>
      ))}
    </section>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const mobileDetailsRef = useRef<HTMLDetailsElement>(null);
  const mobileToolsRef = useRef<HTMLDetailsElement>(null);
  const desktopToolsRef = useRef<HTMLDetailsElement>(null);
  const desktopToolsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const groupedToolActive = groupedTools.some((tool) => isCurrentPage(pathname, tool.href));

  const clearDesktopToolsTimer = useCallback(() => {
    if (desktopToolsTimerRef.current === null) return;
    clearTimeout(desktopToolsTimerRef.current);
    desktopToolsTimerRef.current = null;
  }, []);

  const scheduleDesktopTools = useCallback((open: boolean) => {
    clearDesktopToolsTimer();
    desktopToolsTimerRef.current = setTimeout(() => {
      setToolsOpen(open);
      desktopToolsTimerRef.current = null;
    }, open ? TOOLS_OPEN_DELAY_MS : TOOLS_CLOSE_DELAY_MS);
  }, [clearDesktopToolsTimer]);

  const closeMenu = useCallback(() => {
    clearDesktopToolsTimer();
    setMenuOpen(false);
    setToolsOpen(false);
    if (mobileDetailsRef.current) mobileDetailsRef.current.open = false;
    if (mobileToolsRef.current) mobileToolsRef.current.open = false;
    if (desktopToolsRef.current) desktopToolsRef.current.open = false;
  }, [clearDesktopToolsTimer]);

  useEffect(() => clearDesktopToolsTimer, [clearDesktopToolsTimer]);

  useEffect(() => {
    if (!menuOpen && !toolsOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const insideMobile = mobileDetailsRef.current?.contains(target);
      const insideDesktopTools = desktopToolsRef.current?.contains(target);
      if (!insideMobile && !insideDesktopTools) closeMenu();
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
  }, [closeMenu, menuOpen, toolsOpen]);

  const openPage = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    closeMenu();
    const target = new URL(event.currentTarget.href);
    if (window.location.pathname !== target.pathname) return;
    event.preventDefault();
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <Link href="/" className="brand" aria-label="Minecraft Circle Gen home" onClick={openPage}>
          <span className="brand-mark" aria-hidden="true">
            <i /><i /><i /><i /><i /><i /><i /><i />
          </span>
          <span>Minecraft Circle Gen</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <Link
            href={circleTool.href}
            className={pathname === circleTool.href ? "is-active" : undefined}
            aria-current={pathname === circleTool.href ? "page" : undefined}
            onClick={openPage}
          >
            {circleTool.navLabel}
          </Link>
          <details
            ref={desktopToolsRef}
            className={`desktop-tools-menu${groupedToolActive ? " is-active" : ""}`}
            open={toolsOpen}
            onToggle={(event) => setToolsOpen(event.currentTarget.open)}
            onMouseEnter={() => scheduleDesktopTools(true)}
            onMouseLeave={() => scheduleDesktopTools(false)}
          >
            <summary aria-current={groupedToolActive ? "page" : undefined}>
              Tools <span className="tools-chevron" aria-hidden="true" />
            </summary>
            <div className="desktop-tools-panel">
              <ToolGroup title="Shape Tools" tools={shapeTools} onClick={openPage} />
              <ToolGroup title="Creative Tools" tools={creativeTools} onClick={openPage} />
            </div>
          </details>
          {CONTENT_PAGES.map((page) => {
            const active = isCurrentPage(pathname, page.href);
            return (
              <Link key={page.key} href={page.href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined} onClick={openPage}>
                {page.navLabel}
              </Link>
            );
          })}
        </nav>

        <details
          ref={mobileDetailsRef}
          className="mobile-nav"
          open={menuOpen}
          onToggle={(event) => setMenuOpen(event.currentTarget.open)}
        >
          <summary aria-label={`${menuOpen ? "Close" : "Open"} navigation menu`}>
            <span /><span /><span />
          </summary>
          <nav aria-label="Mobile navigation">
            <Link href={circleTool.href} className={pathname === circleTool.href ? "is-active" : undefined} aria-current={pathname === circleTool.href ? "page" : undefined} onClick={openPage}>
              {circleTool.navLabel}
            </Link>
            <details ref={mobileToolsRef} className="mobile-tools-menu">
              <summary>
                <span>Tools</span><i className="tools-chevron" aria-hidden="true" />
              </summary>
              <div>
                <ToolGroup title="Shape Tools" tools={shapeTools} onClick={openPage} />
                <ToolGroup title="Creative Tools" tools={creativeTools} onClick={openPage} />
              </div>
            </details>
            {CONTENT_PAGES.map((page) => {
              const active = isCurrentPage(pathname, page.href);
              return (
                <Link key={page.key} href={page.href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined} onClick={openPage}>
                  {page.navLabel}
                </Link>
              );
            })}
          </nav>
        </details>
      </div>
    </header>
  );
}
