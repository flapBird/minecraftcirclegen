import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GiveCommandGenerator } from "@/components/give-command-generator/give-command-generator";
import { PlayerLookupTool } from "@/components/player-lookup/player-lookup-tool";
import { EnchantingTableTranslator } from "@/components/enchanting-table-translator/enchanting-table-translator";

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState(null, "", "/");
});

describe("new Minecraft tool interfaces", () => {
  it("updates the give command and blocks invalid stack amounts", () => {
    render(<GiveCommandGenerator />);
    expect(screen.getByLabelText("Generated give command")).toHaveTextContent("/give @p minecraft:diamond_sword 1");

    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "2" } });
    expect(screen.getByRole("alert")).toHaveTextContent("Diamond Sword stacks to 1");
    expect(screen.getByRole("button", { name: "Copy Command" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Custom name/), { target: { value: "雪's \\\"Blade\\\"" } });
    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "1" } });
    expect(screen.getByLabelText("Generated give command")).toHaveTextContent("雪");
  });

  it("filters enchantments and adds styled text and attributes", () => {
    render(<GiveCommandGenerator />);
    fireEvent.click(screen.getByRole("button", { name: "+ Add enchantment" }));
    const enchantment = screen.getByLabelText("Enchantment 1") as HTMLSelectElement;
    expect(within(enchantment).getByRole("option", { name: "Sharpness" })).toBeInTheDocument();
    expect(within(enchantment).queryByRole("option", { name: "Power" })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/^Custom name/), { target: { value: "Styled" } });
    fireEvent.click(screen.getByRole("button", { name: "Name formatting bold" }));
    fireEvent.click(screen.getByRole("button", { name: "+ Add attribute" }));
    const command = screen.getByLabelText("Generated give command");
    expect(command).toHaveTextContent("bold:true");
    expect(command).toHaveTextContent("minecraft:attribute_modifiers");
  });

  it("validates a username before making a player request", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<PlayerLookupTool initialKind="username" />);
    expect(screen.getByText(/Current Java profile lookup only/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Minecraft username"), { target: { value: "a" } });
    fireEvent.click(screen.getByRole("button", { name: "Check Username" }));
    expect(screen.getByRole("alert")).toHaveTextContent("too short");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows found, not found, and API failure states distinctly", async () => {
    const player = {
      username: "Notch",
      uuid: "069a79f4-44e9-4726-a5be-fca90e38aaf5",
      uuidCompact: "069a79f444e94726a5befca90e38aaf5",
      skinUrl: null,
    };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ status: "found", player }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: "error", error: { code: "not_found", message: "No current Java profile was found for this username." } }), { status: 404 }))
      .mockRejectedValueOnce(new Error("offline"));
    vi.stubGlobal("fetch", fetchMock);
    render(<PlayerLookupTool initialKind="username" />);
    const input = screen.getByLabelText("Minecraft username");

    fireEvent.change(input, { target: { value: "Notch" } });
    fireEvent.click(screen.getByRole("button", { name: "Check Username" }));
    await waitFor(() => expect(screen.getByText("Profile found")).toBeInTheDocument());
    expect(screen.getByText("069a79f4-44e9-4726-a5be-fca90e38aaf5")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "NoUserAlpha" } });
    fireEvent.click(screen.getByRole("button", { name: "Check Username" }));
    await waitFor(() => expect(screen.getByText("Not found")).toBeInTheDocument());
    expect(screen.getByText(/does not guarantee/i)).toBeInTheDocument();
    expect(screen.queryByText("Available!", { exact: true })).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "FailUser" } });
    fireEvent.click(screen.getByRole("button", { name: "Check Username" }));
    await waitFor(() => expect(screen.getByText("Lookup unavailable")).toBeInTheDocument());
  });

  it("switches UUID directions and translates the full alphabet", () => {
    const { unmount } = render(<PlayerLookupTool initialKind="username" showTabs />);
    fireEvent.click(screen.getByRole("tab", { name: "UUID → Player" }));
    expect(screen.getByLabelText("Minecraft UUID")).toBeInTheDocument();
    unmount();

    render(<EnchantingTableTranslator />);
    const input = screen.getByLabelText("English text");
    fireEvent.change(input, { target: { value: "ABC xyz!?" } });
    const output = screen.getByLabelText("Translation output") as HTMLTextAreaElement;
    expect(output.value).toContain("!?" );
    expect(output.value).not.toContain("ABC");
    expect(screen.getByText(/characters ·/)).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "ᔑʖᓵ" } });
    expect(screen.getByLabelText("Enchanting table glyphs")).toBeInTheDocument();
    expect(within(screen.getByRole("region", { name: "Minecraft Enchanting Table Alphabet" })).getAllByText(/^[A-Z]$/)).toHaveLength(26);
  });
});
