import { DEFAULT_SOCIAL_IMAGES } from "@/lib/site/social-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { PlayerLookupTool } from "@/components/player-lookup/player-lookup-tool";
import { ToolPageEnd } from "@/components/layout/tool-page-end";
import { ToolStructuredData } from "@/components/layout/tool-structured-data";

const title = "Minecraft UUID Lookup – Find Player UUIDs";
const description = "Find a Minecraft Java player's UUID from a username, or search a hyphenated or compact UUID to view its current profile and skin.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/minecraft-uuid-lookup" },
  openGraph: { images: DEFAULT_SOCIAL_IMAGES, title, description, url: "/minecraft-uuid-lookup", type: "website" },
  twitter: { images: DEFAULT_SOCIAL_IMAGES, card: "summary_large_image", title, description },
};

export default async function MinecraftUuidLookupPage({ searchParams }: {
  searchParams: Promise<{ username?: string | string[]; uuid?: string | string[] }>;
}) {
  const query = await searchParams;
  const username = typeof query.username === "string" ? query.username : "";
  const uuid = typeof query.uuid === "string" ? query.uuid : "";
  const initialKind = uuid && !username ? "uuid" : "username";
  return <main id="main-content">
    <ToolStructuredData name="Minecraft UUID Lookup" description={description} path="/minecraft-uuid-lookup" />
    <section className="hero player-tool-hero"><div className="page-container">
      <h1>Minecraft UUID Lookup</h1>
      <p className="hero-subtitle">Find a Java player UUID from a username, or resolve a UUID to its current profile.</p>
    </div></section>
    <section className="tool-section" aria-label="Minecraft UUID lookup tool"><div className="page-container"><PlayerLookupTool initialKind={initialKind} initialValue={initialKind === "uuid" ? uuid : username} showTabs /></div></section>
    <article className="seo-content"><div className="content-container">
      <section><h2>What is the Minecraft UUID Lookup?</h2><p>The Minecraft UUID Lookup is a two-way Java Edition profile search. It can find the permanent UUID attached to a current username or resolve a compact or hyphenated UUID back to the player&apos;s current profile, including the username and skin when available.</p></section>
      <section id="how-to-use"><h2>How to use the Minecraft UUID Lookup</h2><ol className="guide-steps"><li><strong>Choose a search direction.</strong><span>Select Username → UUID to find an ID, or UUID → Player to resolve an existing ID.</span></li><li><strong>Enter the known value.</strong><span>Type a valid Java username or paste a compact or hyphenated UUID.</span></li><li><strong>Run the lookup.</strong><span>The tool validates the input before requesting the player&apos;s current Java profile.</span></li><li><strong>Copy or share the result.</strong><span>Use the hyphenated UUID, compact UUID, complete profile details, share link, or skin download.</span></li></ol></section>
      <section><h2>Username to UUID and UUID to player</h2><p>The username tab retrieves the UUID assigned to a current Java profile. The result includes both the standard hyphenated form and the compact 32-character form used by many server files and APIs. The UUID tab accepts either format and retrieves the current username.</p></section>
      <section><h2>UUID input is normalized before lookup</h2><p>Uppercase or lowercase hexadecimal characters are accepted, and hyphens are optional. Invalid lengths or non-hex characters are rejected locally, so malformed input is not sent to the profile service.</p></section>
      <section><h2>Checking a name rather than a UUID?</h2><p>The focused <Link href="/minecraft-name-checker">Minecraft Name Checker</Link> explains current-profile results and why a missing profile is not an absolute registration guarantee.</p></section>
      <ToolPageEnd toolKey="uuid-lookup" />
    </div></article>
  </main>;
}
