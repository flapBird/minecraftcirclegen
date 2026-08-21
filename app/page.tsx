import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GeometryGenerator } from "@/components/geometry-generator/geometry-generator";
import { GeometryGeneratorFromUrl } from "@/components/geometry-generator/geometry-generator-from-url";
import { parseGeometryUrl } from "@/lib/geometry/geometry-url-state";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolDirectory } from "@/components/layout/tool-page-end";

const title = "Minecraft Circle Generator – Build Perfect Block Circles";
const description =
  "Create perfect hollow or filled Minecraft circles by diameter. Preview the exact block grid, calculate materials, and download your blueprint.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://minecraftcirclegen.com/",
    type: "website",
    images: [
      {
        url: "https://minecraftcirclegen.com/og.png",
        width: 1200,
        height: 630,
        alt: "Minecraft Circle Gen block circle blueprint",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://minecraftcirclegen.com/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqs = [
  {
    question: "What is a Minecraft circle generator?",
    answer:
      "A Minecraft circle generator converts a diameter into a block-by-block, pixel-style circle blueprint. It shows exactly which blocks to place instead of relying on a smooth geometric drawing that cannot be built on the Minecraft grid.",
  },
  {
    question: "How do I make a perfect circle in Minecraft?",
    answer:
      "Choose a diameter, copy the generated block grid, and keep the shape symmetrical around its center axes. Use the grid lines to place each block accurately.",
  },
  {
    question: "What is the best diameter for a Minecraft circle?",
    answer:
      "The best diameter depends on the build. Sizes from 9 to 15 blocks work well for compact rooms and towers, while 21 to 31 blocks give larger builds more usable interior space. Bigger arenas and bases often start at 51 blocks.",
  },
  {
    question: "Should I use an odd or even diameter?",
    answer:
      "Both work. An odd diameter has one center block, which can make alignment convenient. An even diameter is centered between four blocks and often lines up naturally with two-block-wide entrances. Choose the layout that fits your build.",
  },
  {
    question: "How many blocks do I need?",
    answer:
      "The statistics above the blueprint count the occupied cells in the exact generated shape, so you can prepare materials before building.",
  },
  {
    question: "Can I create a filled circle?",
    answer:
      "Yes. Turn on Filled for a solid circular platform or foundation, or leave it off for a one-block outline.",
  },
  {
    question: "Can I download the circle blueprint?",
    answer:
      "Yes. Download current blueprint creates a high-resolution PNG of the grid currently shown.",
  },
  {
    question: "Does this work for Java and Bedrock Edition?",
    answer:
      "Yes. The blueprint is a general block layout and works in both Java Edition and Bedrock Edition. The tool does not connect to the game or place blocks automatically.",
  },
];

const sizes = [
  ["7 blocks", "A compact fountain, pillar base, or tiny turret."],
  ["9 blocks", "A small tower, garden feature, or circular stair core."],
  ["11 blocks", "A comfortable starter tower or detailed fountain basin."],
  ["15 blocks", "A round room, watchtower, or compact dome foundation."],
  ["21 blocks", "A versatile base, pavilion, or medium arena center."],
  ["31 blocks", "A large hall, substantial tower, or town plaza."],
  ["51 blocks", "A major arena, city landmark, or large storage base."],
  ["101 blocks", "A giant hub, megabase footprint, or server-scale project."],
];

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Minecraft Circle Gen",
    url: "https://minecraftcirclegen.com/",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <link rel="canonical" href="https://minecraftcirclegen.com/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main id="main-content">
        <section className="hero">
          <div className="page-container">
            <PageBreadcrumb toolKey="circle" />
            <h1>Minecraft Circle Generator</h1>
            <p className="hero-subtitle">
              Create perfect Minecraft circles, calculate the blocks you need,
              and copy the exact block layout.
            </p>
          </div>
        </section>

        <section className="tool-section" aria-label="Minecraft circle generator tool">
          <div className="page-container">
            <Suspense
              fallback={
                <GeometryGenerator
                  shape="circle"
                  initialOptions={parseGeometryUrl("circle", "")}
                />
              }
            >
              <GeometryGeneratorFromUrl shape="circle" />
            </Suspense>
          </div>
        </section>

        <article className="seo-content">
          <div className="content-container">
            <section className="tool-introduction">
              <p className="section-label">ABOUT THE TOOL</p>
              <h2>What is a Minecraft circle generator?</h2>
              <p>
                A Minecraft circle generator turns a diameter into a practical
                block-by-block plan for a round build. Because Minecraft uses a
                square grid, a smooth mathematical circle cannot be placed
                directly in the game. The tool converts that curve into a
                balanced pixel-style footprint, showing exactly which blocks
                belong in every row.
              </p>
              <p>
                Minecraft Circle Gen goes beyond a simple circle image. It
                calculates the required blocks and lets you download or share
                the full blueprint. It is useful for planning tower walls, circular
                rooms, arenas, platforms, foundations, roads, and other
                two-dimensional round layouts in both Java and Bedrock Edition.
              </p>
            </section>

            <section id="how-to-use">
              <p className="section-label">USING THE GENERATOR</p>
              <h2>How to use the Minecraft Circle Generator</h2>
              <p>
                Start by entering the diameter of the circle you want to build.
                The diameter is the complete width of the finished blueprint in
                blocks, from one outside edge to the other. The preview updates
                as soon as the value changes, so it is easy to compare several
                sizes without pressing a generate button.
              </p>
              <ol className="guide-steps">
                <li>
                  <strong>Enter a diameter.</strong>
                  <span>
                    Drag the diameter slider or enter any whole number from 3
                    to 512.
                  </span>
                </li>
                <li>
                  <strong>Choose a circle mode.</strong>
                  <span>
                    Leave Filled off for a one-block outline, or turn it on for
                    a solid footprint.
                  </span>
                </li>
                <li>
                  <strong>Read the blueprint.</strong>
                  <span>
                    Green cells are blocks. The crossing lines mark the true
                    horizontal and vertical center of the circle.
                  </span>
                </li>
                <li>
                  <strong>Inspect the grid.</strong>
                  <span>
                    Toggle grid lines and drag the Zoom slider when you need a
                    closer view.
                  </span>
                </li>
                <li>
                  <strong>Save or share the plan.</strong>
                  <span>
                    Download a clean PNG for reference or copy a link that
                    restores the same diameter and fill mode.
                  </span>
                </li>
              </ol>
            </section>

            <section>
              <h2>How to build a circle in Minecraft</h2>
              <p>
                Minecraft worlds are made from square blocks, so a mathematical
                curve cannot be reproduced literally. A convincing circle is a
                carefully balanced pixel approximation: short straight runs
                near the top and bottom gradually become longer toward the
                middle. The important part is not making every step identical.
                It is keeping each step mirrored across the center.
              </p>
              <p>
                Before placing the outline, mark the horizontal and vertical
                center axes on the ground with temporary blocks. On an odd-size
                circle the two axes cross on the center block. On an even-size
                circle they cross between the central four blocks. These guides
                give every row a dependable reference point and stop the shape
                from drifting sideways as it grows.
              </p>
              <p>
                You can start at the top edge and work down one row at a time,
                or build outward from the center row. Starting at the top works
                naturally because the grid makes each horizontal run easy to
                count. For a large circle, another reliable method is to finish
                one quarter first, check the pattern, and mirror it into the
                other three quarters. Whichever approach you use, count the
                length of each straight segment rather than estimating its
                endpoints by eye.
              </p>
            </section>

            <section>
              <h2>Hollow vs filled circles</h2>
              <div className="mode-explainer">
                <div>
                  <span className="mode-icon hollow" aria-hidden="true" />
                  <h3>Hollow circles</h3>
                  <p>
                    Hollow mode draws a one-block outside edge. It is the
                    material-efficient choice for tower walls, arena boundaries,
                    round rooms, decorative rings, and plans where the interior
                    should stay open.
                  </p>
                </div>
                <div>
                  <span className="mode-icon filled" aria-hidden="true" />
                  <h3>Filled circles</h3>
                  <p>
                    Filled mode occupies every block inside the outline. It is
                    best for foundations, floors, islands, circular platforms,
                    roof layers, and any design that needs a complete surface.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2>Odd and even diameter circles</h2>
              <p>
                An odd diameter such as 21 has a single center block. Its
                coordinates run evenly in both directions, and that center block
                can be a convenient anchor for towers, beacons, paths, or radial
                decoration. An even diameter such as 22 has its center at the
                intersection between four blocks. The blueprint shows half-step
                relative coordinates so that the geometry stays honest and
                symmetrical.
              </p>
              <p>
                Neither choice is universally better. Odd circles are often easy
                to align around a central feature, while even circles work well
                with paired doors, two-block corridors, and symmetrical interior
                layouts. Decide from the surrounding build rather than choosing
                a size only because one type is easier to count.
              </p>
            </section>

            <section>
              <h2>Common Minecraft circle sizes</h2>
              <p>
                These sizes are useful starting points, not rigid rules. Check
                the generated interior space before committing materials,
                especially when the circle will contain walls, stairs, storage,
                or redstone.
              </p>
              <div className="size-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Diameter</th>
                      <th>Good for</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizes.map(([size, use]) => (
                      <tr key={size}>
                        <th scope="row">{size}</th>
                        <td>{use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Small changes matter more at compact sizes. Moving from 9 to 11
                blocks can noticeably improve the usable floor area. At larger
                scales, leave room for wall thickness and circulation: a
                31-block outer diameter with a three-block wall has much less
                interior width than the number 31 initially suggests.
              </p>
            </section>

            <section>
              <h2>Minecraft circle building tips</h2>
              <ul className="tips-grid">
                <li>
                  <strong>Mark both center axes.</strong>
                  Keep them in place until the outline closes and every side has
                  been checked.
                </li>
                <li>
                  <strong>Use temporary colors.</strong>
                  A contrasting block at segment changes makes counting easier;
                  replace it after verification.
                </li>
                <li>
                  <strong>Mirror a quarter.</strong>
                  Build one clean quadrant, then copy its turns across the axes
                  for strong symmetry.
                </li>
                <li>
                  <strong>Split large projects.</strong>
                  Treat a 51- or 101-block circle as several sections and verify
                  each section before moving on.
                </li>
                <li>
                  <strong>Bring extra materials.</strong>
                  The total is exact for the plan, but scaffolding and accidental
                  placements usually require a small reserve.
                </li>
                <li>
                  <strong>Check every turn.</strong>
                  Use the grid lines before each turn in
                  the outline to avoid carrying a counting error through the build.
                </li>
              </ul>
              <p>
                For walls that rise several blocks, finish and verify the entire
                ground-level circle before copying it upward. A small mistake in
                the foundation becomes much more expensive after several layers.
                The generator supplies a two-dimensional footprint; height,
                decoration, entrances, and structural details remain yours to
                design in game.
              </p>
            </section>

            <section className="home-house-resource">
              <div>
                <p className="section-label">BUILDING RESOURCES</p>
                <h2>Minecraft house designs you can actually build</h2>
                <p>
                  Move from a shape generator to a complete project. Browse
                  starter, small, modern, and survival houses with dimensions,
                  material counts, build times, and layer-by-layer plans.
                </p>
                <div className="home-resource-links">
                  <Link href="/house-designs">Explore house designs →</Link>
                  <Link href="/house-blueprints">Open house blueprints</Link>
                </div>
              </div>
              <div
                className="home-resource-grid"
                aria-label="Decorative house blueprint footprint"
              >
                {Array.from({ length: 49 }, (_, index) => {
                  const x = index % 7;
                  const z = Math.floor(index / 7);
                  const edge = x === 0 || z === 0 || x === 6 || z === 6;
                  const door = z === 6 && x === 3;
                  return (
                    <span
                      key={index}
                      className={door ? "is-door" : edge ? "is-wall" : "is-floor"}
                    />
                  );
                })}
              </div>
            </section>

            <section id="faq" className="faq-section">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                {faqs.map((faq) => (
                  <details key={faq.question}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
            <ToolDirectory toolKey="circle" />
          </div>
        </article>
      </main>
    </>
  );
}
