import type { Metadata } from "next";
import Link from "next/link";
import { PlayerLookupTool } from "@/components/player-lookup/player-lookup-tool";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import { ToolStructuredData } from "@/components/layout/tool-structured-data";

const title = "Minecraft UUID Lookup – Find Player UUIDs";
const description = "Find a Minecraft Java player's UUID from a username, or search a hyphenated or compact UUID to view its current profile and skin.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-uuid-lookup" },
  openGraph: { title, description, url: "/minecraft-uuid-lookup", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function MinecraftUuidLookupPage() {
  return <main id="main-content">
    <ToolStructuredData name="Minecraft UUID Lookup" description={description} path="/minecraft-uuid-lookup" />
    <section className="hero player-tool-hero"><div className="page-container">
      <PageBreadcrumb toolKey="uuid-lookup" />
      <h1>Minecraft UUID Lookup</h1>
      <p className="hero-subtitle">Find a Java player UUID from a username, or resolve a UUID to its current profile.</p>
    </div></section>
    <section className="tool-section" aria-label="Minecraft UUID lookup tool"><div className="page-container"><PlayerLookupTool initialKind="username" showTabs /></div></section>
    <article className="seo-content"><div className="content-container">
      <section><p className="section-label">TWO-WAY PLAYER SEARCH</p><h2>Username to UUID and UUID to player</h2><p>Use the first tab to retrieve the UUID assigned to a current Java profile. The result includes both the standard hyphenated form and the compact 32-character form used by many server files and APIs. Use the second tab to search either UUID format and retrieve the current username.</p></section>
      <section><h2>UUID input is normalized before lookup</h2><p>Uppercase or lowercase hexadecimal characters are accepted, and hyphens are optional. Invalid lengths or non-hex characters are rejected locally, so malformed input is not sent to the profile service.</p></section>
      <section><h2>Checking a name rather than a UUID?</h2><p>The focused <Link href="/minecraft-name-checker">Minecraft Name Checker</Link> explains current-profile results and why a missing profile is not an absolute registration guarantee.</p></section>
      <ToolPageEnd toolKey="uuid-lookup" />
    </div></article>
  </main>;
}
