export type MinecraftItemCategory =
  | "Combat"
  | "Tools"
  | "Armor"
  | "Building Blocks"
  | "Decoration"
  | "Redstone"
  | "Food"
  | "Materials"
  | "Transport"
  | "Utility";

export interface MinecraftItem {
  id: string;
  name: string;
  maxStack: number;
  category: MinecraftItemCategory;
}

function titleFromId(id: string) {
  return id
    .split("_")
    .map((part) => {
      const upper = part.toUpperCase();
      if (["TNT", "GPS"].includes(upper)) return upper;
      return `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    })
    .join(" ");
}

function items(
  ids: readonly string[],
  category: MinecraftItemCategory,
  maxStack = 64,
): MinecraftItem[] {
  return ids.map((id) => ({ id, name: titleFromId(id), maxStack, category }));
}

const COLORS = [
  "white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray",
  "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black",
] as const;

const COLOR_ITEMS = COLORS.flatMap((color) => [
  ...items([
    `${color}_wool`, `${color}_carpet`, `${color}_concrete`, `${color}_concrete_powder`,
    `${color}_terracotta`, `${color}_glazed_terracotta`, `${color}_stained_glass`,
    `${color}_stained_glass_pane`, `${color}_candle`,
  ], "Decoration"),
  ...items([`${color}_dye`], "Materials"),
  ...items([`${color}_banner`], "Decoration", 16),
  ...items([`${color}_bed`, `${color}_shulker_box`], "Decoration", 1),
]);

const TREE_WOODS = [
  "oak", "spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry",
] as const;

const WOOD_ITEMS = TREE_WOODS.flatMap((wood) => [
  ...items([
    `${wood}_planks`, `${wood}_log`, `${wood}_wood`, `stripped_${wood}_log`,
    `stripped_${wood}_wood`, `${wood}_stairs`, `${wood}_slab`, `${wood}_fence`,
    `${wood}_fence_gate`, `${wood}_door`, `${wood}_trapdoor`, `${wood}_button`,
    `${wood}_pressure_plate`,
  ], "Building Blocks"),
  ...items([`${wood}_sign`, `${wood}_hanging_sign`], "Decoration", 16),
  ...items([`${wood}_boat`, `${wood}_chest_boat`], "Transport", 1),
]);

const NETHER_WOOD_ITEMS = ["crimson", "warped"].flatMap((wood) => [
  ...items([
    `${wood}_planks`, `${wood}_stem`, `${wood}_hyphae`, `stripped_${wood}_stem`,
    `stripped_${wood}_hyphae`, `${wood}_stairs`, `${wood}_slab`, `${wood}_fence`,
    `${wood}_fence_gate`, `${wood}_door`, `${wood}_trapdoor`, `${wood}_button`,
    `${wood}_pressure_plate`,
  ], "Building Blocks"),
  ...items([`${wood}_sign`, `${wood}_hanging_sign`], "Decoration", 16),
]);

const BASE_ITEMS: MinecraftItem[] = [
  ...items([
    "wooden_sword", "stone_sword", "iron_sword", "golden_sword", "diamond_sword",
    "netherite_sword", "bow", "crossbow", "trident", "shield", "arrow",
    "spectral_arrow", "tipped_arrow",
  ], "Combat", 1),
  ...items(["arrow", "spectral_arrow", "tipped_arrow"], "Combat"),
  ...items([
    "wooden_pickaxe", "stone_pickaxe", "iron_pickaxe", "golden_pickaxe", "diamond_pickaxe",
    "netherite_pickaxe", "wooden_axe", "stone_axe", "iron_axe", "golden_axe",
    "diamond_axe", "netherite_axe", "wooden_shovel", "stone_shovel", "iron_shovel",
    "golden_shovel", "diamond_shovel", "netherite_shovel", "wooden_hoe", "stone_hoe",
    "iron_hoe", "golden_hoe", "diamond_hoe", "netherite_hoe", "fishing_rod",
    "flint_and_steel", "shears", "brush", "carrot_on_a_stick", "warped_fungus_on_a_stick",
  ], "Tools", 1),
  ...items([
    "leather_helmet", "leather_chestplate", "leather_leggings", "leather_boots",
    "chainmail_helmet", "chainmail_chestplate", "chainmail_leggings", "chainmail_boots",
    "iron_helmet", "iron_chestplate", "iron_leggings", "iron_boots", "golden_helmet",
    "golden_chestplate", "golden_leggings", "golden_boots", "diamond_helmet",
    "diamond_chestplate", "diamond_leggings", "diamond_boots", "netherite_helmet",
    "netherite_chestplate", "netherite_leggings", "netherite_boots", "turtle_helmet", "elytra",
  ], "Armor", 1),
  ...items([
    "stone", "granite", "polished_granite", "diorite", "polished_diorite", "andesite",
    "polished_andesite", "deepslate", "cobbled_deepslate", "polished_deepslate",
    "calcite", "tuff", "dripstone_block", "grass_block", "dirt", "coarse_dirt",
    "rooted_dirt", "mud", "clay", "gravel", "sand", "red_sand", "cobblestone",
    "mossy_cobblestone", "stone_bricks", "mossy_stone_bricks", "cracked_stone_bricks",
    "chiseled_stone_bricks", "bricks", "mud_bricks", "packed_mud", "sandstone",
    "cut_sandstone", "chiseled_sandstone", "smooth_sandstone", "red_sandstone",
    "cut_red_sandstone", "chiseled_red_sandstone", "smooth_red_sandstone", "glass",
    "glass_pane", "obsidian", "crying_obsidian", "bedrock", "netherrack", "soul_sand",
    "soul_soil", "basalt", "polished_basalt", "smooth_basalt", "blackstone",
    "polished_blackstone", "polished_blackstone_bricks", "end_stone", "end_stone_bricks",
    "purpur_block", "purpur_pillar", "prismarine", "prismarine_bricks", "dark_prismarine",
    "sea_lantern", "quartz_block", "smooth_quartz", "quartz_bricks", "quartz_pillar",
    "amethyst_block", "budding_amethyst", "moss_block", "snow_block", "ice", "packed_ice",
    "blue_ice", "slime_block", "honey_block", "hay_block", "bone_block", "dried_kelp_block",
    "coal_block", "iron_block", "gold_block", "redstone_block", "lapis_block",
    "diamond_block", "emerald_block", "netherite_block", "copper_block", "cut_copper",
    "exposed_copper", "weathered_copper", "oxidized_copper", "waxed_copper_block",
    "waxed_exposed_copper", "waxed_weathered_copper", "waxed_oxidized_copper",
  ], "Building Blocks"),
  ...items([
    "stone_stairs", "stone_slab", "cobblestone_stairs", "cobblestone_slab",
    "stone_brick_stairs", "stone_brick_slab", "brick_stairs", "brick_slab",
    "sandstone_stairs", "sandstone_slab", "red_sandstone_stairs", "red_sandstone_slab",
    "deepslate_brick_stairs", "deepslate_brick_slab", "deepslate_tile_stairs",
    "deepslate_tile_slab", "blackstone_stairs", "blackstone_slab", "end_stone_brick_stairs",
    "end_stone_brick_slab", "purpur_stairs", "purpur_slab", "quartz_stairs", "quartz_slab",
    "prismarine_stairs", "prismarine_slab", "dark_prismarine_stairs", "dark_prismarine_slab",
  ], "Building Blocks"),
  ...items([
    "torch", "soul_torch", "lantern", "soul_lantern", "glowstone", "shroomlight",
    "ochre_froglight", "verdant_froglight", "pearlescent_froglight", "sea_pickle",
    "chain", "ladder", "scaffolding", "bookshelf", "chiseled_bookshelf", "lectern",
    "painting", "item_frame", "glow_item_frame", "flower_pot", "decorated_pot", "armor_stand",
    "end_rod", "bell", "campfire", "soul_campfire", "cobweb", "sponge", "wet_sponge",
    "lily_pad", "vine", "glow_lichen", "pointed_dripstone", "azalea", "flowering_azalea",
  ], "Decoration"),
  ...items(["armor_stand"], "Decoration", 16),
  ...items([
    "redstone", "redstone_torch", "repeater", "comparator", "lever", "stone_button",
    "stone_pressure_plate", "piston", "sticky_piston", "observer", "dispenser", "dropper",
    "hopper", "target", "daylight_detector", "tripwire_hook", "trapped_chest", "note_block",
    "jukebox", "redstone_lamp", "sculk_sensor", "calibrated_sculk_sensor", "lightning_rod",
  ], "Redstone"),
  ...items([
    "apple", "golden_apple", "enchanted_golden_apple", "bread", "cookie", "melon_slice",
    "sweet_berries", "glow_berries", "chorus_fruit", "carrot", "golden_carrot", "potato",
    "baked_potato", "poisonous_potato", "beetroot", "dried_kelp", "beef", "cooked_beef",
    "porkchop", "cooked_porkchop", "chicken", "cooked_chicken", "mutton", "cooked_mutton",
    "rabbit", "cooked_rabbit", "cod", "cooked_cod", "salmon", "cooked_salmon",
    "tropical_fish", "pufferfish", "spider_eye", "rotten_flesh",
  ], "Food"),
  ...items(["cake", "mushroom_stew", "rabbit_stew", "beetroot_soup", "suspicious_stew"], "Food", 1),
  ...items(["honey_bottle"], "Food", 16),
  ...items([
    "coal", "charcoal", "raw_iron", "raw_gold", "raw_copper", "iron_ingot", "gold_ingot",
    "copper_ingot", "netherite_ingot", "netherite_scrap", "iron_nugget", "gold_nugget",
    "diamond", "emerald", "lapis_lazuli", "redstone", "quartz", "amethyst_shard",
    "echo_shard", "prismarine_shard", "prismarine_crystals", "stick", "flint", "string",
    "feather", "leather", "rabbit_hide", "paper", "book", "clay_ball", "brick",
    "nether_brick", "blaze_rod", "blaze_powder", "magma_cream", "ghast_tear", "ender_pearl",
    "ender_eye", "shulker_shell", "nautilus_shell", "heart_of_the_sea", "phantom_membrane",
    "slime_ball", "honeycomb", "ink_sac", "glow_ink_sac", "gunpowder", "bone", "bone_meal",
  ], "Materials"),
  ...items(["ender_pearl", "egg", "snowball"], "Materials", 16),
  ...items([
    "rail", "powered_rail", "detector_rail", "activator_rail",
  ], "Transport"),
  ...items([
    "minecart", "chest_minecart", "furnace_minecart", "hopper_minecart", "tnt_minecart",
  ], "Transport", 1),
  ...items([
    "crafting_table", "furnace", "blast_furnace", "smoker", "stonecutter", "cartography_table",
    "fletching_table", "smithing_table", "loom", "grindstone", "anvil", "chipped_anvil",
    "damaged_anvil", "enchanting_table", "brewing_stand", "cauldron", "chest", "barrel",
    "ender_chest", "composter", "beacon", "conduit", "respawn_anchor", "lodestone",
    "clock", "compass", "recovery_compass", "spyglass", "map", "filled_map", "name_tag",
    "lead", "firework_rocket", "firework_star", "fire_charge", "experience_bottle",
    "totem_of_undying", "dragon_breath", "end_crystal", "goat_horn", "saddle",
  ], "Utility"),
  ...items([
    "water_bucket", "lava_bucket", "milk_bucket", "powder_snow_bucket", "cod_bucket",
    "salmon_bucket", "pufferfish_bucket", "tropical_fish_bucket", "axolotl_bucket",
    "tadpole_bucket", "potion", "splash_potion", "lingering_potion", "enchanted_book",
    "writable_book", "knowledge_book", "bundle", "totem_of_undying", "goat_horn", "saddle",
    "iron_horse_armor", "golden_horse_armor", "diamond_horse_armor", "leather_horse_armor",
  ], "Utility", 1),
  ...items(["bucket"], "Utility", 16),
  ...items(["written_book"], "Utility", 16),
];

const BAMBOO_ITEMS = [
  ...items([
    "bamboo_block", "stripped_bamboo_block", "bamboo_planks", "bamboo_mosaic", "bamboo_stairs",
    "bamboo_mosaic_stairs", "bamboo_slab", "bamboo_mosaic_slab", "bamboo_fence",
    "bamboo_fence_gate", "bamboo_door", "bamboo_trapdoor", "bamboo_button",
    "bamboo_pressure_plate",
  ], "Building Blocks"),
  ...items(["bamboo_sign", "bamboo_hanging_sign"], "Decoration", 16),
  ...items(["bamboo_raft", "bamboo_chest_raft"], "Transport", 1),
];

const byId = new Map<string, MinecraftItem>();
[...BASE_ITEMS, ...COLOR_ITEMS, ...WOOD_ITEMS, ...NETHER_WOOD_ITEMS, ...BAMBOO_ITEMS]
  .forEach((item) => byId.set(item.id, item));

/**
 * Searchable Java Edition item catalogue. The baseline intentionally uses
 * vanilla item IDs available in Java 1.20.4 so every entry also exists in the
 * two newer syntax families supported by the command generator.
 */
export const JAVA_ITEMS = [...byId.values()].sort((left, right) =>
  left.name.localeCompare(right.name),
);

export function getJavaItem(id: string) {
  return byId.get(id) ?? null;
}
