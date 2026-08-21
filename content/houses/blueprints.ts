import { buildBlueprintLayers, createPalette } from "./blueprint-builder";
import type { HouseBlueprint, HouseMaterial } from "./types";

type BlueprintInput = Omit<HouseBlueprint, "blockCount" | "palette" | "layers" | "height"> & {
  roof: "gable" | "flat";
  paletteNames: Parameters<typeof createPalette>[0];
};

function total(materials: HouseMaterial[]) {
  return materials.reduce((sum, material) => sum + material.count, 0);
}

function defineBlueprint(input: BlueprintInput): HouseBlueprint {
  const layers = buildBlueprintLayers({
    width: input.width,
    length: input.length,
    floors: input.floors,
    roof: input.roof,
    paletteNames: input.paletteNames,
  });
  const { roof: _roof, paletteNames, ...blueprint } = input;
  void _roof;
  return {
    ...blueprint,
    height: layers.length,
    blockCount: total(input.materials),
    palette: createPalette(paletteNames),
    layers,
  };
}

export const HOUSE_BLUEPRINTS: HouseBlueprint[] = [
  defineBlueprint({
    slug: "7x7-starter-house",
    name: "7×7 Starter House",
    shortName: "7×7 Starter",
    description: "A one-room first-night house with a stone base, oak frame, usable corners, and a steep roof that gives the small footprint more character.",
    useCase: "Best for a first permanent bed, crafting corner, furnace, and four starter chests.",
    category: "starter",
    style: "Rustic starter",
    width: 7,
    length: 7,
    floors: 1,
    roof: "gable",
    difficulty: "Easy",
    estimatedBuildTime: "10–15 min",
    materials: [
      { name: "Oak planks", count: 72 }, { name: "Cobblestone", count: 48 },
      { name: "Oak logs", count: 16 }, { name: "Oak stairs/slabs", count: 48 },
      { name: "Glass panes", count: 8 }, { name: "Oak door", count: 1 },
    ],
    paletteNames: { foundation: "Cobblestone", floor: "Oak planks", wall: "Oak planks", frame: "Oak logs", roof: "Oak stairs/slabs" },
    steps: ["Mark a 7×7 outside square and build the stone foundation shown in Layer 1.", "Fill the five-block-wide interior floor before adding the corner logs.", "Raise three wall courses, keeping the centered door and side windows open.", "Build each roof tier one block inward until the center ridge closes."],
    tips: ["Place the bed along a side wall so the center stays clear.", "Swap cobblestone for deepslate only if you already have enough; the counts stay the same.", "Use upside-down stairs over the door to break up the flat front wall."],
    image: "/house-designs/7x7-minecraft-starter-house.webp",
    imageAlt: "Original voxel illustration of a 7x7 Minecraft starter house built with oak and cobblestone",
    relatedTools: ["gradient", "circle"],
    relatedSlugs: ["9x9-oak-house", "7x9-small-survival-house", "9x9-small-house"],
  }),
  defineBlueprint({
    slug: "9x9-oak-house",
    name: "9×9 Oak Starter House",
    shortName: "9×9 Oak House",
    description: "A balanced oak starter home with a covered entrance and enough interior width for storage, smelting, a bed, and a compact ladder loft.",
    useCase: "Best for players who want one early-game house that can stay useful beyond the first few nights.",
    category: "starter",
    style: "Oak starter",
    width: 9,
    length: 9,
    floors: 1,
    roof: "gable",
    difficulty: "Easy",
    estimatedBuildTime: "15–20 min",
    materials: [
      { name: "Oak planks", count: 104 }, { name: "Cobblestone", count: 68 },
      { name: "Oak logs", count: 20 }, { name: "Oak stairs/slabs", count: 76 },
      { name: "Glass panes", count: 12 }, { name: "Oak door", count: 1 },
      { name: "Lanterns", count: 4 },
    ],
    paletteNames: { foundation: "Cobblestone", floor: "Oak planks", wall: "Oak planks", frame: "Oak logs", roof: "Oak stairs/slabs" },
    steps: ["Outline the 9×9 foundation and fill the 7×7 floor inside it.", "Set the four corner posts, then frame the centered front doorway.", "Add symmetrical windows on the second wall layer and finish the wall plate.", "Stack the five roof tiers, checking both eaves after every row."],
    tips: ["A central rug makes the wide floor easier to divide into zones.", "Add barrels under the windows to gain storage without blocking the path.", "The porch can be extended by two blocks later without changing the core plan."],
    image: "/house-designs/9x9-oak-minecraft-starter-house.webp",
    imageAlt: "Original voxel illustration of a 9x9 oak Minecraft starter house with a stone base",
    relatedTools: ["gradient", "font"],
    relatedSlugs: ["7x7-starter-house", "9x11-cottage-house", "compact-two-story-house"],
  }),
  defineBlueprint({
    slug: "7x9-small-survival-house",
    name: "7×9 Small Survival House",
    shortName: "7×9 Survival",
    description: "A narrow survival layout with a durable stone skirt, dark timber frame, clear storage wall, and a chimney-side smelting corner.",
    useCase: "Best for compact forest bases, shared survival worlds, and terrain where a square house will not fit.",
    category: "survival",
    style: "Spruce survival",
    width: 7,
    length: 9,
    floors: 1,
    roof: "gable",
    difficulty: "Easy",
    estimatedBuildTime: "15–20 min",
    materials: [
      { name: "Spruce planks", count: 86 }, { name: "Stone bricks", count: 72 },
      { name: "Spruce logs", count: 24 }, { name: "Dark oak stairs/slabs", count: 64 },
      { name: "Glass panes", count: 10 }, { name: "Spruce door", count: 1 },
      { name: "Trapdoors", count: 8 },
    ],
    paletteNames: { foundation: "Stone bricks", floor: "Spruce planks", wall: "Spruce planks", frame: "Spruce logs", roof: "Dark oak stairs/slabs" },
    steps: ["Set the 7×9 stone foundation with the long axis following the terrain.", "Fill the floor and reserve one rear corner for furnaces and the chimney.", "Raise the spruce frame and place the narrow side windows at eye level.", "Close the compact gable roof from both long eaves toward the ridge."],
    tips: ["Keep the storage wall opposite the windows for better visibility.", "Add a ladder and roof hatch if the surrounding area needs a lookout.", "A one-block exterior trench can become a berry hedge or defensive lip."],
    image: "/house-designs/7x9-minecraft-survival-house.webp",
    imageAlt: "Original voxel illustration of a compact 7x9 Minecraft survival house in spruce and stone",
    relatedTools: ["circle", "gradient"],
    relatedSlugs: ["7x7-starter-house", "9x9-small-house", "9x11-cottage-house"],
  }),
  defineBlueprint({
    slug: "9x9-small-house",
    name: "9×9 Small Cottage House",
    shortName: "9×9 Small House",
    description: "A compact cottage plan with pale timber, mossy stone accents, flower boxes, and enough wall length to decorate without crowding the interior.",
    useCase: "Best for village plots, garden builds, and a small house that should feel finished rather than temporary.",
    category: "small",
    style: "Birch cottage",
    width: 9,
    length: 9,
    floors: 1,
    roof: "gable",
    difficulty: "Easy–Medium",
    estimatedBuildTime: "20–25 min",
    materials: [
      { name: "Stripped birch logs", count: 92 }, { name: "Cobblestone", count: 60 },
      { name: "Oak logs", count: 18 }, { name: "Oak stairs/slabs", count: 72 },
      { name: "Glass panes", count: 12 }, { name: "Oak door", count: 1 },
      { name: "Flower pots/trapdoors", count: 8 },
    ],
    paletteNames: { foundation: "Cobblestone", floor: "Stripped birch", wall: "Stripped birch", frame: "Oak logs", roof: "Oak stairs/slabs" },
    steps: ["Build the 9×9 stone rim and fill the interior with pale wood.", "Place darker posts at each corner to frame the lighter wall blocks.", "Set paired windows with room for exterior shutters and planters.", "Complete the layered oak roof, then add cottage details after the shell is sealed."],
    tips: ["Use two related wood tones so the cottage reads clearly from a distance.", "Keep flower boxes outside the footprint; they do not affect the core material count.", "A chimney looks best one block off center rather than on the roof ridge."],
    image: "/house-designs/9x9-small-minecraft-house.webp",
    imageAlt: "Original voxel illustration of a small 9x9 Minecraft cottage house with birch and oak",
    relatedTools: ["gradient", "oval"],
    relatedSlugs: ["7x7-starter-house", "9x11-cottage-house", "compact-two-story-house"],
  }),
  defineBlueprint({
    slug: "11x9-modern-house",
    name: "11×9 Modern House",
    shortName: "11×9 Modern",
    description: "A low-profile modern house with an open living zone, broad glazing, white concrete frames, and a dark oak accent wall for contrast.",
    useCase: "Best for a compact creative build, beach plot, or survival project after quartz or concrete is available.",
    category: "modern",
    style: "Compact modern",
    width: 11,
    length: 9,
    floors: 1,
    roof: "flat",
    difficulty: "Easy–Medium",
    estimatedBuildTime: "25–35 min",
    materials: [
      { name: "White concrete", count: 140 }, { name: "Light gray concrete", count: 80 },
      { name: "Glass panes", count: 44 }, { name: "Smooth stone slabs", count: 50 },
      { name: "Dark oak planks", count: 24 }, { name: "Iron door", count: 1 },
    ],
    paletteNames: { foundation: "Light gray concrete", floor: "Dark oak planks", wall: "White concrete", frame: "Light gray concrete", roof: "Smooth stone slabs" },
    steps: ["Mark the 11×9 slab and separate the dark wood floor strip from the pale foundation.", "Build the concrete frames first so the window openings remain consistent.", "Install the broad glass sections without interrupting the corner supports.", "Cap the shell with the full flat-roof layer and add a one-block parapet if desired."],
    tips: ["Use the Oval Generator for a curved pool that contrasts with the rectangular house.", "Hide lighting under the roof edge instead of filling the interior with torches.", "One dark accent wall is usually stronger than alternating every wall color."],
    image: "/house-designs/11x9-modern-minecraft-house.webp",
    imageAlt: "Original voxel illustration of an 11x9 modern Minecraft house with white concrete and glass",
    relatedTools: ["oval", "gradient"],
    relatedSlugs: ["11x11-modern-house", "compact-two-story-house", "9x9-small-house"],
  }),
  defineBlueprint({
    slug: "11x11-modern-house",
    name: "11×11 Two-Level Modern House",
    shortName: "11×11 Modern",
    description: "A two-level modern build made from interlocking pale volumes, a deepslate base, tall glass sections, and a compact upper balcony.",
    useCase: "Best for players who need separated living, storage, and enchanting floors without committing to a mansion footprint.",
    category: "modern",
    style: "Two-level modern",
    width: 11,
    length: 11,
    floors: 2,
    roof: "flat",
    difficulty: "Medium",
    estimatedBuildTime: "45–60 min",
    materials: [
      { name: "White concrete", count: 210 }, { name: "Polished deepslate", count: 128 },
      { name: "Glass panes", count: 72 }, { name: "Smooth stone slabs", count: 84 },
      { name: "Dark oak planks", count: 42 }, { name: "Iron doors", count: 2 },
    ],
    paletteNames: { foundation: "Polished deepslate", floor: "Dark oak planks", wall: "White concrete", frame: "Polished deepslate", roof: "Smooth stone slabs" },
    steps: ["Lay the 11×11 deepslate-edged foundation and divide the ground floor into two zones.", "Complete three wall courses before filling the upper deck around its stair opening.", "Repeat the frame on the second level, using the marked panes for tall glazing.", "Finish the roof slab, then extend selected edge blocks to create the balcony canopy."],
    tips: ["Build the stair opening before filling the upper deck so it cannot be forgotten.", "Tinted or gray glass works well against the white frame but does not change the count.", "Keep the balcony shallow so the lower room still receives daylight."],
    image: "/house-designs/11x11-modern-minecraft-house.webp",
    imageAlt: "Original voxel illustration of an 11x11 two-level modern Minecraft house",
    relatedTools: ["oval", "gradient", "font"],
    relatedSlugs: ["11x9-modern-house", "compact-two-story-house", "9x11-cottage-house"],
  }),
  defineBlueprint({
    slug: "9x11-cottage-house",
    name: "9×11 Cottage House",
    shortName: "9×11 Cottage",
    description: "A longer cottage shell with spruce framing, a stone base, dormer-ready roof space, and distinct front and rear interior zones.",
    useCase: "Best for a cozy permanent base with separate kitchen, sleeping, and storage areas.",
    category: "cottage",
    style: "Spruce cottage",
    width: 9,
    length: 11,
    floors: 1,
    roof: "gable",
    difficulty: "Easy–Medium",
    estimatedBuildTime: "30–40 min",
    materials: [
      { name: "Spruce planks", count: 124 }, { name: "Stone bricks", count: 84 },
      { name: "Spruce logs", count: 26 }, { name: "Spruce stairs/slabs", count: 92 },
      { name: "Glass panes", count: 14 }, { name: "Spruce door", count: 1 },
      { name: "Trapdoors", count: 8 },
    ],
    paletteNames: { foundation: "Stone bricks", floor: "Spruce planks", wall: "Spruce planks", frame: "Spruce logs", roof: "Spruce stairs/slabs" },
    steps: ["Align the 9×11 stone footprint with the roof ridge running along the long side.", "Fill the floor and reserve the rear third for utility storage.", "Raise the spruce walls and use the side panes to light both interior zones.", "Build the six roof tiers and add a dormer only after checking the complete ridge."],
    tips: ["A two-block-wide arch can divide the long interior without a full wall.", "Place the chimney near the rear utility area so furnaces sit below it.", "Use the Gradient Generator to choose a roof palette that ages from dark eaves to lighter ridge blocks."],
    image: "/house-designs/9x11-minecraft-cottage-house.webp",
    imageAlt: "Original voxel illustration of a 9x11 Minecraft cottage house in spruce and stone",
    relatedTools: ["gradient", "circle"],
    relatedSlugs: ["9x9-small-house", "7x9-small-survival-house", "compact-two-story-house"],
  }),
  defineBlueprint({
    slug: "compact-two-story-house",
    name: "Compact Two-Story House",
    shortName: "Compact Two-Story",
    description: "A space-efficient two-story plan that places daily survival functions downstairs and keeps sleeping, enchanting, or map storage above.",
    useCase: "Best when vertical space is available but the building plot must stay close to 9×11 blocks.",
    category: "small",
    style: "Timber two-story",
    width: 9,
    length: 11,
    floors: 2,
    roof: "gable",
    difficulty: "Medium",
    estimatedBuildTime: "45–55 min",
    materials: [
      { name: "Oak planks", count: 168 }, { name: "White concrete or calcite", count: 112 },
      { name: "Stone bricks", count: 84 }, { name: "Dark oak stairs/slabs", count: 116 },
      { name: "Glass panes", count: 28 }, { name: "Oak logs", count: 32 },
      { name: "Doors", count: 2 },
    ],
    paletteNames: { foundation: "Stone bricks", floor: "Oak planks", wall: "White concrete/calcite", frame: "Oak logs", roof: "Dark oak stairs/slabs" },
    steps: ["Build the 9×11 foundation and position the stair opening before decorating the ground floor.", "Raise the first level, then fill the upper deck around the two-cell stairwell.", "Repeat the framed walls upstairs and keep windows clear of the stair landing.", "Close the six-tier roof from both sides and check the ridge alignment from the front."],
    tips: ["An L-shaped staircase fits the provided opening with less lost floor area.", "Put noisy utility blocks downstairs and the bed or enchanting table upstairs.", "Frame each floor with the same log spacing so the taller facade stays coherent."],
    image: "/house-designs/compact-two-story-minecraft-house.webp",
    imageAlt: "Original voxel illustration of a compact two-story Minecraft house with oak framing",
    relatedTools: ["gradient", "font"],
    relatedSlugs: ["9x9-oak-house", "11x11-modern-house", "9x11-cottage-house"],
  }),
];

export const HOUSE_BLUEPRINT_SLUGS = HOUSE_BLUEPRINTS.map((blueprint) => blueprint.slug);

export function getHouseBlueprint(slug: string) {
  return HOUSE_BLUEPRINTS.find((blueprint) => blueprint.slug === slug);
}

export function getHouseBlueprints(slugs: string[]) {
  return slugs.flatMap((slug) => {
    const blueprint = getHouseBlueprint(slug);
    return blueprint ? [blueprint] : [];
  });
}

