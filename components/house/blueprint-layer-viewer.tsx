"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { BlueprintCell, BlueprintLayer } from "@/content/houses/types";

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function BlueprintLayerViewer({
  name,
  slug,
  width,
  length,
  layers,
  palette,
}: {
  name: string;
  slug: string;
  width: number;
  length: number;
  layers: BlueprintLayer[];
  palette: BlueprintCell[];
}) {
  const [index, setIndex] = useState(0);
  const layer = layers[index];
  const paletteMap = useMemo(() => new Map(palette.map((item) => [item.code, item])), [palette]);

  const downloadLayer = () => {
    const cell = Math.max(30, Math.min(60, Math.floor(720 / Math.max(width, length))));
    const margin = 48;
    const legendHeight = palette.length * 28 + 100;
    const svgWidth = width * cell + margin * 2;
    const svgHeight = length * cell + margin * 2 + legendHeight;
    const cells = layer.rows.flatMap((row, z) => row.split("").map((code, x) => {
      const item = paletteMap.get(code);
      const fill = item?.color ?? "#f4f1e8";
      return `<rect x="${margin + x * cell}" y="${margin + z * cell}" width="${cell}" height="${cell}" fill="${fill}" stroke="#d1d6cf"/><text x="${margin + x * cell + cell / 2}" y="${margin + z * cell + cell / 2 + 5}" text-anchor="middle" font-family="monospace" font-size="${Math.max(11, cell * 0.25)}" fill="${code === "." ? "#8a918a" : "#ffffff"}">${code === "." ? "" : escapeXml(code)}</text>`;
    })).join("");
    const legend = palette.map((item, legendIndex) => `<rect x="${margin}" y="${length * cell + margin * 2 + 38 + legendIndex * 28}" width="18" height="18" fill="${item.color}"/><text x="${margin + 28}" y="${length * cell + margin * 2 + 52 + legendIndex * 28}" font-family="Arial, sans-serif" font-size="15" fill="#18231b">${escapeXml(item.code)} — ${escapeXml(item.label)}</text>`).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}"><rect width="100%" height="100%" fill="#fffdf6"/><text x="${margin}" y="28" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#18231b">${escapeXml(name)} — Layer ${layer.number}: ${escapeXml(layer.title)}</text>${cells}<text x="${margin}" y="${length * cell + margin * 2 + 20}" font-family="Arial, sans-serif" font-size="14" fill="#5d6a61">Each square represents one block. Empty squares are unoccupied.</text>${legend}</svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slug}-blueprint-layer-${layer.number}.svg`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div className="blueprint-viewer">
      <div className="blueprint-toolbar">
        <div aria-live="polite">
          <span>Layer {index + 1} / {layers.length}</span>
          <strong>{layer.title}</strong>
        </div>
        <div className="blueprint-actions">
          <button type="button" onClick={() => setIndex((current) => Math.max(0, current - 1))} disabled={index === 0}>← Previous</button>
          <button type="button" onClick={() => setIndex((current) => Math.min(layers.length - 1, current + 1))} disabled={index === layers.length - 1}>Next →</button>
        </div>
      </div>
      <p className="blueprint-layer-description">{layer.description}</p>
      <div className="blueprint-scroll" role="img" aria-label={`${name}, layer ${layer.number}: ${layer.title}. ${width} by ${length} block top-down grid.`}>
        <div className="blueprint-grid" style={{ "--blueprint-columns": width } as CSSProperties}>
          {layer.rows.flatMap((row, z) => row.split("").map((code, x) => {
            const item = paletteMap.get(code);
            return (
              <span
                key={`${x}-${z}`}
                className={code === "." ? "is-empty" : undefined}
                style={item ? { backgroundColor: item.color } : undefined}
                title={item?.label ?? "Empty"}
                aria-hidden="true"
              />
            );
          }))}
        </div>
      </div>
      <div className="blueprint-legend" aria-label="Blueprint legend">
        {palette.map((item) => <span key={item.code}><i style={{ backgroundColor: item.color }} />{item.code}: {item.label}</span>)}
        <span><i className="is-empty" />Empty</span>
      </div>
      <button className="blueprint-download" type="button" onClick={downloadLayer}>Download current layer SVG</button>
    </div>
  );
}
