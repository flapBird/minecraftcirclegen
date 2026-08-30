export type PlayerLookupKind = "username" | "uuid";

export interface ValidationResult {
  value: string | null;
  error: string | null;
}

const USERNAME_CHARACTERS = /^[A-Za-z0-9_]+$/;
const COMPACT_UUID = /^[0-9a-fA-F]{32}$/;

export function validateMinecraftUsername(rawValue: string): ValidationResult {
  const value = rawValue.trim();
  if (value.length < 3) return { value: null, error: "Username is too short. Use 3–16 characters." };
  if (value.length > 16) return { value: null, error: "Username is too long. Use 3–16 characters." };
  if (!USERNAME_CHARACTERS.test(value)) {
    return { value: null, error: "Use only letters, numbers, and underscores." };
  }
  return { value, error: null };
}

export function formatMinecraftUuid(compactUuid: string) {
  const value = compactUuid.toLowerCase();
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

export function validateMinecraftUuid(rawValue: string): ValidationResult {
  const compact = rawValue.trim().replaceAll("-", "");
  if (!COMPACT_UUID.test(compact)) {
    return { value: null, error: "Enter a 32-character UUID, with or without hyphens." };
  }
  return { value: compact.toLowerCase(), error: null };
}

export function validatePlayerLookup(kind: PlayerLookupKind, value: string) {
  return kind === "username"
    ? validateMinecraftUsername(value)
    : validateMinecraftUuid(value);
}
