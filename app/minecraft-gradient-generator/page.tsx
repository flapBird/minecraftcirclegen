import type { Metadata } from "next";
import { Suspense } from "react";
import { GradientGenerator } from "@/components/gradient-generator/gradient-generator";
import { GradientGeneratorFromUrl } from "@/components/gradient-generator/gradient-generator-from-url";
import { DEFAULT_GRADIENT_OPTIONS } from "@/lib/gradient/gradient-url-state";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolPageEnd } from "@/components/layout/tool-page-end";

const title = "Minecraft Gradient Generator – Create Block Palettes";
const description =
  "Create smooth Minecraft block gradients from any two colors. Choose a vanilla block palette, control the number of steps, and download the result.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-gradient-generator" },
  openGraph: {
    title,
    description,
    url: "/minecraft-gradient-generator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function GradientGeneratorPage() {
  return (
    <main>
      <section className="hero gradient-hero">
        <div className="page-container">
          <PageBreadcrumb toolKey="gradient" />
          <h1>Minecraft Gradient Generator</h1>
          <p className="hero-subtitle">
            Turn any two colors into a smooth, buildable sequence of Minecraft blocks.
          </p>
        </div>
      </section>

      <section className="tool-section" aria-label="Minecraft gradient generator tool">
        <div className="page-container">
          <Suspense
            fallback={<GradientGenerator initialOptions={DEFAULT_GRADIENT_OPTIONS} />}
          >
            <GradientGeneratorFromUrl />
          </Suspense>
        </div>
      </section>

      <article className="seo-content gradient-content">
        <div className="content-container">
          <section>
            <p className="section-label">ABOUT THE TOOL</p>
            <h2>Build smoother Minecraft color transitions</h2>
            <p>
              A Minecraft gradient replaces a smooth digital color blend with a practical sequence
              of blocks. Choose the colors at both ends, set how many materials you want to use, and
              the generator finds a progression that can be placed directly in your build.
            </p>
            <p>
              Use shorter palettes for compact walls and paths, or longer palettes when a large roof,
              cliff, statue, or organic structure has enough space for a gradual transition.
            </p>
          </section>

          <section id="how-to-use">
            <p className="section-label">USING THE GENERATOR</p>
            <h2>How to make a Minecraft block gradient</h2>
            <ol className="guide-steps">
              <li><strong>Choose two colors.</strong><span>Pick the light and dark ends of the transition, or enter exact hex values.</span></li>
              <li><strong>Set the length.</strong><span>Use fewer blocks for a bold change and more blocks for a smoother blend.</span></li>
              <li><strong>Choose a palette.</strong><span>Limit the result to common, colorful, or natural building materials.</span></li>
              <li><strong>Build in order.</strong><span>Follow the numbered blocks from the first color to the last.</span></li>
              <li><strong>Save the plan.</strong><span>Download a PNG or copy the full block list for later.</span></li>
            </ol>
          </section>

          <ToolPageEnd toolKey="gradient" />
        </div>
      </article>
    </main>
  );
}
