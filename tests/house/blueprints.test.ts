import { describe, expect, it } from "vitest";
import { HOUSE_BLUEPRINTS, getHouseBlueprint } from "@/content/houses/blueprints";

describe("house blueprint content", () => {
  it("keeps every blueprint slug unique and every relation resolvable", () => {
    const slugs = HOUSE_BLUEPRINTS.map((blueprint) => blueprint.slug);
    expect(HOUSE_BLUEPRINTS).toHaveLength(8);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const blueprint of HOUSE_BLUEPRINTS) {
      for (const relatedSlug of blueprint.relatedSlugs) {
        expect(getHouseBlueprint(relatedSlug), `${blueprint.slug} -> ${relatedSlug}`).toBeDefined();
      }
    }
  });

  it("keeps material totals and layer dimensions internally consistent", () => {
    for (const blueprint of HOUSE_BLUEPRINTS) {
      expect(blueprint.blockCount).toBe(
        blueprint.materials.reduce((sum, material) => sum + material.count, 0),
      );
      expect(blueprint.layers).toHaveLength(blueprint.height);
      expect(blueprint.layers.map((layer) => layer.number)).toEqual(
        Array.from({ length: blueprint.height }, (_, index) => index + 1),
      );

      for (const layer of blueprint.layers) {
        expect(layer.rows).toHaveLength(blueprint.length);
        expect(layer.rows.every((row) => row.length === blueprint.width)).toBe(true);
      }
    }
  });
});

