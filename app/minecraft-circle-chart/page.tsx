import type { Metadata } from "next";
import Link from "next/link";
import { ChartShareButton } from "@/components/circle-chart/chart-share-button";
import { CIRCLE_CHART_GROUPS } from "@/content/circle-chart";
import { generateCircle } from "@/lib/circle/generate-circle";

const title = "Minecraft Circle Chart – Block Templates for Every Diameter (3 to 101)";
const description =
  "Browse the full Minecraft circle chart: a block-by-block template for every diameter from 3 to 101, with exact outline and filled block counts, stacks of 64, and one-click generator links.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-circle-chart" },
  openGraph: {
    images: [{ url: "/og/minecraft-circle-chart.png", width: 1200, height: 630 }],
    title,
    description,
    url: "/minecraft-circle-chart",
    type: "website",
  },
  twitter: { images: [{ url: "/og/minecraft-circle-chart.png", width: 1200, height: 630 }], card: "summary_large_image", title, description },
};

const faqs = [
  {
    question: "What is a Minecraft circle chart?",
    answer:
      "A circle chart is a reference grid that shows exactly which blocks to place for a round build of a specific diameter. Every square on the chart is one block, so you can copy the pattern row by row in game without running a generator.",
  },
  {
    question: "Which diameters does this chart cover?",
    answer:
      "Every whole diameter from 3 to 101 blocks. Each size has its own chart card with an outline template, exact block counts, and a shareable link, so you can jump straight to the size your build needs.",
  },
  {
    question: "How do I use a circle chart in Minecraft?",
    answer:
      "Match the chart width to your build's diameter, mark the horizontal and vertical center axes on the ground with temporary blocks, then place one chart row at a time from the top edge. Colored squares are blocks; empty squares stay open.",
  },
  {
    question: "What is the best diameter for a Minecraft circle?",
    answer:
      "Diameters from 7 to 11 blocks suit fountains and small towers, 15 to 21 blocks give round rooms with usable floor space, and 31 blocks and above fit arenas and plazas. Check the filled block count in the table before collecting materials.",
  },
  {
    question: "Can I use these circle templates in Bedrock Edition?",
    answer:
      "Yes. Every template is an ordinary block layout and works identically in Java and Bedrock Edition because it does not rely on commands, redstone, or version-specific mechanics.",
  },
  {
    question: "How do I build a larger circle than the chart shows?",
    answer:
      "Open any chart in the circle generator and enter a diameter up to 512. The generator draws the same style of block grid for any size and gives you the exact block count to collect.",
  },
];

const chartRows = CIRCLE_CHART_GROUPS.flatMap((group) =>
  group.sizes.map(({ diameter, bestFor }) => {
    const hollowBlocks = generateCircle({ diameter, mode: "hollow", thickness: 1 }).totalBlocks;
    const filledBlocks = generateCircle({ diameter, mode: "filled", thickness: 1 }).totalBlocks;
    return { diameter, bestFor, hollowBlocks, filledBlocks };
  }),
);

function blockCountWithStacks(count: number) {
  const formatted = count.toLocaleString("en-US");
  if (count < 64) return formatted;
  const stacks = Math.floor(count / 64);
  const remainder = count % 64;
  const stackLabel = `${stacks} ${stacks === 1 ? "stack" : "stacks"}`;
  return remainder === 0
    ? `${formatted} (${stackLabel})`
    : `${formatted} (${stackLabel} + ${remainder})`;
}

function chartAssetPath(diameter: number) {
  return `/circle-charts/circle-chart-${String(diameter).padStart(2, "0")}.svg`;
}

