import type { ToolKey } from "@/lib/site/tools";

export type HouseCategory = "starter" | "small" | "modern" | "survival" | "cottage";
export type HouseDifficulty = "Easy" | "Easy–Medium" | "Medium";

export type HouseMaterial = {
  name: string;
  count: number;
};

export type BlueprintCell = {
  code: string;
  label: string;
  color: string;
};

export type BlueprintLayer = {
  number: number;
  title: string;
  description: string;
  rows: string[];
};

export type HouseBlueprint = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  useCase: string;
  category: HouseCategory;
  style: string;
  width: number;
  length: number;
  height: number;
  floors: 1 | 2;
  difficulty: HouseDifficulty;
  estimatedBuildTime: string;
  blockCount: number;
  materials: HouseMaterial[];
  palette: BlueprintCell[];
  layers: BlueprintLayer[];
  steps: string[];
  tips: string[];
  image: string;
  imageAlt: string;
  relatedTools: ToolKey[];
  relatedSlugs: string[];
};

export type HouseFaq = {
  question: string;
  answer: string;
};

export type HouseCollection = {
  slug: Exclude<HouseCategory, "cottage">;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  designSlugs: string[];
  sizeGuide: { size: string; bestFor: string; note: string }[];
  selectionTitle: string;
  selectionParagraphs: string[];
  tips: { title: string; text: string }[];
  relatedTools: ToolKey[];
  faqs: HouseFaq[];
};

