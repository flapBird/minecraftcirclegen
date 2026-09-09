"use client";

import { useMemo, useRef, useState } from "react";
import { JAVA_ITEMS, getJavaItem } from "@/data/minecraft/java-items";
import {
  ATTRIBUTES,
  ATTRIBUTE_COMPONENT_VERSIONS,
  ATTRIBUTE_OPERATIONS,
  ENCHANTMENTS,
  EQUIPMENT_SLOTS,
  GIVE_COMMAND_VERSIONS,
  TEXT_COLORS,
  generateGiveCommand,
  giveCommandFunctionFile,
  getCompatibleEnchantments,
  type GiveAttributeComponentVersion,
  type GiveAttributeModifier,
  type GiveCommandVersion,
  type GiveTextStyle,
} from "@/lib/minecraft/give-command";

interface EnchantmentRow {
  uid: number;
  id: string;
  level: number;
}

interface AttributeRow extends GiveAttributeModifier {
  uid: number;
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
  const [customNameStyle, setCustomNameStyle] = useState<GiveTextStyle>({});
  const [lore, setLore] = useState<string[]>([]);
  const [loreStyles, setLoreStyles] = useState<GiveTextStyle[]>([]);
  const [enchantments, setEnchantments] = useState<EnchantmentRow[]>([]);
  const [attributes, setAttributes] = useState<AttributeRow[]>([]);
  const [attributeComponentVersion, setAttributeComponentVersion] = useState<GiveAttributeComponentVersion>("1.21.2");
  const [unbreakable, setUnbreakable] = useState(false);
  const [status, setStatus] = useState("");
  const nextEnchantmentUid = useRef(1);
  const nextAttributeUid = useRef(1);
  const draggedLore = useRef<number | null>(null);
  const draggedEnchantment = useRef<number | null>(null);
  const selectedItem = getJavaItem(itemId);
  const compatibleEnchantments = useMemo(() => getCompatibleEnchantments(itemId, version, attributeComponentVersion), [itemId, version, attributeComponentVersion]);

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
    customNameStyle,
    lore,
    loreStyles,
    enchantments: enchantments.map(({ id, level }) => ({ id, level })),
    attributes: attributes.map(({ attribute, amount: attributeAmount, operation, slot }) => ({ attribute, amount: attributeAmount, operation, slot })),
    attributeComponentVersion,
    unbreakable,
  }), [amount, attributeComponentVersion, attributes, customName, customNameStyle, enchantments, itemId, lore, loreStyles, playerName, targetChoice, unbreakable, version]);

  const changeVersion = (nextVersion: GiveCommandVersion, nextSubVersion = attributeComponentVersion) => {
    const allowed = new Set(getCompatibleEnchantments(itemId, nextVersion, nextSubVersion).map(({ id }) => id));
    const retained = enchantments.filter(({ id }) => allowed.has(id));
    setVersion(nextVersion);
    setAttributeComponentVersion(nextSubVersion);
    setEnchantments(retained);
    if (retained.length !== enchantments.length) setStatus("Enchantments unavailable in the selected version were removed");
  };

  const chooseItem = (nextItemId: string) => {
    const item = getJavaItem(nextItemId);
    if (!item) return;
    setItemId(item.id);
    setItemQuery(item.name);
    setItemListOpen(false);
    if (amount > item.maxStack) setAmount(item.maxStack);
    setEnchantments((current) => {
      const compatibleIds = new Set(getCompatibleEnchantments(item.id, version, attributeComponentVersion).map(({ id }) => id));
      const next = current.filter((row) => compatibleIds.has(row.id));
      if (next.length !== current.length) setStatus("Enchantments incompatible with the new item were removed");
      return next;
    });
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
    if (lore.length < 16) {
      setLore((current) => [...current, ""]);
      setLoreStyles((current) => [...current, {}]);
    }
  };

  const addEnchantment = () => {
    const available = compatibleEnchantments.find((option) => !enchantments.some((row) => row.id === option.id));
    if (!available) return;
    setEnchantments((current) => [...current, {
      uid: nextEnchantmentUid.current++,
      id: available.id,
      level: available.maxLevel,
    }]);
  };

  const addAttribute = () => {
    if (attributes.length >= 16) return;
    setAttributes((current) => [...current, {
      uid: nextAttributeUid.current++,
      attribute: "attack_damage",
      amount: 1,
      operation: "add_value",
      slot: "mainhand",
    }]);
  };

  const moveLore = (from: number, to: number) => {
    if (to < 0 || to >= lore.length || from === to) return;
    setLore((current) => moveArrayItem(current, from, to));
    setLoreStyles((current) => moveArrayItem(current, from, to));
  };

  const moveEnchantment = (from: number, to: number) => {
    if (to < 0 || to >= enchantments.length || from === to) return;
    setEnchantments((current) => moveArrayItem(current, from, to));
  };

  const reset = () => {
    setVersion("java-latest");
    setTargetChoice("@p");
    setPlayerName("");
    setItemId("diamond_sword");
    setItemQuery("Diamond Sword");
    setAmount(1);
    setCustomName("");
    setCustomNameStyle({});
    setLore([]);
    setLoreStyles([]);
    setEnchantments([]);
    setAttributes([]);
    setAttributeComponentVersion("1.21.2");
    setUnbreakable(false);
    nextEnchantmentUid.current = 1;
    nextAttributeUid.current = 1;
    setStatus("Generator reset");
  };

  const loadExample = () => {
    setVersion("java-latest");
    setTargetChoice("@p");
    setItemId("netherite_sword");
    setItemQuery("Netherite Sword");
    setAmount(1);
    setCustomName("Skybreaker ✦");
    setCustomNameStyle({ color: "aqua", bold: true });
    setLore(["Forged for the End", "Handle with care: \\\"charged\\\""]);
    setLoreStyles([{ color: "dark_purple", italic: true }, { color: "gray" }]);
    setEnchantments([
      { uid: 1, id: "sharpness", level: 5 },
      { uid: 2, id: "unbreaking", level: 3 },
      { uid: 3, id: "mending", level: 1 },
    ]);
    setUnbreakable(true);
    setAttributes([{ uid: 1, attribute: "attack_damage", amount: 3, operation: "add_value", slot: "mainhand" }]);
    nextEnchantmentUid.current = 4;
    nextAttributeUid.current = 2;
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

  const downloadFunction = () => {
    if (!result.command) return;
    const blob = new Blob([giveCommandFunctionFile(result.command)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "give-item.mcfunction";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("Function file downloaded");
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
            <select value={version} onChange={(event) => changeVersion(event.target.value as GiveCommandVersion)}>
              {GIVE_COMMAND_VERSIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
            <small>{GIVE_COMMAND_VERSIONS.find((option) => option.id === version)?.detail}</small>
          </label>

          {version === "java-components" && <label className="tool-field">
            <span>Java sub-version</span>
            <select value={attributeComponentVersion} onChange={(event) => changeVersion(version, event.target.value as GiveAttributeComponentVersion)}>
              {ATTRIBUTE_COMPONENT_VERSIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
            <small>{ATTRIBUTE_COMPONENT_VERSIONS.find((option) => option.id === attributeComponentVersion)?.detail}</small>
          </label>}

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
          <TextStyleControls label="Name formatting" value={customNameStyle} onChange={setCustomNameStyle} />

          <fieldset className="give-dynamic-fieldset">
            <div className="dynamic-field-heading"><legend>Lore</legend><button type="button" onClick={addLoreLine} disabled={lore.length >= 16}>+ Add lore line</button></div>
            {lore.length ? <div className="dynamic-field-list">
              {lore.map((line, index) => <div
                key={index}
                className="give-sortable-row"
                draggable
                onDragStart={() => { draggedLore.current = index; }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => { if (draggedLore.current !== null) moveLore(draggedLore.current, index); draggedLore.current = null; }}
              >
                <div className="give-text-row-main">
                  <input
                    aria-label={`Lore line ${index + 1}`}
                    value={line}
                    maxLength={257}
                    placeholder={`Lore line ${index + 1}`}
                    onChange={(event) => setLore((current) => current.map((value, lineIndex) => lineIndex === index ? event.target.value : value))}
                  />
                  <TextStyleControls
                    compact
                    label={`Lore line ${index + 1} style`}
                    value={loreStyles[index] ?? {}}
                    onChange={(style) => setLoreStyles((current) => current.map((value, lineIndex) => lineIndex === index ? style : value))}
                  />
                </div>
                <RowControls
                  label={`Lore line ${index + 1}`}
                  index={index}
                  length={lore.length}
                  onMove={moveLore}
                  onRemove={() => {
                    setLore((current) => current.filter((_, lineIndex) => lineIndex !== index));
                    setLoreStyles((current) => current.filter((_, lineIndex) => lineIndex !== index));
                  }}
                />
              </div>)}
            </div> : <p className="dynamic-empty">Add one or more tooltip lines.</p>}
          </fieldset>

          <fieldset className="give-dynamic-fieldset">
            <div className="dynamic-field-heading"><legend>Enchantments</legend><button type="button" onClick={addEnchantment} disabled={enchantments.length >= compatibleEnchantments.length || compatibleEnchantments.length === 0}>+ Add enchantment</button></div>
            {enchantments.length ? <div className="enchantment-list">
              {enchantments.map((row, index) => {
                const option = compatibleEnchantments.find((candidate) => candidate.id === row.id) ?? compatibleEnchantments[0] ?? ENCHANTMENTS[0];
                return <div
                  key={row.uid}
                  className="give-sortable-row"
                  draggable
                  onDragStart={() => { draggedEnchantment.current = index; }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => { if (draggedEnchantment.current !== null) moveEnchantment(draggedEnchantment.current, index); draggedEnchantment.current = null; }}
                >
                  <select
                    aria-label={`Enchantment ${index + 1}`}
                    value={row.id}
                    onChange={(event) => {
                      const nextOption = compatibleEnchantments.find((candidate) => candidate.id === event.target.value) ?? compatibleEnchantments[0];
                      if (!nextOption) return;
                      setEnchantments((current) => current.map((item) => item.uid === row.uid ? { ...item, id: nextOption.id, level: Math.min(item.level, nextOption.maxLevel) } : item));
                    }}
                  >
                    {compatibleEnchantments.map((candidate) => <option key={candidate.id} value={candidate.id} disabled={enchantments.some((item) => item.uid !== row.uid && item.id === candidate.id)}>{candidate.name}</option>)}
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={option.maxLevel}
                    aria-label={`${option.name} level`}
                    value={row.level}
                    onChange={(event) => setEnchantments((current) => current.map((item) => item.uid === row.uid ? { ...item, level: Number(event.target.value) } : item))}
                  />
                  <RowControls
                    label={option.name}
                    index={index}
                    length={enchantments.length}
                    onMove={moveEnchantment}
                    onRemove={() => setEnchantments((current) => current.filter((item) => item.uid !== row.uid))}
                  />
                </div>;
              })}
            </div> : <p className="dynamic-empty">{compatibleEnchantments.length ? `${compatibleEnchantments.length} enchantments are compatible with this item.` : "This item has no supported vanilla enchantments."}</p>}
          </fieldset>

          <fieldset className="give-dynamic-fieldset">
            <div className="dynamic-field-heading"><legend>Attribute modifiers</legend><button type="button" onClick={addAttribute} disabled={attributes.length >= 16}>+ Add attribute</button></div>
            {attributes.length ? <div className="attribute-list">
              {attributes.map((row, index) => <div key={row.uid}>
                <select
                  aria-label={`Attribute ${index + 1}`}
                  value={row.attribute}
                  onChange={(event) => setAttributes((current) => current.map((item) => item.uid === row.uid ? { ...item, attribute: event.target.value } : item))}
                >
                  {ATTRIBUTES.map((attribute) => <option key={attribute.id} value={attribute.id}>{attribute.name}</option>)}
                </select>
                <input
                  type="number"
                  step="any"
                  aria-label={`${ATTRIBUTES.find(({ id }) => id === row.attribute)?.name ?? "Attribute"} amount`}
                  value={row.amount}
                  onChange={(event) => setAttributes((current) => current.map((item) => item.uid === row.uid ? { ...item, amount: Number(event.target.value) } : item))}
                />
                <select
                  aria-label={`Attribute ${index + 1} operation`}
                  value={row.operation}
                  onChange={(event) => setAttributes((current) => current.map((item) => item.uid === row.uid ? { ...item, operation: event.target.value as GiveAttributeModifier["operation"] } : item))}
                >
                  {ATTRIBUTE_OPERATIONS.map((operation) => <option key={operation.id} value={operation.id}>{operation.name}</option>)}
                </select>
                <select
                  aria-label={`Attribute ${index + 1} slot`}
                  value={row.slot}
                  onChange={(event) => setAttributes((current) => current.map((item) => item.uid === row.uid ? { ...item, slot: event.target.value as GiveAttributeModifier["slot"] } : item))}
                >
                  {EQUIPMENT_SLOTS.map((slot) => <option key={slot.id} value={slot.id}>{slot.name}</option>)}
                </select>
                <button type="button" aria-label={`Remove attribute ${index + 1}`} onClick={() => setAttributes((current) => current.filter((item) => item.uid !== row.uid))}>×</button>
              </div>)}
            </div> : <p className="dynamic-empty">Add a numeric modifier and choose how and where it applies.</p>}
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
            <button type="button" className="secondary-button" disabled={!result.command} onClick={downloadFunction}>.mcfunction</button>
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

function moveArrayItem<T>(values: T[], from: number, to: number) {
  const next = [...values];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function TextStyleControls({ label, value, onChange, compact = false }: {
  label: string;
  value: GiveTextStyle;
  onChange: (value: GiveTextStyle) => void;
  compact?: boolean;
}) {
  const toggle = (key: "bold" | "italic" | "underlined" | "strikethrough") => {
    onChange({ ...value, [key]: !value[key] });
  };
  return <fieldset className={`text-style-controls${compact ? " is-compact" : ""}`}>
    <legend>{label}</legend>
    <select aria-label={`${label} color`} value={value.color ?? ""} onChange={(event) => onChange({ ...value, color: event.target.value || undefined })}>
      <option value="">Default color</option>
      {TEXT_COLORS.map((color) => <option key={color} value={color}>{color.replaceAll("_", " ")}</option>)}
    </select>
    <button type="button" aria-pressed={Boolean(value.bold)} aria-label={`${label} bold`} onClick={() => toggle("bold")}><strong>B</strong></button>
    <button type="button" aria-pressed={Boolean(value.italic)} aria-label={`${label} italic`} onClick={() => toggle("italic")}><i>I</i></button>
    <button type="button" aria-pressed={Boolean(value.underlined)} aria-label={`${label} underlined`} onClick={() => toggle("underlined")}><u>U</u></button>
    <button type="button" aria-pressed={Boolean(value.strikethrough)} aria-label={`${label} strikethrough`} onClick={() => toggle("strikethrough")}><s>S</s></button>
  </fieldset>;
}

function RowControls({ label, index, length, onMove, onRemove }: {
  label: string;
  index: number;
  length: number;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}) {
  return <div className="give-row-controls">
    <span title="Drag row to reorder" aria-hidden="true">⠿</span>
    <button type="button" aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => onMove(index, index - 1)}>↑</button>
    <button type="button" aria-label={`Move ${label} down`} disabled={index === length - 1} onClick={() => onMove(index, index + 1)}>↓</button>
    <button type="button" aria-label={`Remove ${label}`} onClick={onRemove}>×</button>
  </div>;
}
