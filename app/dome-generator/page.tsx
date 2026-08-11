import type { Metadata } from "next";
import { GeometryLanding } from "@/components/geometry-generator/geometry-landing";

const title = "Minecraft Dome Generator – Layer-by-Layer Blueprint";
const description = "Create Minecraft dome and hemisphere roof blueprints with base-to-peak layers, hollow or filled modes, and material totals.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/dome-generator" },
  openGraph: { title, description, url: "/dome-generator", type: "website" },
};

export default function DomePage() {
  return <GeometryLanding shape="dome" />;
}
