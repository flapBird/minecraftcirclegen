"use client";

import type { CircleResult } from "@/lib/circle/circle-types";
import { formatCoordinate, pluralize } from "@/lib/circle/circle-utils";

interface CircleBuilderProps {
  result: CircleResult;
  active: boolean;
  currentRow: number;
  completedRows: Set<number>;
  storageWarning: boolean;
  onStart: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  onReset: () => void;
  onExit: () => void;
}

export function CircleBuilder({
  result,
  active,
  currentRow,
  completedRows,
  storageWarning,
  onStart,
  onPrevious,
  onNext,
  onComplete,
  onReset,
  onExit,
}: CircleBuilderProps) {
  const row = result.rows[currentRow];
  const completeCount = completedRows.size;
  const progress = Math.round((completeCount / result.diameter) * 100);
  const allComplete = completeCount === result.diameter;

  return (
    <section className="tool-card builder-card" aria-labelledby="builder-title">
      <div className="card-heading">
        <span className="step-chip">4</span>
        <div>
          <h2 id="builder-title">Builder Mode</h2>
          <p>Follow one exact row at a time.</p>
        </div>
      </div>

      {!active ? (
        <>
          <div className="builder-intro">
            <span className="builder-marker" aria-hidden="true">
              ↓
            </span>
            <p>
              Highlight each row on the blueprint and mark it as built. Your
              progress is saved on this device.
            </p>
          </div>
          <button type="button" className="primary-button full" onClick={onStart}>
            Start Builder Mode
          </button>
        </>
      ) : (
        <div className="builder-active">
          {allComplete ? (
            <div className="complete-message" role="status">
              <span aria-hidden="true">✓</span>
              <div>
                <strong>Circle complete!</strong>
                <p>
                  All {result.diameter} rows have been marked as built.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="row-heading">
                <div>
                  <span className="eyebrow">Current build step</span>
                  <h3>
                    Row {currentRow + 1} of {result.diameter}
                  </h3>
                </div>
                <span
                  className={`status-pill ${completedRows.has(currentRow) ? "done" : ""}`}
                >
                  {completedRows.has(currentRow) ? "Built" : "Not built"}
                </span>
              </div>
              <dl className="row-facts">
                <div>
                  <dt>Relative Z</dt>
                  <dd>{formatCoordinate(row.relativeY)}</dd>
                </div>
                <div>
                  <dt>Blocks in this row</dt>
                  <dd>{row.blockCount}</dd>
                </div>
              </dl>
              <div className="segment-list" aria-label="Segments in current row">
                {row.segments.map((segment, index) => (
                  <div className="segment" key={`${segment.startX}-${segment.endX}`}>
                    <span>Segment {index + 1}</span>
                    <strong>
                      X {formatCoordinate(segment.startX)} to{" "}
                      {formatCoordinate(segment.endX)}
                    </strong>
                    <small>{pluralize(segment.length, "block")}</small>
                  </div>
                ))}
              </div>
              <div className="builder-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={onPrevious}
                  disabled={currentRow === 0}
                >
                  ↑ Previous Row
                </button>
                <button
                  type="button"
                  className="primary-button"
                  data-testid="mark-complete"
                  onClick={onComplete}
                >
                  {completedRows.has(currentRow) ? "Mark Incomplete" : "✓ Mark Complete"}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={onNext}
                  disabled={currentRow === result.diameter - 1}
                >
                  ↓ Next Row
                </button>
              </div>
            </>
          )}

          <div className="progress-block">
            <div>
              <span>
                {completeCount} of {result.diameter} rows complete
              </span>
              <strong>{progress}%</strong>
            </div>
            <progress
              value={completeCount}
              max={result.diameter}
              aria-label={`${completeCount} of ${result.diameter} rows complete`}
            />
          </div>
          <div className="builder-footer-actions">
            <button type="button" onClick={onReset}>
              Reset Progress
            </button>
            <button type="button" onClick={onExit}>
              Exit Builder Mode
            </button>
          </div>
          {storageWarning && (
            <p className="field-error" role="status">
              Progress works for this visit, but your browser could not save it.
            </p>
          )}
          <p className="keyboard-tip">
            Keyboard: ↑ previous · ↓ next · Space mark complete
          </p>
        </div>
      )}
    </section>
  );
}
