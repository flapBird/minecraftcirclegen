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
import {
  CONTENT_PAGES,
  TOOL_CATEGORIES,
  TOOL_PAGES,
  getToolsForCategory,
  type ToolCategoryKey,
} from "@/lib/site/tools";

const circleTool = TOOL_PAGES[0];
const groupedTools = TOOL_PAGES.filter((tool) => tool.key !== "circle");
const TOOLS_OPEN_DELAY_MS = 260;
const TOOLS_CLOSE_DELAY_MS = 180;

function isCurrentPage(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function getCategoryForPath(pathname: string) {
  return TOOL_CATEGORIES.find((category) => (
    getToolsForCategory(category).some((tool) => isCurrentPage(pathname, tool.href))
  ));
}

function ToolsBrowser({
  id,
  activeCategoryKey,
  query,
  onCategoryChange,
  onQueryChange,
  onClick,
}: {
  id: string;
  activeCategoryKey: ToolCategoryKey;
  query: string;
  onCategoryChange: (category: ToolCategoryKey) => void;
  onQueryChange: (query: string) => void;
  onClick: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
}) {
  const activeCategory = TOOL_CATEGORIES.find((category) => category.key === activeCategoryKey) ?? TOOL_CATEGORIES[0];
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const tools = normalizedQuery
    ? groupedTools.filter((tool) => {
        const category = TOOL_CATEGORIES.find((item) => item.toolKeys.includes(tool.key));
        return [tool.navLabel, tool.title, tool.description, category?.title]
          .some((value) => value?.toLocaleLowerCase().includes(normalizedQuery));
      })
    : getToolsForCategory(activeCategory).filter((tool) => tool.key !== "circle");

  return (
    <div className="tools-browser">
      <div className="tools-browser-toolbar">
        <label className="tools-search-field">
          <span className="sr-only">Search Minecraft tools</span>
          <i aria-hidden="true" />
          <input
            type="search"
            value={query}
            placeholder="Search tools…"
            aria-label="Search Minecraft tools"
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>
      </div>
      <div className="tools-browser-body">
        <div className="tools-category-list" aria-label="Tool categories">
          {TOOL_CATEGORIES.map((category) => (
            <button
              key={category.key}
              type="button"
              className={category.key === activeCategoryKey && !normalizedQuery ? "is-active" : undefined}
              aria-pressed={category.key === activeCategoryKey && !normalizedQuery}
              aria-controls={`${id}-results`}
              onClick={() => {
                onQueryChange("");
                onCategoryChange(category.key);
              }}
            >
              {category.title.replace(/ Tools$/, "")}
              <span>{category.toolKeys.filter((key) => key !== "circle").length}</span>
            </button>
          ))}
        </div>
        <section id={`${id}-results`} className="tools-results" aria-live="polite">
          <div className="tools-results-heading">
            <h2>{normalizedQuery ? "Search results" : activeCategory.title}</h2>
            <span>{tools.length} {tools.length === 1 ? "tool" : "tools"}</span>
          </div>
          {tools.length > 0 ? (
            <div className="tools-result-grid">
              {tools.map((tool) => (
                <Link key={tool.key} href={tool.href} onClick={onClick}>
                  <strong>{tool.navLabel}</strong>
                  <i aria-hidden="true">→</i>
                </Link>
              ))}
            </div>
          ) : (
            <p className="tools-empty-state">No matching tools. Try another name or category.</p>
          )}
        </section>
      </div>
      <div className="tools-browser-footer">
        <Link href="/#explore-tools" onClick={onClick}>View all tools <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [toolQuery, setToolQuery] = useState("");
  const [activeToolsCategory, setActiveToolsCategory] = useState<ToolCategoryKey>(() => (
    getCategoryForPath(pathname)?.key ?? TOOL_CATEGORIES[0].key
  ));
  const mobileDetailsRef = useRef<HTMLDetailsElement>(null);
  const desktopToolsRef = useRef<HTMLDetailsElement>(null);
  const desktopToolsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    setMobileToolsOpen(false);
    setToolQuery("");
    setActiveToolsCategory(getCategoryForPath(pathname)?.key ?? TOOL_CATEGORIES[0].key);
    if (mobileDetailsRef.current) mobileDetailsRef.current.open = false;
    if (desktopToolsRef.current) desktopToolsRef.current.open = false;
  }, [clearDesktopToolsTimer, pathname]);

  useEffect(() => clearDesktopToolsTimer, [clearDesktopToolsTimer]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

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
    if (window.location.pathname !== target.pathname || target.hash) return;
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
            onToggle={(event) => {
              const open = event.currentTarget.open;
              setToolsOpen(open);
              if (open) {
                setToolQuery("");
                setActiveToolsCategory(getCategoryForPath(pathname)?.key ?? TOOL_CATEGORIES[0].key);
              }
            }}
            onMouseEnter={() => scheduleDesktopTools(true)}
            onMouseLeave={() => scheduleDesktopTools(false)}
          >
            <summary aria-current={groupedToolActive ? "page" : undefined}>
              Tools <span className="tools-chevron" aria-hidden="true" />
            </summary>
            <div className="desktop-tools-panel">
              <ToolsBrowser
                id="desktop-tools"
                activeCategoryKey={activeToolsCategory}
                query={toolQuery}
                onCategoryChange={setActiveToolsCategory}
                onQueryChange={setToolQuery}
                onClick={openPage}
              />
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
          onToggle={(event) => {
            const open = event.currentTarget.open;
            setMenuOpen(open);
            if (!open) setMobileToolsOpen(false);
          }}
        >
          <summary aria-label={`${menuOpen ? "Close" : "Open"} navigation menu`}>
            <span /><span /><span />
          </summary>
          <nav aria-label="Mobile navigation">
            <Link href={circleTool.href} className={pathname === circleTool.href ? "is-active" : undefined} aria-current={pathname === circleTool.href ? "page" : undefined} onClick={openPage}>
              {circleTool.navLabel}
            </Link>
            <div className="mobile-tools-menu">
              <button
                type="button"
                className="mobile-tools-toggle"
                aria-expanded={mobileToolsOpen}
                aria-controls="mobile-tools-panel"
                onClick={() => {
                  const nextOpen = !mobileToolsOpen;
                  if (nextOpen) {
                    setToolQuery("");
                    setActiveToolsCategory(getCategoryForPath(pathname)?.key ?? TOOL_CATEGORIES[0].key);
                  }
                  setMobileToolsOpen(nextOpen);
                }}
              >
                <span>Tools</span><i className="tools-chevron" aria-hidden="true" />
              </button>
              {mobileToolsOpen && <div id="mobile-tools-panel">
                <ToolsBrowser
                  id="mobile-tools"
                  activeCategoryKey={activeToolsCategory}
                  query={toolQuery}
                  onCategoryChange={setActiveToolsCategory}
                  onQueryChange={setToolQuery}
                  onClick={openPage}
                />
              </div>}
            </div>
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
