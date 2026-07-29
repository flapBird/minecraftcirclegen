import type { CircleResult } from "@/lib/circle/circle-types";
import { formatMode, pluralize } from "@/lib/circle/circle-utils";

interface CircleStatsProps {
  result: CircleResult;
  completedRows: number;
}

export function CircleStats({ result, completedRows }: CircleStatsProps) {
  const fullStacks = Math.floor(result.totalBlocks / 64);
  const remaining = result.totalBlocks % 64;
  const radius = result.diameter / 2;

  return (
    <section className="tool-card stats-card" aria-labelledby="materials-title">
      <div className="card-heading">
        <div>
          <h2 id="materials-title">Materials</h2>
          <p>Everything to gather before you build.</p>
        </div>
      </div>
      <div className="materials-callout">
        <div className="materials-total">
          <span>Total blocks</span>
          <strong>{result.totalBlocks.toLocaleString()}</strong>
        </div>
        <dl className="materials-breakdown">
          <div>
            <dt>Stacks of 64</dt>
            <dd>{pluralize(fullStacks, "stack")}</dd>
          </div>
          <div>
            <dt>Remaining</dt>
            <dd>{pluralize(remaining, "block")}</dd>
          </div>
        </dl>
      </div>
      <dl className="stats-grid">
        <div>
          <dt>Diameter</dt>
          <dd>{result.diameter}</dd>
        </div>
        <div>
          <dt>Radius</dt>
          <dd>{Number.isInteger(radius) ? radius : radius.toFixed(1)}</dd>
        </div>
        <div>
          <dt>Mode</dt>
          <dd>{formatMode(result.mode)}</dd>
        </div>
        <div>
          <dt>{result.mode === "thick" ? "Thickness" : "Completed rows"}</dt>
          <dd>
            {result.mode === "thick"
              ? result.thickness
              : `${completedRows}/${result.diameter}`}
          </dd>
        </div>
        {result.mode === "thick" && (
          <div>
            <dt>Completed rows</dt>
            <dd>
              {completedRows}/{result.diameter}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
