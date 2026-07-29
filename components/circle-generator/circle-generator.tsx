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
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null);
  const progressReadyRef = useRef(false);

  const options: CircleOptions = useMemo(
    () => ({ diameter, mode, thickness }),
    [diameter, mode, thickness],
  );
  const result = useMemo(() => generateCircle(options), [options]);

  const showStatus = useCallback((message: string, error = false) => {
    setToast({ message, error });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    const url = `${window.location.pathname}${serializeCircleUrl(options)}${window.location.hash}`;
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
      const next = normalizeDiameter(value);
      setDiameter(next);
      setDiameterInput(String(next));
      setDiameterError(
        value < MIN_DIAMETER
          ? `Minimum diameter is ${MIN_DIAMETER}. We corrected it for you.`
          : value > MAX_DIAMETER
            ? `Maximum diameter is ${MAX_DIAMETER}. We corrected it for you.`
            : "",
      );
      setThickness((current) => normalizeThickness(current, next));
    },
    [],
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
    setMode(nextMode);
    if (nextMode === "hollow") setThickness(1);
    if (nextMode === "thick" && thickness < 2) {
      setThickness(Math.min(2, getMaxThickness(diameter)));
    }
  };

  const changeThickness = (value: number) => {
    setThickness(normalizeThickness(value, diameter));
  };

  const previousRow = useCallback(() => {
    setCurrentRow((row) => Math.max(0, row - 1));
  }, []);

  const nextRow = useCallback(() => {
    setCurrentRow((row) => Math.min(diameter - 1, row + 1));
  }, [diameter]);

  const toggleComplete = useCallback(() => {
    setCompletedRows((current) => {
      const next = new Set(current);
      if (next.has(currentRow)) {
        next.delete(currentRow);
      } else {
        next.add(currentRow);
        if (currentRow < diameter - 1) {
          window.setTimeout(() => setCurrentRow((row) => Math.min(diameter - 1, row + 1)), 120);
        }
      }
      return next;
    });
  }, [currentRow, diameter]);

  const resetProgress = () => {
    if (!window.confirm("Reset all Builder Mode progress for this circle?")) return;
    clearProgress(options);
    setCompletedRows(new Set());
    setCurrentRow(0);
    setStorageWarning(false);
    showStatus("Builder progress reset");
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
        <span>No sign-up · Works in your browser</span>
      </div>

      <div className="generator-layout">
        <div
          className="generator-controls"
          role="region"
          aria-label="Circle settings, materials, and builder controls"
          tabIndex={0}
        >
          <CircleControls
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
          <CircleStats result={result} completedRows={completedRows.size} />
          <CircleBuilder
            result={result}
            active={builderActive}
            currentRow={currentRow}
            completedRows={completedRows}
            storageWarning={storageWarning}
            onStart={() => setBuilderActive(true)}
            onPrevious={previousRow}
            onNext={nextRow}
            onComplete={toggleComplete}
            onReset={resetProgress}
            onExit={() => setBuilderActive(false)}
          />
        </div>
        <div className="generator-preview">
          <CircleCanvas
            result={result}
            builderActive={builderActive}
            currentRow={currentRow}
            completedRows={completedRows}
          />
          <div className="share-row">
            <CircleExportDialog result={result} onStatus={showStatus} />
            <CircleShareButton onStatus={showStatus} />
            <span className="share-note">Exports the full blueprint, not the current view.</span>
          </div>
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
