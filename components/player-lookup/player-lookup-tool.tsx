"use client";

import { useState, type FormEvent } from "react";
import { validatePlayerLookup, type PlayerLookupKind } from "@/lib/minecraft/player-identifiers";
import type { MinecraftPlayerProfile, PlayerLookupResponse } from "@/lib/minecraft/player-lookup-types";
import { PlayerAvatar } from "./player-avatar";

interface LookupState {
  status: "idle" | "loading" | "found" | "not_found" | "error";
  player?: MinecraftPlayerProfile;
  message?: string;
}

export function PlayerLookupTool({ initialKind, showTabs = false }: {
  initialKind: PlayerLookupKind;
  showTabs?: boolean;
}) {
  const [kind, setKind] = useState<PlayerLookupKind>(initialKind);
  const [values, setValues] = useState({ username: "", uuid: "" });
  const [lookup, setLookup] = useState<LookupState>({ status: "idle" });
  const [copyStatus, setCopyStatus] = useState("");

  const changeKind = (nextKind: PlayerLookupKind) => {
    setKind(nextKind);
    setLookup({ status: "idle" });
    setCopyStatus("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const validation = validatePlayerLookup(kind, values[kind]);
    if (!validation.value) {
      setLookup({ status: "error", message: validation.error ?? "Check the value and try again." });
      return;
    }

    setLookup({ status: "loading" });
    setCopyStatus("");
    try {
      const query = new URLSearchParams({ kind, value: validation.value });
      const response = await fetch(`/api/minecraft-player?${query.toString()}`, {
        headers: { Accept: "application/json" },
      });
      const data = await response.json() as PlayerLookupResponse;
      if (data.status === "found") {
        setLookup({ status: "found", player: data.player });
      } else if (data.error.code === "not_found") {
        setLookup({ status: "not_found", message: data.error.message });
      } else {
        setLookup({ status: "error", message: data.error.message });
      }
    } catch {
      setLookup({ status: "error", message: "The lookup could not be completed. Please try again." });
    }
  };

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus(`${label} copied`);
    } catch {
      setCopyStatus("Copy failed — select the value manually");
    }
  };

  return <div className="generator-shell player-lookup-tool">
    <section className="player-lookup-card" aria-labelledby="player-lookup-title">
      <div className="tool-panel-heading">
        <div><p className="section-label">JAVA EDITION</p><h2 id="player-lookup-title">Player lookup</h2></div>
        <span>Live profile data</span>
      </div>

      {showTabs && <div className="player-lookup-tabs" role="tablist" aria-label="UUID lookup direction">
        <button type="button" role="tab" aria-selected={kind === "username"} onClick={() => changeKind("username")}>Username → UUID</button>
        <button type="button" role="tab" aria-selected={kind === "uuid"} onClick={() => changeKind("uuid")}>UUID → Player</button>
      </div>}

      <form onSubmit={submit} noValidate>
        <label className="tool-field">
          <span>{kind === "username" ? "Minecraft username" : "Minecraft UUID"}</span>
          <input
            name={kind}
            aria-label={kind === "username" ? "Minecraft username" : "Minecraft UUID"}
            value={values[kind]}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder={kind === "username" ? "Notch" : "069a79f4-44e9-4726-a5be-fca90e38aaf5"}
            aria-describedby="player-lookup-hint"
            onChange={(event) => {
              setValues((current) => ({ ...current, [kind]: event.target.value }));
              if (lookup.status !== "idle") setLookup({ status: "idle" });
            }}
          />
          <small id="player-lookup-hint">{kind === "username"
            ? "3–16 letters, numbers, or underscores."
            : "Hyphenated and compact 32-character UUIDs are accepted."}</small>
        </label>
        <button type="submit" className="primary-button" disabled={lookup.status === "loading"}>
          {lookup.status === "loading" ? "Checking…" : kind === "username" ? "Check Username" : "Look Up UUID"}
        </button>
      </form>
    </section>

    <section className="player-result-card" aria-live="polite" aria-labelledby="player-result-title">
      <div className="tool-panel-heading"><div><p className="section-label">RESULT</p><h2 id="player-result-title">Profile result</h2></div></div>
      {lookup.status === "idle" && <div className="player-result-empty"><span aria-hidden="true">?</span><p>Enter a {kind === "username" ? "username" : "UUID"} to search current Java profiles.</p></div>}
      {lookup.status === "loading" && <div className="player-result-empty"><span className="lookup-spinner" aria-hidden="true" /><p>Contacting Minecraft profile services…</p></div>}
      {lookup.status === "not_found" && <div className="player-result-message is-not-found"><strong>Not found</strong><p>{lookup.message}</p>{kind === "username" && <small>This does not guarantee that the name can be registered immediately.</small>}</div>}
      {lookup.status === "error" && <div className="player-result-message is-error" role="alert"><strong>Lookup unavailable</strong><p>{lookup.message}</p></div>}
      {lookup.status === "found" && lookup.player && <PlayerResult player={lookup.player} copy={copy} />}
      <p className="copy-status">{copyStatus}</p>
    </section>
  </div>;
}

function PlayerResult({ player, copy }: {
  player: MinecraftPlayerProfile;
  copy: (value: string, label: string) => void;
}) {
  return <div className="player-profile-result">
    <div className="player-profile-heading">
      <PlayerAvatar username={player.username} skinUrl={player.skinUrl} />
      <div><small>Current Java profile</small><strong>{player.username}</strong><span>Profile found</span></div>
    </div>
    <dl>
      <div><dt>Username</dt><dd><code>{player.username}</code><button type="button" onClick={() => copy(player.username, "Username")}>Copy</button></dd></div>
      <div><dt>UUID with hyphens</dt><dd><code>{player.uuid}</code><button type="button" onClick={() => copy(player.uuid, "UUID")}>Copy</button></dd></div>
      <div><dt>UUID without hyphens</dt><dd><code>{player.uuidCompact}</code><button type="button" onClick={() => copy(player.uuidCompact, "Compact UUID")}>Copy</button></dd></div>
    </dl>
  </div>;
}