export default function MinecraftCircleChartPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://minecraftcirclegen.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Minecraft Circle Chart",
        item: "https://minecraftcirclegen.com/minecraft-circle-chart",
      },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main id="main-content" className="circle-chart-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="hero">
        <div className="page-container">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">Minecraft Circle Chart</li>
            </ol>
          </nav>
          <h1>Minecraft Circle Chart</h1>
          <p className="hero-subtitle">
            A copy-ready block template for every circle diameter from 3 to 101, with
            exact outline and filled block counts. Every chart is generated by the same
            algorithm as the circle generator tool.
          </p>
          <div className="house-hero-actions">
            <a href="#chart-gallery" className="house-primary-button">Browse the charts</a>
            <a href="#circle-size-reference" className="house-secondary-button">Block count table</a>
            <Link href="/" className="house-secondary-button">Open the generator</Link>
          </div>
          <nav className="chart-jump-nav" aria-label="Jump to a circle size group">
            {CIRCLE_CHART_GROUPS.map((group) => (
              <a key={group.id} href={`#${group.id}`}>{group.title.replace(/ \(.*\)$/, "")}</a>
            ))}
          </nav>
        </div>
      </section>

      <article className="seo-content">
        <div className="content-container">
          <section className="tool-introduction">
            <h2>How to read these circle charts</h2>
            <p>
              Each chart below is a top-down blueprint for one diameter. The number under
              the chart is the diameter: the complete width of the finished circle in
              blocks. Green squares are blocks you place; empty squares stay open. The
              label next to every chart gives the exact block count for the one-block
              outline, so you can collect materials before you start building.
            </p>
            <p>
              To copy a chart by hand, mark both center axes on the ground first, then work
              from the top row downward and count each straight run. For a foundation or
              floor instead of a wall outline, use the filled link to see the same diameter
              with every interior block in place. The copy link on each card shares a URL
              that lands directly on that diameter, such as{" "}
              <code>/minecraft-circle-chart#size-21</code>.
            </p>
          </section>

          <section id="chart-gallery" aria-label="Minecraft circle chart gallery">
            {CIRCLE_CHART_GROUPS.map((group) => (
              <section key={group.id} id={group.id} className="chart-group">
                <h2>{group.title}</h2>
                <p className="chart-group-intro">{group.intro}</p>
                <div className="chart-card-grid">
                  {group.sizes.map(({ diameter, bestFor }) => {
                    const hollowBlocks = generateCircle({ diameter, mode: "hollow", thickness: 1 }).totalBlocks;
                    return (
                      <figure key={diameter} id={`size-${diameter}`} className="chart-card">
                        <div className="chart-card-heading">
                          <strong>{diameter}-block circle</strong>
                          <span>{hollowBlocks} blocks</span>
                        </div>
                        <Link
                          href={`/?diameter=${diameter}`}
                          aria-label={`Open the ${diameter}-block circle in the generator`}
                        >
                          {/* Static SVG blueprint asset: fixed dimensions, no optimization needed. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={chartAssetPath(diameter)}
                            alt={`Hollow Minecraft circle blueprint, ${diameter} by ${diameter} blocks, ${hollowBlocks} blocks`}
                            width={diameter * 10}
                            height={diameter * 10}
                            loading="lazy"
                          />
                        </Link>
                        <p>{bestFor}</p>
                        <div className="chart-card-links">
                          <Link href={`/?diameter=${diameter}`}>Open hollow →</Link>
                          <Link href={`/?diameter=${diameter}&mode=filled`}>Open filled →</Link>
                          <ChartShareButton diameter={diameter} />
                        </div>
                      </figure>
                    );
                  })}
                </div>
              </section>
            ))}
          </section>

          <section id="circle-size-reference">
            <h2>Circle size quick reference (all diameters, 3 to 101)</h2>
            <p>
              The outline count is the one-block wall ring shown in the charts above. The
              filled count is the total for a solid platform of the same diameter, useful
              for floors, islands, and roof layers. Counts of 64 blocks or more include a
              stacks-of-64 conversion so you can plan inventories and shulker loads.
            </p>
            <div className="size-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Diameter</th>
                    <th scope="col">Outline blocks</th>
                    <th scope="col">Filled blocks</th>
                    <th scope="col">Best for</th>
                  </tr>
                </thead>
                <tbody>
                  {chartRows.map((row) => (
                    <tr key={row.diameter} id={`ref-${row.diameter}`}>
                      <th scope="row"><Link href={`/?diameter=${row.diameter}`}>{row.diameter} blocks</Link></th>
                      <td>{blockCountWithStacks(row.hollowBlocks)}</td>
                      <td>{blockCountWithStacks(row.filledBlocks)}</td>
                      <td>{row.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>How to build from a circle chart</h2>
            <ol className="guide-steps">
              <li>
                <strong>Prepare flat ground.</strong>
                <span>
                  Clear an area at least two blocks wider than the chart on every side so
                  you can walk around the outline while building.
                </span>
              </li>
              <li>
                <strong>Mark the center axes.</strong>
                <span>
                  Lay temporary blocks along both center lines shown on the chart. Odd
                  diameters cross on one center block; even diameters cross between four.
                </span>
              </li>
              <li>
                <strong>Copy row by row.</strong>
                <span>
                  Start at the top edge of the chart and place each straight run, counting
                  blocks rather than estimating by eye.
                </span>
              </li>
              <li>
                <strong>Verify a quarter, then mirror.</strong>
                <span>
                  Check one quadrant against the chart, then copy it across both axes for a
                  perfectly symmetrical circle.
                </span>
              </li>
            </ol>
            <p>
              The <Link href="/">Minecraft circle generator</Link> builds any diameter from
              3 to 512 with hollow, thick, or filled walls, live material counts, and a
              downloadable blueprint. For stretched shapes, the{" "}
              <Link href="/oval-generator">oval generator</Link> handles independent width
              and height, and the <Link href="/sphere-generator">sphere</Link> and{" "}
              <Link href="/dome-generator">dome generators</Link> extend the same charts
              into three dimensions.
            </p>
          </section>

          <section>
            <h2>Choosing between odd and even diameters</h2>
            <p>
              Odd charts such as 9, 15, and 21 have a single center block, which makes them
              easy to align around a tower core, beacon, or fountain. Even charts such as
              10, 20, and 50 center between four blocks, which pairs naturally with
              two-block-wide doors and symmetric interior layouts. Neither is better in
              general; pick the diameter that fits the rooms and entrances around the
              circle.
            </p>
          </section>

          <section id="faq" className="faq-section">
            <h2>Frequently asked questions</h2>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
