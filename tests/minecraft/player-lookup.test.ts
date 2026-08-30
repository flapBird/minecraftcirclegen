import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formatMinecraftUuid,
  validateMinecraftUsername,
  validateMinecraftUuid,
} from "@/lib/minecraft/player-identifiers";
import { lookupMinecraftPlayer } from "@/lib/minecraft/player-service";

afterEach(() => vi.unstubAllGlobals());

describe("Minecraft player lookup", () => {
  it("validates username length and characters", () => {
    expect(validateMinecraftUsername("ab").error).toMatch(/too short/i);
    expect(validateMinecraftUsername("abcdefghijklmnopq").error).toMatch(/too long/i);
    expect(validateMinecraftUsername("bad-name").error).toMatch(/letters, numbers, and underscores/i);
    expect(validateMinecraftUsername("Notch")).toEqual({ value: "Notch", error: null });
  });

  it("normalizes compact and hyphenated UUIDs", () => {
    const compact = "069A79F444E94726A5BEFCA90E38AAF5";
    expect(validateMinecraftUuid(compact).value).toBe(compact.toLowerCase());
    expect(validateMinecraftUuid("069a79f4-44e9-4726-a5be-fca90e38aaf5").value).toBe(compact.toLowerCase());
    expect(formatMinecraftUuid(compact)).toBe("069a79f4-44e9-4726-a5be-fca90e38aaf5");
    expect(validateMinecraftUuid("not-a-uuid").error).toMatch(/32-character UUID/i);
  });

  it("combines Mojang profile and session texture data", async () => {
    const id = "11111111222243338444555555555555";
    const textureValue = btoa(JSON.stringify({
      textures: { SKIN: { url: "http://textures.minecraft.net/texture/abcdef" } },
    }));
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ id, name: "UnitTester" }))
      .mockResolvedValueOnce(Response.json({ id, name: "UnitTester", properties: [{ name: "textures", value: textureValue }] }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupMinecraftPlayer("username", "UnitTester")).resolves.toEqual({
      username: "UnitTester",
      uuid: "11111111-2222-4333-8444-555555555555",
      uuidCompact: id,
      skinUrl: "https://textures.minecraft.net/texture/abcdef",
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("distinguishes not found, rate limited, and upstream failures", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response("{}", { status: 404 }))
      .mockResolvedValueOnce(new Response("{}", { status: 429 }))
      .mockRejectedValueOnce(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(lookupMinecraftPlayer("username", "NoUserAlpha")).resolves.toBeNull();
    await expect(lookupMinecraftPlayer("username", "BusyUserBeta")).rejects.toMatchObject({ code: "rate_limited" });
    await expect(lookupMinecraftPlayer("username", "FailUserGamma")).rejects.toMatchObject({ code: "upstream_error" });
  });
});
