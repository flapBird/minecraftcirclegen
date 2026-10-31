import type { ToolKey } from "@/lib/site/tools";

/* Inline blueprint-style scene art shared by the tools directory cards and the
   home hero drafting plates. Purely decorative: every SVG is aria-hidden. */

const GREEN = "#4d7f47";
const GREEN_DARK = "#285f36";
const GREEN_SOFT = "#e7f1e8";
const GREEN_SLAB = "#dcebd9";
const RED = "#c25a43";
const INK_TEXT = "#5f665e";
const AMBER = "#d88b2e";
const TERRACOTTA = "#bc5b27";
const MOSS = "#6b7f5e";
const PAPER = "#fffdf6";
const PORTAL_FRAME = "#3b3454";
const PORTAL_FILL = "#8a63c9";
const TERMINAL_BG = "#273229";
const TERMINAL_TEXT = "#9fd0a6";

/** One r=10 pixel ring, 8px cells, spanning 168×168 units. */
const RING_21 = [
  "M48 0h72v8h-72z",
  "M32 8h8v8h-8z",
  "M128 8h8v8h-8z",
  "M24 16h8v8h-8z",
  "M136 16h8v8h-8z",
  "M16 24h8v8h-8z",
  "M144 24h8v8h-8z",
  "M16 32h8v8h-8z",
  "M144 32h8v8h-8z",
  "M8 40h8v8h-8z",
  "M152 40h8v8h-8z",
  "M8 48h8v8h-8z",
  "M152 48h8v8h-8z",
  "M8 56h8v8h-8z",
  "M152 56h8v8h-8z",
  "M0 64h8v8h-8z",
  "M160 64h8v8h-8z",
  "M0 72h8v8h-8z",
  "M160 72h8v8h-8z",
  "M0 80h8v8h-8z",
  "M160 80h8v8h-8z",
  "M0 88h8v8h-8z",
  "M160 88h8v8h-8z",
  "M0 96h8v8h-8z",
  "M160 96h8v8h-8z",
  "M8 104h8v8h-8z",
  "M152 104h8v8h-8z",
  "M8 112h8v8h-8z",
  "M152 112h8v8h-8z",
  "M8 120h8v8h-8z",
  "M152 120h8v8h-8z",
  "M16 128h8v8h-8z",
  "M144 128h8v8h-8z",
  "M16 136h8v8h-8z",
  "M144 136h8v8h-8z",
  "M24 144h8v8h-8z",
  "M136 144h8v8h-8z",
  "M32 152h8v8h-8z",
  "M128 152h8v8h-8z",
  "M48 160h72v8h-72z",
].join("");

function ringAt(x: number, y: number, scale: number) {
  return <path d={RING_21} fill={GREEN} transform={`translate(${x},${y}) scale(${scale})`} />;
}

