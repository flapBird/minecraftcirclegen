"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  TOOL_CATEGORIES,
  TOOL_PAGES,
  type ToolCategoryKey,
} from "@/lib/site/tools";

type DirectoryCategory = "all" | ToolCategoryKey;

export function ToolsDirectoryBrowser() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<DirectoryCategory>("all");
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const visibleGroups = useMemo(() => TOOL_CATEGORIES.map((category) => ({
    category,
    tools: category.toolKeys
      .map((key) => TOOL_PAGES.find((tool) => tool.key === key))
      .filter((tool): tool is (typeof TOOL_PAGES)[number] => Boolean(tool))
      .filter((tool) => {
        if (activeCategory !== "all" && category.key !== activeCategory) return false;
        if (!normalizedQuery) return true;
        return [tool.navLabel, tool.title, tool.description, category.title]
          .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
      }),
  })).filter((group) => group.tools.length > 0), [activeCategory, normalizedQuery]);

  const resultCount = visibleGroups.reduce((total, group) => total + group.tools.length, 0);

  return (
    <div className="tools-index-browser">
      <div className="tools-index-controls">
        <label className="tools-index-search">
          <span>Search Minecraft tools</span>
          <div>
            <i aria-hidden="true" />
            <input
              type="search"
              value={query}
              placeholder="Search circle, banner, UUID, commands…"
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear tool search">Clear</button>}
          </div>
        </label>

        <div className="tools-index-filters" aria-label="Filter tools by category">
          <button
            type="button"
            aria-pressed={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          >
            All <span>{TOOL_PAGES.length}</span>
          </button>
          {TOOL_CATEGORIES.map((category) => (
            <button
              key={category.key}
              type="button"
              aria-pressed={activeCategory === category.key}
              onClick={() => setActiveCategory(category.key)}
            >
              {category.title.replace(/ Tools$/, "")} <span>{category.toolKeys.length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tools-index-summary" aria-live="polite">
        <strong>{resultCount}</strong> {resultCount === 1 ? "tool" : "tools"}
        {normalizedQuery && <> matching “{query.trim()}”</>}
      </div>

      {visibleGroups.length > 0 ? (
        <div className="tools-index-groups">
          {visibleGroups.map(({ category, tools }) => (
            <section key={category.key} aria-labelledby={`tools-index-${category.key}`}>
              <div className="tools-index-group-heading">
                <h2 id={`tools-index-${category.key}`}>{category.title}</h2>
                <span>{tools.length}</span>
              </div>
              <div className="tools-index-grid">
                {tools.map((tool) => (
                  <Link key={tool.key} href={tool.href}>
                    <span className="tools-index-card-category">{category.title.replace(/ Tools$/, "")}</span>
                    <strong>{tool.title}</strong>
                    <p>{tool.description}</p>
                    <i aria-hidden="true">→</i>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="tools-index-empty">
          <strong>No tools found</strong>
          <p>Try a broader search or choose another category.</p>
          <button type="button" onClick={() => { setQuery(""); setActiveCategory("all"); }}>Show all tools</button>
        </div>
      )}
    </div>
  );
}
