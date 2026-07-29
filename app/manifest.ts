import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Minecraft Circle Gen",
    short_name: "Circle Gen",
    description:
      "Create exact block circle blueprints and build them row by row.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7f2",
    theme_color: "#3e7f4c",
    icons: [
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
