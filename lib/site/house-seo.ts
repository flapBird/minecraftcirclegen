import type { Metadata } from "next";

export const SITE_URL = "https://minecraftcirclegen.com";
const DEFAULT_IMAGE = "/og.png";

export function createHouseMetadata({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  imageAlt = "Minecraft house building blueprint and design tools",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      images: [{ url: image, width: 1200, height: 900, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path === "/" ? "/" : path}`;
}

