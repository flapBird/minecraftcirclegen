import type { NextConfig } from "next";
import { buildContentSecurityPolicy } from "./lib/site/security-headers";

const developmentScriptSource =
  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

// AdSense vendors may change: this scoped allowlist fixes known loader endpoints,
// but is not a substitute for Google's nonce-based strict CSP integration.
// The policy lives in lib/site/security-headers.ts so the Cloudflare Worker
// deployment cannot drift from the Next.js build.
const contentSecurityPolicy = buildContentSecurityPolicy({
  developmentScriptSource,
});

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
