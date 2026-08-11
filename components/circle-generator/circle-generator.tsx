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
import { serializeCircleUrl } from "@/lib/circle/circle-url-state";
import { CircleControls } from "./circle-controls";
import { CircleCanvas } from "./circle-canvas";
import { CircleStats } from "./circle-stats";
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
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const options: CircleOptions = useMemo(
    () => ({ diameter, mode, thickness }),
    [diameter, mode, thickness],
  );
  const result = useMemo(() => generateCircle(options), [options]);

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
            summaryPanel={<CircleStats compact result={result} />}
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
