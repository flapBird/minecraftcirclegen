import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why Minecraft Circle Gen was created and how the free block circle building guide works.",
  alternates: { canonical: "https://minecraftcirclegen.com/about" },
};

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="ABOUT"
      title="Built to make block circles easier"
      description="Minecraft Circle Gen is a free, player-focused planning tool for turning a circle size into an exact blueprint you can actually build."
    >
      <section>
        <h2>Why this tool exists</h2>
        <p>
          A smooth circle is easy to draw and surprisingly easy to miscount on
          a block grid. This site gives players more than a picture: it shows
          continuous block segments, relative coordinates, accurate material
          totals, and a row-by-row workflow for keeping a build on track.
        </p>
      </section>
      <section>
        <h2>Free and local</h2>
        <p>
          The generator runs in your browser without an account. Your chosen
          size and circle mode become a shareable link, while Builder Mode
          progress stays on your own device. The first version focuses
          deliberately on two-dimensional circle footprints.
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
          <a href="mailto:contact@minecraftcirclegen.com">
            contact@minecraftcirclegen.com
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
