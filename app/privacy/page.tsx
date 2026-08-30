import type { Metadata } from "next";
import { ContactEmail } from "@/components/layout/contact-email";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Minecraft Circle Gen Privacy Policy",
  description:
    "Privacy information for Minecraft Circle Gen, including Google AdSense, analytics, local browser storage, and share-link parameters.",
  alternates: { canonical: "https://minecraftcirclegen.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="PRIVACY"
      title="Privacy Policy"
      description="This policy explains how Minecraft Circle Gen handles advertising, analytics, local processing, and share-link settings."
    >
      <p className="policy-date">Last updated: August 30, 2026</p>
      <section>
        <h2>Information used by the tool</h2>
        <p>
          Generator calculations happen in your browser. Images selected for the
          Pixel Art or Map Art tools are processed locally in the page rather than
          uploaded to an application database. You do not need to create an
          account, and the site does not store your generated blueprints.
        </p>
      </section>
      <section>
        <h2>Share links</h2>
        <p>
          Some tools include selected dimensions, modes, layers, colors, or design
          data in the page URL when you copy or share a link. Anyone who receives
          that URL can see the encoded tool settings.
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
          performance. It does not store your generated grid, artwork, banner, or
          tool settings. You can limit analytics through your browser&apos;s privacy
          settings or a content blocker.
        </p>
      </section>
      <section>
        <h2>Advertising and Google AdSense</h2>
        <p>
          Minecraft Circle Gen uses Google AdSense to support the site and may
          display advertising provided by Google. Ads may not appear on every
          page or every visit because availability can depend on factors such as
          location, consent choices, ad demand, and site or account review
          status.
        </p>
        <p>
          Google and other third-party advertising vendors may place or read
          cookies on your browser, or use web beacons, IP addresses, device
          identifiers, and similar technologies, to deliver, measure, and
          personalize advertising. Google may use advertising cookies to serve
          ads based on your visits to this site and other websites.
        </p>
        <p>
          You can control personalized advertising in Google&apos;s{" "}
          <a href="https://adssettings.google.com/">Ads Settings</a>. You can
          also learn more about how Google uses information from sites that use
          its services on{" "}
          <a href="https://policies.google.com/technologies/partner-sites">
            Google&apos;s partner sites page
          </a>
          , or visit{" "}
          <a href="https://www.aboutads.info/choices/">YourAdChoices</a> to
          review opt-out choices offered by participating vendors.
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
        <h2>Changes to this policy</h2>
        <p>
          This policy will be updated when the site&apos;s data practices or
          third-party services change. Material changes will be reflected in the
          updated date above.
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
