import { getDye, type BannerLayer } from "@/lib/banner/banner-data";

function PatternShape({ layer, index, gradientId }: { layer: BannerLayer; index: number; gradientId?: string }) {
  const color = getDye(layer.colorId).hex;
  const props = { fill: color, opacity: 0.96 };
  switch (layer.patternId) {
    case "stripe_center": return <rect x="42" y="8" width="36" height="144" {...props} />;
    case "stripe_middle": return <rect x="12" y="62" width="96" height="36" {...props} />;
    case "cross": return <><polygon points="12,8 30,8 108,134 108,152 90,152 12,26" {...props} /><polygon points="90,8 108,8 108,26 30,152 12,152 12,134" {...props} /></>;
    case "straight_cross": return <><rect x="44" y="8" width="32" height="144" {...props} /><rect x="12" y="64" width="96" height="32" {...props} /></>;
    case "border": return <path d="M12 8h96v144H12zM25 22v116h70V22z" fillRule="evenodd" {...props} />;
    case "gradient": return <rect x="12" y="8" width="96" height="144" fill={`url(#${gradientId ?? `banner-gradient-${index}`})`} />;
    case "half_horizontal": return <rect x="12" y="8" width="96" height="72" {...props} />;
    case "half_vertical": return <rect x="12" y="8" width="48" height="144" {...props} />;
    case "diagonal_left": return <polygon points="12,8 108,8 12,152" {...props} />;
    case "circle": return <circle cx="60" cy="80" r="29" {...props} />;
    case "rhombus": return <polygon points="60,25 103,80 60,135 17,80" {...props} />;
    case "triangle_bottom": return <polygon points="12,152 60,92 108,152 84,152 60,122 36,152" {...props} />;
    case "small_stripes": return <>{[18, 38, 58, 78, 98].map((x) => <rect key={x} x={x} y="8" width="10" height="144" {...props} />)}</>;
    default: return null;
  }
}

export function BannerPatternIcon({ patternId, colorId = "black" }: { patternId: string; colorId?: string }) {
  const layer = { uid: 0, patternId, colorId };
  const gradientId = `pattern-icon-gradient-${patternId}-${colorId}`;
  return (
    <svg className="banner-pattern-icon" viewBox="0 0 120 160" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={getDye(colorId).hex} stopOpacity="1" />
          <stop offset="1" stopColor={getDye(colorId).hex} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`pattern-icon-clip-${patternId}`}><rect x="12" y="8" width="96" height="144" rx="2" /></clipPath>
      </defs>
      <rect x="12" y="8" width="96" height="144" rx="2" fill="#f4f4ef" stroke="#b9c0b7" strokeWidth="2" />
      <g clipPath={`url(#pattern-icon-clip-${patternId})`}>
        <PatternShape layer={layer} index={0} gradientId={gradientId} />
      </g>
    </svg>
  );
}

export function BannerPreview({
  baseColorId,
  layers,
  svgRef,
  idPrefix = "banner",
}: {
  baseColorId: string;
  layers: BannerLayer[];
  svgRef?: React.Ref<SVGSVGElement>;
  idPrefix?: string;
}) {
  const clipId = `${idPrefix}-clip`;
  const lightId = `${idPrefix}-cloth-light`;
  return (
    <svg ref={svgRef} className="banner-svg" viewBox="0 0 120 180" role="img" aria-label={`Banner with ${layers.length} pattern layers`}>
      <defs>
        {layers.map((layer, index) => (
          <linearGradient id={`${idPrefix}-gradient-${index}`} key={layer.uid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={getDye(layer.colorId).hex} stopOpacity="1" />
            <stop offset="1" stopColor={getDye(layer.colorId).hex} stopOpacity="0" />
          </linearGradient>
        ))}
        <clipPath id={clipId}><rect x="12" y="8" width="96" height="144" rx="1" /></clipPath>
        <linearGradient id={lightId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".16" />
          <stop offset=".28" stopColor="#fff" stopOpacity="0" />
          <stop offset=".52" stopColor="#000" stopOpacity=".12" />
          <stop offset=".76" stopColor="#fff" stopOpacity=".1" />
          <stop offset="1" stopColor="#000" stopOpacity=".15" />
        </linearGradient>
      </defs>
      <rect x="56" y="0" width="8" height="174" rx="2" fill="#725033" />
      <rect x="8" y="5" width="104" height="7" rx="2" fill="#8a603a" />
      <g className="banner-cloth">
        <g clipPath={`url(#${clipId})`}>
          <rect x="12" y="8" width="96" height="144" fill={getDye(baseColorId).hex} />
          {layers.map((layer, index) => <PatternShape key={layer.uid} layer={layer} index={index} gradientId={`${idPrefix}-gradient-${index}`} />)}
          <rect className="banner-cloth-shine" x="12" y="8" width="96" height="144" fill={`url(#${lightId})`} />
        </g>
        <rect x="12" y="8" width="96" height="144" rx="1" fill="none" stroke="rgba(0,0,0,.24)" strokeWidth="2" />
      </g>
    </svg>
  );
}
