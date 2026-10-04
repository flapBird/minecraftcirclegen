import type { ImageArtMode, ImageArtResult } from "./image-art-types";

const csvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

/** Top-left is (0, 0); x increases right, z increases down. Palette IDs are not command IDs. */
export function imageArtCsv(result: ImageArtResult, mode: ImageArtMode) {
  const rows: Array<Array<string | number>> = [["x", "z", "material_number", "material", "palette_id", "hex", ...(mode === "map" ? ["map_column", "map_row", "local_x", "local_z"] : [])]];
  const numbers = new Map(result.materials.map(({ block }, index) => [block.id, index + 1]));
  result.cells.forEach((row, z) => row.forEach((block, x) => {
    rows.push([x, z, block ? numbers.get(block.id) ?? "" : "", block?.name ?? "Empty", block?.id ?? "", block?.hex ?? "",
      ...(mode === "map" ? [Math.floor(x / 128) + 1, Math.floor(z / 128) + 1, x % 128, z % 128] : [])]);
  }));
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export function downloadImageArtCsv(result: ImageArtResult, mode: ImageArtMode) {
  const url = URL.createObjectURL(new Blob([imageArtCsv(result, mode)], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `minecraft-${mode}-art-coordinates.csv`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
