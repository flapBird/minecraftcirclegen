import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BannerMaker } from "@/components/banner-maker/banner-maker";

describe("BannerMaker", () => {
  it("adds visual pattern layers directly after choosing a color", () => {
    const { container } = render(<BannerMaker />);

    expect(screen.getByRole("heading", { name: "PREVIEW" })).toBeInTheDocument();
    expect(screen.getByText("0 / 6 layers")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Set pattern color to Black" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Set pattern color to Red" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Circle layer" }));
    expect(screen.getByText("1 / 6 layers")).toBeInTheDocument();
    expect(screen.getByText("Circle · Red")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Banner with 1 pattern layers" })).toBeInTheDocument();
    expect(container.querySelector(".banner-cloth")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Layers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Generate command" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy share link" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy command" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Randomize" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear All" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "SetBlock" }));
    expect(screen.getByText(/\/setblock ~ ~ ~/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share design" })).toBeInTheDocument();
  });
});
