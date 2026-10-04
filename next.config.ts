import type { NextConfig } from "next";

const developmentScriptSource =
  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

// AdSense vendors may change: this scoped allowlist fixes known loader endpoints,
// but is not a substitute for Google's nonce-based strict CSP integration.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${developmentScriptSource} https://www.googletagmanager.com https://*.clarity.ms https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://www.googleadservices.com https://googleads.g.doubleclick.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://textures.minecraft.net https://*.clarity.ms https://c.bing.com https://*.googlesyndication.com https://*.doubleclick.net https://www.google.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms https://c.bing.com https://*.googlesyndication.com https://*.doubleclick.net https://www.google.com ws: wss:",
  "frame-src https://*.googlesyndication.com https://*.doubleclick.net https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

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
