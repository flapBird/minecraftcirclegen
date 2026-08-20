import { normalizeGradientOptions } from "./generate-gradient";
import type { GradientOptions, GradientPalette } from "./gradient-types";

export const DEFAULT_GRADIENT_OPTIONS: GradientOptions = {
  startColor: "#ece5d8",
  endColor: "#505052",
  steps: 8,
  palette: "stone",
  endpointMode: "block",
  startBlockId: "quartz_block",
  endBlockId: "deepslate",
};

export function parseGradientOptions(query: string): GradientOptions {
  const params = new URLSearchParams(query);
  const hasLegacyColorQuery = params.has("start") || params.has("end");
  return normalizeGradientOptions({
    startColor: params.get("start") ?? DEFAULT_GRADIENT_OPTIONS.startColor,
    endColor: params.get("end") ?? DEFAULT_GRADIENT_OPTIONS.endColor,
    steps: Number(params.get("steps") ?? DEFAULT_GRADIENT_OPTIONS.steps),
    palette: (params.get("palette") ?? (hasLegacyColorQuery ? "all" : DEFAULT_GRADIENT_OPTIONS.palette)) as GradientPalette,
    endpointMode: (params.get("mode") ?? (hasLegacyColorQuery ? "color" : DEFAULT_GRADIENT_OPTIONS.endpointMode)) as "block" | "color",
    startBlockId: params.get("startBlock") ?? DEFAULT_GRADIENT_OPTIONS.startBlockId,
    endBlockId: params.get("endBlock") ?? DEFAULT_GRADIENT_OPTIONS.endBlockId,
  });
}

export function serializeGradientOptions(options: GradientOptions) {
  const normalized = normalizeGradientOptions(options);
  const params = new URLSearchParams({
    start: normalized.startColor.slice(1),
    end: normalized.endColor.slice(1),
    steps: String(normalized.steps),
    palette: normalized.palette,
    mode: normalized.endpointMode ?? "color",
  });
  if (normalized.startBlockId) params.set("startBlock", normalized.startBlockId);
  if (normalized.endBlockId) params.set("endBlock", normalized.endBlockId);
  return params;
}
