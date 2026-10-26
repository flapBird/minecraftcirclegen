export type PortalDirection = "ow2n" | "n2ow";
export type PortalEdition = "java" | "bedrock";

export type PortalCoords = { x: number; y: number; z: number };

/** World border clamps for converted coordinates, from the Minecraft Wiki. */
export const WORLD_BORDER_LIMIT = 29_999_983;
export const NETHER_Y_RANGE = { min: 0, max: 127 } as const;
export const OVERWORLD_Y_RANGE = { min: -64, max: 319 } as const;
export const SEARCH_RADIUS = {
  java: { toNether: 16, toOverworld: 128 },
  bedrock: { toNether: 128, toOverworld: 128 },
} as const;

export function convertPortalCoords(direction: PortalDirection, coords: PortalCoords): PortalCoords {
  if (direction === "ow2n") {
    return { x: Math.floor(coords.x / 8), y: coords.y, z: Math.floor(coords.z / 8) };
  }
  return { x: coords.x * 8, y: coords.y, z: coords.z * 8 };
}

export function destinationYRange(direction: PortalDirection): { min: number; max: number } {
  return direction === "ow2n" ? NETHER_Y_RANGE : OVERWORLD_Y_RANGE;
}

export function destinationDimensionId(direction: PortalDirection): string {
  return direction === "ow2n" ? "minecraft:the_nether" : "minecraft:overworld";
}

export function searchRadiusBlocks(direction: PortalDirection, edition: PortalEdition): number {
  return edition === "java"
    ? direction === "ow2n" ? SEARCH_RADIUS.java.toNether : SEARCH_RADIUS.java.toOverworld
    : SEARCH_RADIUS.bedrock.toNether;
}

export function destinationName(direction: PortalDirection): string {
  return direction === "ow2n" ? "the Nether" : "the Overworld";
}

export function isInsideWorldBorder(value: number): boolean {
  return Math.abs(value) <= WORLD_BORDER_LIMIT;
}

export function buildTeleportCommand(direction: PortalDirection, coords: PortalCoords): string {
  return `/execute in ${destinationDimensionId(direction)} run tp @s ${coords.x} ${coords.y} ${coords.z}`;
}

/**
 * Frame for a floor-standing 4×5 portal at the converted coordinates, laid along
 * the X axis. Portal orientation does not affect linking; light the 2×3 interior
 * with flint and steel.
 */
export function buildFrameCommands(coords: PortalCoords): string[] {
  const { x, y, z } = coords;
  return [
    `/fill ${x} ${y} ${z} ${x + 3} ${y} ${z} minecraft:obsidian`,
    `/fill ${x} ${y + 4} ${z} ${x + 3} ${y + 4} ${z} minecraft:obsidian`,
    `/fill ${x} ${y + 1} ${z} ${x} ${y + 3} ${z} minecraft:obsidian`,
    `/fill ${x + 3} ${y + 1} ${z} ${x + 3} ${y + 3} ${z} minecraft:obsidian`,
  ];
}

export function formatPortalCoords(coords: PortalCoords): string {
  return `${coords.x} ${coords.y} ${coords.z}`;
}
