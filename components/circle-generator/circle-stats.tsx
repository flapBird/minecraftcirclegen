import type { CircleResult } from "@/lib/circle/circle-types";
import { formatMode, pluralize } from "@/lib/circle/circle-utils";

interface CircleStatsProps {
  result: CircleResult;
  compact?: boolean;
}

export function CircleStats({
  result,
  compact = false,
}: CircleStatsProps) {
  const fullStacks = Math.floor(result.totalBlocks / 64);
  const remaining = result.totalBlocks % 64;
  const radius = result.diameter / 2;
  const stackSummary =
    fullStacks > 0
      ? `${pluralize(fullStacks, "stack")}${remaining > 0 ? ` + ${pluralize(remaining, "block")}` : ""}`
      : pluralize(remaining, "block");

  if (compact) {
    return (
      <section
        className="workbench-materials"
        aria-labelledby="materials-title"
      >
        <h2 id="materials-title">Materials</h2>
        <dl>
          <div>
            <dt>Total</dt>
            <dd>{pluralize(result.totalBlocks, "block")}</dd>
          </div>
          <div>
            <dt>Stacks</dt>
            <dd>{stackSummary}</dd>
          </div>
          <div>
            <dt>Shape</dt>
            <dd>
              {result.diameter} × {result.diameter} · {formatMode(result.mode)}
              {result.mode === "thick" ? ` ${result.thickness}` : ""}
            </dd>
          </div>
          <div>
            <dt>Radius</dt>
            <dd>{Number.isInteger(radius) ? radius : radius.toFixed(1)}</dd>
          </div>
        </dl>
      </section>
    );
  }

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
        {result.mode === "thick" && (
          <div>
            <dt>Thickness</dt>
            <dd>{result.thickness}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
