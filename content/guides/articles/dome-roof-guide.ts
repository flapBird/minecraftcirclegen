import type { Guide } from "../types";

export const domeRoofGuide: Guide = {
  slug: "dome-roof-guide",
  eyebrow: "BUILDING FUNDAMENTALS",
  title: "Minecraft Dome Roofs: Sizes, Layer Plans, and When to Use One",
  description:
    "Plan a Minecraft dome roof with verified layer counts for common diameters, the hollow-versus-filled choice, and ceiling-clearance rules for circular rooms and towers.",
  datePublished: "2026-10-27",
  toolKeys: ["dome", "sphere", "circle"],
  contentLinks: [
    { label: "Minecraft circle chart", href: "/minecraft-circle-chart" },
  ],
  illustration: {
    src: "/guides-visuals/dome-ring-6.png",
    alt: "Layer 6 of a 15-block hollow Minecraft dome rendered by the dome generator, showing the shell ring and the inner ceiling ring",
    landscape: true,
  },
  sections: [
    {
      heading: "A dome is half a sphere with a job to do",
      paragraphs: [
        "Dome roofs cap round rooms, towers, temples, and observatories. Because a dome is a hemisphere, its widest layer must match the room it covers exactly — which makes the footprint circle the first decision and the roof the last.",
        "The dome generator draws a hemisphere from the widest base layer up to the peak, one top-down grid per layer, with per-layer block counts. The numbers below are verified from that same math.",
      ],
    },
    {
      heading: "Verified sizes and material counts",
      paragraphs: [
        "Dome costs scale with the footprint, and a hollow shell is far cheaper than a solid cap. For the diameters that cover most builds:",
      ],
      ordered: [
        "11 blocks: 153 blocks hollow, 418 filled, 6 layers — gazebos and small rotundas.",
        "15 blocks: 285 blocks hollow, 984 filled, 8 layers — round rooms and tower caps.",
        "21 blocks: 569 blocks hollow, 2,647 filled, 11 layers — grand halls and temple roofs.",
      ],
    },
    {
      heading: "Match the base layer to the room, not the wish",
      paragraphs: [
        "The dome's first layer is its widest circle. If the room below is a 15-block circle, the dome base is that same 15-block ring — 40 blocks around, the same as the footprint outline on the circle chart. Stretching a dome wider than the walls leaves an overhang that looks intentional only when it is planned as one.",
        "Check ceiling height before choosing the diameter: a dome needs headroom equal to roughly half its diameter. A 15-block dome rises 8 layers, so the walls below it should stand at least 4 to 5 blocks tall before the curve starts, or the interior feels like a lid.",
      ],
      tips: [
        { title: "Start the curve at wall height", text: "Let straight walls carry the vertical, then begin the dome; roofs that start at floor level swallow usable space." },
        { title: "Windows live in the lower layers", text: "Cut skylights or arched windows into layers two to four, where each layer is still wide enough to survive an opening." },
        { title: "Keep the peak solid", text: "The top two layers are small enough to fill solid; a hollow peak leaks light patterns and looks patchy from outside." },
      ],
    },
    {
      heading: "Building the layers in order",
      paragraphs: [
        "Domes build fastest from the base up, one verified grid at a time. The first layer is the only circle you share with the walls; every layer after it is smaller, so each one is faster than the last.",
      ],
      ordered: [
        "Generate the dome at your diameter and confirm the first layer matches the room's footprint ring.",
        "Place layer one on top of the walls, checking it against the footprint before continuing.",
        "Build upward through the layers, stepping in as the grid narrows; each layer's block count is listed in the generator.",
        "Fill the final two layers solid and cap the peak; light the interior before the last layer closes.",
      ],
    },
    {
      heading: "When a dome is the wrong roof",
      paragraphs: [
        "Domes suit round and square rooms with a central peak. They fit poorly on long rectangular halls — a barrel-vault of repeated arches covers those better — and on builds that need a flat, walkable roof for farms or defenses; a flat ring roof with crenellations keeps the top usable.",
        "For complete balls rather than caps, use the sphere workflow instead: a 15-block sphere is 530 blocks hollow against the dome's 285, because the ball repeats the lower half on top.",
      ],
    },
  ],
};
