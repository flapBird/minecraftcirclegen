"use client";

import { useEffect, useRef } from "react";
import type { CircleResult } from "@/lib/circle/circle-types";
import { formatCoordinate, pluralize } from "@/lib/circle/circle-utils";

interface CircleBuilderProps {
  embedded?: boolean;
  result: CircleResult;
  active: boolean;
  currentRow: number;
  completedRows: Set<number>;
  storageWarning: boolean;
  completionPending: boolean;
  onStart: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  onReset: () => void;
  onExit: () => void;
}

export function CircleBuilder({
  embedded = false,
  result,
  active,
  currentRow,
  completedRows,
  storageWarning,
  completionPending,
  onStart,
  onPrevious,
  onNext,
  onComplete,
  onReset,
  onExit,
}: CircleBuilderProps) {
  const safeCurrentRow = Math.min(
    result.diameter - 1,
    Math.max(0, Number.isInteger(currentRow) ? currentRow : 0),
  );
  const row = result.rows[safeCurrentRow];
  const completeCount = completedRows.size;
  const progress = Math.round((completeCount / result.diameter) * 100);
  const allComplete = completeCount === result.diameter;
  const rowHeadingRef = useRef<HTMLHeadingElement>(null);
  const wasActiveRef = useRef(active);

  useEffect(() => {
    if (active && !wasActiveRef.current) rowHeadingRef.current?.focus();
    wasActiveRef.current = active;
  }, [active]);

  return (
    <section
      className={
        embedded
          ? "builder-card workbench-builder-panel"
          : "tool-card builder-card"
      }
      aria-labelledby="builder-title"
    >
      <div className="card-heading">
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
          {allComplete && (
            <div className="complete-message" role="status">
              <span aria-hidden="true">✓</span>
              <div>
                <strong>Circle complete!</strong>
                <p>
                  All {result.diameter} rows have been marked as built.
                </p>
              </div>
            </div>
          )}

          <div className="row-heading" aria-live="polite">
            <div>
              <span className="eyebrow">Current build step</span>
              <h3 ref={rowHeadingRef} tabIndex={-1}>
                Row {safeCurrentRow + 1} of {result.diameter}
              </h3>
            </div>
            <span
              className={`status-pill ${completedRows.has(safeCurrentRow) ? "done" : ""}`}
            >
              {completedRows.has(safeCurrentRow) ? "Built" : "Not built"}
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
          <div className="row-preview" aria-hidden="true">
            {row.segments.map((segment) => {
              const startIndex = segment.startX + (result.diameter - 1) / 2;
              return (
                <span
                  key={`${segment.startX}-${segment.endX}`}
                  style={{
                    left: `${(startIndex / result.diameter) * 100}%`,
                    width: `${(segment.length / result.diameter) * 100}%`,
                  }}
                />
              );
            })}
          </div>
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
              disabled={safeCurrentRow === 0 || completionPending}
            >
              ↑ Previous Row
            </button>
            <button
              type="button"
              className="primary-button"
              data-testid="mark-complete"
              onClick={onComplete}
              disabled={completionPending}
            >
              {completionPending
                ? "Updating…"
                : completedRows.has(safeCurrentRow)
                  ? "Mark Incomplete"
                  : "✓ Mark Complete"}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={onNext}
              disabled={safeCurrentRow === result.diameter - 1 || completionPending}
            >
              ↓ Next Row
            </button>
          </div>

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
