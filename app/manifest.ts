import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Minecraft Circle Gen",
    short_name: "Circle Gen",
    description:
      "Create Minecraft block blueprints and building palettes with live controls and PNG export.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1e8",
    theme_color: "#3e7f4c",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
