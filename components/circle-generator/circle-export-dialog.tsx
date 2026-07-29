"use client";

import { useState } from "react";
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
      setOpen(false);
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
    <div className="export-control">
      <button
        type="button"
        className="primary-button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        ↓ Download PNG
      </button>
      {open && (
        <div className="export-panel">
          <div className="export-panel-heading">
            <strong>Export options</strong>
            <button
              type="button"
              aria-label="Close export options"
              onClick={() => setOpen(false)}
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
