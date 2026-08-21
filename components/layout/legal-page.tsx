import type { ReactNode } from "react";

export function LegalPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main id="main-content" className="legal-page">
      <div className="content-container">
        <p className="section-label">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="legal-intro">{description}</p>
        <div className="legal-content">{children}</div>
      </div>
    </main>
  );
}
