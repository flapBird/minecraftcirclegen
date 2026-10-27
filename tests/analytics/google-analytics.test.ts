import { describe, expect, it } from "vitest";
import { getGoogleAnalyticsMeasurementId } from "@/components/analytics/google-analytics";

describe("getGoogleAnalyticsMeasurementId", () => {
  it("accepts and trims a GA4 Measurement ID", () => {
    expect(getGoogleAnalyticsMeasurementId("  G-ABC123XYZ  ")).toBe(
      "G-ABC123XYZ",
    );
  });

  it("falls back to the hard-coded default when no override is set", () => {
    // Bundlers inline a missing env var as an empty string, so both the
    // no-argument and empty-string cases must resolve to the default.
    expect(getGoogleAnalyticsMeasurementId()).toBe("G-9NM2YML7QR");
    expect(getGoogleAnalyticsMeasurementId("")).toBe("G-9NM2YML7QR");
    expect(getGoogleAnalyticsMeasurementId("   ")).toBe("G-9NM2YML7QR");
  });

  it("falls back to the hard-coded default on invalid overrides", () => {
    expect(getGoogleAnalyticsMeasurementId("UA-12345-1")).toBe(
      "G-9NM2YML7QR",
    );
    expect(getGoogleAnalyticsMeasurementId("not-an-id")).toBe(
      "G-9NM2YML7QR",
    );
  });
});
