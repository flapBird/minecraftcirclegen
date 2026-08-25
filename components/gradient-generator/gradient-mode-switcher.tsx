"use client";

import { useState } from "react";
import { GradientGeneratorFromUrl } from "./gradient-generator-from-url";
import { TextGradientGenerator } from "./text-gradient-generator";

export function GradientModeSwitcher() {
  const [mode, setMode] = useState<"text" | "block">("block");
  return (
    <div className="gradient-mode-shell" id="generator">
      <div className="gradient-mode-tabs" role="tablist" aria-label="Gradient generator mode">
        <button type="button" role="tab" aria-selected={mode === "text"} onClick={() => setMode("text")}><span aria-hidden="true">Aa</span><strong>Text Gradient</strong><small>RGB chat and server text</small></button>
        <button type="button" role="tab" aria-selected={mode === "block"} onClick={() => setMode("block")}><span aria-hidden="true">▦</span><strong>Block Gradient</strong><small>Buildable vanilla palettes</small></button>
      </div>
      {mode === "text" ? <TextGradientGenerator /> : <GradientGeneratorFromUrl />}
    </div>
  );
}
