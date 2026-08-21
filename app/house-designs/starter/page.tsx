import type { Metadata } from "next";
import { HouseCollectionPage } from "@/components/house/house-collection-page";
import { getHouseCollection } from "@/content/houses/collections";
import { createHouseMetadata } from "@/lib/site/house-seo";

const collection = getHouseCollection("starter")!;
export const metadata: Metadata = createHouseMetadata({ title: "Minecraft Starter House Designs: Easy Plans & Blueprints", description: collection.description, path: "/house-designs/starter", image: "/house-designs/7x7-minecraft-starter-house.webp", imageAlt: "Original voxel illustration of an easy Minecraft starter house" });
export default function StarterHousePage() { return <HouseCollectionPage collection={collection} />; }

