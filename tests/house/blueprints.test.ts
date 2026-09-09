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

  it("accounts for each placed item, counting a two-block door once", () => {
    for (const house of HOUSE_BLUEPRINTS) {
      const rows = house.layers.flatMap((layer) => layer.rows).join("");
      const placedCells = [...rows].filter((cell) => cell !== ".").length;
      expect(rows.match(/D/g)).toHaveLength(1);
      expect(rows.match(/U/g)).toHaveLength(1);
      expect(house.blockCount).toBe(placedCells - 1);
      expect(house.materials.find(({ name }) => name.endsWith("door"))?.count).toBe(1);
      expect(house.materials.some(({ name }) => name.includes("/") || name.includes(" or "))).toBe(false);
      for (const material of house.materials) expect(material.count).toBeGreaterThan(0);
    }
  });

  it("provides continuous stairs with two blocks of headroom and a landing", () => {
    for (const house of HOUSE_BLUEPRINTS.filter(({ floors }) => floors === 2)) {
      const stairPositions: Array<{ x: number; y: number; z: number }> = [];
      house.layers.forEach((layer, y) => layer.rows.forEach((row, z) => [...row].forEach((cell, x) => {
        if (cell === "T") stairPositions.push({ x, y, z });
      })));
      expect(stairPositions).toHaveLength(4);
      stairPositions.forEach(({ x, y, z }, index) => {
        expect(house.layers[y + 1].rows[z][x]).toBe(".");
        expect(house.layers[y + 2].rows[z][x]).toBe(".");
        if (index > 0) expect(stairPositions[index - 1]).toEqual({ x, y: y - 1, z: z + 1 });
      });
      const top = stairPositions[3];
      expect(house.layers[top.y].rows[top.z - 1][top.x]).toBe("F");
    }
  });
});
