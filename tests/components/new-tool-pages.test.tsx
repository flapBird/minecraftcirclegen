import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MinecraftEnchantingTableTranslatorPage from "@/app/minecraft-enchanting-table-translator/page";
import MinecraftGiveCommandGeneratorPage from "@/app/minecraft-give-command-generator/page";
import MinecraftNameCheckerPage from "@/app/minecraft-name-checker/page";
import MinecraftUuidLookupPage from "@/app/minecraft-uuid-lookup/page";

describe("new Minecraft tool page guidance", () => {
  it("introduces the Give Command Generator and explains how to use it", () => {
    const { container } = render(<MinecraftGiveCommandGeneratorPage />);
    const hero = container.querySelector(".hero");

    expect(hero).not.toBeNull();
    expect(within(hero as HTMLElement).queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What is the Minecraft Give Command Generator?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How to use the Give Command Generator" })).toBeInTheDocument();
  });

  it("introduces the translator and explains how to use it", async () => {
    const page = await MinecraftEnchantingTableTranslatorPage({ searchParams: Promise.resolve({}) });
    const { container } = render(page);
    const hero = container.querySelector(".hero");

    expect(hero).not.toBeNull();
    expect(within(hero as HTMLElement).queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What is the Minecraft Enchanting Table Translator?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How to use the Enchanting Table Translator" })).toBeInTheDocument();
  });

  it("introduces both player lookup tools and gives each one its own instructions", async () => {
    const namePage = await MinecraftNameCheckerPage({ searchParams: Promise.resolve({}) });
    const { container, unmount } = render(namePage);
    const nameHero = container.querySelector(".hero");

    expect(nameHero).not.toBeNull();
    expect(within(nameHero as HTMLElement).queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What is the Minecraft Name Checker?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How to use the Minecraft Name Checker" })).toBeInTheDocument();
    unmount();

    const uuidPage = await MinecraftUuidLookupPage({ searchParams: Promise.resolve({}) });
    const uuidRender = render(uuidPage);
    const uuidHero = uuidRender.container.querySelector(".hero");

    expect(uuidHero).not.toBeNull();
    expect(within(uuidHero as HTMLElement).queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What is the Minecraft UUID Lookup?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How to use the Minecraft UUID Lookup" })).toBeInTheDocument();
  });
});
