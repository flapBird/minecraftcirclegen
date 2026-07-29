"use client";

import type { CircleMode } from "@/lib/circle/circle-types";
import {
  MAX_DIAMETER,
  MIN_DIAMETER,
  getMaxThickness,
} from "@/lib/circle/circle-utils";

const PRESETS = [5, 7, 9, 11, 15, 21, 31, 51, 101];

interface CircleControlsProps {
  diameter: number;
  diameterInput: string;
  diameterError: string;
  mode: CircleMode;
  thickness: number;
  isEffectivelyFilled: boolean;
  onDiameterInput: (value: string) => void;
  onDiameterCommit: () => void;
  onDiameterChange: (value: number) => void;
  onModeChange: (mode: CircleMode) => void;
  onThicknessChange: (value: number) => void;
}

export function CircleControls({
  diameter,
  diameterInput,
  diameterError,
  mode,
  thickness,
  isEffectivelyFilled,
  onDiameterInput,
  onDiameterCommit,
  onDiameterChange,
  onModeChange,
  onThicknessChange,
}: CircleControlsProps) {
  const maxThickness = getMaxThickness(diameter);

  return (
    <section className="tool-card controls-card" aria-labelledby="controls-title">
      <div className="card-heading">
        <div>
          <h2 id="controls-title">Shape settings</h2>
          <p>Choose the footprint you want to build.</p>
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="diameter">Diameter</label>
        <p id="diameter-help" className="field-help">
          The circle will be this many blocks wide and tall.
        </p>
        <div className="number-stepper">
          <button
            type="button"
            aria-label="Decrease diameter"
            onClick={() => onDiameterChange(diameter - 1)}
            disabled={diameter <= MIN_DIAMETER}
          >
            −
          </button>
          <input
            id="diameter"
            data-testid="diameter-input"
            type="number"
            inputMode="numeric"
            min={MIN_DIAMETER}
            max={MAX_DIAMETER}
            value={diameterInput}
            aria-describedby={`diameter-help${diameterError ? " diameter-error" : ""}`}
            aria-invalid={Boolean(diameterError)}
            onChange={(event) => onDiameterInput(event.target.value)}
            onBlur={onDiameterCommit}
            onKeyDown={(event) => {
              if (event.key === "Enter") onDiameterCommit();
            }}
          />
          <button
            type="button"
            aria-label="Increase diameter"
            onClick={() => onDiameterChange(diameter + 1)}
            disabled={diameter >= MAX_DIAMETER}
          >
            +
          </button>
        </div>
        <p id="diameter-error" className="field-error" aria-live="polite">
          {diameterError}
        </p>
        <div className="preset-list" aria-label="Common circle diameters">
          {PRESETS.map((preset) => (
            <button
              type="button"
              key={preset}
              className={diameter === preset ? "is-active" : ""}
              aria-pressed={diameter === preset}
              onClick={() => onDiameterChange(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <fieldset className="field-group">
        <legend>Circle mode</legend>
        <div className="segmented-control">
          {(["hollow", "thick", "filled"] as CircleMode[]).map((value) => (
            <button
              key={value}
              type="button"
              data-testid={`mode-${value}`}
              className={mode === value ? "is-active" : ""}
              aria-pressed={mode === value}
              onClick={() => onModeChange(value)}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
        <p className="field-help">
          {mode === "hollow" && "A one-block outline for walls and rings."}
          {mode === "thick" && "A sturdy ring with an adjustable wall width."}
          {mode === "filled" && "A solid footprint for platforms and foundations."}
        </p>
      </fieldset>

      {mode === "thick" && (
        <div className="field-group" data-testid="thickness-control">
          <label htmlFor="thickness">Thickness</label>
          <div className="number-stepper compact">
            <button
              type="button"
              aria-label="Decrease thickness"
              onClick={() => onThicknessChange(thickness - 1)}
              disabled={thickness <= 1}
            >
              −
            </button>
            <input
              id="thickness"
              type="number"
              min={1}
              max={maxThickness}
              value={thickness}
              onChange={(event) => onThicknessChange(Number(event.target.value))}
            />
            <button
              type="button"
              aria-label="Increase thickness"
              onClick={() => onThicknessChange(thickness + 1)}
              disabled={thickness >= maxThickness}
            >
              +
            </button>
          </div>
          <input
            className="range-control"
            aria-label="Circle thickness"
            type="range"
            min={1}
            max={maxThickness}
            value={thickness}
            onChange={(event) => onThicknessChange(Number(event.target.value))}
          />
          <div className="range-labels">
            <span>1 block</span>
            <span>{maxThickness} blocks</span>
          </div>
          {isEffectivelyFilled && (
            <p className="notice-inline">This thickness creates a filled circle.</p>
          )}
        </div>
      )}
    </section>
  );
}
