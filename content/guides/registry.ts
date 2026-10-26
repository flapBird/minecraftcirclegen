import { circleMistakesGuide } from "./articles/circle-mistakes";
import { netherPortalNetworkGuide } from "./articles/nether-portal-network";
import { roundTowersGuide } from "./articles/round-towers";
import { guideReadingMinutes, type Guide } from "./types";

export const GUIDES: Guide[] = [
  circleMistakesGuide,
  roundTowersGuide,
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
