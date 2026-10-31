import Link from "next/link";
import { HeroPlateArt } from "@/components/site/tool-scenes";

export default function NotFound() {
  return (
    <main id="main-content" className="error-page">
      <section className="error-card" aria-labelledby="not-found-title">
        <span className="error-mark" aria-hidden="true">
          <HeroPlateArt shape="circle" />
        </span>
        <p className="eyebrow">404 — Block not found</p>
        <h1 id="not-found-title">This page could not be found.</h1>
        <p>
          The link may be outdated, or the page may have moved. Every generator
          is still one click away — start with the circle tool or browse the
          full collection.
        </p>
        <div className="error-actions">
          <Link className="primary-button" href="/">
            Open the circle generator
          </Link>
          <Link className="secondary-button" href="/minecraft-tools">
            Browse all tools
          </Link>
        </div>
      </section>
    </main>
  );
}
