import type { Metadata } from "next";
import { GeometryLanding } from "@/components/geometry-generator/geometry-landing";

const title = "Minecraft Oval Generator – Block Ellipse Blueprint";
const description = "Generate accurate hollow or filled Minecraft oval blueprints by width and height, with live material counts and PNG export.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/oval-generator" },
  openGraph: { title, description, url: "/oval-generator", type: "website" },
};

export default function OvalPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <GeometryLanding shape="oval" searchParams={searchParams} />;
}
