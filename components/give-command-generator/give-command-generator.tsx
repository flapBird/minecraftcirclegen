"use client";

import { useMemo, useRef, useState } from "react";
import { JAVA_ITEMS, getJavaItem } from "@/data/minecraft/java-items";
import {
  ENCHANTMENTS,
  GIVE_COMMAND_VERSIONS,
  generateGiveCommand,
  type GiveCommandVersion,
} from "@/lib/minecraft/give-command";

interface EnchantmentRow {
  uid: number;
  id: string;
  level: number;
}

const TARGET_OPTIONS = [
  { value: "@p", label: "@p · Nearest player" },
  { value: "@a", label: "@a · All players" },
  { value: "@s", label: "@s · Command executor" },
  { value: "player", label: "Player name" },
] as const;

export function GiveCommandGenerator() {
  const [version, setVersion] = useState<GiveCommandVersion>("java-latest");
  const [targetChoice, setTargetChoice] = useState("@p");
  const [playerName, setPlayerName] = useState("");
  const [itemId, setItemId] = useState("diamond_sword");
  const [itemQuery, setItemQuery] = useState("Diamond Sword");
  const [itemListOpen, setItemListOpen] = useState(false);
  const [amount, setAmount] = useState(1);
  const [customName, setCustomName] = useState("");
  const [lore, setLore] = useState<string[]>([]);
  const [enchantments, setEnchantments] = useState<EnchantmentRow[]>([]);
  const [unbreakable, setUnbreakable] = useState(false);
  const [status, setStatus] = useState("");
  const nextEnchantmentUid = useRef(1);
  const selectedItem = getJavaItem(itemId);

  const filteredItems = useMemo(() => {
    const query = itemQuery.trim().toLowerCase();
    if (!query) return JAVA_ITEMS.slice(0, 12);
    return JAVA_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(query) || item.id.includes(query.replaceAll(" ", "_")),
    ).slice(0, 12);
  }, [itemQuery]);

  const result = useMemo(() => generateGiveCommand({
    version,
    target: targetChoice === "player" ? playerName.trim() : targetChoice,
    itemId,
    amount,
    customName,
    lore,
    enchantments: enchantments.map(({ id, level }) => ({ id, level })),
    unbreakable,
  }), [amount, customName, enchantments, itemId, lore, playerName, targetChoice, unbreakable, version]);

  const chooseItem = (nextItemId: string) => {
    const item = getJavaItem(nextItemId);
    if (!item) return;
    setItemId(item.id);
    setItemQuery(item.name);
    setItemListOpen(false);
    if (amount > item.maxStack) setAmount(item.maxStack);
  };

  const updateItemQuery = (query: string) => {
    setItemQuery(query);
    const exact = JAVA_ITEMS.find((item) =>
      item.name.toLowerCase() === query.trim().toLowerCase()
      || item.id === query.trim().toLowerCase().replaceAll(" ", "_"),
    );
    setItemId(exact?.id ?? "");
    setItemListOpen(true);
  };

  const addLoreLine = () => {
    if (lore.length < 16) setLore((current) => [...current, ""]);
  };

  const addEnchantment = () => {
    const available = ENCHANTMENTS.find((option) => !enchantments.some((row) => row.id === option.id));
    if (!available) return;
    setEnchantments((current) => [...current, {
      uid: nextEnchantmentUid.current++,
      id: available.id,
      level: available.maxLevel,
    }]);
  };

  const reset = () => {
    setVersion("java-latest");
    setTargetChoice("@p");
    setPlayerName("");
    setItemId("diamond_sword");
    setItemQuery("Diamond Sword");
    setAmount(1);
    setCustomName("");
    setLore([]);
    setEnchantments([]);
    setUnbreakable(false);
    nextEnchantmentUid.current = 1;
    setStatus("Generator reset");
  };

  const loadExample = () => {
    setVersion("java-latest");
    setTargetChoice("@p");
    setItemId("netherite_sword");
    setItemQuery("Netherite Sword");
    setAmount(1);
    setCustomName("Skybreaker ✦");
    setLore(["Forged for the End", "Handle with care: \\\"charged\\\""]);
    setEnchantments([
      { uid: 1, id: "sharpness", level: 5 },
      { uid: 2, id: "unbreaking", level: 3 },
      { uid: 3, id: "mending", level: 1 },
    ]);
    setUnbreakable(true);
    nextEnchantmentUid.current = 4;
    setStatus("Example loaded");
  };

  const copyCommand = async () => {
    if (!result.command) return;
    try {
      await navigator.clipboard.writeText(result.command);
      setStatus("Command copied");
    } catch {
      setStatus("Copy failed — select the command manually");
    }
  };

  return (
    <div className="generator-shell give-command-tool">
      <div className="give-command-layout">
        <section className="give-command-form" aria-labelledby="give-command-settings-title">
          <div className="tool-panel-heading">
            <div><p className="section-label">JAVA EDITION</p><h2 id="give-command-settings-title">Item settings</h2></div>
            <span>{JAVA_ITEMS.length} items</span>
          </div>

          <label className="tool-field">
            <span>Command version</span>
            <select value={version} onChange={(event) => setVersion(event.target.value as GiveCommandVersion)}>
              {GIVE_COMMAND_VERSIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
            <small>{GIVE_COMMAND_VERSIONS.find((option) => option.id === version)?.detail}</small>
          </label>

          <div className="give-field-row">
            <label className="tool-field">
              <span>Target</span>
              <select value={targetChoice} onChange={(event) => setTargetChoice(event.target.value)}>
                {TARGET_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            {targetChoice === "player" && <label className="tool-field">
              <span>Player name</span>
              <input value={playerName} maxLength={16} placeholder="Notch" onChange={(event) => setPlayerName(event.target.value)} />
            </label>}
          </div>

          <div
            className="tool-field item-combobox"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setItemListOpen(false);
            }}
          >
            <label htmlFor="give-item-search">Item</label>
            <input
              id="give-item-search"
              role="combobox"
              aria-expanded={itemListOpen}
              aria-controls="give-item-listbox"
              aria-autocomplete="list"
              autoComplete="off"
              value={itemQuery}
              placeholder="Search item name or ID"
              onFocus={() => setItemListOpen(true)}
              onChange={(event) => updateItemQuery(event.target.value)}
            />
            {itemListOpen && <div id="give-item-listbox" className="item-search-results" role="listbox">
              {filteredItems.length ? filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={item.id === itemId}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => chooseItem(item.id)}
                >
                  <strong>{item.name}</strong><span>minecraft:{item.id}</span><small>×{item.maxStack}</small>
                </button>
              )) : <p>No matching item in the Java catalogue.</p>}
            </div>}
            {selectedItem && <small>minecraft:{selectedItem.id} · max stack {selectedItem.maxStack}</small>}
          </div>

          <label className="tool-field give-amount-field">
            <span>Amount</span>
            <input
              type="number"
              min={1}
              max={selectedItem?.maxStack ?? 64}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </label>

          <label className="tool-field">
            <span>Custom name <i>Optional</i></span>
            <input value={customName} maxLength={129} placeholder="Example: The Builder's Blade" onChange={(event) => setCustomName(event.target.value)} />
          </label>

          <fieldset className="give-dynamic-fieldset">
            <div className="dynamic-field-heading"><legend>Lore</legend><button type="button" onClick={addLoreLine} disabled={lore.length >= 16}>+ Add lore line</button></div>
            {lore.length ? <div className="dynamic-field-list">
              {lore.map((line, index) => <div key={index}>
                <input
                  aria-label={`Lore line ${index + 1}`}
                  value={line}
                  maxLength={257}
                  placeholder={`Lore line ${index + 1}`}
                  onChange={(event) => setLore((current) => current.map((value, lineIndex) => lineIndex === index ? event.target.value : value))}
                />
                <button type="button" aria-label={`Remove lore line ${index + 1}`} onClick={() => setLore((current) => current.filter((_, lineIndex) => lineIndex !== index))}>×</button>
              </div>)}
            </div> : <p className="dynamic-empty">Add one or more tooltip lines.</p>}
          </fieldset>

          <fieldset className="give-dynamic-fieldset">
            <div className="dynamic-field-heading"><legend>Enchantments</legend><button type="button" onClick={addEnchantment} disabled={enchantments.length >= ENCHANTMENTS.length}>+ Add enchantment</button></div>
            {enchantments.length ? <div className="enchantment-list">
              {enchantments.map((row, index) => {
                const option = ENCHANTMENTS.find((candidate) => candidate.id === row.id) ?? ENCHANTMENTS[0];
                return <div key={row.uid}>
                  <select
                    aria-label={`Enchantment ${index + 1}`}
                    value={row.id}
                    onChange={(event) => {
                      const nextOption = ENCHANTMENTS.find((candidate) => candidate.id === event.target.value) ?? ENCHANTMENTS[0];
                      setEnchantments((current) => current.map((item) => item.uid === row.uid ? { ...item, id: nextOption.id, level: Math.min(item.level, nextOption.maxLevel) } : item));
                    }}
                  >
                    {ENCHANTMENTS.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={option.maxLevel}
                    aria-label={`${option.name} level`}
                    value={row.level}
                    onChange={(event) => setEnchantments((current) => current.map((item) => item.uid === row.uid ? { ...item, level: Number(event.target.value) } : item))}
                  />
                  <button type="button" aria-label={`Remove ${option.name}`} onClick={() => setEnchantments((current) => current.filter((item) => item.uid !== row.uid))}>×</button>
                </div>;
              })}
            </div> : <p className="dynamic-empty">Add enchantments with vanilla maximum levels.</p>}
          </fieldset>

          <label className="give-toggle-row">
            <span><strong>Unbreakable</strong><small>Prevents durability loss on damageable items.</small></span>
            <input type="checkbox" className="switch-input" checked={unbreakable} onChange={(event) => setUnbreakable(event.target.checked)} />
          </label>
        </section>

        <aside className="give-command-preview" aria-labelledby="give-command-preview-title">
          <div className="tool-panel-heading">
            <div><p className="section-label">LIVE OUTPUT</p><h2 id="give-command-preview-title">Command preview</h2></div>
            <span>{GIVE_COMMAND_VERSIONS.find((option) => option.id === version)?.label}</span>
          </div>
          {result.errors.length ? <div className="command-validation" role="alert">
            <strong>Fix before copying</strong>
            <ul>{result.errors.map((error) => <li key={error}>{error}</li>)}</ul>
          </div> : <p className="command-valid">Ready to run in a Java Edition world with commands enabled.</p>}
          <pre tabIndex={0} aria-label="Generated give command"><code>{result.command ?? "Command preview will appear when every field is valid."}</code></pre>
          <div className="give-preview-actions">
            <button type="button" className="primary-button" disabled={!result.command} onClick={copyCommand}>Copy Command</button>
            <button type="button" className="secondary-button" onClick={loadExample}>Example</button>
            <button type="button" className="secondary-button" onClick={reset}>Reset</button>
          </div>
          <p className="give-compatibility-note"><strong>Compatibility:</strong> Java Edition only. Item data and command formats differ in Bedrock Edition.</p>
          <p className="copy-status" aria-live="polite">{status}</p>
        </aside>
      </div>
    </div>
  );
}
