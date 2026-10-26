import type { Guide } from "../types";

export const pixelArtCirclesGuide: Guide = {
  slug: "pixel-art-circles-and-rings",
  eyebrow: "ART & DESIGN",
  title: "Circles in Minecraft Pixel Art: Rings, Logos, and Round Murals",
  description:
    "Design round pixel art in Minecraft: circle outlines as logo bases, ring borders for murals, dithering on curves, and how to carry a circle blueprint into map art at 128-block scale.",
  datePublished: "2026-10-27",
  toolKeys: ["pixel-art", "map-art", "font"],
  contentLinks: [
    { label: "Minecraft circle chart", href: "/minecraft-circle-chart" },
  ],
  sections: [
    {
      heading: "Round shapes are pixel art's hardest test",
      paragraphs: [
        "Straight lines and rectangles survive almost any pixel treatment; circles expose every wrong pixel. A ring that wobbles reads as broken at 32 blocks wide, and the same wobble multiplies across a 128-block map art mural. This is why round logos, badges, and medallions benefit most from a computed blueprint rather than freehand placement.",
        "The shape and circle tools output the same block grids the building tools use, which means a circle designed as pixel art shares its curve math with towers and arenas — one verified curve, many uses.",
      ],
    },
    {
      heading: "Circle outlines as logo and badge bases",
      paragraphs: [
        "Logos, coins, crests, and portal rings all start with a clean circle outline. Choose the diameter from the chart — 15 blocks for a badge readable in chat screenshots, 21 to 31 blocks for anything viewed from a distance — and place the one-block ring as the outer boundary.",
        "Keep interior detail inside the ring's safe area: the outline itself eats one block everywhere, and the diagonal sections eat into the interior fastest. Text and emblems placed on the middle rows have the most room; the top and bottom rows of the ring curve tightly and fit little more than the outline.",
      ],
    },
    {
      heading: "Rings as mural borders",
      paragraphs: [
        "On large murals — especially map art at the 128×128 tile scale — a circular border turns a rectangular image into a medallion. Generate the ring at the mural's width, place it as the outermost band, and crop the artwork to the interior. The ring hides ragged image edges and gives the piece a finished frame from every viewing angle.",
        "Two-block thickness reads better at map scale than one; a one-block ring disappears at the distance map art is usually viewed from. The thickness mode draws exactly that band, and the block count updates so the border's material cost is known before the artwork starts.",
      ],
    },
    {
      heading: "Dithering and color on curves",
      paragraphs: [
        "Curved edges alias: the staircase of blocks along the curve stands out when the interior and background colors contrast strongly. Two fixes work at pixel-art scale. Checkerboard dithering on the boundary row softens the stair into a gradient. Or outline the curve with a color between the two — a dark ring between a bright emblem and a dark sky reads as a shadow line.",
        "The pixel art generator's dithering option applies this automatically when converting an uploaded image to blocks, and the palette control keeps the mural to colors you can actually source in bulk.",
      ],
    },
    {
      heading: "Carrying the design into the world",
      paragraphs: [
        "Once the round design exists as a blueprint, the export path matters more than the design. For hand-placed art, the coordinate CSV lists every cell with its position and material, so a ring can be built from the outside in without counting. For big pieces, plan it as map art — the 128-block tiles tell you exactly how many maps the mural spans and where the tile seams fall, which is the difference between a mural and a guess.",
        "Labels, dates, and names inside round frames come from the font generator; it renders on the same block grid, so text sized to the ring's interior never overflows the curve.",
      ],
    },
  ],
};
