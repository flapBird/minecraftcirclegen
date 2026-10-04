import { expect, it } from "vitest";
import { imageArtCsv } from "@/lib/image-art/export-image-art-csv";
import { convertRasterToBlocks } from "@/lib/image-art/convert-image-art";

it("exports exact cells, empty spaces and map boundaries with stable material numbers", () => {
  const result = convertRasterToBlocks({ raster: { width: 129, height: 1, data: new Uint8ClampedArray(129 * 4).fill(255) }, mode: "map", palette: "common", dither: false, backgroundColor: "#ffffff", transparentPixels: false });
  result.cells[0][0] = null;
  const rows = imageArtCsv(result, "map").split("\r\n");
  expect(rows).toHaveLength(130);
  expect(rows[1]).toContain('"0","0","","Empty","",""');
  expect(rows[128]).toContain('"127","0","1"');
  expect(rows[128]).toMatch(/"1","1","127","0"$/);
  expect(rows[129]).toMatch(/"2","1","0","0"$/);
  expect(rows[129]).toContain(result.cells[0][128]!.name);
  expect(imageArtCsv(result, "pixel").split("\r\n")[0]).not.toContain("map_column");
});
