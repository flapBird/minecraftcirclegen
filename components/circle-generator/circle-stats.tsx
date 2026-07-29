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
        <span className="step-chip">3</span>
        <div>
          <h2 id="materials-title">Materials</h2>
          <p>Your build at a glance.</p>
        </div>
      </div>
      <div className="materials-callout">
        <span>Total blocks</span>
        <strong>{result.totalBlocks.toLocaleString()}</strong>
        <small>
          {fullStacks === 0
            ? pluralize(remaining, "block")
            : `${pluralize(fullStacks, "stack")}${remaining ? ` + ${pluralize(remaining, "block")}` : ""}`}
        </small>
      </div>
      <dl className="stats-grid">
        <div>
          <dt>Stacks of 64</dt>
          <dd>{fullStacks}</dd>
        </div>
        <div>
          <dt>Remaining blocks</dt>
          <dd>{remaining}</dd>
        </div>
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
