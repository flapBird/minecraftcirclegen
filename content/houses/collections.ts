import type { HouseCollection, HouseFaq } from "./types";

export const HOUSE_DESIGNS_FAQS: HouseFaq[] = [
  { question: "What is the easiest Minecraft house to build?", answer: "A 7×7 oak-and-cobblestone house is a reliable first build: the footprint is easy to count, the roof stays small, and every material is available early. Start with a complete floor and three-block-high walls before adding decoration." },
  { question: "How big should a starter house be?", answer: "A 7×7 outside footprint works for a bed, crafting table, furnaces, and basic storage. Choose 9×9 if you want clearer walking space or plan to keep the house after the early game." },
  { question: "What blocks are best for Minecraft houses?", answer: "Use one structural block, one contrasting frame block, and one roof block. Oak with cobblestone is easy to collect; spruce with stone feels heavier; white concrete with deepslate suits modern builds. The palette matters more than using rare blocks." },
  { question: "How do I make a Minecraft house look less boxy?", answer: "Move corner posts one block forward, add a roof overhang, vary the wall depth around doors or windows, and use stairs or slabs at transitions. Even a one-block shadow line makes a flat wall easier to read." },
  { question: "What rooms should a Minecraft house have?", answer: "Start with a clear crafting and smelting zone, storage, a bed, and safe circulation to the door. Larger houses can separate enchanting, brewing, maps, food, and armor displays instead of creating empty rooms with no gameplay use." },
];

