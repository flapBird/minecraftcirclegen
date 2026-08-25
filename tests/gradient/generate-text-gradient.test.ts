import { describe, expect, it } from "vitest";
import { generateTextGradient, textGradientOutputs } from "@/lib/gradient/generate-text-gradient";

describe("text gradients", () => {
  it("keeps exact endpoint colors", () => {
    const result = generateTextGradient("ABC", ["#000000", "#FFFFFF"]);
    expect(result[0].hex).toBe("#000000");
    expect(result[2].hex).toBe("#FFFFFF");
  });

  it("produces valid Java tellraw JSON", () => {
    const outputs = textGradientOutputs(generateTextGradient('A"B', ["#FF0000", "#00FF00"]), ["#FF0000", "#00FF00"]);
    expect(() => JSON.parse(outputs.tellraw.replace("/tellraw @a ", ""))).not.toThrow();
  });
});
