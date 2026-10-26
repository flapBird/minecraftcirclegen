import { circleMistakesGuide } from "./articles/circle-mistakes";
import { domeRoofGuide } from "./articles/dome-roof-guide";
import { netherPortalNetworkGuide } from "./articles/nether-portal-network";
import { ovalBlueprintGuide } from "./articles/oval-blueprint-guide";
import { roundTowersGuide } from "./articles/round-towers";
import { sphereLayerGuide } from "./articles/sphere-layer-guide";
import { guideReadingMinutes, type Guide } from "./types";

export const GUIDES: Guide[] = [
  circleMistakesGuide,
  roundTowersGuide,
  sphereLayerGuide,
  domeRoofGuide,
  ovalBlueprintGuide,
  netherPortalNetworkGuide,
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

export function otherGuides(slug: string): Guide[] {
  return GUIDES.filter((guide) => guide.slug !== slug);
}

export { guideReadingMinutes };
export type { Guide };
