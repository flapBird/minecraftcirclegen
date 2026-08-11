"use client";

import type { CircleOptions } from "@/lib/circle/circle-types";
import { serializeCircleUrl } from "@/lib/circle/circle-url-state";

interface CircleShareButtonProps {
  options: CircleOptions;
  onStatus: (message: string, isError?: boolean) => void;
}

export function CircleShareButton({ options, onStatus }: CircleShareButtonProps) {
  const copyLink = async () => {
    const url = new URL(window.location.href);
    url.search = serializeCircleUrl(options).slice(1);
    url.hash = "";
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
      onStatus("Link copied");
    } catch {
      onStatus("Could not copy the link. Select the address in your browser to share it.", true);
    }
  };

  return (
    <button type="button" className="secondary-button" onClick={copyLink}>
      ⧉ Copy Link
    </button>
  );
}
