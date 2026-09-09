"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { validatePlayerLookup, type PlayerLookupKind } from "@/lib/minecraft/player-identifiers";
import type { MinecraftPlayerProfile, PlayerLookupResponse } from "@/lib/minecraft/player-lookup-types";
import { PlayerAvatar } from "./player-avatar";

interface LookupState {
  status: "idle" | "loading" | "found" | "not_found" | "error";
  player?: MinecraftPlayerProfile;
  message?: string;
  resultUrl?: string;
}

export function PlayerLookupTool({ initialKind, initialValue = "", showTabs = false }: {
  initialKind: PlayerLookupKind;
  initialValue?: string;
  showTabs?: boolean;
}) {
  const [kind, setKind] = useState<PlayerLookupKind>(initialKind);
  const [values, setValues] = useState({
    username: initialKind === "username" ? initialValue.slice(0, 16) : "",
    uuid: initialKind === "uuid" ? initialValue.slice(0, 36) : "",
  });
  const [lookup, setLookup] = useState<LookupState>({ status: "idle" });
  const [copyStatus, setCopyStatus] = useState("");
  const requestId = useRef(0);
  const requestController = useRef<AbortController | null>(null);
  const invalidateRequest = () => {
    requestId.current += 1;
    requestController.current?.abort();
  };
  useEffect(() => () => {
    requestId.current += 1;
    requestController.current?.abort();
  }, []);

  const changeKind = (nextKind: PlayerLookupKind) => {
    invalidateRequest();
    setKind(nextKind);
    setLookup({ status: "idle" });
    setCopyStatus("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    invalidateRequest();
    const submittedId = requestId.current;
    const validation = validatePlayerLookup(kind, values[kind]);
    if (!validation.value) {
      setLookup({ status: "error", message: validation.error ?? "Check the value and try again." });
      return;
    }

    setLookup({ status: "loading" });
    setCopyStatus("");
    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.delete(kind === "username" ? "uuid" : "username");
    pageUrl.searchParams.set(kind, validation.value);
    window.history.replaceState(null, "", pageUrl);
    const controller = new AbortController();
    requestController.current = controller;
    try {
      const query = new URLSearchParams({ kind, value: validation.value });
      const response = await fetch(`/api/minecraft-player?${query.toString()}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      const data = await response.json() as PlayerLookupResponse;
      if (requestId.current !== submittedId) return;
      if (data.status === "found") {
        setLookup({ status: "found", player: data.player, resultUrl: pageUrl.toString() });
      } else if (data.error.code === "not_found") {
        setLookup({ status: "not_found", message: data.error.message });
      } else {
        setLookup({ status: "error", message: data.error.message });
      }
    } catch {
      if (requestId.current !== submittedId) return;
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

  const copyResultLink = () => { if (lookup.resultUrl) void copy(lookup.resultUrl, "Result link"); };

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
              invalidateRequest();
              setCopyStatus("");
              setValues((current) => ({ ...current, [kind]: event.target.value }));
              if (lookup.status !== "idle") setLookup({ status: "idle" });
            }}
          />
          <small id="player-lookup-hint">{kind === "username"
            ? "3–16 letters, numbers, or underscores."
            : "Hyphenated and compact 32-character UUIDs are accepted."}</small>
        </label>
        {kind === "username" && <p className="lookup-scope-note"><strong>Current Java profile lookup only.</strong> A missing profile is not proof that a username can be registered.</p>}
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
      {lookup.status === "found" && lookup.player && <PlayerResult player={lookup.player} copy={copy} copyResultLink={copyResultLink} />}
      <p className="copy-status">{copyStatus}</p>
    </section>
  </div>;
}

function PlayerResult({ player, copy, copyResultLink }: {
  player: MinecraftPlayerProfile;
  copy: (value: string, label: string) => void;
  copyResultLink: () => void;
}) {
  const allDetails = `Minecraft Java profile\nUsername: ${player.username}\nUUID: ${player.uuid}\nCompact UUID: ${player.uuidCompact}`;
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
    <div className="player-profile-actions">
      <button type="button" className="secondary-button" onClick={() => copy(allDetails, "All profile details")}>Copy All Details</button>
      <button type="button" className="secondary-button" onClick={copyResultLink}>Copy Result Link</button>
    </div>
    {player.skinUrl && <div className="player-skin-export">
      <div><strong>Complete skin texture</strong><small>The full 64×64 skin file returned by Minecraft profile services.</small></div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={player.skinUrl} alt={`${player.username}'s complete Minecraft skin texture`} />
      <a className="secondary-button" href={player.skinUrl} download={`${player.username}.png`} target="_blank" rel="noreferrer">Download Skin</a>
    </div>}
  </div>;
}
