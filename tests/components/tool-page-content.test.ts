import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const directToolContentFiles = [
  "app/page.tsx",
  "app/minecraft-shape-generator/page.tsx",
  "app/minecraft-banner-maker/page.tsx",
  "app/minecraft-text-generator/page.tsx",
  "app/minecraft-color-codes/page.tsx",
  "app/minecraft-gradient-generator/page.tsx",
  "app/minecraft-pixel-art-generator/page.tsx",
  "app/minecraft-map-art-generator/page.tsx",
  "app/minecraft-font-generator/page.tsx",
  "app/minecraft-give-command-generator/page.tsx",
  "app/minecraft-name-checker/page.tsx",
  "app/minecraft-uuid-lookup/page.tsx",
  "app/minecraft-enchanting-table-translator/page.tsx",
];

const sharedGeometryContent = "components/geometry-generator/geometry-landing.tsx";

function source(file: string) {
  return readFileSync(resolve(process.cwd(), file), "utf8");
}

describe("tool page explanatory content", () => {
  it.each(directToolContentFiles)("keeps %s direct and useful", (file) => {
    const content = source(file);

    expect(content).not.toContain("PageBreadcrumb");
    expect(content).not.toContain("section-label");
    expect(content).toMatch(/<h2>What (?:is|are)/);
    expect(content).toContain('id="how-to-use"');
  });

  it("gives oval, sphere, and dome pages a shared introduction and numbered workflow", () => {
    const content = source(sharedGeometryContent);

    expect(content).not.toContain("PageBreadcrumb");
    expect(content).not.toContain("section-label");
    expect(content).toContain("<h2>What is the {copy.title}?</h2>");
    expect(content).toContain("<h2>How to use the {copy.title}</h2>");
    expect(content).toContain('className="guide-steps"');
  });
});
