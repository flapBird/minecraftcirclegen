import type { PortalCoords, PortalDirection, PortalEdition } from "./portal-math";

export type PortalUrlState = {
  direction: PortalDirection;
  edition: PortalEdition;
  coords: PortalCoords;
};

export const PORTAL_DEFAULTS: PortalUrlState = {
  direction: "ow2n",
  edition: "java",
  coords: { x: 100, y: 64, z: -200 },
};

const DIRECTIONS = new Set<PortalDirection>(["ow2n", "n2ow"]);
const EDITIONS = new Set<PortalEdition>(["java", "bedrock"]);

function integer(params: URLSearchParams, key: string, fallback: number): number {
  const value = params.get(key);
  if (value === null || !/^-?\d+$/.test(value)) return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) return fallback;
  return parsed;
}

export function parsePortalUrl(search: string): PortalUrlState {
  const params = new URLSearchParams(search);
  const direction = params.get("dir") as PortalDirection | null;
  const edition = params.get("edition") as PortalEdition | null;
  return {
    direction: direction && DIRECTIONS.has(direction) ? direction : PORTAL_DEFAULTS.direction,
    edition: edition && EDITIONS.has(edition) ? edition : PORTAL_DEFAULTS.edition,
    coords: {
      x: integer(params, "x", PORTAL_DEFAULTS.coords.x),
      y: integer(params, "y", PORTAL_DEFAULTS.coords.y),
      z: integer(params, "z", PORTAL_DEFAULTS.coords.z),
    },
  };
}

export function serializePortalUrl(state: PortalUrlState): string {
  const params = new URLSearchParams();
  if (state.direction !== PORTAL_DEFAULTS.direction) params.set("dir", state.direction);
  if (state.edition !== PORTAL_DEFAULTS.edition) params.set("edition", state.edition);
  if (state.coords.x !== PORTAL_DEFAULTS.coords.x) params.set("x", String(state.coords.x));
  if (state.coords.y !== PORTAL_DEFAULTS.coords.y) params.set("y", String(state.coords.y));
  if (state.coords.z !== PORTAL_DEFAULTS.coords.z) params.set("z", String(state.coords.z));
  const query = params.toString();
  return query ? `?${query}` : "";
}