export const HOUSE_COLLECTIONS: HouseCollection[] = [
  {
    slug: "starter",
    name: "Starter Houses",
    eyebrow: "EASY EARLY-GAME BUILDS",
    title: "Minecraft Starter House Designs",
    description: "Easy Minecraft starter house designs with practical sizes, material counts, build times, and step-by-step blueprints for Java and Bedrock.",
    intro: "A useful starter house should be quick to seal before night, cheap to light, and large enough for the blocks you actually use. These plans start at 7×7 and grow into compact two-story layouts without wasting early-game materials.",
    designSlugs: ["7x7-starter-house", "9x9-oak-house", "7x9-small-survival-house", "9x9-small-house", "compact-two-story-house"],
    sizeGuide: [
      { size: "5×5", bestFor: "First-night shelter", note: "Very tight; use a ladder loft or exterior storage." },
      { size: "7×7", bestFor: "Core starter base", note: "Enough for a bed, crafting, smelting, and a compact chest wall." },
      { size: "7×9", bestFor: "Narrow terrain", note: "Adds a utility end without increasing the front elevation." },
      { size: "9×9", bestFor: "Longer-term starter", note: "Comfortable circulation and clearer interior zones." },
      { size: "9×11, two floors", bestFor: "Upgradable base", note: "Keeps a small footprint while separating functions vertically." },
    ],
    selectionTitle: "Choose a starter house you can finish",
    selectionParagraphs: ["Count what you already have before choosing a style. A smaller house with a finished roof, windows, and lighting is safer and more useful than a large shell that remains open for several nights.", "Plan the interior before the walls go up. Beds, double chests, and furnaces need predictable clearances, so mark those zones on the floor with temporary blocks. Every layout here works in both Java and Bedrock because it uses ordinary building blocks rather than version-specific mechanics."],
    tips: [
      { title: "Finish the shell first", text: "Foundation, walls, door, roof, and lighting come before shutters or landscaping." },
      { title: "Keep storage near the entrance", text: "Returning from a mining trip is faster when common drop-off chests are easy to reach." },
      { title: "Use local blocks", text: "Swap woods or stone variants in equal counts instead of traveling for a perfect palette." },
      { title: "Leave one upgrade path", text: "A side wall without a chimney or farm can later open into storage or an enchanting wing." },
    ],
    relatedTools: ["gradient", "circle"],
    faqs: [
      { question: "How big should a Minecraft starter house be?", answer: "A 7×7 footprint is the practical minimum for a comfortable one-room base. A 9×9 plan gives noticeably better storage and walking space while remaining fast to build." },
      { question: "What materials should I collect first?", answer: "Collect the foundation and wall blocks before decorative pieces. For the 7×7 plan, one stack of cobblestone, a little over one stack of planks, 16 logs, and roughly 48 stair or slab pieces cover the main shell." },
      { question: "Can I build these houses in Survival Mode?", answer: "Yes. The starter plans use obtainable blocks, realistic counts, and no commands. Modern alternatives may require extra preparation for concrete, quartz, or large glass sections." },
    ],
  },
  {
    slug: "small",
    name: "Small Houses",
    eyebrow: "COMPACT, BUILDABLE LAYOUTS",
    title: "Small Minecraft House Designs",
    description: "Small Minecraft house ideas with efficient 5×5 to 9×11 layouts, material lists, dimensions, and buildable blueprint layers.",
    intro: "Small houses work when every block has a job. The strongest layouts protect a clear path from the door, use wall storage, and gain character from roof shape rather than oversized empty rooms.",
    designSlugs: ["7x7-starter-house", "7x9-small-survival-house", "9x9-small-house", "9x11-cottage-house", "compact-two-story-house"],
    sizeGuide: [
      { size: "5×5", bestFor: "Tiny outpost", note: "Treat it as a sleep-and-resupply stop rather than a full base." },
      { size: "7×7", bestFor: "Small one-room home", note: "The best balance of low cost and essential functions." },
      { size: "7×9", bestFor: "Hillside or riverbank", note: "The narrow facade fits constrained plots." },
      { size: "9×9", bestFor: "Decorated cottage", note: "More window and furniture options without becoming bulky." },
      { size: "9×11, two floors", bestFor: "Tiny two-story", note: "Maximum usable area per block of ground." },
    ],
    selectionTitle: "Make a small footprint feel intentional",
    selectionParagraphs: ["Choose the footprint from the interior backward. A single-floor 7×7 house has a 5×5 room after the outside walls are counted, while a 9×9 shell has a 7×7 room—almost twice the usable floor area.", "Vertical storage, under-stair barrels, lofts, and exterior utility spaces keep the center clear. If the house still feels crowded, add a connected shed rather than making every wall longer."],
    tips: [
      { title: "Protect the center aisle", text: "Keep at least one uninterrupted path between the door, bed, storage, and stairs." },
      { title: "Build upward selectively", text: "A loft over only half the room keeps the lower level from feeling compressed." },
      { title: "Use an overhang", text: "A one-block roof overhang adds depth without changing the interior footprint." },
      { title: "Move utilities outside", text: "Farms, animal pens, and bulk storage can use linked exterior structures." },
    ],
    relatedTools: ["gradient", "oval"],
    faqs: [
      { question: "What is a good size for a small Minecraft house?", answer: "Use 7×7 for an efficient one-room base or 9×9 for more comfortable furniture and storage. Remember that one-block walls reduce each interior dimension by two." },
      { question: "How do I add storage to a tiny house?", answer: "Use barrels where chest lids would be blocked, place storage below a stair run, and reserve one complete wall for labeled containers. Avoid scattering single chests through the walking path." },
      { question: "Should a small house have two floors?", answer: "Add a second floor when the plot is constrained or when you want to separate utility blocks from sleeping and enchanting. A one-floor house is faster when the upper space would remain mostly empty." },
    ],
  },
  {
    slug: "modern",
    name: "Modern Houses",
    eyebrow: "CLEAN LINES, USEFUL ROOMS",
    title: "Minecraft Modern House Designs",
    description: "Buildable Minecraft modern house designs with exact dimensions, concrete and glass material counts, floor layouts, and layered blueprints.",
    intro: "Modern houses depend on proportion, depth, and controlled contrast—not simply covering a box in white concrete. These layouts pair practical rooms with offset frames, broad windows, dark accents, and flat roofs that remain straightforward to build.",
    designSlugs: ["11x9-modern-house", "11x11-modern-house", "compact-two-story-house"],
    sizeGuide: [
      { size: "9×9", bestFor: "Modern micro house", note: "Use one open room and a strong exterior frame." },
      { size: "11×9", bestFor: "Compact single level", note: "Wide enough for glazing without losing every storage wall." },
      { size: "11×11", bestFor: "Two-level home", note: "Supports a real stair and separated upper rooms." },
      { size: "15×11", bestFor: "Courtyard layout", note: "Room for a patio or pool without a mansion-scale shell." },
    ],
    selectionTitle: "Balance glass, structure, and contrast",
    selectionParagraphs: ["Start with the structural frames, then fill between them. Large glass walls look convincing when they terminate against a solid column and a clear roof line; uninterrupted glass on every side makes rooms hard to furnish.", "Use a restrained palette of two structural colors, one wood accent, and glass. For survival builds, concrete can be replaced with calcite, smooth sandstone, or stripped birch while you collect dyes and powder."],
    tips: [
      { title: "Offset one volume", text: "Move an entry frame or upper room by one block to create depth and shade." },
      { title: "Light the edges", text: "Hide lamps below slabs and overhangs to preserve clean interior walls." },
      { title: "Keep one solid wall", text: "Storage, maps, and utility blocks need a surface that is not glass." },
      { title: "Contrast with curves", text: "A block-built oval pool softens the surrounding straight lines." },
    ],
    relatedTools: ["oval", "gradient"],
    faqs: [
      { question: "What blocks make a good Minecraft modern house?", answer: "White or light gray concrete, smooth quartz, calcite, smooth stone, deepslate, dark oak, and glass are reliable choices. Limit the build to a few coordinated materials so the shape remains the focus." },
      { question: "How much glass should a modern house use?", answer: "Use glass where it frames a view or lights a main room, then keep at least one solid wall per room for storage and furniture. The 11×9 plan uses about 44 panes; the two-level 11×11 plan uses about 72." },
      { question: "Can a modern house work in Survival Mode?", answer: "Yes, but gather sand, fuel, dyes, and gravel before committing to large concrete and glass sections. Calcite or smooth sandstone can reduce early resource processing." },
    ],
  },
  {
    slug: "survival",
    name: "Survival Houses",
    eyebrow: "SAFE, PRACTICAL BASES",
    title: "Minecraft Survival House Designs",
    description: "Practical Minecraft survival house designs with defensible layouts, storage planning, exact materials, dimensions, and blueprints.",
    intro: "A survival house needs fast access, safe lighting, storage that scales, and an exterior that can accept farms or defenses later. These designs prioritize useful floor plans first, then add roofs and frames that keep the base from looking temporary.",
    designSlugs: ["7x9-small-survival-house", "7x7-starter-house", "9x9-oak-house", "9x11-cottage-house", "compact-two-story-house"],
    sizeGuide: [
      { size: "7×7", bestFor: "Early-game safety", note: "Cheap to light and easy to complete before the second night." },
      { size: "7×9", bestFor: "Utility-focused base", note: "Separate a furnace end from sleeping and storage." },
      { size: "9×9", bestFor: "Expandable main base", note: "Enough width for storage and direct exterior connections." },
      { size: "9×11, two floors", bestFor: "Long-term compact base", note: "Separate noisy utility blocks from maps, beds, or enchanting." },
    ],
    selectionTitle: "Plan the daily survival loop",
    selectionParagraphs: ["Walk through the routine before decorating: enter, unload resources, repair or smelt, craft, eat, and leave again. Putting those functions in sequence makes a compact base faster than a larger house with scattered rooms.", "Light the roof and perimeter as carefully as the interior. A building can be sealed while still allowing hostile mobs to gather above the door or on a flat roof."],
    tips: [
      { title: "Create a drop-off point", text: "Place common storage and furnaces close to the entrance used after mining trips." },
      { title: "Reserve exterior faces", text: "Leave clear walls for later farms, portals, or connected workshops." },
      { title: "Control roof spawns", text: "Use slabs, lighting, or other appropriate spawn-proofing on accessible roof surfaces." },
      { title: "Build a visible landmark", text: "A round watchtower can make the base easier to find from surrounding terrain." },
    ],
    relatedTools: ["circle", "gradient"],
    faqs: [
      { question: "What should every Minecraft survival house include?", answer: "Include a bed, crafting table, furnaces, food, safe lighting, and organized storage with a clear route to the door. Add enchanting, brewing, and bulk storage only when you can use them." },
      { question: "How large should a survival base be?", answer: "A 7×9 or 9×9 house is enough for early progression. Choose a two-floor 9×11 layout if it will remain your main base and you want separate utility and living levels." },
      { question: "Do these layouts work in Java and Bedrock?", answer: "Yes. The building layouts use ordinary block placement and work in both editions. Any later redstone additions should be checked separately because mechanics can differ." },
    ],
  },
];

export function getHouseCollection(slug: string) {
  return HOUSE_COLLECTIONS.find((collection) => collection.slug === slug);
}

