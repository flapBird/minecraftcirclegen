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
          a block grid. The project began with an exact circle blueprint and now
          also covers related shapes, block art, text, palettes, banners, and
          buildable house plans.
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
      <section id="contact">
        <h2>Contact</h2>
        <p>
          Questions, bug reports, and practical feedback are welcome at{" "}
          <ContactEmail />
          .
        </p>
      </section>
    </LegalPage>
  );
}
