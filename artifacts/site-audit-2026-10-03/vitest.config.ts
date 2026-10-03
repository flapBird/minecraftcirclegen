import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Audit repros assert the observed defects, not the desired fixed behavior.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("../../", import.meta.url)) } },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["artifacts/site-audit-2026-10-03/repro.test.tsx"],
    maxWorkers: 1,
    fileParallelism: false,
  },
});
