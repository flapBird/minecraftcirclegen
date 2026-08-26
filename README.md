# Minecraft Circle Gen

[Minecraft Circle Gen](https://minecraftcirclegen.com) is a free collection of browser-based tools for planning Minecraft builds, artwork, banners, and formatted server text. It turns dimensions, text, colors, or uploaded images into practical block-by-block blueprints with material counts and downloadable exports.

The generators run in the browser, require no account, and do not depend on an application database. Uploaded artwork is processed locally rather than sent to an image-processing service.

## What is included

### Build and shape tools

- **Circle Generator** — Create hollow or filled circles from 3 to 512 blocks in diameter.
- **Oval Generator** — Generate stretched circles with independent width and height controls.
- **Sphere Generator** — Follow layer-by-layer plans for complete block spheres.
- **Dome Generator** — Build hemisphere roofs from base to peak.
- **Shape Generator** — Plan circles, polygons, stars, cylinders, cones, pyramids, and other 2D or 3D forms.

### Art and design tools

- **Pixel Art Generator** — Convert PNG, JPG, WebP, or GIF images into block grids and material lists.
- **Map Art Generator** — Prepare flat artwork in Minecraft's 128 x 128 map-tile format.
- **Font Generator** — Turn text into pixel lettering with colors, gradients, outlines, and shadows.
- **Banner Maker** — Combine banner patterns, review loom steps, save designs locally, and copy Java commands.

### Text and server tools

- **Text Generator** — Produce formatted chat, MOTD, MiniMessage, and safe `tellraw` output.
- **Gradient Generator** — Create RGB text gradients or buildable vanilla-block palettes.
- **Color Codes** — Preview and copy Minecraft color and formatting codes.

The site also includes curated house-design collections and interactive house blueprints with material totals and downloadable SVG layers.

## Highlights

- Live Canvas previews with grid, coordinate, zoom, pan, fit, and fullscreen controls where applicable
- Exact block totals, stack calculations, material lists, and layer navigation
- PNG and SVG exports for printable or second-screen build references
- Shareable URLs that restore supported generator settings
- Responsive keyboard- and touch-friendly interface
- SEO metadata, structured data, sitemap, robots rules, web manifest, and security headers
- Unit and component tests for generators, URL state, exports, navigation, and blueprint data

## Tech stack

- [Next.js 16](https://nextjs.org/) App Router
- [React 19](https://react.dev/) and TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/) plus project-wide styles
- HTML Canvas for interactive previews and bitmap exports
- [Vitest](https://vitest.dev/) and Testing Library
- Optional Cloudflare-compatible development and builds through [Vinext](https://github.com/cloudflare/vinext)

## Getting started

### Requirements

- Node.js 22.13.0 or newer
- npm (the repository includes a `package-lock.json`)

### Install and run

```bash
git clone https://github.com/flapBird/minecraftcirclegen.git
cd minecraftcirclegen
npm install
cp .env.example .env.local # optional: configure Google Analytics
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The application works without environment variables. To enable Google Analytics, set the following value in `.env.local`:

```dotenv
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production Next.js build using webpack. |
| `npm run start` | Serve the production Next.js build. |
| `npm run lint` | Run ESLint across the project. |
| `npm run typecheck` | Check TypeScript types without emitting files. |
| `npm run test` | Run the Vitest suite once. |
| `npm run dev:sites` | Start the Vinext/Cloudflare development environment. |
| `npm run build:sites` | Create the Vinext/Cloudflare production build. |
| `npm run start:sites` | Serve the built Vinext/Cloudflare application. |

## Project structure

```text
app/                  Next.js routes, metadata, sitemap, and legal/content pages
components/           Interactive generators and shared layout components
lib/                  Geometry, export, formatting, palette, and URL-state logic
public/               Icons, social artwork, and Minecraft block textures
tests/                Vitest unit and React component tests
worker/               Cloudflare Worker entry point and response headers
build/                Sites/Vite integration helpers
.openai/hosting.json  Sites project configuration
```

The `@/*` TypeScript alias resolves from the repository root. Generator calculations and export helpers live under `lib/`, while browser interaction and rendering remain in `components/`.

## Validation

Run the complete local check before submitting a change:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Tests use the `jsdom` environment and are discovered under `tests/**/*.test.{ts,tsx}`.

## Deployment

The standard Next.js production path is:

```bash
npm run build
npm run start
```

The repository also includes configuration for Vercel (`vercel.json`) and a Vinext-based Cloudflare/Sites runtime (`vite.config.ts`, `worker/`, and `.openai/hosting.json`). Use the corresponding `*:sites` scripts when developing or validating that runtime.

## Live site

[minecraftcirclegen.com](https://minecraftcirclegen.com)
