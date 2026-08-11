import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Minecraft Circle Gen",
    short_name: "Circle Gen",
    description:
      "Create exact Minecraft block circle blueprints with live sizing and PNG export.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7f2",
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
