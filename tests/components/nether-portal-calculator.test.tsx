import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NetherPortalCalculator } from "@/components/nether-portal/nether-portal-calculator";
import {
  buildFrameCommands,
  buildTeleportCommand,
  convertPortalCoords,
  formatPortalCoords,
  searchRadiusBlocks,
} from "@/lib/nether-portal/portal-math";
import { parsePortalUrl, serializePortalUrl } from "@/lib/nether-portal/portal-url-state";

describe("portal coordinate conversion", () => {
  it("divides X and Z by 8 with floor rounding and keeps Y", () => {
    expect(convertPortalCoords("ow2n", { x: 100, y: 64, z: -200 })).toEqual({ x: 12, y: 64, z: -25 });
    expect(convertPortalCoords("ow2n", { x: -100, y: 64, z: 0 })).toEqual({ x: -13, y: 64, z: 0 });
    expect(convertPortalCoords("ow2n", { x: 7, y: 64, z: 7 })).toEqual({ x: 0, y: 64, z: 0 });
  });

  it("multiplies X and Z by 8 going back to the Overworld", () => {
    expect(convertPortalCoords("n2ow", { x: 12, y: 64, z: -25 })).toEqual({ x: 96, y: 64, z: -200 });
    expect(convertPortalCoords("n2ow", { x: -1, y: 90, z: 3 })).toEqual({ x: -8, y: 90, z: 24 });
  });
});

describe("portal commands", () => {
  it("targets the destination dimension in the teleport command", () => {
    expect(buildTeleportCommand("ow2n", { x: 12, y: 64, z: -25 })).toBe(
      "/execute in minecraft:the_nether run tp @s 12 64 -25",
    );
    expect(buildTeleportCommand("n2ow", { x: 12, y: 64, z: -25 })).toBe(
      "/execute in minecraft:overworld run tp @s 12 64 -25",
    );
  });

  it("builds a 4×5 frame starting at the converted coordinates", () => {
    const commands = buildFrameCommands({ x: 12, y: 64, z: -25 });
    expect(commands).toEqual([
      "/fill 12 64 -25 15 64 -25 minecraft:obsidian",
      "/fill 12 68 -25 15 68 -25 minecraft:obsidian",
      "/fill 12 65 -25 12 67 -25 minecraft:obsidian",
      "/fill 15 65 -25 15 67 -25 minecraft:obsidian",
    ]);
  });

  it("uses the edition-aware search radius", () => {
    expect(searchRadiusBlocks("ow2n", "java")).toBe(16);
    expect(searchRadiusBlocks("n2ow", "java")).toBe(128);
    expect(searchRadiusBlocks("ow2n", "bedrock")).toBe(128);
  });

  it("formats coordinates for display and copy", () => {
    expect(formatPortalCoords({ x: 0, y: -64, z: 319 })).toBe("0 -64 319");
  });
});

describe("portal url state", () => {
  it("parses direction, edition, and coordinates from the query string", () => {
    expect(parsePortalUrl("?dir=n2ow&edition=bedrock&x=-13&y=90&z=7")).toEqual({
      direction: "n2ow",
      edition: "bedrock",
      coords: { x: -13, y: 90, z: 7 },
    });
  });

  it("falls back to defaults on invalid or missing params", () => {
    const parsed = parsePortalUrl("?dir= sideways&x=1.5&y=abc");
    expect(parsed.direction).toBe("ow2n");
    expect(parsed.edition).toBe("java");
    expect(parsed.coords).toEqual({ x: 100, y: 64, z: -200 });
  });

  it("round-trips through serialize", () => {
    const state = parsePortalUrl("?dir=n2ow&edition=bedrock&x=-13&y=90&z=7");
    expect(parsePortalUrl(serializePortalUrl(state))).toEqual(state);
  });

  it("omits default values from the serialized query", () => {
    expect(
      serializePortalUrl({ direction: "ow2n", edition: "java", coords: { x: 100, y: 64, z: -200 } }),
    ).toBe("");
  });
});

describe("NetherPortalCalculator", () => {
  it("converts the prefilled coordinates and shows the target", () => {
    render(<NetherPortalCalculator initialSearch="" />);
    expect(screen.getByLabelText(/Converted coordinates/)).toHaveTextContent("12 64 -25");
    expect(screen.getByText(/searches 16 blocks around this point/)).toBeInTheDocument();
  });

  it("recomputes when the direction changes", () => {
    render(<NetherPortalCalculator initialSearch="x=12&y=64&z=-25&dir=n2ow" />);
    expect(screen.getByLabelText(/Converted coordinates/)).toHaveTextContent("96 64 -200");
    fireEvent.click(screen.getByRole("radio", { name: "Overworld → Nether" }));
    expect(screen.getByLabelText(/Converted coordinates/)).toHaveTextContent("1 64 -4");
  });

  it("switches the search radius note for Bedrock", () => {
    render(<NetherPortalCalculator initialSearch="edition=bedrock" />);
    expect(screen.getByText(/searches 128 blocks around this point/)).toBeInTheDocument();
  });

  it("warns when the destination Y is outside the Nether build range", () => {
    render(<NetherPortalCalculator initialSearch="x=0&y=200&z=0" />);
    expect(screen.getByText(/portals need Y between 0 and 127/)).toBeInTheDocument();
  });

  it("hides the result while a field is not a whole number", () => {
    render(<NetherPortalCalculator initialSearch="" />);
    fireEvent.change(screen.getByLabelText("X coordinate"), { target: { value: "1.5" } });
    expect(screen.queryByLabelText(/Converted coordinates/)).not.toBeInTheDocument();
    expect(screen.getByText(/Enter whole numbers for X, Y, and Z/)).toBeInTheDocument();
  });
});
