"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildFrameCommands,
  buildTeleportCommand,
  convertPortalCoords,
  destinationName,
  destinationYRange,
  formatPortalCoords,
  isInsideWorldBorder,
  searchRadiusBlocks,
  type PortalCoords,
} from "@/lib/nether-portal/portal-math";
import {
  parsePortalUrl,
  PORTAL_DEFAULTS,
  serializePortalUrl,
  type PortalUrlState,
} from "@/lib/nether-portal/portal-url-state";

const PAGE_PATH = "/nether-portal-calculator";
const INTEGER_PATTERN = /^-?\d+$/;

type FieldTexts = { x: string; y: string; z: string };

function parseField(text: string): number | null {
  return INTEGER_PATTERN.test(text.trim()) ? Number(text.trim()) : null;
}

export function NetherPortalCalculator({ initialSearch }: { initialSearch: string }) {
  const [state, setState] = useState<PortalUrlState>(() => parsePortalUrl(initialSearch));
  const [texts, setTexts] = useState<FieldTexts>({
    x: String(state.coords.x),
    y: String(state.coords.y),
    z: String(state.coords.z),
  });
  const [status, setStatus] = useState("");
  const statusTimer = useRef<number | null>(null);

  const parsed: PortalCoords = useMemo(
    () => ({ x: parseField(texts.x) as number, y: parseField(texts.y) as number, z: parseField(texts.z) as number }),
    [texts],
  );
  const allValid = [parsed.x, parsed.y, parsed.z].every((value) => value !== null && Number.isFinite(value));

  useEffect(() => {
    const query = allValid
      ? serializePortalUrl({ direction: state.direction, edition: state.edition, coords: parsed })
      : serializePortalUrl({ direction: state.direction, edition: state.edition, coords: PORTAL_DEFAULTS.coords });
    window.history.replaceState(null, "", `${PAGE_PATH}${query}`);
  }, [state.direction, state.edition, allValid, parsed]);

  useEffect(() => () => {
    if (statusTimer.current !== null) window.clearTimeout(statusTimer.current);
  }, []);

  function showStatus(message: string) {
    setStatus(message);
    if (statusTimer.current !== null) window.clearTimeout(statusTimer.current);
    statusTimer.current = window.setTimeout(() => setStatus(""), 2500);
  }

  async function copyText(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
      showStatus(message);
    } catch {
      showStatus("Copy failed — select the text and copy it manually.");
    }
  }

  const { direction, edition } = state;
  const converted = allValid ? convertPortalCoords(direction, parsed) : null;
  const yRange = destinationYRange(direction);
  const warnings: string[] = [];
  if (converted) {
    if (converted.y < yRange.min || converted.y > yRange.max) {
      warnings.push(
        `${destinationName(direction)} portals need Y between ${yRange.min} and ${yRange.max}; this portal would stand at Y=${converted.y}.`,
      );
    }
    if (!isInsideWorldBorder(converted.x) || !isInsideWorldBorder(converted.z)) {
      warnings.push("The converted coordinates fall outside the world border (±29,999,983).");
    }
  }

  const shareQuery = allValid
    ? serializePortalUrl({ direction, edition, coords: parsed })
    : serializePortalUrl({ direction, edition, coords: PORTAL_DEFAULTS.coords });

  return (
    <div className="portal-calculator">
      <fieldset className="portal-fieldset">
        <legend>Direction</legend>
        <div className="portal-segmented" role="radiogroup" aria-label="Conversion direction">
          <label className={direction === "ow2n" ? "is-active" : ""}>
            <input
              type="radio"
              name="portal-direction"
              value="ow2n"
              checked={direction === "ow2n"}
              onChange={() => setState((current) => ({ ...current, direction: "ow2n" }))}
            />
            Overworld → Nether
          </label>
          <label className={direction === "n2ow" ? "is-active" : ""}>
            <input
              type="radio"
              name="portal-direction"
              value="n2ow"
              checked={direction === "n2ow"}
              onChange={() => setState((current) => ({ ...current, direction: "n2ow" }))}
            />
            Nether → Overworld
          </label>
        </div>
      </fieldset>

      <fieldset className="portal-fieldset">
        <legend>Edition</legend>
        <div className="portal-segmented" role="radiogroup" aria-label="Minecraft edition">
          <label className={edition === "java" ? "is-active" : ""}>
            <input
              type="radio"
              name="portal-edition"
              value="java"
              checked={edition === "java"}
              onChange={() => setState((current) => ({ ...current, edition: "java" }))}
            />
            Java
          </label>
          <label className={edition === "bedrock" ? "is-active" : ""}>
            <input
              type="radio"
              name="portal-edition"
              value="bedrock"
              checked={edition === "bedrock"}
              onChange={() => setState((current) => ({ ...current, edition: "bedrock" }))}
            />
            Bedrock
          </label>
        </div>
      </fieldset>

      <div className="portal-inputs">
        {(["x", "y", "z"] as const).map((axis) => (
          <label key={axis} className="portal-input">
            <span>{axis.toUpperCase()}</span>
            <input
              type="number"
              step="1"
              inputMode="numeric"
              value={texts[axis]}
              aria-label={`${axis.toUpperCase()} coordinate${allValid || parseField(texts[axis]) !== null ? "" : " (whole number)"}`}
              onChange={(event) => setTexts((current) => ({ ...current, [axis]: event.target.value }))}
            />
          </label>
        ))}
      </div>

      {!allValid && (
        <p className="portal-hint" role="status">
          Enter whole numbers for X, Y, and Z to convert coordinates. Y is not scaled by
          the 1:8 ratio in either direction.
        </p>
      )}

      {converted && (
        <>
          {warnings.length > 0 && (
            <ul className="portal-warnings" role="status">
              {warnings.map((warning) => <li key={warning}>{warning}</li>)}
            </ul>
          )}
          <div className="portal-result">
            <p className="section-label">PORTAL TARGET IN {destinationName(direction).toUpperCase()}</p>
            <div className="portal-result-row">
              <output className="portal-coords" aria-label={`Converted coordinates ${formatPortalCoords(converted)}`}>
                {formatPortalCoords(converted)}
              </output>
              <button
                type="button"
                className="portal-copy-button"
                onClick={() => copyText(formatPortalCoords(converted), "Coordinates copied")}
              >
                Copy coordinates
              </button>
            </div>
            <p className="portal-note">
              The game searches {searchRadiusBlocks(direction, edition)} blocks around this
              point in {destinationName(direction)} for an existing portal ({edition === "java" ? "Java Edition" : "Bedrock Edition"}).
              Y stays the same as the source portal, and the closest portal by 3D distance wins the link.
            </p>
          </div>

          <div className="portal-commands">
            <div className="portal-command-row">
              <pre aria-label="Teleport command">{buildTeleportCommand(direction, converted)}</pre>
              <button
                type="button"
                className="portal-copy-button"
                onClick={() => copyText(buildTeleportCommand(direction, converted), "Teleport command copied")}
              >
                Copy
              </button>
            </div>
            <div className="portal-command-row portal-command-row--block">
              <pre aria-label="Obsidian frame fill commands">{buildFrameCommands(converted).join("\n")}</pre>
              <button
                type="button"
                className="portal-copy-button"
                onClick={() => copyText(buildFrameCommands(converted).join("\n"), "Frame commands copied")}
              >
                Copy frame
              </button>
            </div>
            <p className="portal-note">
              The fill commands build the 4×5 obsidian frame with the first frame block at the
              converted coordinates, laid out along the X axis. Light the 2×3 interior with
              flint and steel; orientation does not affect linking.
            </p>
          </div>
        </>
      )}

      <div className="portal-share-row">
        <button
          type="button"
          className="portal-copy-button portal-copy-button--primary"
          onClick={() => copyText(`${window.location.origin}${PAGE_PATH}${shareQuery}`, "Share link copied")}
        >
          Copy link to these coordinates
        </button>
        <p className="portal-status" role="status" aria-live="polite">{status}</p>
      </div>
    </div>
  );
}
