import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy information for Minecraft Circle Gen, including local browser storage and share-link parameters.",
  alternates: { canonical: "https://minecraftcirclegen.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="PRIVACY"
      title="Privacy Policy"
      description="This policy explains how the first version of Minecraft Circle Gen handles tool settings and Builder Mode progress."
    >
      <p className="policy-date">Last updated: July 29, 2026</p>
      <section>
        <h2>Information used by the tool</h2>
        <p>
          Circle calculations happen in your browser. You do not need to create
          an account, and the site does not operate an application database for
          your blueprints or Builder Mode activity.
        </p>
      </section>
      <section>
        <h2>Local storage</h2>
        <p>
          Builder Mode saves the active row and completed rows in your
          browser&apos;s localStorage. This data is stored on the device and
          browser you use. You can remove it with the Reset Progress control or
          by clearing site data in your browser.
        </p>
      </section>
      <section>
        <h2>Share links</h2>
        <p>
          The diameter, mode, and thickness are included in the page URL when
          you use Copy Link. Anyone who receives that URL can see those tool
          settings. Builder completion data is not added to the share link.
        </p>
      </section>
      <section>
        <h2>Hosting and technical logs</h2>
        <p>
          Like most websites, the hosting infrastructure may process basic
          request information such as IP address, browser type, requested page,
          and timestamps for security, reliability, and operational logs. This
          version does not include an account system or an advertising profile.
        </p>
      </section>
      <section>
        <h2>Future changes</h2>
        <p>
          If analytics, advertising, or other third-party services are added,
          this policy will be updated to explain what is used and why. Material
          changes will be reflected in the updated date above.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          For privacy questions, email{" "}
          <a href="mailto:contact@minecraftcirclegen.com">
            contact@minecraftcirclegen.com
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
