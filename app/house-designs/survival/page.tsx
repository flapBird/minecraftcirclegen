import type { Metadata } from "next";
import { HouseCollectionPage } from "@/components/house/house-collection-page";
import { getHouseCollection } from "@/content/houses/collections";
import { createHouseMetadata } from "@/lib/site/house-seo";

const collection = getHouseCollection("survival")!;
export const metadata: Metadata = createHouseMetadata({ title: "Minecraft Survival House Designs: Practical Blueprints", description: collection.description, path: "/house-designs/survival", image: "/house-designs/7x9-minecraft-survival-house.webp", imageAlt: "Original voxel illustration of a compact Minecraft survival house" });
export default function SurvivalHousePage() { return <HouseCollectionPage collection={collection} />; }

