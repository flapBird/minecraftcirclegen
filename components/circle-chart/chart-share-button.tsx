"use client";

import { useState } from "react";

interface ChartShareButtonProps {
  diameter: number;
}

export function ChartShareButton({ diameter }: ChartShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  const copyLink = async () => {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = `size-${diameter}`;
    const link = url.toString();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const input = document.createElement("textarea");
        input.value = link;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        if (!document.execCommand("copy")) throw new Error("Copy failed");
        input.remove();
      }
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  };

  return (
    <button type="button" className="chart-copy-link" onClick={copyLink}>
      {status === "copied" ? "Link copied ✓" : status === "error" ? "Copy failed" : "⧉ Copy link"}
    </button>
  );
}
