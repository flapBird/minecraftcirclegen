import type { Metadata } from "next";
import { ContactEmail } from "@/components/layout/contact-email";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why Minecraft Circle Gen was created and how its free block circle blueprints work.",
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
          a block grid. This site provides a live block blueprint, relative
          coordinate lookup, accurate material totals, and a downloadable
          reference for building in game.
        </p>
      </section>
      <section>
        <h2>Free and local</h2>
        <p>
          The generator runs in your browser without an account. Your chosen
          size and circle mode become a shareable link. The first version
          focuses deliberately on fast, two-dimensional circle footprints.
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
