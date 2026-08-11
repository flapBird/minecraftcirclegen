import type { Metadata } from "next";
import { GeometryLanding } from "@/components/geometry-generator/geometry-landing";

const title = "Minecraft Sphere Generator – Layer-by-Layer Blueprint";
const description = "Generate hollow or filled Minecraft sphere blueprints, inspect every layer from bottom to top, and calculate the total blocks required.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sphere-generator" },
  openGraph: { title, description, url: "/sphere-generator", type: "website" },
};

export default function SpherePage() {
  return <GeometryLanding shape="sphere" />;
}
