import type { Guide } from "../types";

export const roundTowersGuide: Guide = {
  slug: "round-towers-and-domes",
  eyebrow: "BUILDING FUNDAMENTALS",
  title: "Planning Round Towers and Domes That Actually Line Up",
  description:
    "A layer-by-layer workflow for round towers: pick a footprint, choose wall thickness, plan windows on a curve, and cap it with a dome or sphere cap that matches the ring below.",
  datePublished: "2026-10-27",
  toolKeys: ["circle", "sphere", "dome", "shape"],
  contentLinks: [
    { label: "Minecraft circle chart", href: "/minecraft-circle-chart" },
  ],
  sections: [
    {
      heading: "Towers are three stacked decisions",
      paragraphs: [
        "A round tower is a footprint, a wall plan, and a roof, in that order. Skipping ahead to the roof is why so many towers end up with a dome that overhangs the walls or a top floor too cramped for a ladder. Decide each layer against the layer below it and the build assembles itself.",
        "The workflow below uses the same generators throughout, so every layer shares one geometry: the footprint ring, the wall rings copied upward, and the roof layers that close the top.",
      ],
    },
    {
      heading: "Start from the footprint, not the height",
      paragraphs: [
        "Pick the interior you need first, then work outward. A watchtower with a ladder core and a chest nook fits a 15-block footprint: the one-block wall ring uses 40 blocks, and filling it solid would take 177. A barracks floor with furnaces and beds wants a 21-block footprint at 56 outline blocks, or 349 filled.",
        "Check the outline and filled counts for any diameter on the circle chart before collecting materials. The gap between the two numbers is your floor area, and it grows faster than the ring does, which is why a 31-block tower feels vastly larger inside than a 21-block one: 84 outline blocks enclose a 749-block floor.",
      ],
    },
    {
      heading: "Choose wall thickness per floor, not per build",
      paragraphs: [
        "A one-block ring is the material-efficient default for towers. Thicker walls earn their cost on specific floors: a two-block wall at the base reads as a foundation, and a three-block wall creates window reveals deep enough for lanterns and flower boxes.",
        "The generator's thick mode draws multi-block walls at any thickness, and the block count updates with each change. Varying thickness between floors is legitimate design; just keep the outside diameter constant so the silhouette stays straight.",
      ],
    },
    {
      heading: "Windows and doors on a curve",
      paragraphs: [
        "Curved walls make openings behave differently than straight walls. A door placed on a short run near the top or bottom of the ring sits inside a tight corner; placing it on the longest run, at the middle of a side, keeps the approach straight and the reveal clean.",
        "For windows, mark the run pattern for your diameter and cut openings centered on runs, never on turns. A turn is structural to the circle's look: carving into it flattens the silhouette. On a 21-block tower, each quadrant has runs long enough for two paired windows without touching a corner.",
      ],
    },
    {
      heading: "Close the top with a dome or sphere cap",
      paragraphs: [
        "Domes and spheres are layer plans, not stretched circles. The dome generator draws each horizontal layer of a hemisphere from the widest base to the peak, and the sphere generator does the same for a full ball, so you can build the roof one verified layer at a time.",
        "Match the roof's base diameter to the footprint. A 15-block tower takes a 15-block dome base exactly; a wider overhang roof can step up from a larger base layer. For towers that end in a flat battlement instead, keep the top ring at the footprint diameter and add crenellation blocks on the run centers.",
      ],
      ordered: [
        "Generate the footprint ring and build it at ground level.",
        "Copy the ring upward floor by floor, cutting openings on run centers only.",
        "Switch to the dome generator at the top and follow its layers from base to peak.",
        "Light each floor before adding the roof so dark pockets never get sealed in.",
      ],
    },
    {
      heading: "A worked example: the 15-block watchtower",
      paragraphs: [
        "Footprint: a 15-block hollow circle, 40 blocks of wall, marked with center axes and built one verified quadrant at a time. First floor: a three-block door reveal on the longest run, with the ladder core centered on the middle block. Second and third floors: window pairs cut into run centers, wall thickness unchanged.",
        "Roof: a 15-block dome from the generator, its widest layer exactly over the wall ring. The dome's layer view lists every layer from base to peak, so the roof materials are counted before the first block goes down. This is the entire plan, and every number in it came from the generators rather than from guesswork.",
      ],
    },
  ],
};
