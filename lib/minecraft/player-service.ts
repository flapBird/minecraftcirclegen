import { formatMinecraftUuid, validatePlayerLookup, type PlayerLookupKind } from "./player-identifiers";
import type { MinecraftPlayerProfile, PlayerLookupErrorCode } from "./player-lookup-types";

interface MojangBasicProfile {
  id: string;
  name: string;
}

interface MojangSessionProfile extends MojangBasicProfile {
  properties?: Array<{ name?: string; value?: string }>;
}

interface TexturePayload {
  textures?: { SKIN?: { url?: string } };
}

interface CacheEntry {
  expiresAt: number;
  value: MinecraftPlayerProfile | null;
}

export class PlayerLookupError extends Error {
  constructor(
    public readonly code: PlayerLookupErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PlayerLookupError";
  }
}

const PROFILE_CACHE = new Map<string, CacheEntry>();
const FOUND_TTL_MS = 5 * 60 * 1000;
const NOT_FOUND_TTL_MS = 60 * 1000;
const UPSTREAM_TIMEOUT_MS = 6_000;
const MAX_CACHE_ENTRIES = 1_000;

function isBasicProfile(value: unknown): value is MojangBasicProfile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Partial<MojangBasicProfile>;
  return typeof profile.id === "string"
    && /^[0-9a-fA-F]{32}$/.test(profile.id)
    && typeof profile.name === "string";
}

function cacheGet(key: string) {
  const entry = PROFILE_CACHE.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    PROFILE_CACHE.delete(key);
    return undefined;
  }
  return entry.value;
}

function cacheSet(key: string, value: MinecraftPlayerProfile | null) {
  if (PROFILE_CACHE.size >= MAX_CACHE_ENTRIES) {
    const firstKey = PROFILE_CACHE.keys().next().value as string | undefined;
    if (firstKey) PROFILE_CACHE.delete(firstKey);
  }
  PROFILE_CACHE.set(key, {
    value,
    expiresAt: Date.now() + (value ? FOUND_TTL_MS : NOT_FOUND_TTL_MS),
  });
}

async function fetchMojangJson(url: URL) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    return await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
  } catch {
    throw new PlayerLookupError(
      "upstream_error",
      "Minecraft profile services did not respond. Please try again.",
    );
  } finally {
    clearTimeout(timeout);
  }
}

function decodeSkinUrl(profile: MojangSessionProfile) {
  const encoded = profile.properties?.find((property) => property.name === "textures")?.value;
  if (!encoded) return null;
  try {
    const payload = JSON.parse(atob(encoded)) as TexturePayload;
    const rawUrl = payload.textures?.SKIN?.url;
    if (!rawUrl) return null;
    const url = new URL(rawUrl);
    if (url.hostname !== "textures.minecraft.net" || !url.pathname.startsWith("/texture/")) return null;
    url.protocol = "https:";
    return url.toString();
  } catch {
    return null;
  }
}

function toPlayer(profile: MojangSessionProfile): MinecraftPlayerProfile {
  const uuidCompact = profile.id.toLowerCase();
  return {
    username: profile.name,
    uuid: formatMinecraftUuid(uuidCompact),
    uuidCompact,
    skinUrl: decodeSkinUrl(profile),
  };
}

function throwForUpstreamStatus(response: Response): never {
  if (response.status === 429) {
    throw new PlayerLookupError("rate_limited", "Minecraft profile services are busy. Please wait and try again.");
  }
  throw new PlayerLookupError("upstream_error", "Minecraft profile services returned an error. Please try again.");
}

async function sessionProfile(uuidCompact: string) {
  const url = new URL(`https://sessionserver.mojang.com/session/minecraft/profile/${uuidCompact}`);
  const response = await fetchMojangJson(url);
  if (response.status === 204 || response.status === 404) return null;
  if (!response.ok) throwForUpstreamStatus(response);
  const value: unknown = await response.json();
  if (!isBasicProfile(value)) throwForUpstreamStatus(response);
  return value as MojangSessionProfile;
}

async function lookupUsername(username: string) {
  const cacheKey = `username:${username.toLowerCase()}`;
  const cached = cacheGet(cacheKey);
  if (cached !== undefined) return cached;

  const url = new URL(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`);
  const response = await fetchMojangJson(url);
  if (response.status === 204 || response.status === 404) {
    cacheSet(cacheKey, null);
    return null;
  }
  if (!response.ok) throwForUpstreamStatus(response);
  const basic: unknown = await response.json();
  if (!isBasicProfile(basic)) throwForUpstreamStatus(response);

  let fullProfile: MojangSessionProfile = basic;
  try {
    fullProfile = await sessionProfile(basic.id) ?? basic;
  } catch (error) {
    if (error instanceof PlayerLookupError && error.code === "rate_limited") throw error;
  }
  const player = toPlayer(fullProfile);
  cacheSet(cacheKey, player);
  cacheSet(`uuid:${player.uuidCompact}`, player);
  return player;
}

async function lookupUuid(uuidCompact: string) {
  const cacheKey = `uuid:${uuidCompact}`;
  const cached = cacheGet(cacheKey);
  if (cached !== undefined) return cached;

  const profile = await sessionProfile(uuidCompact);
  if (!profile) {
    cacheSet(cacheKey, null);
    return null;
  }
  const player = toPlayer(profile);
  cacheSet(cacheKey, player);
  cacheSet(`username:${player.username.toLowerCase()}`, player);
  return player;
}

export async function lookupMinecraftPlayer(kind: PlayerLookupKind, rawValue: string) {
  const validation = validatePlayerLookup(kind, rawValue);
  if (!validation.value) {
    throw new PlayerLookupError("invalid_input", validation.error ?? "Invalid player lookup input.");
  }
  return kind === "username"
    ? lookupUsername(validation.value)
    : lookupUuid(validation.value);
}
