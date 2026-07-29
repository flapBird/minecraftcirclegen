# Minecraft Circle Gen

A free, client-side Minecraft circle blueprint generator for diameters from 3
to 512 blocks.

## Features

- Hollow, thick, and filled block circles
- High-DPI Canvas preview with zoom, pan, fit, and fullscreen controls
- Exact block and stack counts
- Row-by-row Builder Mode with local progress
- High-resolution PNG blueprint export
- Shareable URL parameters
- Server-rendered guides, FAQ, and legal pages

## Development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The local URL is printed by the development server.

The default commands use the native Next.js runtime and are suitable for
Vercel. The existing Sites/Cloudflare build remains available separately:

```bash
npm run dev:sites
npm run build:sites
```

## Validation

```bash
npm run test
npm run lint
npm run build
```

Circle calculations and Builder Mode progress run entirely in the browser. The
application does not require an account or application database.
