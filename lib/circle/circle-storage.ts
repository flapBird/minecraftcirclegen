import type { CircleOptions } from "./circle-types";

export interface BuilderProgress {
  currentRow: number;
  completedRows: number[];
  active: boolean;
}

export function getProgressKey(options: CircleOptions): string {
  const thickness =
    options.mode === "thick" ? options.thickness : options.mode === "hollow" ? 1 : 0;
  return `mc-circle:v1:${options.diameter}:${options.mode}:${thickness}`;
}

export function loadProgress(
  options: CircleOptions,
  diameter: number,
): BuilderProgress | null {
  try {
    const raw = window.localStorage.getItem(getProgressKey(options));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BuilderProgress>;
    if (!Array.isArray(parsed.completedRows)) return null;
    return {
      currentRow: Math.min(
        diameter - 1,
        Math.max(0, Number(parsed.currentRow) || 0),
      ),
      completedRows: parsed.completedRows.filter(
        (row): row is number =>
          Number.isInteger(row) && row >= 0 && row < diameter,
      ),
      active: Boolean(parsed.active),
    };
  } catch {
    return null;
  }
}

export function saveProgress(
  options: CircleOptions,
  progress: BuilderProgress,
): boolean {
  try {
    window.localStorage.setItem(getProgressKey(options), JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function clearProgress(options: CircleOptions): boolean {
  try {
    window.localStorage.removeItem(getProgressKey(options));
    return true;
  } catch {
    return false;
  }
}
