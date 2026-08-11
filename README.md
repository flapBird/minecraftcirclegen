# Minecraft Circle Gen

Minecraft Circle Gen is a free online Minecraft circle generator that creates
practical block-by-block blueprints for circular builds.

Website: https://minecraftcirclegen.com

## Main Features

- Generate circles from 3 to 512 blocks in diameter
- Choose Hollow, Thick, or Filled circle modes
- Preview the complete blueprint on a high-resolution Canvas grid
- Display center axes and relative coordinates
- Zoom, fit, pan, and fullscreen the blueprint view
- Calculate exact block totals, stacks of 64, and remaining blocks
- Export a high-resolution PNG blueprint with configurable grid, axes,
  coordinates, and background
- Copy a shareable link that restores the selected circle settings
- Use the generator on desktop, tablet, and mobile devices

All circle calculations run locally in the browser. The project does not
require an account or application database.

## Local Development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run test
npm run build
```
