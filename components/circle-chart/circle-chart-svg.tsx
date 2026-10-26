import { generateCircle } from "@/lib/circle/generate-circle";

export const CHART_BLOCK_COLOR = "#4d7f47";
export const CHART_GRID_COLOR = "#d7ddd4";
const CELL = 10;

export function CircleChartSvg({
  diameter,
  mode = "hollow",
}: {
  diameter: number;
  mode?: "hollow" | "filled";
}) {
  const { grid, totalBlocks } = generateCircle({ diameter, mode, thickness: 1 });
  const size = diameter * CELL;
  const patternId = `circle-chart-grid-${mode}-${diameter}`;
  const label = `${mode === "filled" ? "Filled" : "Hollow"} Minecraft circle blueprint, ${diameter} by ${diameter} blocks, ${totalBlocks} blocks`;

  return (
    <svg
      role="img"
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      aria-label={label}
      focusable="false"
      aria-hidden={false}
    >
      <title>{label}</title>
      <defs>
        <pattern id={patternId} width={CELL} height={CELL} patternUnits="userSpaceOnUse">
          <path
            d={`M ${CELL} 0 L 0 0 0 ${CELL}`}
            fill="none"
            stroke={CHART_GRID_COLOR}
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width={size} height={size} fill="#ffffff" />
      <rect width={size} height={size} fill={`url(#${patternId})`} />
      {grid.flatMap((row, y) =>
        row.map((filled, x) =>
          filled ? (
            <rect
              key={`${x}-${y}`}
              className="chart-block"
              x={x * CELL}
              y={y * CELL}
              width={CELL}
              height={CELL}
              fill={CHART_BLOCK_COLOR}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
