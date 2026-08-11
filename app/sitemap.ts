import type { MetadataRoute } from "next";

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
