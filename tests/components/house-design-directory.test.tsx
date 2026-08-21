import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HouseDesignDirectory } from "@/components/house/house-support";

describe("HouseDesignDirectory", () => {
  it("links to every other house-design child page and excludes the current page", () => {
    render(<HouseDesignDirectory currentPage="starter" />);

    expect(screen.getByRole("heading", { name: "Explore more Minecraft house designs" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Starter Houses/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Small Houses/ })).toHaveAttribute("href", "/house-designs/small");
    expect(screen.getByRole("link", { name: /Modern Houses/ })).toHaveAttribute("href", "/house-designs/modern");
    expect(screen.getByRole("link", { name: /Survival Houses/ })).toHaveAttribute("href", "/house-designs/survival");
    expect(screen.getByRole("link", { name: /Staircase Designs/ })).toHaveAttribute("href", "/house-designs/staircases");
  });
});
