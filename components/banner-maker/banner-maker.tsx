"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BANNER_PATTERNS,
  DYE_COLORS,
  decodeBannerDesign,
  encodeBannerDesign,
  getDye,
  getPattern,
  makeBannerCommand,
  makeBannerSetblockCommand,
  type BannerLayer,
} from "@/lib/banner/banner-data";
import { BannerPatternIcon, BannerPreview } from "./banner-preview";

export function BannerMaker() {
  const [baseColorId, setBaseColorId] = useState("green");
  const [layers, setLayers] = useState<BannerLayer[]>([]);
  const [activeColorId, setActiveColorId] = useState("black");
  const [editingLayerUid, setEditingLayerUid] = useState<number | null>(null);
  const [commandMode, setCommandMode] = useState<"give" | "setblock">("give");
  const [toast, setToast] = useState("");
  const nextUid = useRef(1);
  const toastTimer = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const giveCommand = useMemo(() => makeBannerCommand(baseColorId, layers), [baseColorId, layers]);
  const setblockCommand = useMemo(() => makeBannerSetblockCommand(baseColorId, layers), [baseColorId, layers]);
  const command = commandMode === "give" ? giveCommand : setblockCommand;
  const sharePath = useMemo(() => `/minecraft-banner-maker?banner=${encodeURIComponent(encodeBannerDesign(baseColorId, layers))}`, [baseColorId, layers]);
  const editingLayer = layers.find((layer) => layer.uid === editingLayerUid) ?? null;

  const showStatus = useCallback((message: string) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);

  useEffect(() => {
    const shared = decodeBannerDesign(new URL(window.location.href).searchParams.get("banner"));
    if (!shared) return;
    const restore = window.setTimeout(() => {
      setBaseColorId(shared.baseColorId);
      setLayers(shared.layers);
      nextUid.current = shared.layers.length + 1;
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const moveLayer = (index: number, direction: -1 | 1) => {
    setLayers((current) => {
      const destination = index + direction;
      if (destination < 0 || destination >= current.length) return current;
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  };

  const addPattern = (patternId: string) => {
    if (layers.length >= 6) return showStatus("A Minecraft banner supports up to 6 loom pattern layers");
    setLayers((current) => [...current, { uid: nextUid.current++, patternId, colorId: activeColorId }]);
    setEditingLayerUid(null);
    showStatus(`${getPattern(patternId).name} added`);
  };

  const choosePatternColor = (colorId: string) => {
    setActiveColorId(colorId);
    if (editingLayerUid !== null) {
      setLayers((current) => current.map((layer) => layer.uid === editingLayerUid ? { ...layer, colorId } : layer));
    }
  };

  const copyCommand = async () => {
    try { await navigator.clipboard.writeText(command); showStatus("Java command copied"); }
    catch { showStatus("Copy failed — select the command manually"); }
  };

  const share = async () => {
    const url = new URL(sharePath, window.location.origin);
    window.history.replaceState(null, "", url);
    const canShare = typeof navigator.share === "function";
    try {
      if (canShare) await navigator.share({ title: "Minecraft banner design", url: url.toString() });
      else await navigator.clipboard.writeText(url.toString());
      showStatus(canShare ? "Share sheet opened" : "Share link copied");
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") showStatus("Share link could not be copied");
    }
  };

  const copyShareLink = async () => {
    const url = new URL(sharePath, window.location.origin).toString();
    window.history.replaceState(null, "", url);
    try { await navigator.clipboard.writeText(url); showStatus("Share link copied"); }
    catch { showStatus("Copy failed — select the link manually"); }
  };

  const downloadPng = async () => {
    const svg = svgRef.current;
    if (!svg) return;
    try {
      const source = new XMLSerializer().serializeToString(svg);
      const url = URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" }));
      const image = new Image();
      await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("Image could not load")); image.src = url; });
      const canvas = document.createElement("canvas");
      canvas.width = 720;
      canvas.height = 1080;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = "minecraft-banner.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      showStatus("Banner PNG downloaded");
    } catch { showStatus("The banner PNG could not be created"); }
  };

  const randomize = () => {
    const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
    const count = 3 + Math.floor(Math.random() * 4);
    const nextLayers = Array.from({ length: count }, (_, index) => ({
      uid: index + 1,
      patternId: pick(BANNER_PATTERNS).id,
      colorId: pick(DYE_COLORS).id,
    }));
    setBaseColorId(pick(DYE_COLORS).id);
    setLayers(nextLayers);
    setActiveColorId("black");
    setEditingLayerUid(null);
    nextUid.current = count + 1;
    showStatus("Random banner created");
  };

  const reset = () => {
    setBaseColorId("green");
    setLayers([]);
    setActiveColorId("black");
    setEditingLayerUid(null);
    nextUid.current = 1;
    showStatus("Banner cleared");
  };

  return (
    <div className="generator-shell banner-maker" id="generator">
      <div className="banner-studio">
        <section className="banner-preview-card" aria-labelledby="banner-preview-title">
          <div className="server-card-heading">
            <h2 id="banner-preview-title" className="preview-heading">PREVIEW</h2>
            <span>{layers.length} / 6 layers</span>
          </div>
          <div className="banner-preview-stage"><BannerPreview baseColorId={baseColorId} layers={layers} svgRef={svgRef} /></div>
          <div className="banner-actions banner-preview-actions">
            <button type="button" className="primary-button" onClick={randomize}>Randomize</button>
            <button type="button" className="secondary-button" onClick={reset}>Clear All</button>
            <button type="button" className="secondary-button" onClick={downloadPng}>↓ Download PNG</button>
          </div>
        </section>

        <section className="banner-layers-card" aria-labelledby="banner-layers-title">
          <div className="banner-panel-heading"><h2 id="banner-layers-title">Layers</h2><span>{layers.length} / 6</span></div>
          <div className="banner-base-layer"><span style={{ background: getDye(baseColorId).hex }} /><div><strong>Base</strong><small>{getDye(baseColorId).name} banner</small></div></div>
          {layers.length ? (
            <ol className="banner-layer-list compact-banner-layers">
              {layers.map((layer, index) => (
                <li key={layer.uid} className={editingLayerUid === layer.uid ? "is-editing" : ""}>
                  <button type="button" className="banner-layer-edit" aria-label={`Edit layer ${index + 1}`} onClick={() => { setEditingLayerUid(layer.uid); setActiveColorId(layer.colorId); }}><BannerPatternIcon patternId={layer.patternId} colorId={layer.colorId} /><span><strong>Layer {index + 1}</strong><small>{getPattern(layer.patternId).name} · {getDye(layer.colorId).name}</small></span></button>
                  <div>
                    <button type="button" aria-label={`Move layer ${index + 1} down`} disabled={index === 0} onClick={() => moveLayer(index, -1)}>↓</button>
                    <button type="button" aria-label={`Move layer ${index + 1} up`} disabled={index === layers.length - 1} onClick={() => moveLayer(index, 1)}>↑</button>
                    <button type="button" aria-label={`Remove layer ${index + 1}`} onClick={() => { setLayers((current) => current.filter((item) => item.uid !== layer.uid)); if (editingLayerUid === layer.uid) setEditingLayerUid(null); }}>×</button>
                  </div>
                </li>
              ))}
            </ol>
          ) : <p className="banner-empty-layers">Choose a layer color, then click any pattern once to add it.</p>}
        </section>

        <aside className="banner-settings-card" aria-labelledby="banner-settings-title">
          <div className="banner-panel-heading"><div><p className="section-label">BANNER DESIGN</p><h2 id="banner-settings-title">Layer creation</h2></div><span>Java 1.21+</span></div>

          <fieldset className="banner-color-fieldset banner-compact-colors">
            <legend>Base color</legend>
            <div className="banner-color-grid">
              {DYE_COLORS.map((color) => <button key={color.id} type="button" className={baseColorId === color.id ? "is-active" : ""} aria-label={`Set base color to ${color.name}`} aria-pressed={baseColorId === color.id} title={color.name} onClick={() => setBaseColorId(color.id)}><span style={{ background: color.hex }} /></button>)}
            </div>
          </fieldset>

          <fieldset className="banner-color-fieldset banner-compact-colors">
            <legend>{editingLayer ? `Layer color · ${getPattern(editingLayer.patternId).name}` : `New layer color · ${getDye(activeColorId).name}`}</legend>
            <div className="banner-color-grid">
              {DYE_COLORS.map((color) => <button key={color.id} type="button" className={(editingLayer?.colorId ?? activeColorId) === color.id ? "is-active" : ""} aria-label={`Set pattern color to ${color.name}`} aria-pressed={(editingLayer?.colorId ?? activeColorId) === color.id} title={color.name} onClick={() => choosePatternColor(color.id)}><span style={{ background: color.hex }} /></button>)}
            </div>
            {editingLayer && <button type="button" className="banner-finish-edit" onClick={() => setEditingLayerUid(null)}>Done editing layer</button>}
          </fieldset>

          <div className="banner-pattern-grid" aria-label="Banner patterns">
            {BANNER_PATTERNS.map((pattern) => (
              <button key={pattern.id} type="button" disabled={layers.length >= 6} aria-label={`Add ${pattern.name} layer`} onClick={() => addPattern(pattern.id)}>
                <BannerPatternIcon patternId={pattern.id} colorId={activeColorId} />
                <span>{pattern.name}</span>
              </button>
            ))}
          </div>

          <section className="banner-share-panel" aria-labelledby="banner-share-title">
            <div className="banner-inline-heading"><h3 id="banner-share-title">Share link</h3><button type="button" onClick={copyShareLink}>Copy</button></div>
            <button type="button" className="banner-share-url" aria-label="Copy share link" title="Click to copy" onClick={copyShareLink}>{sharePath}</button>
            <button type="button" className="secondary-button banner-native-share" onClick={share}>Share design</button>
          </section>

          <section className="banner-command" aria-labelledby="banner-command-title">
            <div className="banner-inline-heading"><h3 id="banner-command-title">Generate command</h3><span>Java 1.20.5+</span></div>
            <div className="banner-command-tabs" role="tablist" aria-label="Banner command type">
              <button type="button" role="tab" aria-selected={commandMode === "give"} onClick={() => setCommandMode("give")}>Give</button>
              <button type="button" role="tab" aria-selected={commandMode === "setblock"} onClick={() => setCommandMode("setblock")}>SetBlock</button>
            </div>
            <pre tabIndex={0}><code>{command}</code></pre>
            <button type="button" className="primary-button" onClick={copyCommand}>Copy command</button>
            <p>Bedrock Edition uses different command behavior.</p>
          </section>
        </aside>
      </div>

      <section className="loom-instructions" aria-labelledby="loom-title">
        <p className="section-label">LOOM RECIPE</p>
        <h2 id="loom-title">How to Make This Banner in Minecraft</h2>
        <ol>
          <li><span>1</span><div><strong>Start with a {getDye(baseColorId).name} Banner</strong><p>Craft or obtain the base banner before opening the loom.</p></div></li>
          {layers.map((layer, index) => <li key={layer.uid}><span>{index + 2}</span><div><strong>{getPattern(layer.patternId).loomName} + {getDye(layer.colorId).name} Dye</strong><p>Select the {getPattern(layer.patternId).name} pattern in the loom.</p></div></li>)}
        </ol>
      </section>
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}
