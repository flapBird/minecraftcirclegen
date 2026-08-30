import { Suspense } from "react";
import { GeometryGenerator } from "./geometry-generator";
import { GeometryGeneratorFromUrl } from "./geometry-generator-from-url";
import { parseGeometryUrl } from "@/lib/geometry/geometry-url-state";
import type { GeometryShape } from "@/lib/geometry/geometry-types";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import type { ToolKey } from "@/lib/site/tools";

const COPY: Record<Exclude<GeometryShape, "circle">, {
  title: string;
  subtitle: string;
  intro: string;
  steps: Array<{ title: string; description: string }>;
  toolKey: ToolKey;
}> = {
  oval: {
    title: "Minecraft Oval Generator",
    subtitle: "Create accurate block-by-block ovals with independent width and height controls.",
    intro: "A Minecraft oval generator converts an ellipse into a symmetrical block grid. Set a different width and height to plan oval arenas, gardens, racetracks, roofs, and decorative frames without estimating the curve by hand.",
    steps: [
      { title: "Set the width and height.", description: "Use different dimensions to control how wide or tall the finished oval will be." },
      { title: "Choose hollow or filled.", description: "Use a hollow outline for walls and frames, or a filled plan for floors and foundations." },
      { title: "Read the block grid.", description: "Every colored cell is one block, while the center axes keep both halves aligned." },
      { title: "Save or share the plan.", description: "Download the current blueprint or copy a link that restores the same dimensions and mode." },
    ],
    toolKey: "oval",
  },
  sphere: {
    title: "Minecraft Sphere Generator",
    subtitle: "Build a complete Minecraft sphere from practical, layer-by-layer block blueprints.",
    intro: "A Minecraft sphere cannot be built reliably from one flat circle. This generator divides the full sphere into horizontal layers, showing the exact X/Z block layout for every Y level from the bottom to the top.",
    steps: [
      { title: "Set the sphere diameter.", description: "Choose the complete width of the sphere in blocks." },
      { title: "Choose hollow or filled.", description: "Hollow creates a shell with an open interior; filled creates a solid volume." },
      { title: "Build layer by layer.", description: "Start at Layer 1 and place each X/Z grid one block above the previous layer." },
      { title: "Track and save the build.", description: "Use the current-layer and total counts, then download or share the exact blueprint." },
    ],
    toolKey: "sphere",
  },
  dome: {
    title: "Minecraft Dome Generator",
    subtitle: "Plan smooth hemisphere roofs with clear blueprints from the base to the peak.",
    intro: "A Minecraft dome is the upper half of a block sphere. The generator starts at the widest base ring and removes the lower half, giving you only the layers needed for a hemisphere roof.",
    steps: [
      { title: "Set the dome diameter.", description: "Match the widest base layer to the opening or structure the dome must cover." },
      { title: "Choose hollow or filled.", description: "Hollow is suited to roofs and interiors; filled creates a solid hemisphere." },
      { title: "Build from the base upward.", description: "Place Layer 1 at the widest ring, then move one block higher for each following grid." },
      { title: "Check totals and export.", description: "Prepare the listed materials and download or share the finished layer plan." },
    ],
    toolKey: "dome",
  },
};

export function GeometryLanding({ shape }: {
  shape: Exclude<GeometryShape, "circle">;
}) {
  const copy = COPY[shape];
  return (
    <main id="main-content">
      <section className="hero geometry-hero">
        <div className="page-container">
          <h1>{copy.title}</h1>
          <p className="hero-subtitle">{copy.subtitle}</p>
        </div>
      </section>
      <section className="tool-section" aria-label={`${copy.title} tool`}>
        <div className="page-container">
          <Suspense
            fallback={
              <GeometryGenerator
                shape={shape}
                initialOptions={parseGeometryUrl(shape, "")}
              />
            }
          >
            <GeometryGeneratorFromUrl shape={shape} />
          </Suspense>
        </div>
      </section>
      <article className="seo-content geometry-content">
        <div className="content-container">
          <section>
            <h2>What is the {copy.title}?</h2>
            <p>{copy.intro}</p>
          </section>
          <section id="how-to-use">
            <h2>How to use the {copy.title}</h2>
            <ol className="guide-steps">
              {copy.steps.map((step) => (
                <li key={step.title}><strong>{step.title}</strong><span>{step.description}</span></li>
              ))}
            </ol>
          </section>
          <section>
            <h2>Designed for actual block building</h2>
            <p>
              Every colored cell represents one Minecraft block. Center axes keep the plan aligned,
              and Download current blueprint saves the exact grid currently shown. The layout works
              for both Java and Bedrock builds.
            </p>
          </section>
          <ToolPageEnd toolKey={copy.toolKey} />
        </div>
      </article>
    </main>
  );
}
