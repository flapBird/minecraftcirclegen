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
            <h2>Plan smoother Minecraft block gradients</h2>
            <p>
              A digital gradient can use thousands of colors, but a Minecraft build needs a short,
              practical sequence of real blocks. This Minecraft gradient generator compares the
              representative colors of vanilla block textures and creates an ordered palette between
              the start and end points you choose.
            </p>
            <p>
              The smooth color bar shows the transition you are aiming for. The texture bar beneath
              it shows the actual blocks you will place, including their patterns and material changes.
              Use the numbered order for walls, roofs, floors, terrain, statues, pixel art, and other
              builds that need controlled color shading.
            </p>
          </section>

          <section>
            <p className="section-label">TWO STARTING POINTS</p>
            <h2>Choose blocks or work from exact colors</h2>
            <div className="mode-explainer">
              <div>
                <h3>Minecraft blocks</h3>
                <p>
                  Choose a real start block and end block from the searchable texture library. These
                  two anchors always remain fixed, while the generator finds suitable blocks between
                  them. Use this mode when the materials are already part of your build plan.
                </p>
              </div>
              <div>
                <h3>Exact colors</h3>
                <p>
                  Enter two hex colors or begin with a preset. The generator treats those colors as
                  visual targets and selects vanilla blocks that approximate the transition. Use this
                  mode when you have a color reference but have not chosen materials yet.
                </p>
              </div>
            </div>
          </section>

          <section id="how-to-use">
            <p className="section-label">USING THE GENERATOR</p>
            <h2>How to make a Minecraft block gradient</h2>
            <ol className="guide-steps">
              <li><strong>Choose the endpoint mode.</strong><span>Use Minecraft blocks for fixed materials, or Exact colors for a color-led search.</span></li>
              <li><strong>Set the start and end.</strong><span>Search the texture library for two blocks, or enter the colors your build should move between.</span></li>
              <li><strong>Choose the length.</strong><span>Short gradients create a clear material change; longer gradients provide more intermediate shades for wide surfaces.</span></li>
              <li><strong>Pick a block palette.</strong><span>Search all blocks, favor common survival materials, or narrow the candidates to a material family.</span></li>
              <li><strong>Check color and texture.</strong><span>Use the top bar to judge color flow and the lower bar to check whether neighboring block patterns work together.</span></li>
              <li><strong>Build or save the order.</strong><span>Place the numbered blocks from left to right, copy the list, or download the matching PNG plan.</span></li>
            </ol>
          </section>

          <section>
            <p className="section-label">HOW MATCHING WORKS</p>
            <h2>Why the suggested blocks form a smoother transition</h2>
            <p>
              The generator uses the average visible color of each real block texture rather than a
              generic color label. It divides the start-to-end transition into evenly spaced visual
              targets, then selects the closest unused block for each target from the active palette.
              In Minecraft blocks mode, the chosen endpoints are never replaced.
            </p>
            <p>
              Color matching is only the first part of a good gradient. A block with strong lines,
              bright highlights, or a noisy texture can feel different from a smoother block even when
              their average colors are close. That is why the generator displays the continuous color
              goal and the real texture sequence together.
            </p>
          </section>

          <section>
            <p className="section-label">BUILDING TIPS</p>
            <h2>Make the gradient look natural in your build</h2>
            <ul className="tips-grid">
              <li><strong>Give every step enough space.</strong> On a wide wall, repeat each material for several blocks instead of changing material in every column.</li>
              <li><strong>Judge the blocks in game lighting.</strong> Sunlight, shadows, biome tint, shaders, and the face of a block can change how the transition reads.</li>
              <li><strong>Watch texture direction.</strong> Logs, bricks, glazed terracotta, and other directional blocks may need careful orientation or a substitute.</li>
              <li><strong>Remove a disruptive middle block.</strong> If one texture attracts too much attention, shorten the gradient or try a narrower block palette.</li>
            </ul>
          </section>

          <ToolPageEnd toolKey="gradient" />
        </div>
      </article>
    </main>
  );
}
