// Generates self-contained 1200x630 HTML cards for OG screenshots (real CSS grid,
// avoiding satori layout quirks). Captured by the browser into public/og/*.png.
import { mkdirSync, writeFileSync } from "node:fs";

const CELL = 13;
const BLOCK = "#4d7f47";
const GRID = "#dfe5da";

function circleCells(diameter) {
  const center = (diameter - 1) / 2;
  const radius = diameter / 2;
  const cells = new Set();
  for (let y = 0; y < diameter; y += 1) {
    for (let x = 0; x < diameter; x += 1) {
      const dx = x - center;
      const dy = y - center;
      if (dx * dx + dy * dy > radius * radius) continue;
      const inner = (diameter - 2) / 2;
      if (x === 0 || y === 0 || x === diameter - 1 || y === diameter - 1 || dx * dx + dy * dy > inner * inner) {
        cells.add(`${x},${y}`);
      }
    }
  }
  return cells;
}

function circleGrid(diameter) {
  const cells = circleCells(diameter);
  const divs = [];
  for (let y = 0; y < diameter; y += 1) {
    for (let x = 0; x < diameter; x += 1) {
      const filled = cells.has(`${x},${y}`);
      divs.push(`<i class="${filled ? "b" : "e"}"></i>`);
    }
  }
  return `<div class="grid" style="grid-template-columns:repeat(${diameter},${CELL}px)">${divs.join("")}</div>`;
}

function portalFrame() {
  const width = 8;
  const height = 6;
  const cell = 34;
  const divs = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const isFrame = y === 0 || y === height - 1 || x === 0 || x === width - 1;
      const isInterior = !isFrame && x > 0 && x < width - 1 && y > 0 && y < height - 1;
      divs.push(`<i class="${isFrame ? "o" : isInterior ? "p" : "e"}" style="width:${cell}px;height:${cell}px"></i>`);
    }
  }
  return `<div class="grid" style="grid-template-columns:repeat(${width},${cell}px)">${divs.join("")}</div>`;
}

const baseCss = `
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; }
  .card {
    width: 1200px; height: 630px; background: #f4f1e7;
    display: flex; align-items: center; justify-content: space-between;
    padding: 72px; font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .copy { display: flex; flex-direction: column; width: 640px; }
  .eyebrow { font-size: 26px; letter-spacing: 4px; color: #6b7a68; margin-bottom: 24px; font-weight: 600; }
  h1 { font-size: 54px; font-weight: 700; color: #1f2a1d; line-height: 1.15; }
  .sub { font-size: 28px; color: #5d685f; margin-top: 32px; }
  .url { font-size: 28px; color: #5d685f; margin-top: 16px; }
  .grid {
    display: grid; background: #fff; border: 2px solid #d1cdc0;
    border-radius: 16px; padding: 10px;
  }
  .grid i { display: block; width: ${CELL}px; height: ${CELL}px; }
  .grid i.b { background: ${BLOCK}; }
  .grid i.e { box-shadow: inset 0 0 0 0.5px ${GRID}; }
  .grid i.o { background: #2c2438; }
  .grid i.p { background: #8a5fc4; }
  .stack { display: flex; flex-direction: column; align-items: flex-end; gap: 18px; }
`;

function card({ eyebrow, title, sub, url, visual }) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseCss}</style></head>
<body><div class="card">
  <div class="copy">
    <div class="eyebrow">${eyebrow}</div>
    <h1>${title}</h1>
    ${sub ? `<div class="sub">${sub}</div>` : ""}
    <div class="url">${url}</div>
  </div>
  ${visual}
</div></body></html>`;
}

const guides = [
  ["circle-building-mistakes", "BUILDING FUNDAMENTALS", "Common Mistakes When Building Minecraft Circles"],
  ["circle-without-generator", "BUILDING FUNDAMENTALS", "How to Make a Minecraft Circle Without a Generator"],
  ["round-towers-and-domes", "BUILDING FUNDAMENTALS", "Planning Round Towers and Domes That Actually Line Up"],
  ["round-base-layouts", "BUILDING FUNDAMENTALS", "Round Base Layouts: Planning Rooms Inside a Circle"],
  ["sphere-layer-guide", "BUILDING FUNDAMENTALS", "How to Build a Minecraft Sphere: Layer-by-Layer Plans"],
  ["dome-roof-guide", "BUILDING FUNDAMENTALS", "Minecraft Dome Roofs: Sizes, Layer Plans, and When to Use One"],
  ["oval-blueprint-guide", "BUILDING FUNDAMENTALS", "Minecraft Ovals and Ellipses: When a Circle Won't Fit"],
  ["pixel-art-circles-and-rings", "ART &amp; DESIGN", "Circles in Minecraft Pixel Art: Rings, Logos, and Round Murals"],
  ["nether-portal-network", "TRAVEL &amp; INFRASTRUCTURE", "How to Plan a Nether Portal Network That Never Mislinks"],
];

mkdirSync("public/og/_html", { recursive: true });

guides.forEach(([slug, eyebrow, title], index) => {
  const visual = index === 8
    ? portalFrame()
    : circleGrid([15, 21, 15, 21][index % 4]);
  writeFileSync(
    `public/og/_html/guides-${slug}.html`,
    card({ eyebrow, title, sub: null, url: "minecraftcirclegen.com/guides", visual }),
  );
});

writeFileSync(
  "public/og/_html/minecraft-circle-chart.html",
  card({
    eyebrow: "BLOCK TEMPLATES BY DIAMETER",
    title: "Minecraft Circle Chart",
    sub: "Exact outline and filled block counts, 7–101 blocks",
    url: "minecraftcirclegen.com/minecraft-circle-chart",
    visual: `<div class="stack">${circleGrid(21)}${circleGrid(13)}</div>`,
  }),
);

writeFileSync(
  "public/og/_html/nether-portal-calculator.html",
  card({
    eyebrow: "OVERWORLD / NETHER · 1:8 RATIO",
    title: "Nether Portal Calculator",
    sub: "Exact coordinates, /tp and frame /fill commands, Java + Bedrock",
    url: "minecraftcirclegen.com/nether-portal-calculator",
    visual: portalFrame(),
  }),
);

console.log("11 OG card HTML files written to public/og/_html/");
