import type { Guide } from "../types";

export const circleMistakesGuide: Guide = {
  slug: "circle-building-mistakes",
  eyebrow: "BUILDING FUNDAMENTALS",
  title: "Common Mistakes When Building Minecraft Circles",
  description:
    "Nine fixable mistakes cause most lopsided or wasted Minecraft circles, from eyeballing turns to ignoring wall thickness. Learn how to spot and correct each one.",
  datePublished: "2026-10-27",
  toolKeys: ["circle", "oval", "sphere", "dome"],
  contentLinks: [
    { label: "Minecraft circle chart", href: "/minecraft-circle-chart" },
  ],
  sections: [
    {
      heading: "Why circles go wrong",
      paragraphs: [
        "A circle is the first shape most players try to freehand, and it is also the easiest shape to get subtly wrong. The block grid forgives almost any straight wall, but every turn in a circle is a decision, and a single miscounted corner survives into every layer you copy upward.",
        "The good news is that the same handful of mistakes cause nearly every lopsided circle. Each one below has a concrete check you can run before you commit materials, and none of them requires commands or mods.",
      ],
    },
    {
      heading: "Eyeballing turns instead of counting runs",
      paragraphs: [
        "The most common failure is placing turns by feel. A circle is a sequence of straight runs that shrink near the top and bottom and lengthen toward the middle; the pattern only stays round when each run is counted, not estimated.",
        "Pick a chart for your diameter and read it row by row while you build. The charts on our circle chart page list the exact run pattern for every common size, and the generator draws the same grid at any diameter from 3 to 512 with grid lines you can trace.",
      ],
      tips: [
        { title: "Count, then place", text: "Say the run length out loud before each straight segment; if you cannot state the number, you are estimating." },
        { title: "Verify one quarter", text: "Build a single quadrant, compare it against the chart, and only then mirror it across the center axes." },
      ],
    },
    {
      heading: "Ignoring wall thickness when planning the interior",
      paragraphs: [
        "Players choose an outside diameter, then discover the room inside is far smaller than expected. A 31-block circle with a three-block-thick wall has only a 25-block interior width, and corners cost even more because the diagonal walls intrude on floor space.",
        "Before collecting materials, compare the outline count with the filled count for your diameter. A 15-block circle needs 40 blocks as a one-block outline but 177 as a solid platform; the difference between those numbers is your actual living space.",
      ],
    },
    {
      heading: "Mixing odd and even diameters between floors",
      paragraphs: [
        "An odd circle such as 21 has a single center block; an even circle such as 22 centers between four blocks. If a tower switches parity between floors, every upper ring shifts by half a block and the walls develop a visible lean where the floors meet.",
        "Choose the parity once per build and keep it. Odd diameters suit builds organized around a central feature like a beacon or ladder core; even diameters pair naturally with two-block-wide doors and symmetrical furniture lines.",
      ],
    },
    {
      heading: "Scaling a pattern up without regenerating it",
      paragraphs: [
        "A run pattern that works at 21 blocks is not a stretched version of the pattern at 31. Circle geometry redistributes the curve as the radius grows, so scaling by eye stacks small errors into a visibly flat side or a pointed corner.",
        "Regenerate the grid for every new diameter. It takes seconds, and the generated block count updates with it, so your material list stays honest.",
      ],
    },
    {
      heading: "Skipping the center axes",
      paragraphs: [
        "The center axes are the two crossing lines through the middle of the blueprint. Marked on the ground with a temporary contrasting block, they give every row a reference and make drift obvious within the first few runs instead of after the roof goes on.",
        "On odd diameters the axes cross on a block; on even diameters they cross between four. Either way, leave them in place until the outline closes and every side has been checked against the chart.",
      ],
    },
    {
      heading: "Copying a quarter without mirroring",
      paragraphs: [
        "Building one clean quadrant and copying it is the fastest reliable method for large circles, but the copy has to be mirrored, not rotated. Rotating a quarter of a circle produces four curves that meet at hard points on the diagonals.",
        "After placing each mirrored section, walk the full ring once. Every turn should feel like the quarter you verified; a turn that breaks the rhythm is where the mirror went wrong.",
      ],
    },
    {
      heading: "Lighting a curved wall like a straight one",
      paragraphs: [
        "Ring walls leave dark pockets behind the curve where a straight-wall lighting habit misses. Hostile mobs do not care that your build is round, and the inside corners of a hollow ring are exactly where spawns collect.",
        "Place lighting on the inside face of every second straight run for small rings, and check the finished floor at night before furnishing. For large arenas, run a light line along the wall base rather than trusting scattered torches.",
      ],
    },
    {
      heading: "Using the wrong shape tool for the job",
      paragraphs: [
        "Circles, ovals, spheres, and domes are different problems. Stretching a circle pattern by hand to fill an oval plot distorts the run pattern; an oval generator computes the stretched grid correctly. Same for roofs: a dome is not a squashed sphere, and each has its own layer plan.",
        "Match the tool to the shape first, then bring the resulting blueprint into the world. The rest of the mistakes on this list disappear once the plan itself is exact.",
      ],
      ordered: [
        "Pick the shape and generate the blueprint at your target size.",
        "Compare outline and filled block counts to sanity-check interior space.",
        "Mark center axes on the ground and copy the chart row by row.",
        "Verify one quarter, mirror the rest, and light the finished ring before furnishing.",
      ],
    },
  ],
};
