/**
 * Canonical Content-Security-Policy shared by next.config.ts (Next.js build)
 * and worker/index.ts (Cloudflare Worker runtime) so the two deployments
 * cannot drift apart.
 */
export function buildContentSecurityPolicy({
  developmentScriptSource = "",
}: {
  developmentScriptSource?: string;
} = {}): string {
  return [
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
}
