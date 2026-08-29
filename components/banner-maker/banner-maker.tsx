"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BANNER_PATTERNS,
  BANNER_JAVA_VERSION,
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

const SAVED_BANNERS_KEY = "minecraftcirclegen.saved-banners.v1";

interface SavedBanner {
  id: string;
  design: string;
  savedAt: number;
}

export function BannerMaker() {
  const [baseColorId, setBaseColorId] = useState("green");
  const [layers, setLayers] = useState<BannerLayer[]>([]);
  const [activeColorId, setActiveColorId] = useState("black");
  const [editingLayerUid, setEditingLayerUid] = useState<number | null>(null);
  const [commandMode, setCommandMode] = useState<"give" | "setblock">("give");
  const [savedBanners, setSavedBanners] = useState<SavedBanner[]>([]);
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

  useEffect(() => {
    let restore: number | null = null;
    try {
      const parsed = JSON.parse(window.localStorage.getItem(SAVED_BANNERS_KEY) ?? "[]") as unknown;
      if (Array.isArray(parsed)) {
        const valid = parsed.flatMap((item) => {
          if (!item || typeof item !== "object") return [];
          const candidate = item as Partial<SavedBanner>;
          if (typeof candidate.id !== "string" || typeof candidate.design !== "string" || typeof candidate.savedAt !== "number") return [];
          return decodeBannerDesign(candidate.design) ? [candidate as SavedBanner] : [];
        }).slice(0, 12);
        restore = window.setTimeout(() => setSavedBanners((current) => current.length ? current : valid), 0);
      }
    } catch {
      window.localStorage.removeItem(SAVED_BANNERS_KEY);
    }
    return () => { if (restore !== null) window.clearTimeout(restore); };
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

  const persistSavedBanners = (next: SavedBanner[]) => {
    setSavedBanners(next);
    window.localStorage.setItem(SAVED_BANNERS_KEY, JSON.stringify(next));
  };

  const saveCurrentBanner = () => {
    const design = encodeBannerDesign(baseColorId, layers);
    const existing = savedBanners.find((item) => item.design === design);
    const next = [{
      id: existing?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      design,
      savedAt: Date.now(),
    }, ...savedBanners.filter((item) => item.design !== design)].slice(0, 12);
    persistSavedBanners(next);
    showStatus(existing ? "Saved banner updated" : "Banner saved on this device");
  };

  const loadSavedBanner = (saved: SavedBanner) => {
    const restored = decodeBannerDesign(saved.design);
    if (!restored) return;
    setBaseColorId(restored.baseColorId);
    setLayers(restored.layers);
    setActiveColorId("black");
    setEditingLayerUid(null);
    nextUid.current = restored.layers.length + 1;
    showStatus("Saved banner loaded");
  };

  const removeSavedBanner = (id: string) => {
    persistSavedBanners(savedBanners.filter((item) => item.id !== id));
    showStatus("Saved banner removed");
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
          ) : <p className="banner-empty-layers">Add a pattern from the right to create your first layer.</p>}
        </section>

        <aside className="banner-settings-card" aria-labelledby="banner-settings-title">
          <div className="banner-panel-heading"><div><p className="section-label">BANNER DESIGN</p><h2 id="banner-settings-title">Layer creation</h2></div><span>{BANNER_JAVA_VERSION}</span></div>

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
          </section>

          <section className="banner-command" aria-labelledby="banner-command-title">
            <div className="banner-inline-heading"><h3 id="banner-command-title">Generate command</h3><span>{commandMode === "give" ? "/give" : "/setblock"} · {BANNER_JAVA_VERSION}</span></div>
            <div className="banner-command-tabs" role="tablist" aria-label="Banner command type">
              <button type="button" role="tab" aria-selected={commandMode === "give"} onClick={() => setCommandMode("give")}>Give</button>
              <button type="button" role="tab" aria-selected={commandMode === "setblock"} onClick={() => setCommandMode("setblock")}>SetBlock</button>
            </div>
            <pre tabIndex={0}><code>{command}</code></pre>
            <button type="button" className="primary-button" onClick={copyCommand}>Copy command</button>
            <p>Bedrock Edition uses different command behavior.</p>
          </section>

          <section className="banner-saved-panel" aria-labelledby="banner-saved-title">
            <div className="banner-inline-heading">
              <h3 id="banner-saved-title">Saved Banners</h3>
              <button type="button" onClick={saveCurrentBanner}>+ Save current</button>
            </div>
            {savedBanners.length ? (
              <div className="banner-saved-grid">
                {savedBanners.map((saved, index) => {
                  const design = decodeBannerDesign(saved.design);
                  if (!design) return null;
                  return (
                    <article key={saved.id}>
                      <button type="button" className="banner-saved-load" aria-label={`Load saved banner ${index + 1}`} onClick={() => loadSavedBanner(saved)}>
                        <BannerPreview baseColorId={design.baseColorId} layers={design.layers} idPrefix={`saved-banner-${saved.id}`} />
                        <span>{getDye(design.baseColorId).name} · {design.layers.length} layers</span>
                      </button>
                      <button type="button" className="banner-saved-remove" aria-label={`Remove saved banner ${index + 1}`} onClick={() => removeSavedBanner(saved.id)}>×</button>
                    </article>
                  );
                })}
              </div>
            ) : <p className="banner-saved-empty">Save the current design to reopen it later on this device.</p>}
          </section>
        </aside>
      </div>

      {layers.length > 0 && (
        <section className="banner-recipe-card current-loom-recipe" aria-labelledby="current-loom-recipe-title">
          <div><div><p className="section-label">LOOM RECIPE</p><h2 id="current-loom-recipe-title">Current loom recipe</h2></div><span>{layers.length + 1} steps</span></div>
          <ol>
            <li><span>1</span><div><strong>Start with a {getDye(baseColorId).name} Banner</strong><p>Place the base banner in the loom.</p></div></li>
            {layers.map((layer, index) => <li key={layer.uid}><span>{index + 2}</span><div><strong>{getPattern(layer.patternId).loomName} + {getDye(layer.colorId).name} Dye</strong><p>Select the {getPattern(layer.patternId).name} pattern.</p></div></li>)}
          </ol>
        </section>
      )}
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}
