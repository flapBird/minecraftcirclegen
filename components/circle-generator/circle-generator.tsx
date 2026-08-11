"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CircleMode, CircleOptions } from "@/lib/circle/circle-types";
import { generateCircle } from "@/lib/circle/generate-circle";
import {
  MAX_DIAMETER,
  MIN_DIAMETER,
  getMaxThickness,
  normalizeDiameter,
  normalizeThickness,
} from "@/lib/circle/circle-utils";
import {
  clearProgress,
  loadProgress,
  saveProgress,
} from "@/lib/circle/circle-storage";
import {
  serializeCircleUrl,
} from "@/lib/circle/circle-url-state";
import { CircleControls } from "./circle-controls";
import { CircleCanvas } from "./circle-canvas";
import { CircleStats } from "./circle-stats";
import { CircleBuilder } from "./circle-builder";
import { CircleExportDialog } from "./circle-export-dialog";
import { CircleShareButton } from "./circle-share-button";

export function CircleGenerator({
  initialOptions,
}: {
  initialOptions: CircleOptions;
}) {
  const [diameter, setDiameter] = useState(initialOptions.diameter);
  const [diameterInput, setDiameterInput] = useState(String(initialOptions.diameter));
  const [diameterError, setDiameterError] = useState("");
  const [mode, setMode] = useState<CircleMode>(initialOptions.mode);
  const [thickness, setThickness] = useState(initialOptions.thickness);
  const [builderActive, setBuilderActive] = useState(false);
  const [currentRow, setCurrentRow] = useState(0);
  const [completedRows, setCompletedRows] = useState<Set<number>>(new Set());
  const [storageWarning, setStorageWarning] = useState(false);
  const [completionPending, setCompletionPending] = useState(false);
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null);
  const progressReadyRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const options: CircleOptions = useMemo(
    () => ({ diameter, mode, thickness }),
    [diameter, mode, thickness],
  );
  const result = useMemo(() => generateCircle(options), [options]);

  const cancelPendingAdvance = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setCompletionPending(false);
  }, []);

  const showStatus = useCallback((message: string, error = false) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ message, error });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3500);
  }, []);

  useEffect(
    () => () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.delete("diameter");
    params.delete("mode");
    params.delete("thickness");
    const circleParams = new URLSearchParams(serializeCircleUrl(options));
    circleParams.forEach((value, key) => params.set(key, value));
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [options]);

  useEffect(() => {
    progressReadyRef.current = false;
    const timer = window.setTimeout(() => {
      const saved = loadProgress(options, diameter);
      setCurrentRow(saved?.currentRow ?? 0);
      setCompletedRows(new Set(saved?.completedRows ?? []));
      setBuilderActive(saved?.active ?? false);
      setStorageWarning(false);
      progressReadyRef.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, [diameter, mode, thickness, options]);

  useEffect(() => {
    if (!progressReadyRef.current) return;
    const saved = saveProgress(options, {
      active: builderActive,
      currentRow,
      completedRows: [...completedRows],
    });
    setStorageWarning(!saved);
  }, [builderActive, completedRows, currentRow, options]);

  const changeDiameter = useCallback(
    (value: number) => {
      cancelPendingAdvance();
      const next = normalizeDiameter(value);
      setDiameter(next);
      setDiameterInput(String(next));
      setCurrentRow((row) => Math.min(row, next - 1));
      setCompletedRows(
        (rows) => new Set([...rows].filter((row) => row < next)),
      );
      setDiameterError(
        value < MIN_DIAMETER
          ? `Minimum diameter is ${MIN_DIAMETER}. We corrected it for you.`
          : value > MAX_DIAMETER
            ? `Maximum diameter is ${MAX_DIAMETER}. We corrected it for you.`
            : "",
      );
      setThickness((current) => normalizeThickness(current, next));
    },
    [cancelPendingAdvance],
  );

  const handleDiameterInput = (value: string) => {
    setDiameterInput(value);
    if (value.trim() === "") {
      setDiameterError(`Enter a whole number from ${MIN_DIAMETER} to ${MAX_DIAMETER}.`);
      return;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      setDiameterError("Enter a valid whole number.");
      return;
    }
    changeDiameter(parsed);
    if (parsed < MIN_DIAMETER || parsed > MAX_DIAMETER) {
      setDiameterInput(value);
    }
  };

  const commitDiameter = () => {
    if (!diameterInput.trim() || !Number.isFinite(Number(diameterInput))) {
      setDiameterInput(String(diameter));
      setDiameterError(`Using the last valid diameter: ${diameter}.`);
      return;
    }
    changeDiameter(Number(diameterInput));
  };

  const changeMode = (nextMode: CircleMode) => {
    cancelPendingAdvance();
    setMode(nextMode);
    if (nextMode === "hollow") setThickness(1);
    if (nextMode === "thick" && thickness < 2) {
      setThickness(Math.min(2, getMaxThickness(diameter)));
    }
  };

  const changeThickness = (value: number) => {
    cancelPendingAdvance();
    setThickness(normalizeThickness(value, diameter));
  };

  const previousRow = useCallback(() => {
    setCurrentRow((row) => Math.max(0, row - 1));
  }, []);

  const nextRow = useCallback(() => {
    setCurrentRow((row) => Math.min(diameter - 1, row + 1));
  }, [diameter]);

  const toggleComplete = useCallback(() => {
    if (advanceTimerRef.current !== null) return;
    const wasComplete = completedRows.has(currentRow);
    setCompletedRows((current) => {
      const next = new Set(current);
      if (wasComplete) next.delete(currentRow);
      else next.add(currentRow);
      return next;
    });
    setCompletionPending(true);
    advanceTimerRef.current = window.setTimeout(() => {
      if (!wasComplete && currentRow < diameter - 1) {
        setCurrentRow((row) => Math.min(diameter - 1, row + 1));
      }
      advanceTimerRef.current = null;
      setCompletionPending(false);
    }, 160);
  }, [completedRows, currentRow, diameter]);

  const resetProgress = () => {
    if (!window.confirm("Reset all Builder Mode progress for this circle?")) return;
    cancelPendingAdvance();
    const cleared = clearProgress(options);
    setCompletedRows(new Set());
    setCurrentRow(0);
    setStorageWarning(!cleared);
    showStatus(
      cleared
        ? "Builder progress reset"
        : "Progress reset for this visit, but the saved copy could not be cleared.",
      !cleared,
    );
  };

  useEffect(() => {
    if (!builderActive) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName)
      ) {
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        previousRow();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        nextRow();
      } else if (event.code === "Space") {
        event.preventDefault();
        toggleComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [builderActive, nextRow, previousRow, toggleComplete]);

  return (
    <div className="generator-shell" id="generator">
      <div className="generator-toolbar">
        <div>
          <span className="live-dot" aria-hidden="true" />
          <span>Blueprint updates live</span>
        </div>
      </div>

      <div className="generator-layout">
        <div className="generator-preview">
          <CircleCanvas
            settingsPanel={
              <CircleControls
                embedded
                diameter={diameter}
                diameterInput={diameterInput}
                diameterError={diameterError}
                mode={mode}
                thickness={thickness}
                isEffectivelyFilled={result.isEffectivelyFilled}
                onDiameterInput={handleDiameterInput}
                onDiameterCommit={commitDiameter}
                onDiameterChange={changeDiameter}
                onModeChange={changeMode}
                onThicknessChange={changeThickness}
              />
            }
            summaryPanel={
              <CircleStats
                compact
                result={result}
                completedRows={completedRows.size}
              />
            }
            builderPanel={
              <CircleBuilder
                embedded
                result={result}
                active={builderActive}
                currentRow={currentRow}
                completedRows={completedRows}
                storageWarning={storageWarning}
                completionPending={completionPending}
                onStart={() => setBuilderActive(true)}
                onPrevious={previousRow}
                onNext={nextRow}
                onComplete={toggleComplete}
                onReset={resetProgress}
                onExit={() => setBuilderActive(false)}
              />
            }
            actionPanel={
              <div className="share-row workbench-share-row">
                <CircleExportDialog result={result} onStatus={showStatus} />
                <CircleShareButton options={options} onStatus={showStatus} />
                <span className="share-note">
                  Exports the full blueprint, not the current view.
                </span>
              </div>
            }
            result={result}
            builderActive={builderActive}
            currentRow={currentRow}
            completedRows={completedRows}
          />
        </div>
      </div>

      {toast && (
        <div
          className={`toast ${toast.error ? "is-error" : ""}`}
          role={toast.error ? "alert" : "status"}
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