/** Wide scene shown at the top of each directory card (320×96 units). */
function SceneArt({ tool }: { tool: ToolKey }) {
  switch (tool) {
    case "circle":
      return (
        <>
          {ringAt(116, 4, 0.5)}
          <path d="M158 2 V90 M116 46 H200" stroke={RED} strokeWidth="1.2" strokeDasharray="4 3" opacity="0.7" fill="none" />
        </>
      );
    case "oval":
      return (
        <>
          <ellipse cx="160" cy="48" rx="64" ry="30" fill="none" stroke={GREEN} strokeWidth="4" />
          <path d="M160 6 V90 M92 48 H228" stroke={RED} strokeWidth="1.2" strokeDasharray="4 3" opacity="0.7" fill="none" />
        </>
      );
    case "sphere":
      return (
        <g stroke={GREEN} strokeWidth="1.6">
          <rect x="140" y="4" width="40" height="10" fill={GREEN_SOFT} />
          <rect x="126" y="17" width="68" height="10" fill={GREEN_SOFT} />
          <rect x="112" y="30" width="96" height="10" fill={GREEN_SLAB} />
          <rect x="98" y="43" width="124" height="10" fill={GREEN_SLAB} />
          <rect x="112" y="56" width="96" height="10" fill={GREEN_SLAB} />
          <rect x="126" y="69" width="68" height="10" fill={GREEN_SOFT} />
          <rect x="140" y="82" width="40" height="10" fill={GREEN_SOFT} />
        </g>
      );
    case "dome":
      return (
        <>
          <path d="M104 72 A56 56 0 0 1 216 72" fill={GREEN_SOFT} stroke={GREEN} strokeWidth="4" />
          <path d="M92 72 H228" stroke={GREEN} strokeWidth="3.5" />
          <path d="M160 22 V72" stroke={RED} strokeWidth="1.2" strokeDasharray="4 3" opacity="0.7" fill="none" />
        </>
      );
    case "shape":
      return (
        <>
          <rect x="64" y="26" width="42" height="42" fill="none" stroke={GREEN} strokeWidth="4" />
          <path d="M150 68 L172 26 L194 68 Z" fill="none" stroke={GREEN} strokeWidth="4" />
          <circle cx="244" cy="47" r="21" fill={GREEN_SOFT} stroke={GREEN} strokeWidth="4" />
        </>
      );
    case "gradient":
      return (
        <g>
          <rect x="70" y="33" width="30" height="30" fill="#1e3b26" />
          <rect x="106" y="33" width="30" height="30" fill="#2c5735" />
          <rect x="142" y="33" width="30" height="30" fill="#3e7f4c" />
          <rect x="178" y="33" width="30" height="30" fill="#5da06a" />
          <rect x="214" y="33" width="30" height="30" fill="#87bf8f" />
        </g>
      );
    case "pixel-art":
      return (
        <g>
          <rect x="104" y="16" width="20" height="20" fill={GREEN} />
          <rect x="126" y="16" width="20" height="20" fill={AMBER} />
          <rect x="148" y="16" width="20" height="20" fill={MOSS} />
          <rect x="104" y="38" width="20" height="20" fill={TERRACOTTA} />
          <rect x="126" y="38" width="20" height="20" fill={GREEN} />
          <rect x="148" y="38" width="20" height="20" fill={AMBER} />
          <rect x="104" y="60" width="20" height="20" fill={GREEN} />
          <rect x="126" y="60" width="20" height="20" fill={TERRACOTTA} />
          <rect x="148" y="60" width="20" height="20" fill={MOSS} />
        </g>
      );
    case "map-art":
      return (
        <>
          <path d="M64 18 H172 L182 28 V78 H64 Z" fill={PAPER} stroke={GREEN} strokeWidth="3" />
          <path d="M172 18 V28 H182" fill="none" stroke={GREEN} strokeWidth="3" />
          <path d="M78 40 H158 M78 52 H158 M78 64 H120" stroke={MOSS} strokeWidth="4" fill="none" />
        </>
      );
    case "font":
      return (
        <g fill={GREEN}>
          <rect x="64" y="24" width="14" height="14" />
          <rect x="92" y="24" width="14" height="14" />
          <rect x="78" y="38" width="14" height="14" />
          <rect x="64" y="52" width="14" height="14" />
          <rect x="78" y="52" width="14" height="14" />
          <rect x="92" y="52" width="14" height="14" />
        </g>
      );
    case "banner":
      return (
        <>
          <path d="M92 14 V82" stroke={GREEN} strokeWidth="3.5" fill="none" />
          <rect x="92" y="18" width="76" height="34" fill={GREEN_SOFT} stroke={GREEN} strokeWidth="3" />
          <rect x="92" y="18" width="76" height="11" fill={GREEN} />
        </>
      );
    case "text":
      return (
        <>
          <rect x="62" y="24" width="196" height="48" rx="8" fill={PAPER} stroke={GREEN} strokeWidth="3" />
          <path d="M96 72 L88 84 L112 72" fill={PAPER} stroke={GREEN} strokeWidth="3" />
          <path d="M76 48 H122" stroke={GREEN} strokeWidth="6" fill="none" />
          <path d="M132 48 H162" stroke={AMBER} strokeWidth="6" fill="none" />
          <path d="M172 48 H196" stroke={TERRACOTTA} strokeWidth="6" fill="none" />
        </>
      );
    case "color-codes":
      return (
        <>
          <text x="72" y="60" fontFamily="'Courier New',monospace" fontWeight="bold" fontSize="34" fill={GREEN_DARK}>§</text>
          <circle cx="130" cy="48" r="13" fill={AMBER} />
          <circle cx="168" cy="48" r="13" fill={GREEN} />
          <circle cx="206" cy="48" r="13" fill={TERRACOTTA} />
        </>
      );
    case "enchanting-translator":
      return (
        <>
          <path d="M74 30 Q120 18 166 30 V72 Q120 60 74 72 Z" fill={PAPER} stroke={GREEN} strokeWidth="3" />
          <path d="M120 24 V66" stroke={GREEN} strokeWidth="3" fill="none" />
          <rect x="136" y="36" width="8" height="8" fill={MOSS} />
          <rect x="150" y="48" width="8" height="8" fill={MOSS} />
          <rect x="92" y="40" width="8" height="8" fill={MOSS} />
        </>
      );
    case "give-command":
      return (
        <>
          <rect x="60" y="20" width="200" height="56" rx="6" fill={TERMINAL_BG} />
          <text x="76" y="54" fontFamily="'Courier New',monospace" fontWeight="bold" fontSize="15" fill={TERMINAL_TEXT}>/give ⛏ 1</text>
        </>
      );
    case "nether-portal":
      return (
        <>
          <rect x="118" y="14" width="84" height="68" rx="4" fill={PORTAL_FRAME} />
          <rect x="130" y="26" width="60" height="56" fill={PORTAL_FILL} />
          <rect x="142" y="38" width="14" height="14" fill="#b295e3" />
          <rect x="164" y="58" width="14" height="14" fill="#6d47ab" />
        </>
      );
    case "name-checker":
      return (
        <>
          <circle cx="140" cy="44" r="24" fill={GREEN_SOFT} stroke={GREEN} strokeWidth="4" />
          <rect x="130" y="38" width="6" height="6" fill={GREEN_DARK} />
          <rect x="146" y="38" width="6" height="6" fill={GREEN_DARK} />
          <circle cx="196" cy="60" r="16" fill="none" stroke={GREEN_DARK} strokeWidth="4" />
          <path d="M207 71 L222 86" stroke={GREEN_DARK} strokeWidth="4" fill="none" />
        </>
      );
    case "uuid-lookup":
      return (
        <>
          <rect x="72" y="22" width="176" height="52" rx="6" fill={PAPER} stroke={GREEN} strokeWidth="3" />
          <path d="M86 40 H120" stroke={MOSS} strokeWidth="5" fill="none" />
          <path d="M128 40 H172" stroke={AMBER} strokeWidth="5" fill="none" />
          <path d="M180 40 H232" stroke={MOSS} strokeWidth="5" fill="none" />
          <path d="M86 56 H150" stroke={MOSS} strokeWidth="5" fill="none" />
          <path d="M158 56 H196" stroke={AMBER} strokeWidth="5" fill="none" />
        </>
      );
  }
}

