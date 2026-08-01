import type { Metadata } from "next";
import { ContactEmail } from "@/components/layout/contact-email";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the free Minecraft Circle Gen planning tool.",
  alternates: { canonical: "https://minecraftcirclegen.com/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="TERMS"
      title="Terms of Use"
      description="By using Minecraft Circle Gen, you agree to use the tool responsibly and to verify that its output fits your own build."
    >
      <p className="policy-date">Last updated: July 29, 2026</p>
      <section>
        <h2>Tool provided as is</h2>
        <p>
          Minecraft Circle Gen is provided free of charge and on an “as is” and
          “as available” basis. The tool is intended as a planning aid. No
          warranty is made that it will be uninterrupted, error-free, or
          suitable for every project.
        </p>
      </section>
      <section>
        <h2>Blueprints and material counts</h2>
        <p>
          Generated block layouts are pixel-style approximations of circles.
          Visual preferences vary, especially at very small sizes. You are
          responsible for reviewing the blueprint and verifying material totals,
          wall thickness, clearances, and dimensions before committing resources
          in your world.
        </p>
      </section>
      <section>
        <h2>Acceptable use</h2>
        <p>
          You may use generated blueprints for personal builds, videos, servers,
          and other creative projects. Do not misuse the site, interfere with
          its availability, attempt unauthorized access, or represent the tool
          as an official Mojang or Microsoft service.
        </p>
      </section>
      <section>
        <h2>Limitation of responsibility</h2>
        <p>
          To the extent allowed by law, the site operators are not responsible
          for lost materials, altered worlds, lost progress, or other direct or
          indirect consequences of relying on a generated plan. Keep appropriate
          backups of important game worlds.
        </p>
      </section>
      <section>
        <h2>Trademarks</h2>
        <p>
          Minecraft and related marks belong to their respective rights holders.
          Minecraft Circle Gen is an independent, unofficial, fan-made tool and
          is not affiliated with, endorsed by, or associated with Mojang Studios
          or Microsoft.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <ContactEmail />
          .
        </p>
      </section>
    </LegalPage>
  );
}
