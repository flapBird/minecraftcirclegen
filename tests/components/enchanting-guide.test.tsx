import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import EnchantingTablePage from "@/app/enchanting-table/page";
import { BookshelfSimulator } from "@/components/enchanting-guide/bookshelf-simulator";
import { bottomSlotRange } from "@/lib/minecraft/enchant-power";

describe("enchanting table guide page", () => {
  it("renders the hero, section anchors, and cross-links to the translator", () => {
    const { container } = render(<EnchantingTablePage />);

    expect(screen.getByRole("heading", { level: 1, name: "Minecraft Enchanting Table" })).toBeInTheDocument();
    for (const anchor of ["how-to-make", "how-to-use", "bookshelf-simulator", "bookshelf-rules", "symbols", "faq"]) {
      expect(container.querySelector(`#${anchor}`), `missing #${anchor}`).not.toBeNull();
    }
    const translatorLinks = container.querySelectorAll('a[href="/minecraft-enchanting-table-translator"]');
    expect(translatorLinks.length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector('a[href="/minecraft-font-generator"]')).not.toBeNull();
  });

  it("covers the three keyword demands: crafting recipe, level 30, and symbol language", () => {
    const { container } = render(<EnchantingTablePage />);

    expect(screen.getByRole("heading", { name: "How to make an enchanting table" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "15 bookshelf layout simulator" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What the enchanting table symbols say" })).toBeInTheDocument();
    const symbolsSection = container.querySelector("#symbols")!;
    expect(symbolsSection.textContent).toContain("Standard Galactic Alphabet");
  });

  it("renders the full FAQ and matching FAQPage structured data", () => {
    const { container } = render(<EnchantingTablePage />);

    const faqSummaries = container.querySelectorAll("#faq details summary");
    expect(faqSummaries.length).toBeGreaterThanOrEqual(7);
    const schemaScripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
      .map((script) => JSON.parse(script.textContent ?? "{}"));
    const faqSchema = schemaScripts.find((schema) => schema["@type"] === "FAQPage");
    expect(faqSchema.mainEntity).toHaveLength(faqSummaries.length);
    expect(schemaScripts.some((schema) => schema["@type"] === "BreadcrumbList")).toBe(true);
  });

  it("shows the complete shelf-count level table with vanilla reference points", () => {
    const { container } = render(<EnchantingTablePage />);

    const rows = container.querySelectorAll("#bookshelf-rules tbody tr");
    expect(rows).toHaveLength(16);
    expect(container.querySelector("#level-0")!.textContent).toContain("Levels 1–8");
    expect(container.querySelector("#level-14")!.textContent).toContain("Levels 28–29");
    expect(container.querySelector("#level-15")!.textContent).toContain("Level 30");
    expect(bottomSlotRange(15)).toEqual({ min: 30, max: 30 });
  });
});

describe("bookshelf simulator", () => {
  it("starts on the classic 15-shelf ring and reports level 30", () => {
    render(<BookshelfSimulator />);

    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("/ 15 shelves counting")).toBeInTheDocument();
    expect(screen.getByText("Bottom slot offers level 30")).toBeInTheDocument();
    expect(screen.getByText(/Level 30 unlocked/)).toBeInTheDocument();
  });

  it("drops the count when a torch blocks a gap and recovers when cleared", async () => {
    render(<BookshelfSimulator />);

    const northGap = screen.getByRole("button", { name: /Gap cell 1 north/ });
    await userEvent.click(northGap);
    expect(screen.getByText(/shelves do not count/)).toBeInTheDocument();
    expect(screen.getByText(/Bottom slot offers levels/)).toBeInTheDocument();

    await userEvent.click(northGap);
    expect(screen.getByText("Bottom slot offers level 30")).toBeInTheDocument();
  });

  it("switches to the upper layer and toggles shelves there", async () => {
    render(<BookshelfSimulator />);

    await userEvent.click(screen.getByRole("button", { name: "One block above" }));
    const slot = screen.getByRole("button", { name: /Bookshelf slot 2 east — empty/ });
    await userEvent.click(slot);
    expect(screen.getByRole("button", { name: /Bookshelf slot 2 east — bookshelf placed/ })).toBeInTheDocument();
  });

  it("preset buttons swap between layouts, including a capped full ring", async () => {
    render(<BookshelfSimulator />);

    await userEvent.click(screen.getByRole("button", { name: "Torch demo" }));
    expect(screen.getByText(/shelves do not count/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Full ring (16)" }));
    expect(screen.getByText("Bottom slot offers level 30")).toBeInTheDocument();
    expect(screen.getByText(/16 placed · 15 counting/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Corner stack" }));
    expect(screen.getByText(/Add 1 more bookshelf/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByText("Bottom slot offers levels 1–8")).toBeInTheDocument();
  });
});
