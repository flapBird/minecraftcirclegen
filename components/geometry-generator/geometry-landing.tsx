import { Suspense } from "react";
import { GeometryGenerator } from "./geometry-generator";
import { GeometryGeneratorFromUrl } from "./geometry-generator-from-url";
import { parseGeometryUrl } from "@/lib/geometry/geometry-url-state";
import type { GeometryShape } from "@/lib/geometry/geometry-types";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import type { ToolKey } from "@/lib/site/tools";

const COPY: Record<Exclude<GeometryShape, "circle">, {
  title: string;
  subtitle: string;
  intro: string;
  uses: string;
  toolKey: ToolKey;
}> = {
  oval: {
    title: "Minecraft Oval Generator",
    subtitle: "Create accurate block-by-block ovals with independent width and height controls.",
    intro: "A Minecraft oval generator converts an ellipse into a symmetrical block grid. Set a different width and height to plan oval arenas, gardens, racetracks, roofs, and decorative frames without estimating the curve by hand.",
    uses: "Leave Filled off for a one-block outline, or turn it on for a solid floor. Drag either size slider and the blueprint and material count update immediately.",
    toolKey: "oval",
  },
  sphere: {
    title: "Minecraft Sphere Generator",
    subtitle: "Build a complete Minecraft sphere from practical, layer-by-layer block blueprints.",
    intro: "A Minecraft sphere cannot be built reliably from one flat circle. This generator divides the full sphere into horizontal layers, showing the exact X/Z block layout for every Y level from the bottom to the top.",
    uses: "Set the diameter, choose Hollow or Filled, and start at Layer 1. Build each displayed grid at the shown height, then move to the next layer. The current-layer and full-sphere material counts update automatically.",
    toolKey: "sphere",
  },
  dome: {
    title: "Minecraft Dome Generator",
    subtitle: "Plan smooth hemisphere roofs with clear blueprints from the base to the peak.",
    intro: "A Minecraft dome is the upper half of a block sphere. The generator starts at the widest base ring and removes the lower half, giving you only the layers needed for a hemisphere roof.",
    uses: "Choose a diameter and build Layer 1 at the dome base. Continue upward one layer at a time until the peak. Hollow produces an open interior suitable for roofs; Filled produces a solid hemisphere.",
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
          <PageBreadcrumb toolKey={copy.toolKey} />
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
            <p className="section-label">ABOUT THE TOOL</p>
            <h2>How the {copy.title} works</h2>
            <p>{copy.intro}</p>
            <p>{copy.uses}</p>
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
