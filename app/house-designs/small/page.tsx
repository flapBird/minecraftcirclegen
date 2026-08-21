import type { Metadata } from "next";
import { HouseCollectionPage } from "@/components/house/house-collection-page";
import { getHouseCollection } from "@/content/houses/collections";
import { createHouseMetadata } from "@/lib/site/house-seo";

const collection = getHouseCollection("small")!;
export const metadata: Metadata = createHouseMetadata({ title: "Small Minecraft House Designs: Compact Plans & Blueprints", description: collection.description, path: "/house-designs/small", image: "/house-designs/9x9-small-minecraft-house.webp", imageAlt: "Original voxel illustration of a small Minecraft cottage house" });
export default function SmallHousePage() { return <HouseCollectionPage collection={collection} />; }

