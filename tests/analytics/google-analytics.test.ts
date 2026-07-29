import { describe, expect, it } from "vitest";
import { getGoogleAnalyticsMeasurementId } from "@/components/analytics/google-analytics";

describe("getGoogleAnalyticsMeasurementId", () => {
  it("accepts and trims a GA4 Measurement ID", () => {
    expect(getGoogleAnalyticsMeasurementId("  G-ABC123XYZ  ")).toBe(
      "G-ABC123XYZ",
    );
  });

  it("rejects missing and invalid values", () => {
    expect(getGoogleAnalyticsMeasurementId()).toBeNull();
    expect(getGoogleAnalyticsMeasurementId("UA-12345-1")).toBeNull();
    expect(getGoogleAnalyticsMeasurementId("not-an-id")).toBeNull();
  });
});
