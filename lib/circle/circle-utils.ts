import type { CircleMode } from "./circle-types";

export const MIN_DIAMETER = 3;
export const MAX_DIAMETER = 512;
export const DEFAULT_DIAMETER = 21;
export const DEFAULT_MODE: CircleMode = "hollow";
export const DEFAULT_THICKNESS = 2;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeDiameter(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_DIAMETER;
  return clamp(Math.round(value), MIN_DIAMETER, MAX_DIAMETER);
}

export function getMaxThickness(diameter: number): number {
  return Math.ceil(normalizeDiameter(diameter) / 2);
}

export function normalizeThickness(value: number, diameter: number): number {
  if (!Number.isFinite(value)) return 1;
  return clamp(Math.round(value), 1, getMaxThickness(diameter));
}

export function coordinateForIndex(index: number, diameter: number): number {
  return index - (diameter - 1) / 2;
}

export function formatCoordinate(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function formatMode(mode: CircleMode): string {
  return mode.charAt(0).toUpperCase() + mode.slice(1);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
