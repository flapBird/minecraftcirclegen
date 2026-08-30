import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ToolsDirectoryBrowser } from "@/components/tools-directory/tools-directory-browser";
import { TOOL_PAGES } from "@/lib/site/tools";

describe("ToolsDirectoryBrowser", () => {
  it("renders every tool in HTML and filters by category", () => {
    render(<ToolsDirectoryBrowser />);

    expect(screen.getAllByRole("link")).toHaveLength(TOOL_PAGES.length);
    fireEvent.click(screen.getByRole("button", { name: /Player/ }));

    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Minecraft Name Checker/ })).toHaveAttribute("href", "/minecraft-name-checker");
    expect(screen.getByRole("link", { name: /Minecraft UUID Lookup/ })).toHaveAttribute("href", "/minecraft-uuid-lookup");
    expect(screen.queryByRole("link", { name: /Circle Generator/ })).not.toBeInTheDocument();
  });

  it("searches across all tool names and shows a recoverable empty state", () => {
    render(<ToolsDirectoryBrowser />);
    const search = screen.getByRole("searchbox", { name: "Search Minecraft tools" });

    fireEvent.change(search, { target: { value: "give command" } });
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Give Command Generator/ })).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "tool-that-does-not-exist" } });
    expect(screen.getByText("No tools found")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show all tools" }));
    expect(screen.getAllByRole("link")).toHaveLength(TOOL_PAGES.length);
  });
});
