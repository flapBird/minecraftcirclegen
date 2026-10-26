import type { Guide } from "../types";

export const circleWithoutGeneratorGuide: Guide = {
  slug: "circle-without-generator",
  eyebrow: "BUILDING FUNDAMENTALS",
  title: "How to Make a Minecraft Circle Without a Generator",
  description:
    "Build Minecraft circles by hand: read a chart row by row, count straight runs instead of guessing, and use the quarter-mirror method to stay round with nothing but blocks and patience.",
  datePublished: "2026-10-27",
  toolKeys: ["circle"],
  contentLinks: [
    { label: "Minecraft circle chart", href: "/minecraft-circle-chart" },
  ],
  illustration: {
    src: "/circle-charts/circle-chart-07.svg",
    alt: "Hollow Minecraft circle blueprint, 7 by 7 blocks, 16 blocks — small enough to memorize and build by hand",
  },
  sections: [
    {
      heading: "Why build by hand at all",
      paragraphs: [
        "Generators are faster, but every Minecraft player eventually needs a circle with no browser open: on a server without mods, mid-dungeon with a phone battery dead, or helping a friend who insists on doing it the old way. Hand-building a circle is also the fastest way to internalize how the curves work, which makes every later generator-assisted build faster too.",
        "The method below is the same one builders used for years before chart sites existed, tightened up with counted runs instead of guesswork.",
      ],
    },
    {
      heading: "Start from a chart, even when building by hand",
      paragraphs: [
        "Hand-building does not mean guessing. Open a chart once — on screen, printed, or copied onto paper — and read it the way you would read sheet music: each row is a count of blocks from edge to edge, and the turns are what you carry in your head while building.",
        "The circle chart page lists every common diameter. For a first hand-built circle, pick 15 or 21 blocks: big enough to be useful, small enough that a mistake costs minutes rather than hours.",
      ],
    },
    {
      heading: "The counting method: straight runs, not pixels",
      paragraphs: [
        "The mistake that ruins hand-built circles is placing one block at a time from memory. Instead, read each chart row as a set of straight runs. A 15-block circle's middle row is a single run of 13 interior blocks between two wall blocks; the rows above it are pairs of shorter runs. Count the run, place the run, then check the count.",
        "Run counting converts a 15-block circle from roughly two hundred individual placement decisions into about eight counted segments per quadrant. This is also how you verify: if a row's runs do not match the chart, the row is wrong before the wall rises.",
      ],
      tips: [
        { title: "Whisper the count", text: "Saying each run's length while placing keeps rhythm and exposes errors immediately." },
        { title: "Mark run starts", text: "Drop a contrasting temporary block where each run begins on long rows; replace them after the row is verified." },
      ],
    },
    {
      heading: "The quarter-mirror method",
      paragraphs: [
        "Circles are four-fold symmetric: one verified quadrant determines the other three. Build a single quadrant from the chart — from the top-center block (or center pair on even diameters) down to the side-center — then copy it across the vertical axis, the horizontal axis, and both at once.",
        "Mirroring halves the counting work and guarantees the four quadrants agree with each other. The only place errors can hide is at the seams, so walk the full ring once after mirroring and check the four seam rows against the chart directly.",
      ],
      ordered: [
        "Mark the center axes on the ground with temporary blocks.",
        "Build the top-right quadrant from the chart, counting every run.",
        "Mirror it to the top-left across the vertical axis and verify the top row is continuous.",
        "Mirror both to the bottom across the horizontal axis, then walk the full ring once.",
      ],
    },
    {
      heading: "Memorizing the small ones",
      paragraphs: [
        "A few diameters are worth knowing by heart because they recur in almost every build. The 7-block circle (16 blocks) fits fountains and tree bases; the 9-block circle (24 blocks) is the standard small tower; the 11-block circle (28 blocks) reads as round from farther away. Build each of these twice by hand and you will never need the chart for them again.",
        "For everything larger, keep using the chart or the generator — counting a 51-block circle's runs by hand is possible but is a project in itself, and the mirror method only shines when a chart is within reach.",
      ],
    },
  ],
};
