import type { MetadataRoute } from "next";
import { HOUSE_BLUEPRINT_SLUGS } from "@/content/houses/blueprints";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://minecraftcirclegen.com";
  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...["oval-generator", "sphere-generator", "dome-generator"].map((path) => ({
      url: `${baseUrl}/${path}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...[
      "minecraft-gradient-generator",
      "minecraft-font-generator",
      "minecraft-pixel-art-generator",
      "minecraft-map-art-generator",
    ].map((path) => ({
      url: `${baseUrl}/${path}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...[
      "house-designs",
      "house-designs/starter",
      "house-designs/small",
      "house-designs/staircases",
      "house-designs/modern",
      "house-designs/survival",
      "house-blueprints",
    ].map((path) => ({
      url: `${baseUrl}/${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "house-designs" || path === "house-blueprints" ? 0.9 : 0.8,
    })),
    ...HOUSE_BLUEPRINT_SLUGS.map((slug) => ({
      url: `${baseUrl}/house-blueprints/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
