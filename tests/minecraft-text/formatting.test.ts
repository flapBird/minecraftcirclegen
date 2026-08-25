import { describe, expect, it } from "vitest";
import { DEFAULT_TEXT_STYLES, makeMiniMessage, makeMotdText, makeTellraw } from "@/lib/minecraft-text/formatting";

describe("Minecraft text formatting", () => {
  it("escapes section signs for server.properties", () => {
    expect(makeMotdText("Welcome", "a", DEFAULT_TEXT_STYLES)).toBe("\\u00A7aWelcome");
  });

  it("JSON-encodes unsafe tellraw input", () => {
    const command = makeTellraw('Hello "Alex"\nNext', "c", DEFAULT_TEXT_STYLES);
    const json = command.replace("/tellraw @a ", "");
    expect(JSON.parse(json)).toMatchObject({ text: 'Hello "Alex"\nNext', color: "red" });
  });

  it("escapes user-authored MiniMessage tags", () => {
    expect(makeMiniMessage("<click:run_command:/op @s>Hi", "a", DEFAULT_TEXT_STYLES))
      .toContain("\\<click:run_command:/op @s>Hi");
  });
});
