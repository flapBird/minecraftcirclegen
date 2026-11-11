import { buildBlueprintLayers, createPalette, countBlueprintMaterials } from "./blueprint-builder";
import type { HouseBlueprint, HouseMaterial } from "./types";

type BlueprintInput = Omit<HouseBlueprint, "blockCount" | "palette" | "layers" | "height" | "materials"> & {
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
  const palette = createPalette(paletteNames);
  const materials = countBlueprintMaterials(layers, palette);
  return {
    ...blueprint,
    height: layers.length,
    blockCount: total(materials),
    materials,
    palette,
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
    paletteNames: { foundation: "Cobblestone", floor: "Oak planks", wall: "Oak planks", frame: "Oak logs", roof: "Oak planks", door: "Oak door" },
    steps: ["Clear and level a 9×9 area so the 7×7 footprint sits on flat ground with walking space around every wall.", "Mark the 7×7 outline with temporary corner blocks, then lay the stone foundation ring shown in Layer 1.", "Fill the five-block-wide interior floor with oak planks, leaving the door gap open at the center of the front edge.", "Set the four corner oak logs and raise the first wall course, keeping the door opening clear.", "Add the second and third wall courses, placing the side windows where the layers show open panes.", "Build each roof tier one block inward, checking both slopes meet evenly until the center ridge closes.", "Move the bed, crafting table, furnace, and four starter chests into the corners so the center of the room stays open."],
    tips: ["Place the bed along a side wall so the center stays clear.", "Swap cobblestone for deepslate only if you already have enough; the counts stay the same.", "Use upside-down stairs over the door to break up the flat front wall.", "Collect the full material list before starting; the whole shell fits in a single inventory trip with a spare stack of planks.", "If you outgrow the room, rebuild the same layout on the 9×9 oak plan instead of extending the walls."],
    faqs: [
      { question: "Can I swap the oak and cobblestone for other blocks?", answer: "Yes. Equal-count swaps such as deepslate for cobblestone or spruce and birch for oak keep every layer grid valid in both Java and Bedrock Edition." },
      { question: "How many blocks does the 7×7 house need in total?", answer: "The material table above counts every structural block exactly, including the door and roof. Furniture, lighting, and scaffolding are additional, so bring a small reserve." },
      { question: "Is a 7×7 house big enough for survival?", answer: "For the first nights, yes: a bed, furnace, crafting corner, and four chests all fit. Most players upgrade to the 9×9 oak plan once they have gathered more resources." },
      { question: "Does the plan work on uneven terrain?", answer: "Flatten the footprint first. The grids assume a level foundation, so on a slope either terrace the ground or sink the foundation one block into the hill." },
    ],
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
    paletteNames: { foundation: "Cobblestone", floor: "Oak planks", wall: "Oak planks", frame: "Oak logs", roof: "Oak planks", door: "Oak door" },
    steps: ["Level an 11×11 area and mark the 9×9 foundation line with temporary corner blocks.", "Build the cobblestone foundation ring and fill the 7×7 interior floor with oak planks.", "Set the four corner oak posts, then frame the centered front doorway on the first wall course.", "Raise the second wall course with symmetrical side windows, then close the third course up to the wall plate.", "Check the wall plate is level on all four sides before starting the roof.", "Stack the five roof tiers one row at a time, checking both eaves stay even after every row.", "Zone the wide interior: bed and chests along one wall, furnace and crafting along the other, with a rug marking the walking path."],
    tips: ["A central rug makes the wide floor easier to divide into zones.", "Add barrels under the windows to gain storage without blocking the path.", "The porch can be extended by two blocks later without changing the core plan.", "Build the ladder loft opening last so you can reposition it once the furniture layout is settled."],
    faqs: [
      { question: "What fits inside a 9×9 starter house?", answer: "A full survival starter kit: bed, furnace, crafting table, storage chests, and even a compact ladder loft. The 7×7 interior floor leaves a clear walking path around the furniture." },
      { question: "Can I extend the porch later?", answer: "Yes. The plan keeps the front wall flat around the door, so a two-block porch extension does not change the core material count." },
      { question: "Which block swaps work with this plan?", answer: "Equal-count swaps keep the grids valid: deepslate for cobblestone, spruce or birch for oak, and any door style you prefer." },
      { question: "Is the 9×9 better than the 7×7 starter plan?", answer: "Choose 7×7 for the fastest first night and 9×9 when you want storage space and a loft from day one. Both plans use the same material style and build sequence." },
    ],
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
    paletteNames: { foundation: "Stone bricks", floor: "Spruce planks", wall: "Spruce planks", frame: "Spruce logs", roof: "Dark oak planks", door: "Spruce door" },
    steps: ["Set the 7×9 stone foundation with the long axis following the terrain.", "Fill the floor and reserve one rear corner for furnaces and the chimney.", "Raise the spruce frame and place the narrow side windows at eye level.", "Build the solid stepped roof from the front and rear edges toward the left-to-right ridge."],
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
    paletteNames: { foundation: "Cobblestone", floor: "Stripped birch logs", wall: "Stripped birch logs", frame: "Oak logs", roof: "Oak planks", door: "Oak door" },
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
    paletteNames: { foundation: "Light gray concrete", floor: "Dark oak planks", wall: "White concrete", frame: "Light gray concrete", roof: "Smooth stone", door: "Dark oak door" },
    steps: ["Mark the 11×9 foundation and separate the dark wood floor strip from the pale foundation.", "Build the concrete frames first so the window openings remain consistent.", "Install the broad glass sections without interrupting the corner supports.", "Cap the shell with the full flat-roof layer and add a one-block parapet if desired."],
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
    paletteNames: { stairs: "Dark oak stairs", foundation: "Polished deepslate", floor: "Dark oak planks", wall: "White concrete", frame: "Polished deepslate", roof: "Smooth stone", door: "Dark oak door" },
    steps: ["Level the plot and lay the 11×11 polished deepslate foundation edge shown in Layer 1.", "Fill the dark oak ground floor and split it into a living zone and a utility zone before building any walls.", "Raise three wall courses in white concrete, leaving the stair opening and marked window panes open.", "Fill the upper deck around the stairwell so the opening cannot be blocked or forgotten later.", "Repeat the frame on the second level, using the marked panes for the tall glass sections.", "Cap the build with the smooth stone roof layer, then extend the marked edge blocks outward to create the balcony canopy.", "Place the stair, enchanting setup, and storage upstairs, keeping the balcony shallow so the lower room still gets daylight."],
    tips: ["Build the stair opening before filling the upper deck so it cannot be forgotten.", "Tinted or gray glass works well against the white frame but does not change the count.", "Keep the balcony shallow so the lower room still receives daylight.", "Gather concrete before you start; converting powder into blocks mid-build slows the wall courses down."],
    faqs: [
      { question: "Do I need concrete for this modern house?", answer: "The plan uses white concrete for the frames and polished deepslate for the base. Any equal-count white block, such as quartz or snow blocks, works without changing the layer grids." },
      { question: "Where does the staircase go?", answer: "The stair opening is marked in the layer grids between the two floors. Build it before filling the upper deck so the landing stays reachable." },
      { question: "Can the balcony be wider?", answer: "Yes. Extend the canopy edge blocks outward by one more block, but keep it shallow so the ground-floor room still receives daylight." },
      { question: "How does it compare to the compact two-story house?", answer: "Both give two levels. This plan uses an 11×11 footprint with flat roofs, concrete, and a balcony; the compact two-story keeps a 9×11 timber footprint with a gable roof." },
    ],
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
    paletteNames: { foundation: "Stone bricks", floor: "Spruce planks", wall: "Spruce planks", frame: "Spruce logs", roof: "Spruce planks", door: "Spruce door" },
    steps: ["Align the 9×11 stone footprint with the roof ridge running left to right across the grid.", "Fill the floor and reserve the rear third for utility storage.", "Raise the spruce walls and use the side panes to light both interior zones.", "Build the six roof tiers and add a dormer only after checking the complete ridge."],
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
    paletteNames: { stairs: "Oak stairs", foundation: "Stone bricks", floor: "Oak planks", wall: "White concrete", frame: "Oak logs", roof: "Dark oak planks", door: "Spruce door" },
    steps: ["Level the plot and lay the 9×11 stone brick foundation with the long side facing your path.", "Mark the stair opening on the floor plan first, then place the ground-floor utility blocks around it.", "Raise the first-level walls with the oak frame spacing, leaving the two-cell stairwell clear.", "Fill the upper deck around the stairwell and lay the upper floor boards.", "Repeat the framed walls upstairs, keeping windows clear of the stair landing.", "Close the six-tier roof from both long sides, checking the ridge alignment from the front after every tier.", "Furnish the noisy utilities downstairs and keep the bed, enchanting, or map storage upstairs."],
    tips: ["Follow the four marked T stairs toward the top of the grid; keep the stairwell clear.", "Put noisy utility blocks downstairs and the bed or enchanting table upstairs.", "Frame each floor with the same log spacing so the taller facade stays coherent.", "Build the stairwell before decorating either floor; retrofitting stairs through a filled deck costs extra blocks."],
    faqs: [
      { question: "Where do the stairs fit in this plan?", answer: "The layer grids mark a two-cell stairwell between the floors. Build it before filling the upper deck so the landing stays reachable from both levels." },
      { question: "What goes on each floor?", answer: "Keep furnaces, crafting, and bulk storage downstairs, and reserve the upper floor for the bed, enchanting table, or map wall so noise stays away from rest areas." },
      { question: "How does it compare to the 11×11 modern house?", answer: "Both give two levels. This plan keeps a 9×11 timber footprint with a gable roof; the modern build uses an 11×11 footprint with concrete, flat roofs, and a balcony." },
      { question: "Can I use different wood types?", answer: "Yes. Equal-count swaps such as spruce for dark oak planks keep every layer grid valid in both Java and Bedrock Edition." },
    ],
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

