"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="error-page">
      <section className="error-card" aria-labelledby="error-title">
        <p className="eyebrow">Something went wrong</p>
        <h1 id="error-title">The generator hit an unexpected problem.</h1>
        <p>
          Your saved build progress is still stored on this device. Try loading the
          generator again before resetting anything.
        </p>
        <div className="error-actions">
          <button className="primary-button" type="button" onClick={reset}>
            Try again
          </button>
          <Link className="secondary-button" href="/">
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
