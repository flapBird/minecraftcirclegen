import { lookupMinecraftPlayer, PlayerLookupError } from "@/lib/minecraft/player-service";
import type { PlayerLookupKind } from "@/lib/minecraft/player-identifiers";
import type { PlayerLookupErrorResponse, PlayerLookupSuccessResponse } from "@/lib/minecraft/player-lookup-types";

interface RateWindow {
  count: number;
  resetAt: number;
}

const RATE_WINDOWS = new Map<string, RateWindow>();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;
const MAX_RATE_KEYS = 2_000;

function responseHeaders(cacheControl: string) {
  return {
    "Cache-Control": cacheControl,
    "Content-Type": "application/json; charset=utf-8",
  };
}

function jsonError(code: PlayerLookupErrorResponse["error"]["code"], message: string, status: number) {
  const body: PlayerLookupErrorResponse = { status: "error", error: { code, message } };
  return Response.json(body, {
    status,
    headers: responseHeaders("private, no-store"),
  });
}

function clientKey(request: Request) {
  return request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = RATE_WINDOWS.get(key);
  if (!current || current.resetAt <= now) {
    if (RATE_WINDOWS.size >= MAX_RATE_KEYS) RATE_WINDOWS.clear();
    RATE_WINDOWS.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
}

export async function GET(request: Request) {
  if (isRateLimited(clientKey(request))) {
    return jsonError("rate_limited", "Too many lookups. Please wait a minute and try again.", 429);
  }

  const searchParams = new URL(request.url).searchParams;
  const kind = searchParams.get("kind");
  const value = searchParams.get("value") ?? "";
  if (kind !== "username" && kind !== "uuid") {
    return jsonError("invalid_input", "Choose a username or UUID lookup.", 400);
  }

  try {
    const player = await lookupMinecraftPlayer(kind as PlayerLookupKind, value);
    if (!player) {
      return jsonError(
        "not_found",
        kind === "username"
          ? "No current Java profile was found for this username."
          : "No current Java profile was found for this UUID.",
        404,
      );
    }
    const body: PlayerLookupSuccessResponse = { status: "found", player };
    return Response.json(body, {
      headers: responseHeaders("public, max-age=60, s-maxage=300, stale-while-revalidate=3600"),
    });
  } catch (error) {
    if (error instanceof PlayerLookupError) {
      const status = error.code === "invalid_input" ? 400 : error.code === "rate_limited" ? 429 : 502;
      return jsonError(error.code, error.message, status);
    }
    return jsonError("upstream_error", "Player lookup failed. Please try again.", 502);
  }
}
