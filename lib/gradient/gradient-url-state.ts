import { normalizeGradientOptions } from "./generate-gradient";
import type { GradientOptions, GradientPalette } from "./gradient-types";

export const DEFAULT_GRADIENT_OPTIONS: GradientOptions = {
  startColor: "#eee5cf",
  endColor: "#26352c",
  steps: 8,
  palette: "all",
};

export function parseGradientOptions(query: string): GradientOptions {
  const params = new URLSearchParams(query);
  return normalizeGradientOptions({
    startColor: params.get("start") ?? DEFAULT_GRADIENT_OPTIONS.startColor,
    endColor: params.get("end") ?? DEFAULT_GRADIENT_OPTIONS.endColor,
    steps: Number(params.get("steps") ?? DEFAULT_GRADIENT_OPTIONS.steps),
    palette: (params.get("palette") ?? DEFAULT_GRADIENT_OPTIONS.palette) as GradientPalette,
  });
}

export function serializeGradientOptions(options: GradientOptions) {
  const normalized = normalizeGradientOptions(options);
  return new URLSearchParams({
    start: normalized.startColor.slice(1),
    end: normalized.endColor.slice(1),
    steps: String(normalized.steps),
    palette: normalized.palette,
  });
}
