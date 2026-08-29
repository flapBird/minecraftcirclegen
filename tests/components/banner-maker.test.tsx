import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { BannerMaker } from "@/components/banner-maker/banner-maker";

describe("BannerMaker", () => {
  beforeEach(() => window.localStorage.clear());

  it("adds visual pattern layers directly after choosing a color", () => {
    const { container } = render(<BannerMaker />);

    expect(screen.getByRole("heading", { name: "PREVIEW" })).toBeInTheDocument();
    expect(screen.getByText("0 / 6 layers")).toBeInTheDocument();
    expect(screen.getByText("Add a pattern from the right to create your first layer.")).toBeInTheDocument();
    expect(screen.getByText("/give · Java 1.20.5+")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Current loom recipe" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Set pattern color to Black" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Set pattern color to Red" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Circle layer" }));
    expect(screen.getByText("1 / 6 layers")).toBeInTheDocument();
    expect(screen.getByText("Circle · Red")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Current loom recipe" })).toBeInTheDocument();
    expect(screen.getByText("Roundel + Red Dye")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Banner with 1 pattern layers" })).toBeInTheDocument();
    expect(container.querySelector(".banner-cloth")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Layers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Generate command" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy share link" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy command" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Randomize" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear All" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "SetBlock" }));
    expect(screen.getByText("/setblock · Java 1.20.5+")).toBeInTheDocument();
    expect(screen.getByText(/\/setblock ~ ~ ~/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Share design" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Saved Banners" })).toBeInTheDocument();
  });

  it("saves, restores, and removes banners on the current device", () => {
    render(<BannerMaker />);

    fireEvent.click(screen.getByRole("button", { name: "Add Circle layer" }));
    fireEvent.click(screen.getByRole("button", { name: "+ Save current" }));

    expect(screen.getByRole("button", { name: "Load saved banner 1" })).toBeInTheDocument();
    expect(window.localStorage.getItem("minecraftcirclegen.saved-banners.v1")).toContain("circle,black");

    fireEvent.click(screen.getByRole("button", { name: "Clear All" }));
    expect(screen.getByText("0 / 6 layers")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Current loom recipe" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Load saved banner 1" }));
    expect(screen.getByText("Circle · Black")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remove saved banner 1" }));
    expect(screen.queryByRole("button", { name: "Load saved banner 1" })).not.toBeInTheDocument();
    expect(window.localStorage.getItem("minecraftcirclegen.saved-banners.v1")).toBe("[]");
  });
});
