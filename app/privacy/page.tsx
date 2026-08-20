import type { Metadata } from "next";
import { ContactEmail } from "@/components/layout/contact-email";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Minecraft Circle Gen Privacy Policy",
  description:
    "Privacy information for Minecraft Circle Gen, including analytics, local browser storage, and share-link parameters.",
  alternates: { canonical: "https://minecraftcirclegen.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="PRIVACY"
      title="Privacy Policy"
      description="This policy explains how Minecraft Circle Gen handles analytics and share-link settings."
    >
      <p className="policy-date">Last updated: July 29, 2026</p>
      <section>
        <h2>Information used by the tool</h2>
        <p>
          Circle calculations happen in your browser. You do not need to create
          an account, and the site does not operate an application database for
          your generated blueprints.
        </p>
      </section>
      <section>
        <h2>Share links</h2>
        <p>
          The selected dimensions, fill mode, and layer are included in the
          page URL when you use Copy Link. Anyone who receives that URL can see
          those tool settings.
        </p>
      </section>
      <section>
        <h2>Analytics</h2>
        <p>
          When analytics is enabled, Minecraft Circle Gen uses Google Analytics
          to understand visits and general feature usage. Google may process
          details such as pages viewed, referral source, approximate location,
          and browser or device information. Google Analytics may also use
          cookies or similar browser storage to distinguish visits.
        </p>
        <p>
          Analytics is used to improve the site&apos;s usability and
          performance. It does not store your generated circle grid or tool
          settings. You can limit analytics through your browser&apos;s privacy
          settings or a content blocker.
        </p>
      </section>
      <section>
        <h2>Hosting and technical logs</h2>
        <p>
          Like most websites, the hosting infrastructure may process basic
          request information such as IP address, browser type, requested page,
          and timestamps for security, reliability, and operational logs. This
          version does not include an account system.
        </p>
      </section>
      <section>
        <h2>Future changes</h2>
        <p>
          If advertising or other third-party services are added, this policy
          will be updated to explain what is used and why. Material changes will
          be reflected in the updated date above.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          For privacy questions, email{" "}
          <ContactEmail />
          .
        </p>
      </section>
    </LegalPage>
  );
}
