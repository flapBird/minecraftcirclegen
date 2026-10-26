export type CircleChartEntry = {
  diameter: number;
  bestFor: string;
};

export type CircleChartGroup = {
  id: string;
  title: string;
  intro: string;
  sizes: CircleChartEntry[];
};

export const CIRCLE_CHART_GROUPS: CircleChartGroup[] = [
  {
    id: "tiny-circles",
    title: "Tiny circles (3–9 blocks)",
    intro:
      "Fountains, pillar bases, lamp rings, and decorative inlays that fit inside tight floor plans. At these sizes every block matters, so count the interior before committing.",
    sizes: [
      { diameter: 3, bestFor: "A lamp post ring or the rounded corner of a small fountain." },
      { diameter: 4, bestFor: "A compact planter or a fence-post lantern base." },
      { diameter: 5, bestFor: "A tiny fountain, wishing well, or flower bed center." },
      { diameter: 6, bestFor: "A wider planter ring or a torch platform around a beacon." },
      { diameter: 7, bestFor: "A compact fountain, pillar base, or tiny turret." },
      { diameter: 8, bestFor: "A small gazebo floor or a courtyard inlay pattern." },
      { diameter: 9, bestFor: "A small tower, garden feature, or circular stair core." },
    ],
  },
  {
    id: "small-circles",
    title: "Small circles (10–19 blocks)",
    intro:
      "Round rooms, watchtowers, treehouse platforms, and farm rings. Interiors from 8 to 17 blocks wide fit real furniture and storage walls.",
    sizes: [
      { diameter: 10, bestFor: "A paired-door entry tower or a circular animal pen." },
      { diameter: 11, bestFor: "A comfortable starter tower or detailed fountain basin." },
      { diameter: 12, bestFor: "A round workshop room with storage along one wall." },
      { diameter: 13, bestFor: "A watchtower footprint with a central ladder core." },
      { diameter: 15, bestFor: "A round room, watchtower, or compact dome foundation." },
      { diameter: 17, bestFor: "A treehouse platform or a circular brewing barn." },
      { diameter: 19, bestFor: "A village bell tower base or round meeting hall." },
    ],
  },
  {
    id: "medium-circles",
    title: "Medium circles (20–39 blocks)",
    intro:
      "Bases, pavilions, small arenas, and multi-room round builds. Plan walls and circulation before placing the outline, because a three-block wall costs seven blocks of width.",
    sizes: [
      { diameter: 20, bestFor: "A paired-entrance pavilion with open circulation." },
      { diameter: 21, bestFor: "A versatile base, pavilion, or medium arena center." },
      { diameter: 25, bestFor: "A round survival base with an interior utility ring." },
      { diameter: 29, bestFor: "A small arena or a circular market plaza." },
      { diameter: 31, bestFor: "A large hall, substantial tower, or town plaza." },
      { diameter: 33, bestFor: "A domed council hall or circular farm hub." },
    ],
  },
  {
    id: "large-circles",
    title: "Large circles (40+ blocks)",
    intro:
      "Server landmarks, arenas, and megabase footprints. Build one quarter at a time, verify it against the chart, then mirror it across the center axes.",
    sizes: [
      { diameter: 41, bestFor: "A stadium ring or large circular warehouse." },
      { diameter: 51, bestFor: "A major arena, city landmark, or large storage base." },
      { diameter: 61, bestFor: "A server hub plaza or castle keep courtyard." },
      { diameter: 75, bestFor: "A grand colosseum outer wall." },
      { diameter: 101, bestFor: "A giant hub, megabase footprint, or server-scale project." },
    ],
  },
];

export const CIRCLE_CHART_DIAMETERS: number[] = CIRCLE_CHART_GROUPS.flatMap((group) =>
  group.sizes.map((size) => size.diameter),
);
