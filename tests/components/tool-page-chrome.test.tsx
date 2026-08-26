import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { SiteFooter } from "@/components/layout/site-footer";
import { HomeToolDirectory, ToolPageEnd } from "@/components/layout/tool-page-end";
import { TOOL_FAQS } from "@/lib/site/tool-faqs";
import { RELATED_TOOLS, TOOL_CATEGORIES, getToolPage } from "@/lib/site/tools";

describe("shared tool page navigation", () => {
  it("shows a breadcrumb for the current generator", () => {
    render(<PageBreadcrumb toolKey="sphere" />);
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });

    expect(within(breadcrumb).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(breadcrumb).getByText("Sphere Generator")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("provides FAQs and a focused internal-link cluster", () => {
    render(<ToolPageEnd toolKey="sphere" />);

    expect(screen.getByRole("heading", { name: "Frequently Asked Questions" })).toBeInTheDocument();
    expect(screen.getAllByRole("group")).toHaveLength(TOOL_FAQS.sphere.length);

    const directory = screen.getByRole("region", { name: "Explore more Minecraft tools" });
    const links = within(directory).getAllByRole("link");
    const related = RELATED_TOOLS.sphere.map(getToolPage);
    expect(links).toHaveLength(related.length);
    expect(links.map((link) => link.textContent)).toEqual(
      related.map((tool) => `${tool.title}${tool.description}→`),
    );
    expect(within(directory).getByRole("link", { name: /Shape Generator/ })).toHaveAttribute("href", "/minecraft-shape-generator");
  });

  it("keeps tools and site information in separate footer columns", () => {
    render(<SiteFooter />);

    const tools = screen.getByRole("navigation", { name: "Footer tools" });
    const resources = screen.getByRole("navigation", { name: "Minecraft building resources" });
    const site = screen.getByRole("navigation", { name: "Site information" });
    expect(within(tools).getAllByRole("link")).toHaveLength(
      TOOL_CATEGORIES.reduce((total, category) => total + category.toolKeys.length, 0),
    );
    expect(within(resources).getAllByRole("link")).toHaveLength(4);
    expect(within(site).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "About",
      "Contact",
      "Privacy Policy",
      "Terms of Use",
    ]);
  });

  it("uses the whole home tool card as the link without repeated action copy", () => {
    render(<HomeToolDirectory />);

    expect(screen.getByRole("heading", { name: "Explore Minecraft Tools" })).toBeInTheDocument();
    expect(screen.queryByText(/Open tool/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Circle Generator/ })).toHaveAttribute("href", "/");
  });
});
