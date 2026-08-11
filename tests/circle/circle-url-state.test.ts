import { describe, expect, it } from "vitest";
import {
  parseCircleUrl,
  serializeCircleUrl,
} from "@/lib/circle/circle-url-state";

describe("circle URL state", () => {
  it("keeps the homepage URL clean for the default circle", () => {
    expect(
      serializeCircleUrl({
        diameter: 21,
        mode: "hollow",
        thickness: 1,
      }),
    ).toBe("");
  });

  it("only includes parameters that differ from the defaults", () => {
    expect(
      serializeCircleUrl({
        diameter: 31,
        mode: "hollow",
        thickness: 1,
      }),
    ).toBe("?diameter=31");

    expect(
      serializeCircleUrl({
        diameter: 21,
        mode: "filled",
        thickness: 2,
      }),
    ).toBe("?mode=filled");

    expect(
      serializeCircleUrl({
        diameter: 21,
        mode: "thick",
        thickness: 3,
      }),
    ).toBe("?mode=thick&thickness=3");
  });

  it("restores defaults from a clean URL", () => {
    expect(parseCircleUrl("")).toEqual({
      diameter: 21,
      mode: "hollow",
      thickness: 1,
    });
  });

  it("ignores hidden thickness for hollow and filled links", () => {
    expect(parseCircleUrl("?mode=hollow&thickness=10").thickness).toBe(1);
    expect(parseCircleUrl("?mode=filled&thickness=10").thickness).toBe(2);
  });
});
