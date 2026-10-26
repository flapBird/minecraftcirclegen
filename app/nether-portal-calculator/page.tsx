import type { Metadata } from "next";
import Link from "next/link";
import { NetherPortalCalculator } from "@/components/nether-portal/nether-portal-calculator";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import { ToolStructuredData } from "@/components/layout/tool-structured-data";

const title = "Minecraft Nether Portal Calculator – Overworld to Nether Coordinates";
const description =
  "Convert Overworld coordinates to Nether coordinates and back with the exact 1:8 ratio, get the portal target, teleport command, and obsidian frame fill commands for Java and Bedrock.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/nether-portal-calculator" },
  // og/twitter images come from opengraph-image.tsx in this route.
  openGraph: { title, description, url: "/nether-portal-calculator", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default async function NetherPortalCalculatorPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const search = new URLSearchParams(
    Object.entries(query).flatMap(([key, value]) =>
      typeof value === "string" ? [[key, value] as [string, string]] : [],
    ),
  ).toString();

  return (
    <main id="main-content">
      <ToolStructuredData name="Minecraft Nether Portal Calculator" description={description} path="/nether-portal-calculator" />
      <section className="hero">
        <div className="page-container">
          <h1>Minecraft Nether Portal Calculator</h1>
          <p className="hero-subtitle">
            Convert Overworld and Nether coordinates with the exact 1:8 ratio, then build
            the portal where the game expects it — in Java or Bedrock Edition.
          </p>
        </div>
      </section>
      <section className="tool-section" aria-label="Nether portal coordinate calculator">
        <div className="page-container">
          <NetherPortalCalculator initialSearch={search} />
        </div>
      </section>
      <article className="seo-content">
        <div className="content-container">
          <section className="tool-introduction">
            <h2>How the Nether coordinate ratio works</h2>
            <p>
              The Nether compresses horizontal distance at a 1:8 ratio: traveling one block
              in the Nether moves you eight blocks in the Overworld. To find where an
              Overworld portal should link, the game divides X and Z by 8 and keeps Y
              unchanged. Going the other way, it multiplies X and Z by 8. Division rounds
              down, so an Overworld portal at X=100 becomes X=12 in the Nether, while X=-100
              becomes X=-13.
            </p>
            <p>
              This calculator applies the same conversion the game uses, so the target it
              shows is the point where Minecraft starts looking for an existing portal — and
              where a new one appears if none is found.
            </p>
          </section>

          <section id="how-to-use">
            <h2>How to use the Nether Portal Calculator</h2>
            <ol className="guide-steps">
              <li>
                <strong>Pick the direction.</strong>
                <span>
                  Choose Overworld → Nether to divide by 8, or Nether → Overworld to
                  multiply by 8. Y passes through unchanged in both directions.
                </span>
              </li>
              <li>
                <strong>Enter your portal coordinates.</strong>
                <span>
                  Use the F3 debug screen (Java) or the map coordinates (Bedrock) at your
                  existing portal&apos;s base.
                </span>
              </li>
              <li>
                <strong>Build at the target.</strong>
                <span>
                  Place the Nether-side portal at the converted coordinates before lighting
                  the other side, and the pair links exactly where you planned.
                </span>
              </li>
              <li>
                <strong>Copy the helpers.</strong>
                <span>
                  The tool gives the teleport command for reaching the spot and fill
                  commands for the obsidian frame, ready for the chat or a function file.
                </span>
              </li>
            </ol>
          </section>

          <section>
            <h2>Portal linking rules in Java and Bedrock</h2>
            <p>
              When you step through a portal, the game converts the coordinates and searches
              the destination for the nearest existing portal. The search window differs by
              edition and direction:
            </p>
            <div className="size-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Travel direction</th>
                    <th scope="col">Java Edition search</th>
                    <th scope="col">Bedrock Edition search</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Overworld → Nether</th>
                    <td>16-block radius (32×32 area)</td>
                    <td>128-block radius (256×256 area)</td>
                  </tr>
                  <tr>
                    <th scope="row">Nether → Overworld</th>
                    <td>128-block radius (256×256 area)</td>
                    <td>128-block radius (256×256 area)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The search covers the full height of the destination, and the chosen portal is
              the closest by straight-line 3D distance including Y. That is why two
              Overworld portals within 16 blocks of each other&apos;s Nether target can grab
              each other&apos;s links: whichever existing portal sits closest in 3D distance
              wins.
            </p>
          </section>

          <section>
            <h2>How to link a portal pair correctly</h2>
            <ol className="guide-steps">
              <li>
                <strong>Calculate the target.</strong>
                <span>
                  Convert your Overworld portal&apos;s coordinates; note the exact X and Z in
                  the Nether.
                </span>
              </li>
              <li>
                <strong>Build the Nether side first.</strong>
                <span>
                  Teleport to the target, clear a 4×5 area, and build the frame there — the
                  copyable fill commands place the frame with its first block exactly on the
                  target.
                </span>
              </li>
              <li>
                <strong>Light it and step through.</strong>
                <span>
                  Traveling back to the Overworld, the search looks within 128 blocks of
                  your original portal, so it returns you to the right place.
                </span>
              </li>
              <li>
                <strong>Break strays.</strong>
                <span>
                  If the game auto-created an unexpected portal near the target, mine it and
                  relight your intended one; otherwise it keeps capturing the link.
                </span>
              </li>
            </ol>
            <p>
              For command blocks and datapacks, the <Link href="/minecraft-give-command-generator">give
              command generator</Link> handles item commands with the same version awareness,
              and the <Link href="/minecraft-text-generator">text generator</Link> formats
              server messages for your portal hub announcements.
            </p>
          </section>
          <ToolPageEnd toolKey="nether-portal" />
        </div>
      </article>
    </main>
  );
}
