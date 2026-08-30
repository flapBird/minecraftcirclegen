import type { Metadata } from "next";
import Link from "next/link";
import { PlayerLookupTool } from "@/components/player-lookup/player-lookup-tool";
import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import { ToolStructuredData } from "@/components/layout/tool-structured-data";

const title = "Minecraft Name Checker – Search Minecraft Usernames";
const description = "Check a current Minecraft Java username, view its UUID and skin when available, and distinguish not found results from profile service errors.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-name-checker" },
  openGraph: { title, description, url: "/minecraft-name-checker", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function MinecraftNameCheckerPage() {
  return <main id="main-content">
    <ToolStructuredData name="Minecraft Name Checker" description={description} path="/minecraft-name-checker" />
    <section className="hero player-tool-hero"><div className="page-container">
      <PageBreadcrumb toolKey="name-checker" />
      <h1>Minecraft Name Checker</h1>
      <p className="hero-subtitle">Search a current Java Edition profile by username and copy the player&apos;s canonical name or UUID.</p>
    </div></section>
    <section className="tool-section" aria-label="Minecraft name checker tool"><div className="page-container"><PlayerLookupTool initialKind="username" /></div></section>
    <article className="seo-content"><div className="content-container">
      <section><p className="section-label">CURRENT JAVA PROFILES</p><h2>Check a Minecraft username accurately</h2><p>The checker validates the 3–16 character Java username format before contacting Minecraft profile services. A found result includes the current canonical username, UUID with and without hyphens, and the current skin face when texture data is available.</p></section>
      <section><h2>“Not found” does not always mean “available”</h2><p>If no current Java profile is returned, the result says exactly that. It does not promise that Microsoft will allow the name to be registered immediately; reserved names, account state, migration rules, and service timing can affect registration separately.</p></section>
      <section><h2>Need the UUID instead?</h2><p>Use the <Link href="/minecraft-uuid-lookup">Minecraft UUID Lookup</Link> to convert a username to both UUID formats or search a UUID back to its current player profile.</p></section>
      <ToolPageEnd toolKey="name-checker" />
    </div></article>
  </main>;
}
