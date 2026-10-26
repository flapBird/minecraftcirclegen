import type { Guide } from "../types";

export const netherPortalNetworkGuide: Guide = {
  slug: "nether-portal-network",
  eyebrow: "TRAVEL & INFRASTRUCTURE",
  title: "How to Plan a Nether Portal Network That Never Mislinks",
  description:
    "Plan a multi-portal Nether hub with the exact 1:8 conversion, Java and Bedrock search radii, and spacing rules that keep every Overworld portal pointed at the right destination.",
  datePublished: "2026-10-27",
  toolKeys: ["nether-portal", "give-command", "circle"],
  contentLinks: [
    { label: "Minecraft circle chart (round hub floors)", href: "/minecraft-circle-chart" },
  ],
  sections: [
    {
      heading: "Why portal networks need planning",
      paragraphs: [
        "The Nether compresses distance at a 1:8 ratio, which is what makes it the fast lane of any survival world. The same ratio is also why careless portals mislink: every portal you light competes for the same destination targets, and the game always picks the closest portal by straight-line 3D distance.",
        "A network that works has two properties: every Overworld portal converts to a Nether target that is far enough from every other target, and each Nether-side portal was built at its calculated coordinates before the Overworld side was ever lit. Both are planning steps, not luck.",
      ],
    },
    {
      heading: "The 1:8 ratio and floor rounding",
      paragraphs: [
        "To convert Overworld coordinates, divide X and Z by 8 and keep Y unchanged. Division rounds down, so X=100 converts to X=12, while X=-100 converts to X=-13. Going from the Nether back to the Overworld, multiply X and Z by 8.",
        "Because rounding floors toward negative infinity, two Overworld portals 8 blocks apart can convert to Nether targets 1 block apart near negative coordinates, and 2 blocks apart near positive ones. Spacing rules below account for this asymmetry.",
      ],
    },
    {
      heading: "Search radii decide where portals link",
      paragraphs: [
        "When you step through, the game converts your coordinates and searches the destination for existing portals. In Java Edition the search reaches a 16-block radius around the target in the Nether and a 128-block radius in the Overworld. Bedrock Edition searches a 128-block radius in both directions.",
        "The search covers the full height of the destination, and Y counts toward the 3D distance. A portal one block closer but forty blocks lower can steal a link from the portal you intended, which is why hubs keep their floors aligned.",
      ],
      ordered: [
        "Convert your Overworld portal coordinates before lighting anything.",
        "Teleport to the converted target and build the Nether-side portal exactly there.",
        "Light the Nether side first, then step through to the Overworld side.",
        "Break any stray portal the game auto-created within the search radius.",
      ],
    },
    {
      heading: "Spacing rules for multiple destinations",
      paragraphs: [
        "Two Overworld portals that convert to Nether targets within 16 blocks of each other can capture each other's links in Java Edition. Sixteen Nether blocks equals 128 Overworld blocks, so the practical rule is simple: keep Overworld entrances at least 128 blocks apart in both X and Z.",
        "In Bedrock Edition the search window is much wider, so portal pairs need deliberately different Nether targets and a build-first workflow to stay separated. When in doubt, place the Nether-side portal at the exact converted coordinate and keep neighboring targets farther than 128 blocks apart there as well.",
      ],
    },
    {
      heading: "Hub layout that scales",
      paragraphs: [
        "A hub-and-spoke plan keeps every future destination one calculation away. Put a central hub portal at a convenient Nether coordinate, then add spokes: each new Overworld base gets its own converted target, a corridor from the hub, and a signed junction.",
        "Corridors do the long-distance work in the Nether, so invest in them: a three-wide tunnel with a packed-ice runway turns a 500-block trip into a boat ride. Round hub rooms are popular because traffic flows around a central portal; a 15-block circle gives a 40-block ring wall with a 177-block floor if you fill it solid.",
      ],
      tips: [
        { title: "Match Y between pairs", text: "Keep each portal pair at the same height so the 3D distance search always favors your intended link." },
        { title: "Label junctions", text: "Sign each corridor with the Overworld destination coordinates; future you will not remember which spoke went where." },
        { title: "Map before mining", text: "Chart the Nether terrain around each target before tunneling; ceilings at Y=127 and open lava both reshape routes." },
      ],
    },
    {
      heading: "Common failure modes and fixes",
      paragraphs: [
        "Most mislinks fall into three groups. First, the stray portal: lighting an Overworld portal auto-creates a Nether portal near the target, and that stray keeps capturing the link until you mine it. Second, the shared target: two entrances too close together fight over one destination, fixed by moving one entrance or building its Nether side elsewhere. Third, the Y mismatch: a hub floor far below or above the converted target loses links to whatever sits nearer in 3D distance.",
        "For each failure, the repair is the same: recalculate, build the intended portal at the target, and remove the competitor. The calculator's teleport and frame commands make the rebuild a two-minute job instead of a project.",
      ],
    },
  ],
};
