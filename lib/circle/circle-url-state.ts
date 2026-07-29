import type { CircleMode, CircleOptions } from "./circle-types";
import {
  DEFAULT_DIAMETER,
  DEFAULT_MODE,
  DEFAULT_THICKNESS,
  MAX_DIAMETER,
  MIN_DIAMETER,
  getMaxThickness,
} from "./circle-utils";

const MODES: CircleMode[] = ["hollow", "thick", "filled"];

function parseInteger(value: string | null): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function parseCircleUrl(search: string): CircleOptions {
  const params = new URLSearchParams(search);
  const parsedDiameter = parseInteger(params.get("diameter"));
  const diameter =
    parsedDiameter !== null &&
    parsedDiameter >= MIN_DIAMETER &&
    parsedDiameter <= MAX_DIAMETER
      ? parsedDiameter
      : DEFAULT_DIAMETER;
  const rawMode = params.get("mode") as CircleMode | null;
  const mode = rawMode && MODES.includes(rawMode) ? rawMode : DEFAULT_MODE;
  const parsedThickness = parseInteger(params.get("thickness"));
  const thickness =
    parsedThickness !== null &&
    parsedThickness >= 1 &&
    parsedThickness <= getMaxThickness(diameter)
      ? parsedThickness
      : mode === "hollow"
        ? 1
        : DEFAULT_THICKNESS;

  return { diameter, mode, thickness };
}

export function serializeCircleUrl(options: CircleOptions): string {
  const params = new URLSearchParams();

  if (options.diameter !== DEFAULT_DIAMETER) {
    params.set("diameter", String(options.diameter));
  }
  if (options.mode !== DEFAULT_MODE) {
    params.set("mode", options.mode);
  }
  if (
    options.mode === "thick" &&
    options.thickness !== DEFAULT_THICKNESS
  ) {
    params.set("thickness", String(options.thickness));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}
