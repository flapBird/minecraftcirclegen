import type { CircleMode } from "@/lib/circle/circle-types";
import { getLayerCount, maxSizeForShape, MIN_GEOMETRY_SIZE } from "./generate-geometry";
import type { GeometryOptions, GeometryShape } from "./geometry-types";

const DEFAULTS: GeometryOptions = {
  diameter: 21,
  width: 21,
  height: 15,
  mode: "hollow",
  thickness: 2,
  layer: 1,
};

function integer(params: URLSearchParams, key: string, fallback: number, min: number, max: number) {
  const value = params.get(key);
  if (!value || !/^\d+$/.test(value)) return fallback;
  return Math.max(min, Math.min(max, Number(value)));
}

export function parseGeometryUrl(shape: GeometryShape, search: string): GeometryOptions {
  const params = new URLSearchParams(search);
  const max = maxSizeForShape(shape);
  const diameter = integer(params, "diameter", DEFAULTS.diameter, MIN_GEOMETRY_SIZE, max);
  const width = integer(params, "width", DEFAULTS.width, MIN_GEOMETRY_SIZE, max);
  const height = integer(params, "height", DEFAULTS.height, MIN_GEOMETRY_SIZE, max);
  const candidateMode = params.get("mode") as CircleMode | null;
  const allowedModes: CircleMode[] = shape === "sphere" || shape === "dome"
    ? ["hollow", "filled"]
    : ["hollow", "thick", "filled"];
  const mode = candidateMode && allowedModes.includes(candidateMode) ? candidateMode : DEFAULTS.mode;
  const thicknessBase = shape === "oval" ? Math.min(width, height) : diameter;
  const thickness = integer(params, "thickness", DEFAULTS.thickness, 1, Math.ceil(thicknessBase / 2));
  const layer = integer(params, "layer", 1, 1, getLayerCount(shape, diameter));
  return { diameter, width, height, mode, thickness, layer };
}

export function serializeGeometryUrl(shape: GeometryShape, options: GeometryOptions) {
  const params = new URLSearchParams();
  if (shape === "oval") {
    if (options.width !== DEFAULTS.width) params.set("width", String(options.width));
    if (options.height !== DEFAULTS.height) params.set("height", String(options.height));
  } else if (options.diameter !== DEFAULTS.diameter) {
    params.set("diameter", String(options.diameter));
  }
  if (options.mode !== DEFAULTS.mode) params.set("mode", options.mode);
  if (options.mode === "thick" && options.thickness !== DEFAULTS.thickness) {
    params.set("thickness", String(options.thickness));
  }
  if ((shape === "sphere" || shape === "dome") && options.layer !== 1) {
    params.set("layer", String(options.layer));
  }
  return params;
}
