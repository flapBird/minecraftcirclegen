"use client";

import { useState } from "react";

export function PlayerAvatar({ username, skinUrl }: { username: string; skinUrl: string | null }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const failed = skinUrl !== null && failedUrl === skinUrl;

  if (!skinUrl || failed) {
    return <span className="player-avatar-fallback" aria-hidden="true">{username.slice(0, 2).toUpperCase()}</span>;
  }

  return <span className="player-avatar" aria-hidden="true">
    {/* The raw 64×64 skin is intentionally cropped twice for the face and hat layer. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={skinUrl} alt="" onError={() => setFailedUrl(skinUrl)} />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="player-avatar-overlay" src={skinUrl} alt="" onError={() => setFailedUrl(skinUrl)} />
  </span>;
}
