import type { Metadata } from "next";
import { HouseCollectionPage } from "@/components/house/house-collection-page";
import { getHouseCollection } from "@/content/houses/collections";
import { createHouseMetadata } from "@/lib/site/house-seo";

const collection = getHouseCollection("modern")!;
export const metadata: Metadata = createHouseMetadata({ title: "Minecraft Modern House Designs with Plans & Blueprints", description: collection.description, path: "/house-designs/modern", image: "/house-designs/11x9-modern-minecraft-house.webp", imageAlt: "Original voxel illustration of a modern Minecraft house in concrete and glass" });
export default function ModernHousePage() { return <HouseCollectionPage collection={collection} />; }

