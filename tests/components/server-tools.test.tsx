import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ColorCodesTool } from "@/components/color-codes/color-codes-tool";
import { TextGradientGenerator } from "@/components/gradient-generator/text-gradient-generator";
import { TextGenerator } from "@/components/text-generator/text-generator";

describe("Minecraft text and code tools", () => {
  it("uses a concise preview heading without adding a server prefix", () => {
    render(<TextGenerator />);

    expect(screen.getByRole("heading", { name: "PREVIEW" })).toBeInTheDocument();
    expect(screen.queryByText("[Server]", { exact: true })).not.toBeInTheDocument();
  });

  it("keeps text-gradient characters inside one inline preview line", () => {
    const { container } = render(<TextGradientGenerator />);

    expect(screen.getByRole("heading", { name: "PREVIEW" })).toBeInTheDocument();
    expect(container.querySelector(".text-gradient-text")).toHaveTextContent("Welcome");
  });

  it("presents colors and formatting as compact reference tables", () => {
    render(<ColorCodesTool />);

    const colors = screen.getByRole("table", { name: "Minecraft color codes" });
    const formats = screen.getByRole("table", { name: "Minecraft formatting codes" });
    expect(within(colors).getAllByRole("row")).toHaveLength(17);
    expect(within(formats).getAllByRole("row")).toHaveLength(7);
    expect(within(colors).getByRole("button", { name: "Copy Green MOTD code" })).toBeInTheDocument();
    expect(within(colors).queryByText("Copy", { exact: true })).not.toBeInTheDocument();
    expect(within(formats).queryByText("Copy", { exact: true })).not.toBeInTheDocument();
  });

  it("keeps arbitrary RGB palettes separate from legacy Minecraft codes and exports them", () => {
    render(<ColorCodesTool />);

    fireEvent.change(screen.getByLabelText("Color"), { target: { value: "#ff0000" } });
    expect(screen.getByText("#FF0000")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Copy palette color/ })).toHaveLength(11);
    fireEvent.click(screen.getByRole("button", { name: "Export color palette" }));
    const dialog = screen.getByRole("dialog", { name: "Export color codes" });
    expect(dialog).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("tab", { name: "HEX" })).toHaveAttribute("aria-selected", "true");
    expect(within(dialog).getAllByRole("button", { name: /^Copy #/ })).toHaveLength(11);
    fireEvent.click(screen.getByRole("tab", { name: "OKLCH" }));
    expect(screen.getByRole("tab", { name: "OKLCH" })).toHaveAttribute("aria-selected", "true");
    expect(within(dialog).getAllByRole("button", { name: /^Copy oklch/ })).toHaveLength(11);
    expect(screen.getByRole("button", { name: /^MiniMessage/ })).toHaveAttribute("aria-pressed", "true");
    expect(within(dialog).getByText(/<#FF0000>/)).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Copy codes" })).toHaveClass("palette-copy-all");
    const colors = dialog.querySelector(".palette-export-center");
    const output = dialog.querySelector(".palette-export-output");
    expect(Boolean(colors && output && (colors.compareDocumentPosition(output) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: /^CSS variables/ }));
    expect(within(dialog).getByText(/:root/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close palette export" }));
    expect(document.body.style.overflow).toBe("");
  });

  it("offers compact palette families from the toolbar", () => {
    render(<ColorCodesTool />);

    fireEvent.click(screen.getByRole("button", { name: "Choose palette type" }));
    expect(screen.getAllByRole("menuitemradio")).toHaveLength(8);
    fireEvent.click(screen.getByRole("menuitemradio", { name: "Complementary" }));
    expect(screen.getAllByRole("button", { name: /Copy palette color/ })).toHaveLength(2);
  });
});
