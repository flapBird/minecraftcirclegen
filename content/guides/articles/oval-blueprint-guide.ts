import type { Guide } from "../types";

export const ovalBlueprintGuide: Guide = {
  slug: "oval-blueprint-guide",
  eyebrow: "BUILDING FUNDAMENTALS",
  title: "Minecraft Ovals and Ellipses: When a Circle Won't Fit",
  description:
    "Use an oval instead of a circle for stadiums, gardens, ponds, and long rooms: how paired dimensions work, how thickness behaves, and which width-height combinations build cleanly.",
  datePublished: "2026-10-27",
  toolKeys: ["oval", "circle", "shape"],
  contentLinks: [
    { label: "Minecraft circle chart", href: "/minecraft-circle-chart" },
  ],
  sections: [
    {
      heading: "Circles are a special case; ovals are the tool",
      paragraphs: [
        "A circle forces the same width in both directions. Most real plots do not cooperate: a racetrack arena is longer than it is wide, a garden bed hugs a rectangular wall, and a pond fills a corner. An ellipse stretches the curve independently in each direction, which is exactly what those builds need.",
        "The oval generator takes a width and a height and draws the stretched curve with the same outline-and-count treatment as the circle tool, so every statement below has an exact blueprint behind it.",
      ],
    },
    {
      heading: "How paired dimensions work",
      paragraphs: [
        "Width and height stretch the two axes independently. A 31×15 oval is a 31-block-long, 15-block-deep ellipse — twice as long as it is wide. The curve stays smooth when the two numbers keep a reasonable ratio; beyond roughly 1:3, the ends of the oval tighten into semicircles and the sides run nearly straight, which is often exactly the stadium look you want.",
        "Parity matters per axis, not jointly. An odd width centers on one middle block while an even height centers between four; the generator shows half-step center coordinates when the parities differ, and the blueprint stays symmetrical either way.",
      ],
    },
    {
      heading: "Choosing oval dimensions by build type",
      paragraphs: [
        "Start from the interior, same as with circles, then let the long axis absorb the extra length. Combinations that build cleanly and look intentional:",
      ],
      ordered: [
        "Stadium or arena: 51×21 or larger — the long sides run straight enough for tiered seating; keep entrances on the curve ends.",
        "Garden bed or pond: 15×9 or 17×11 — a gentle stretch that reads as organic rather than stretched.",
        "Round-ended hall: 31×15 with the interior filled — the oval floor plan with straight wall sections between the curved ends.",
        "Racetrack: 61×21 hollow with a two-block thickness, which widens the driving line enough for boats or horses.",
      ],
    },
    {
      heading: "Thickness behaves differently on stretched curves",
      paragraphs: [
        "On a circle, a one-block outline looks even everywhere. On a stretched ellipse, the tight ends curve faster, so a one-block outline can look thin at the ends and thick along the straight sides. The generator's thickness control adds layers from the boundary inward; for long ovals, thickness two keeps the outline readable along the straights without bloating the ends.",
        "Because the ends curve like small circles, corners and entrances belong on the straights. A door placed on the end curve fights the tight geometry; the same door on a long side gets a clean approach.",
      ],
    },
    {
      heading: "From oval footprint to finished build",
      paragraphs: [
        "The oval is a floor plan, and the workflow from there matches the circle playbook: mark both center axes, copy the grid row by row, verify one half against the other. For vertical builds — oval towers, elliptical domes — generate each level separately, shrinking or stretching per floor, and check every level against the one below before building upward.",
        "When the plot truly fits a circle after all, go back to the circle chart; a circle is the stronger, simpler shape whenever the space allows it.",
      ],
    },
  ],
};
