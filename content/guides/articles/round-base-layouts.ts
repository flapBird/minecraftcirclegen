import type { Guide } from "../types";

export const roundBaseLayoutsGuide: Guide = {
  slug: "round-base-layouts",
  eyebrow: "BUILDING FUNDAMENTALS",
  title: "Round Base Layouts: Planning Rooms Inside a Circle",
  description:
    "Plan the interior of a circular Minecraft base: verified floor areas for common diameters, where walls eat space, and room arrangements that work with curved walls instead of against them.",
  datePublished: "2026-10-27",
  toolKeys: ["circle", "shape"],
  contentLinks: [
    { label: "House designs for curved spaces", href: "/house-designs" },
  ],
  sections: [
    {
      heading: "The floor you get is smaller than the circle you draw",
      paragraphs: [
        "A base's outside diameter overstates its living space twice over: the wall thickness takes a ring off the outside, and the curve takes diagonal bites from every corner of rectangular furniture. Planning from the outside diameter alone is why so many round bases feel cramped the day the walls go up.",
        "The exact numbers make the trade-off visible. A 15-block circle encloses 177 blocks of floor if filled solid; its one-block wall ring takes 40 of those, leaving 137 usable floor blocks. A 21-block circle: 349 filled, 56 in the wall, 293 of floor. A 31-block circle: 749 filled, 84 in the wall, 665 of floor — nearly five times the 15-block interior for less than twice the wall material.",
      ],
    },
    {
      heading: "Walls multiply: choosing thickness on purpose",
      paragraphs: [
        "Every block of wall thickness costs two blocks of interior width. A 21-block circle with one-block walls has a 19-block interior width; the same circle with a three-block wall drops to 15. On a circle, the corners bite hardest — the diagonal distance between opposite walls is what bounds the largest rectangular room you can fit inside.",
        "Decide thickness per floor. Ground floors carry two-block or three-block walls for depth and defense; upper floors drop to one block to reclaim space. The generator's thick mode shows the exact ring for any thickness before you commit.",
      ],
    },
    {
      heading: "Room arrangements that respect the curve",
      paragraphs: [
        "Curved walls punish long rectangular furniture and reward rooms organized around the center. Three arrangements cover most round bases:",
      ],
      ordered: [
        "Central feature: the beacon, ladder core, or staircase occupies the exact center, and rooms ring around it — the strongest choice for 15 to 21 block bases.",
        "Split-lobes: two or three wedge rooms divided by radial walls, each wedge holding one function (sleeping, storage, smelting); works from 21 blocks up.",
        "Rim services, open center: storage and furnaces hug the curved wall in matching niches while the center stays open for crafting and movement — the lightest-touch layout for 15-block bases.",
      ],
    },
    {
      heading: "Furniture clearance on a curve",
      paragraphs: [
        "A double chest is two blocks wide, a furnace setup wants three in a row, and a bed needs two clear blocks beside it. On curved walls, these rectangles only fit where the wall runs straight for long enough — which is on the run centers, not the turns. Count the straight runs of your interior ring and assign furniture to the longest runs first.",
        "The 21-block interior gives runs of up to 19 blocks at the middle and as few as three near the top; a three-furnace row fits on any run of five or more. Mark each placement on the floor with temporary blocks before placing the furniture, the same way the outline was verified.",
      ],
    },
    {
      heading: "Scaling up: when to go round at all",
      paragraphs: [
        "Round bases shine from 21 blocks up. At 15 blocks the interior supports a single-purpose outpost comfortably but gets tight for multi-room living; at 31 blocks and above the floor area supports full rooms and the curve becomes a design feature rather than a constraint. Below that, a small rectangular cabin wastes less space — or browse the house design collections for curved-wall-ready layouts and start from a proven plan.",
      ],
    },
  ],
};
