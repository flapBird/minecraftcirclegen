import type { Metadata } from "next";
import { ContactEmail } from "@/components/layout/contact-email";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "About Minecraft Circle Gen",
  description:
    "Learn why Minecraft Circle Gen was created and how its free shape, art, text, banner, and house-planning tools work.",
  alternates: { canonical: "https://minecraftcirclegen.com/about" },
};

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="ABOUT"
      title="Built to make Minecraft planning easier"
      description="Minecraft Circle Gen is a free, player-focused collection of shape, art, text, palette, banner, and house-planning tools."
    >
      <section>
        <h2>Why this tool exists</h2>
        <p>
          A smooth circle is easy to draw and surprisingly easy to miscount on
          a block grid. Minecraft Circle Gen exists to turn that sort of planning
          problem into a clear blueprint you can keep beside the game and follow
          one block at a time.
        </p>
      </section>
      <section>
        <h2>How the project grew</h2>
        <p>
          Development started in July 2026 with a focused circle generator. The
          same practical idea soon expanded to ovals, spheres, domes, polygons,
          block art, formatted text, gradients, banners, and house plans. Each
          addition is intended to solve a real preparation task rather than make
          the directory larger for its own sake.
        </p>
      </section>
      <section>
        <h2>How the generators work</h2>
        <p>
          The tools translate dimensions, colors, text, or an image into a
          discrete Minecraft block grid. Depending on the tool, the result may
          include layer views, coordinates, material totals, stack counts, a
          downloadable image, or a shareable URL. The site does not connect to
          your Minecraft account or modify a world.
        </p>
      </section>
      <section>
        <h2>Technology behind the site</h2>
        <p>
          Minecraft Circle Gen is built with Next.js, React, and TypeScript.
          Interactive previews and image exports use browser Canvas APIs, while
          reusable calculation modules generate the grids, layers, palettes, and
          material counts. Automated tests cover core geometry, exports, URL
          state, navigation, and blueprint data.
        </p>
      </section>
      <section>
        <h2>Designed for practical building</h2>
        <p>
          A result should be useful after you leave the generator. That is why
          the tools emphasize readable grids, exact counts, zoom and layer
          controls, keyboard and touch support, printable exports, and links that
          restore supported settings. Feedback is prioritized when it makes a
          plan easier to understand or use while building.
        </p>
      </section>
      <section>
        <h2>Free and local</h2>
        <p>
          The generators run in your browser without an account. Supported tools
          keep uploads and processing in the browser, and many plans can be
          downloaded or shared as a URL for later reference.
        </p>
      </section>
      <section>
        <h2>Independent and unofficial</h2>
        <p>
          Minecraft Circle Gen is an independent fan-made utility. It is not
          affiliated with, endorsed by, or associated with Mojang Studios or
          Microsoft, and it does not use official Minecraft logos or game
          assets.
        </p>
      </section>
      <section>
        <h2>Frequently asked questions</h2>
        <h3>Does the site need my Minecraft login?</h3>
        <p>
          No. The planning tools work without a Minecraft or site account and do
          not request access to your game installation or saved worlds.
        </p>
        <h3>Are generated plans tied to one edition?</h3>
        <p>
          Most geometric blueprints are useful in both Java and Bedrock Edition.
          Commands, block availability, colors, and game mechanics can vary by
          version, so check the notes shown by the relevant tool before building.
        </p>
        <h3>What happens to an image I select?</h3>
        <p>
          Supported Pixel Art and Map Art workflows process the image in your
          browser. The site does not upload it to an application database. See
          the Privacy Policy for details about analytics, advertising, and other
          request data.
        </p>
      </section>
      <section id="contact">
        <h2>Contact</h2>
        <p>
          Questions, corrections, feature ideas, and practical feedback are
          welcome at <ContactEmail />. For a bug report, include the tool URL,
          the settings you used, what you expected, what happened instead, and a
          screenshot or browser name when relevant.
        </p>
      </section>
    </LegalPage>
  );
}
