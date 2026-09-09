import { DEFAULT_SOCIAL_IMAGES } from "@/lib/site/social-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { PlayerLookupTool } from "@/components/player-lookup/player-lookup-tool";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import { ToolStructuredData } from "@/components/layout/tool-structured-data";

const title = "Minecraft Name Checker – Search Minecraft Usernames";
const description = "Check a current Minecraft Java username, view its UUID and skin when available, and distinguish not found results from profile service errors.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-name-checker" },
  openGraph: { images: DEFAULT_SOCIAL_IMAGES, title, description, url: "/minecraft-name-checker", type: "website" },
  twitter: { images: DEFAULT_SOCIAL_IMAGES, card: "summary_large_image", title, description },
};

export default async function MinecraftNameCheckerPage({ searchParams }: {
  searchParams: Promise<{ username?: string | string[] }>;
}) {
  const query = await searchParams;
  const username = typeof query.username === "string" ? query.username : "";
  return <main id="main-content">
    <ToolStructuredData name="Minecraft Name Checker" description={description} path="/minecraft-name-checker" />
    <section className="hero player-tool-hero"><div className="page-container">
      <h1>Minecraft Name Checker</h1>
      <p className="hero-subtitle">Search a current Java Edition profile by username and copy the player&apos;s canonical name or UUID.</p>
    </div></section>
    <section className="tool-section" aria-label="Minecraft name checker tool"><div className="page-container"><PlayerLookupTool initialKind="username" initialValue={username} /></div></section>
    <article className="seo-content"><div className="content-container">
      <section><h2>What is the Minecraft Name Checker?</h2><p>The Minecraft Name Checker searches current Java Edition profiles by username. A successful result shows the player&apos;s canonical name, UUID in both common formats, current skin details when available, and quick actions for copying or sharing the profile.</p></section>
      <section id="how-to-use"><h2>How to use the Minecraft Name Checker</h2><ol className="guide-steps"><li><strong>Enter a Java username.</strong><span>Use a name containing 3–16 letters, numbers, or underscores.</span></li><li><strong>Select Check Username.</strong><span>The tool queries the current Java profile and clearly separates found, not found, and service-error results.</span></li><li><strong>Use the profile details.</strong><span>Copy the name, UUID, all details, or result link, and preview or download the current skin when available.</span></li></ol></section>
      <section><h2>Check a Minecraft username accurately</h2><p>The checker validates the Java username format before contacting Minecraft profile services, preventing malformed requests and making error states easier to understand.</p></section>
      <section><h2>“Not found” does not always mean “available”</h2><p>If no current Java profile is returned, the result says exactly that. It does not promise that Microsoft will allow the name to be registered immediately; reserved names, account state, migration rules, and service timing can affect registration separately.</p></section>
      <section><h2>Need the UUID instead?</h2><p>Use the <Link href="/minecraft-uuid-lookup">Minecraft UUID Lookup</Link> to convert a username to both UUID formats or search a UUID back to its current player profile.</p></section>
      <ToolPageEnd toolKey="name-checker" />
    </div></article>
  </main>;
}
