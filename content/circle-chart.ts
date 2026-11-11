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
      { diameter: 14, bestFor: "A compact sheep pen or a covered well with a shaded rim." },
      { diameter: 15, bestFor: "A round room, watchtower, or compact dome foundation." },
      { diameter: 16, bestFor: "A circular garden bed or a small bridge landing platform." },
      { diameter: 17, bestFor: "A treehouse platform or a circular brewing barn." },
      { diameter: 18, bestFor: "A round stable ring or a lighthouse base with a walkway." },
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
      { diameter: 22, bestFor: "A round farmhouse floor or a covered market stall ring." },
      { diameter: 23, bestFor: "A castle gatehouse turret with a spiral stair core." },
      { diameter: 24, bestFor: "A circular greenhouse frame or a pond island with a dock." },
      { diameter: 25, bestFor: "A round survival base with an interior utility ring." },
      { diameter: 26, bestFor: "A small amphitheater or a moated tower footprint." },
      { diameter: 27, bestFor: "A circular meeting hall or a rounded harbor warehouse." },
      { diameter: 28, bestFor: "A village plaza centerpiece with benches and a fountain." },
      { diameter: 29, bestFor: "A small arena or a circular market plaza." },
      { diameter: 30, bestFor: "A rounded courtyard for a mansion or monastery layout." },
      { diameter: 31, bestFor: "A large hall, substantial tower, or town plaza." },
      { diameter: 32, bestFor: "A grand entrance rotunda or a circular library floor." },
      { diameter: 33, bestFor: "A domed council hall or circular farm hub." },
      { diameter: 34, bestFor: "A training yard ring or a circular horse arena." },
      { diameter: 35, bestFor: "A practice colosseum ring or a large fountain plaza." },
      { diameter: 36, bestFor: "A circular temple floor with an outer colonnade." },
      { diameter: 37, bestFor: "A rounded banquet hall or a guild meeting circle." },
      { diameter: 38, bestFor: "A large ceremonial plaza with a central statue base." },
      { diameter: 39, bestFor: "A border outpost ring with gate openings on four sides." },
    ],
  },
  {
    id: "large-circles",
    title: "Large circles (40–59 blocks)",
    intro:
      "Landmark arenas, castle courtyards, and domed halls. At this scale, build and verify one quarter at a time, and decide wall thickness and gate positions before placing the outline.",
    sizes: [
      { diameter: 40, bestFor: "A castle courtyard ring or a circular docking bay." },
      { diameter: 41, bestFor: "A stadium ring or large circular warehouse." },
      { diameter: 42, bestFor: "A practice race loop or a large tree canopy platform." },
      { diameter: 43, bestFor: "A fortress outer wall with room for interior towers." },
      { diameter: 44, bestFor: "A palace garden ring or a sunken circular lounge." },
      { diameter: 45, bestFor: "A harbor ring with moored-ship bays and walkways." },
      { diameter: 46, bestFor: "A grand carousel base or a festival ground ring." },
      { diameter: 47, bestFor: "A monastery cloister circle with an open garden core." },
      { diameter: 48, bestFor: "A large domed observatory footprint." },
      { diameter: 49, bestFor: "A town square ring with market stalls around the edge." },
      { diameter: 50, bestFor: "A half-scale colosseum or a spacious circular throne room." },
      { diameter: 51, bestFor: "A major arena, city landmark, or large storage base." },
      { diameter: 52, bestFor: "A walled garden circle with four symmetric gatehouses." },
      { diameter: 53, bestFor: "A large harbor plaza or a circular trading hall." },
      { diameter: 54, bestFor: "A grand library rotunda with reading alcoves." },
      { diameter: 55, bestFor: "A server spawn ring with portals around the rim." },
      { diameter: 56, bestFor: "A large amphitheater with tiered spectator seating." },
      { diameter: 57, bestFor: "A fortress keep courtyard with an inner bailey ring." },
      { diameter: 58, bestFor: "A circular botanical dome foundation." },
      { diameter: 59, bestFor: "A grand temple plaza with processional walkways." },
    ],
  },
  {
    id: "giant-circles",
    title: "Giant circles (60–101 blocks)",
    intro:
      "Server landmarks and megabase footprints. Lay the outline in sections with temporary markers, verify each quadrant against the chart, then mirror it across both center axes.",
    sizes: [
      { diameter: 60, bestFor: "A citadel courtyard with layered defensive walls." },
      { diameter: 61, bestFor: "A server hub plaza or castle keep courtyard." },
      { diameter: 62, bestFor: "A stadium outer wall with room for interior pitches." },
      { diameter: 63, bestFor: "A grand citadel ring with layered gatehouses." },
      { diameter: 64, bestFor: "A massive circular farm with radial field plots." },
      { diameter: 65, bestFor: "A castle town ring with streets radiating from the center." },
      { diameter: 66, bestFor: "A large lagoon enclosure or a circular harbor wall." },
      { diameter: 67, bestFor: "A monumental forum with colonnades on the rim." },
      { diameter: 68, bestFor: "A grand arena floor with gate tunnels on four axes." },
      { diameter: 69, bestFor: "A huge circular garden with seasonal flower rings." },
      { diameter: 70, bestFor: "A palace courtyard with fountains on the center axes." },
      { diameter: 71, bestFor: "A walled server-city district with a round perimeter." },
      { diameter: 72, bestFor: "A great hall rotunda for a cathedral-scale build." },
      { diameter: 73, bestFor: "A massive beacon platform with radial pathways." },
      { diameter: 74, bestFor: "A colossal clocktower or planetary display base." },
      { diameter: 75, bestFor: "A grand colosseum outer wall." },
      { diameter: 76, bestFor: "A ceremonial plaza for a fantasy capital city." },
      { diameter: 77, bestFor: "A huge defensive keep ring with bastion towers." },
      { diameter: 78, bestFor: "A circular airfield or airship terminal apron." },
      { diameter: 79, bestFor: "A grand race circuit for horses or ice boat tracks." },
      { diameter: 80, bestFor: "A megabase perimeter wall with four gatehouses." },
      { diameter: 81, bestFor: "A colossal dome foundation for a landmark build." },
      { diameter: 82, bestFor: "A vast marketplace ring with stalls along the rim." },
      { diameter: 83, bestFor: "A mountain summit ring for a panoramic tower." },
      { diameter: 84, bestFor: "A huge amphitheater with layered seating tiers." },
      { diameter: 85, bestFor: "A grand naval harbor with dry docks in the ring." },
      { diameter: 86, bestFor: "A sprawling circular zoo or wildlife park path." },
      { diameter: 87, bestFor: "A monumental mausoleum or memorial plaza." },
      { diameter: 88, bestFor: "A large wizard academy circle with rune inlays." },
      { diameter: 89, bestFor: "A server event ground for tournaments and festivals." },
      { diameter: 90, bestFor: "A majestic capital plaza with a central obelisk." },
      { diameter: 91, bestFor: "A colossal fortress ring with layered gates." },
      { diameter: 92, bestFor: "A huge greenhouse dome covering a full farm ecosystem." },
      { diameter: 93, bestFor: "A grand cathedral footprint with an ambulatory ring." },
      { diameter: 94, bestFor: "A vast circular lagoon city foundation." },
      { diameter: 95, bestFor: "A legendary arena for large server battles." },
      { diameter: 96, bestFor: "A sprawling market city ring with radial avenues." },
      { diameter: 97, bestFor: "A monumental palace forecourt with garden rings." },
      { diameter: 98, bestFor: "A huge training ground with obstacle rings." },
      { diameter: 99, bestFor: "A grand capital forum with radiating boulevards." },
      { diameter: 100, bestFor: "A milestone build — a full hundred-block display ring." },
      { diameter: 101, bestFor: "A giant hub, megabase footprint, or server-scale project." },
    ],
  },
];

export const CIRCLE_CHART_DIAMETERS: number[] = CIRCLE_CHART_GROUPS.flatMap((group) =>
  group.sizes.map((size) => size.diameter),
);
