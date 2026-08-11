"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CircleResult, ExportOptions } from "@/lib/circle/circle-types";
import { downloadCirclePng } from "@/lib/circle/export-circle-png";

const DEFAULT_OPTIONS: ExportOptions = {
  showGrid: true,
  showAxes: true,
  showCoordinates: false,
  transparentBackground: false,
};

interface CircleExportDialogProps {
  result: CircleResult;
  onStatus: (message: string, isError?: boolean) => void;
}

export function CircleExportDialog({
  result,
  onStatus,
}: CircleExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [downloading, setDownloading] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!controlRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [close, open]);

  const download = async () => {
    setDownloading(true);
    try {
      const outcome = await downloadCirclePng(result, options);
      onStatus(
        outcome === "shared"
          ? "Blueprint ready to share"
          : outcome === "opened"
            ? "Blueprint opened in a new tab"
            : "PNG downloaded",
      );
      close(false);
    } catch (error) {
      onStatus(
        error instanceof Error
          ? error.message
          : "The PNG could not be downloaded. Please try again.",
        true,
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div ref={controlRef} className="export-control">
      <button
        ref={triggerRef}
        type="button"
        className="primary-button"
        aria-expanded={open}
        aria-controls="export-options"
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        ↓ Download PNG
      </button>
      {open && (
        <div
          ref={panelRef}
          id="export-options"
          className="export-panel"
          role="dialog"
          aria-labelledby="export-options-title"
          tabIndex={-1}
        >
          <div className="export-panel-heading">
            <strong id="export-options-title">Export options</strong>
            <button
              type="button"
              aria-label="Close export options"
              onClick={() => close()}
            >
              ×
            </button>
          </div>
          {(
            [
              ["showGrid", "Show grid"],
              ["showAxes", "Show axes"],
              ["showCoordinates", "Show coordinates"],
              ["transparentBackground", "Transparent background"],
            ] as const
          ).map(([key, label]) => (
            <label className="check-row" key={key}>
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(event) =>
                  setOptions((current) => ({
                    ...current,
                    [key]: event.target.checked,
                  }))
                }
              />
              <span>{label}</span>
            </label>
          ))}
          <button
            type="button"
            className="primary-button full"
            disabled={downloading}
            onClick={download}
          >
            {downloading ? "Creating PNG…" : "Download blueprint"}
          </button>
        </div>
      )}
    </div>
  );
}