/** Blueprint-paper panel with the tool's scene, used on directory cards. */
export function ToolSceneArt({ tool, featured = false }: { tool: ToolKey; featured?: boolean }) {
  return (
    <span className={featured ? "tool-preview is-featured" : "tool-preview"} aria-hidden="true">
      {featured && <span className="tool-preview-tag">Start here</span>}
      {featured ? (
        <svg viewBox="0 0 640 176" preserveAspectRatio="xMidYMid meet">
          <g transform="translate(30,22) scale(0.786)">
            <path d={RING_21} fill={GREEN} />
            <path d="M66 -14 V146 M-14 66 H146" stroke={RED} strokeWidth="1.6" strokeDasharray="5 4" opacity="0.7" fill="none" />
          </g>
          <text x="225" y="58" fontFamily="'Courier New',monospace" fontWeight="bold" fontSize="15" fill={INK_TEXT}>DIAMETER 3–512</text>
          <text x="225" y="82" fontFamily="'Courier New',monospace" fontWeight="bold" fontSize="15" fill={INK_TEXT}>HOLLOW / FILLED</text>
          <text x="225" y="106" fontFamily="'Courier New',monospace" fontWeight="bold" fontSize="15" fill={INK_TEXT}>PNG + SHARE LINK</text>
        </svg>
      ) : (
        <svg viewBox="0 0 320 96" preserveAspectRatio="xMidYMid meet">
          <SceneArt tool={tool} />
        </svg>
      )}
    </span>
  );
}

/** Square drafting-plate art for the home hero (Circle / Oval / Sphere / Dome). */
export function HeroPlateArt({ shape }: { shape: "circle" | "oval" | "sphere" | "dome" }) {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true">
      {shape === "circle" && (
        <>
          {ringAt(6, 6, 0.5)}
          <path d="M48 2 V94 M2 48 H94" stroke={RED} strokeWidth="1.2" strokeDasharray="4 3" opacity="0.7" fill="none" />
        </>
      )}
      {shape === "oval" && (
        <>
          <g transform="translate(6,26) scale(0.5,0.26)">
            <path d={RING_21} fill={GREEN} />
          </g>
          <path d="M48 2 V94 M2 48 H94" stroke={RED} strokeWidth="1.2" strokeDasharray="4 3" opacity="0.7" fill="none" />
        </>
      )}
      {shape === "sphere" && (
        <g stroke={GREEN} strokeWidth="1.6">
          <rect x="32" y="8" width="32" height="11" fill={GREEN_SOFT} />
          <rect x="20" y="23" width="56" height="11" fill={GREEN_SOFT} />
          <rect x="8" y="38" width="80" height="11" fill={GREEN_SLAB} />
          <rect x="20" y="53" width="56" height="11" fill={GREEN_SLAB} />
          <rect x="32" y="68" width="32" height="11" fill={GREEN_SOFT} />
        </g>
      )}
      {shape === "dome" && (
        <>
          <path d="M18 70 A30 30 0 0 1 78 70" fill={GREEN_SOFT} stroke={GREEN} strokeWidth="3.5" />
          <path d="M10 70 H86" stroke={GREEN} strokeWidth="3" fill="none" />
          <path d="M48 40 V70" stroke={RED} strokeWidth="1.2" strokeDasharray="4 3" opacity="0.7" fill="none" />
        </>
      )}
    </svg>
  );
}
