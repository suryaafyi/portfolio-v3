"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import VisitorCard, { STICKER_ART, STICKER_KEYS } from "./VisitorCard";
import {
  CARD_COLORS,
  MAX_STICKERS,
  MAX_STROKES,
  PEN_COLORS,
  fetchCards,
  guestbookEnabled,
  postCard,
  type CardSticker,
  type Stroke,
  type VisitorCardData,
} from "@/lib/guestbook";

const PINNED_KEY = "surya-guestbook-pinned-v1";

type Mode = "sticker" | "doodle";

export default function GuestbookPage() {
  /* card content */
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [color, setColor] = useState("paper");
  const [stickers, setStickers] = useState<CardSticker[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  /* editor tools */
  const [mode, setMode] = useState<Mode>("sticker");
  const [pen, setPen] = useState("blue");

  /* submission + wall */
  const [pinnedNum, setPinnedNum] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wall, setWall] = useState<VisitorCardData[] | null>(null);
  const [wallError, setWallError] = useState(false);
  const [newId, setNewId] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLElement>(null);
  const draftRef = useRef<Stroke | null>(null); // hot path (mutated in handlers only)
  const [draftView, setDraftView] = useState<Stroke | null>(null); // render mirror
  const dragIdx = useRef<number>(-1);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(PINNED_KEY) ?? "null");
        if (saved?.num) setPinnedNum(saved.num);
      } catch {}
    });
    fetchCards()
      .then((cards) => setWall(cards))
      .catch(() => {
        setWall([]);
        setWallError(true);
      });
  }, []);

  /* pointer position → normalized card coords */
  const norm = (e: { clientX: number; clientY: number }) => {
    const r = cardRef.current!.getBoundingClientRect();
    return {
      x: Math.min(0.97, Math.max(0.03, (e.clientX - r.left) / r.width)),
      y: Math.min(0.96, Math.max(0.04, (e.clientY - r.top) / r.height)),
    };
  };

  /* ── stickers ── */
  const addSticker = (k: string) => {
    setMode("sticker");
    setStickers((s) => {
      if (s.length >= MAX_STICKERS) return s;
      return [
        ...s,
        {
          k,
          x: 0.3 + Math.random() * 0.4,
          y: 0.3 + Math.random() * 0.4,
          r: Math.round((Math.random() - 0.5) * 40),
        },
      ];
    });
  };

  const onStickerDown = (i: number) => (e: React.PointerEvent<HTMLSpanElement>) => {
    if (mode !== "sticker") return;
    dragIdx.current = i;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {} // capture is an enhancement; drag still works without it
  };
  const onStickerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const i = dragIdx.current;
    if (i < 0 || mode !== "sticker") return;
    const { x, y } = norm(e);
    setStickers((s) => s.map((st, idx) => (idx === i ? { ...st, x, y } : st)));
  };
  const onStickerUp = () => {
    dragIdx.current = -1;
  };
  const removeSticker = (i: number) => setStickers((s) => s.filter((_, idx) => idx !== i));

  /* ── doodle ── */
  const onDrawDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (strokes.length >= MAX_STROKES) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {} // capture is an enhancement; drawing still works without it
    const { x, y } = norm(e);
    draftRef.current = { c: pen, pts: [x, y] };
    setDraftView({ c: pen, pts: [x, y] });
  };
  const onDrawMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = draftRef.current;
    if (!d) return;
    const { x, y } = norm(e);
    const n = d.pts.length;
    const dx = x - d.pts[n - 2];
    const dy = y - d.pts[n - 1];
    if (dx * dx + dy * dy < 0.00006 || d.pts.length >= 600) return;
    d.pts.push(x, y);
    setDraftView({ c: d.c, pts: [...d.pts] });
  };
  const onDrawUp = () => {
    const d = draftRef.current;
    draftRef.current = null;
    if (d && d.pts.length >= 4) setStrokes((s) => [...s, d]);
    setDraftView(null);
  };
  const undoStroke = () => setStrokes((s) => s.slice(0, -1));
  const clearDoodle = () => setStrokes([]);

  /* ── submit ── */
  const pin = async () => {
    if (!name.trim()) {
      setError("a name (or alias) is the one required field :)");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const row = await postCard({ name: name.trim(), role, email, color, stickers, doodle: strokes });
      setPinnedNum(row.num ?? null);
      setNewId(row.id ?? null);
      try {
        localStorage.setItem(PINNED_KEY, JSON.stringify({ num: row.num, id: row.id }));
      } catch {}
      setWall((w) => [row, ...(w ?? [])]);
      wallRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    } catch {
      setError("the wall didn’t take it — try again in a moment?");
    } finally {
      setSubmitting(false);
    }
  };

  const data: VisitorCardData = useMemo(
    () => ({
      name,
      role,
      email,
      color,
      stickers,
      doodle: draftView ? [...strokes, draftView] : strokes,
    }),
    [name, role, email, color, stickers, strokes, draftView]
  );

  const wallCount = wall?.length ?? 0;

  return (
    <main className="gb-page">
      <header className="gb-head">
        <p className="gb-eyebrow">The guestbook — visitor log</p>
        <h1 className="gb-title">
          Leave your <em className="scribble">mark</em>.
        </h1>
        <p className="gb-sub">
          Every visitor gets a pass. Scribble on it, sticker it, make it yours —
          then pin it to the wall with everyone else’s.
        </p>
      </header>

      {/* ── the card maker ── */}
      <section className="gb-maker" aria-label="Make your visitor pass">
        <div
          ref={cardRef}
          className={`gb-card-zone ${mode === "doodle" ? "is-doodle" : ""}`}
        >
          <VisitorCard
            data={data}
            baseFont={16}
            body={
              <div className="vc-body">
                <input
                  className="vc-name vc-in"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="your name"
                  maxLength={40}
                  aria-label="Your name"
                />
                <input
                  className="vc-role vc-in"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="who are you? (designer, cat, recruiter…)"
                  maxLength={60}
                  aria-label="Who are you"
                />
                <input
                  className="vc-mail vc-in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email (optional — shows on the card)"
                  maxLength={80}
                  type="email"
                  aria-label="Email, optional"
                />
              </div>
            }
            stickerLayer={
              <div className={`vc-stickers ${mode === "sticker" ? "is-live" : ""}`}>
                {stickers.map((s, i) => (
                  <span
                    key={i}
                    className="vc-sticker vc-sticker-live"
                    style={{
                      left: `${s.x * 100}%`,
                      top: `${s.y * 100}%`,
                      transform: `translate(-50%, -50%) rotate(${s.r}deg)`,
                    }}
                    onPointerDown={onStickerDown(i)}
                    onPointerMove={onStickerMove}
                    onPointerUp={onStickerUp}
                    onDoubleClick={() => removeSticker(i)}
                    title="drag to move · double-tap to remove"
                  >
                    {STICKER_ART[s.k]}
                  </span>
                ))}
              </div>
            }
            overlay={
              mode === "doodle" ? (
                <div
                  className="vc-draw"
                  onPointerDown={onDrawDown}
                  onPointerMove={onDrawMove}
                  onPointerUp={onDrawUp}
                  onPointerCancel={onDrawUp}
                  aria-label="Doodle area — draw with your pointer"
                />
              ) : null
            }
          />
        </div>

        {/* toolbar */}
        <div className="gb-tools">
          <div className="gb-tool-row" role="group" aria-label="Card color">
            <span className="gb-tool-k">card</span>
            {CARD_COLORS.map((c) => (
              <button
                key={c.k}
                type="button"
                className={`gb-swatch ${color === c.k ? "on" : ""}`}
                style={{ background: c.bg }}
                data-hover
                onClick={() => setColor(c.k)}
                aria-label={`Card color ${c.label}`}
                aria-pressed={color === c.k}
              />
            ))}
          </div>

          <div className="gb-tool-row" role="group" aria-label="Stickers">
            <span className="gb-tool-k">stick</span>
            {STICKER_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                className="gb-tray-btn"
                data-hover
                onClick={() => addSticker(k)}
                aria-label={`Add ${k} sticker`}
              >
                {STICKER_ART[k]}
              </button>
            ))}
          </div>

          <div className="gb-tool-row" role="group" aria-label="Doodle pen">
            <span className="gb-tool-k">doodle</span>
            <button
              type="button"
              className={`gb-mode ${mode === "doodle" ? "on" : ""}`}
              data-hover
              onClick={() => setMode(mode === "doodle" ? "sticker" : "doodle")}
              aria-pressed={mode === "doodle"}
            >
              {mode === "doodle" ? "pen on ✏" : "pen off"}
            </button>
            {PEN_COLORS.map((p) => (
              <button
                key={p.k}
                type="button"
                className={`gb-swatch pen ${pen === p.k ? "on" : ""}`}
                style={{ background: p.c }}
                data-hover
                onClick={() => {
                  setPen(p.k);
                  setMode("doodle");
                }}
                aria-label={`Pen color ${p.label}`}
                aria-pressed={pen === p.k}
              />
            ))}
            <button type="button" className="gb-mini" data-hover onClick={undoStroke} disabled={!strokes.length}>
              undo
            </button>
            <button type="button" className="gb-mini" data-hover onClick={clearDoodle} disabled={!strokes.length}>
              clear
            </button>
          </div>

          <p className="gb-hint" aria-hidden>
            {mode === "doodle"
              ? "draw right on the card — switch the pen off to move stickers"
              : "tap a sticker to add · drag to place · double-tap to peel off"}
          </p>

          <div className="gb-submit">
            <button
              type="button"
              className="gb-pin-btn"
              data-hover
              onClick={pin}
              disabled={submitting || !guestbookEnabled || pinnedNum !== null}
            >
              {pinnedNum !== null
                ? `pinned ✓ — you’re visitor №${String(pinnedNum).padStart(3, "0")}`
                : submitting
                  ? "pinning…"
                  : "pin it to the wall"}
            </button>
            {pinnedNum !== null && (
              <button
                type="button"
                className="gb-again"
                data-hover
                onClick={() => setPinnedNum(null)}
              >
                pin another?
              </button>
            )}
            {!guestbookEnabled && <p className="gb-err">wall backend isn’t configured yet</p>}
            {error && (
              <p className="gb-err" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── the wall ── */}
      <section className="gb-wall-sec" ref={wallRef} aria-label="The visitor wall">
        <div className="gb-wall-head">
          <h2>The wall</h2>
          <p>
            {wall === null
              ? "counting pins…"
              : wallError
                ? "the wall is unreachable right now — your card maker still works"
                : `${wallCount} visitor${wallCount === 1 ? "" : "s"} and counting`}
          </p>
        </div>

        {wall !== null && wallCount === 0 && !wallError && (
          <p className="gb-empty">freshly painted — be the first to pin a card.</p>
        )}

        <div className="gb-wall">
          {(wall ?? []).map((c, i) => (
            <div
              key={c.id ?? i}
              className={`gb-pin ${c.id && c.id === newId ? "is-new" : ""}`}
              style={
                {
                  "--rot": `${(((c.num ?? i) * 37) % 9) - 4}deg`,
                  "--i": Math.min(i, 14),
                } as React.CSSProperties
              }
            >
              <VisitorCard data={c} baseFont={7.5} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
