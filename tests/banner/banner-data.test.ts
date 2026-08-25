import { describe, expect, it } from "vitest";
import { decodeBannerDesign, encodeBannerDesign, makeBannerCommand, makeBannerSetblockCommand } from "@/lib/banner/banner-data";

describe("makeBannerCommand", () => {
  it("uses Java 1.20.5+ item components and registry pattern ids", () => {
    expect(makeBannerCommand("green", [{ uid: 1, patternId: "stripe_center", colorId: "white" }]))
      .toBe("/give @p minecraft:green_banner[minecraft:banner_patterns=[{pattern:'minecraft:stripe_center',color:'white'}]] 1");
  });

  it("omits the component when there are no patterns", () => {
    expect(makeBannerCommand("red", [])).toBe("/give @p minecraft:red_banner 1");
  });

  it("creates a standing banner setblock command with block entity patterns", () => {
    expect(makeBannerSetblockCommand("green", [{ uid: 1, patternId: "cross", colorId: "black" }]))
      .toBe("/setblock ~ ~ ~ minecraft:green_banner{patterns:[{pattern:'minecraft:cross',color:'black'}]}");
    expect(makeBannerSetblockCommand("red", [])).toBe("/setblock ~ ~ ~ minecraft:red_banner");
  });

  it("round-trips a shareable banner design without accepting unknown ids", () => {
    const value = encodeBannerDesign("red", [{ uid: 9, patternId: "circle", colorId: "white" }]);
    expect(decodeBannerDesign(value)).toEqual({ baseColorId: "red", layers: [{ uid: 1, patternId: "circle", colorId: "white" }] });
    expect(decodeBannerDesign("unknown|circle,white")).toBeNull();
  });
});
