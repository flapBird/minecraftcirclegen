"use client";

interface CircleShareButtonProps {
  onStatus: (message: string, isError?: boolean) => void;
}

export function CircleShareButton({ onStatus }: CircleShareButtonProps) {
  const copyLink = async () => {
    const link = window.location.href;
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
