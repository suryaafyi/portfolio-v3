"use client";

import { useEffect, useRef, useState } from "react";
import { PROJECTS, gradient } from "@/lib/projects";
import { ribbonLayout } from "@/lib/ribbon";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useFlashNav } from "./WorksTransition";

type View = "spiral" | "list";

// Motion tuning. Claude Design's editor defaults were speed 2 / parallax 2;
// dialled to 1 here for a calmer portfolio idle. All live-tunable.
const SPEED = 3;
const PARALLAX = 1;
const AUTOPLAY = true;
const DRIFT = 0.00013; // base auto-travel per ms

const YEARS = PROJECTS.map((p) => Number(p.year));
const YEAR_RANGE = `${Math.min(...YEARS)}—${Math.max(...YEARS)}`;

export default function SpiralGallery() {
  // Dense 3D drag-spiral is rough on small / touch screens — default to list.
  const compact = useMediaQuery("(max-width: 760px), (pointer: coarse)");
  const [override, setOverride] = useState<View | null>(null);
  const view: View = override ?? (compact ? "list" : "spiral");
  const { go } = useFlashNav();
  // Keep a live ref so the (mount-once) pointer loop always calls the latest go.
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  }, [go]);

  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const capEls = useRef<(HTMLDivElement | null)[]>([]);
  const viewRef = useRef<View>(view);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    const stage = stageRef.current;
    const world = worldRef.current;
    if (!stage || !world) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cards = cardEls.current;
    const caps = capEls.current;
    const N = cards.length;
    const L = N;

    const st = {
      offset: 0,
      target: 0,
      px: 0,
      py: 0,
      tpx: 0,
      tpy: 0,
      hov: cards.map(() => 0),
      thov: cards.map(() => 0),
      phase: cards.map((_, i) => i * 1.7),
      fade: 0,
      dragging: false,
      dragged: false,
      lastX: 0,
      lastY: 0,
      moved: 0,
      downSlug: null as string | null,
    };

    // ── Pointer: drag travels the spiral, move feeds cursor-parallax ──
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || viewRef.current !== "spiral") return;
      st.dragging = true;
      st.dragged = false;
      st.moved = 0;
      const hit = (e.target as Element | null)?.closest?.("[data-slug]") ?? null;
      st.downSlug = hit ? hit.getAttribute("data-slug") : null;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
      try {
        stage.setPointerCapture(e.pointerId);
      } catch {}
      stage.classList.add("grabbing");
    };
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      st.tpx = ((e.clientX - r.left) / r.width) * 2 - 1;
      st.tpy = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (st.dragging) {
        const dx = e.clientX - st.lastX;
        const dy = e.clientY - st.lastY;
        st.lastX = e.clientX;
        st.lastY = e.clientY;
        st.moved += Math.abs(dx) + Math.abs(dy);
        const s = 0.006;
        st.target -= dy * s + dx * s * 0.32;
      }
    };
    const endDrag = (e: PointerEvent) => {
      if (!st.dragging) return;
      st.dragging = false;
      stage.classList.remove("grabbing");
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {}
      // A tap (not a drag) on a card opens its detail. Done here rather than via
      // a click handler because setPointerCapture redirects the click off the card.
      if (st.moved <= 6 && st.downSlug) goRef.current(`/works/${st.downSlug}`);
      st.downSlug = null;
    };
    const onLeave = () => {
      st.tpx = 0;
      st.tpy = 0;
    };
    const onWheel = (e: WheelEvent) => {
      if (viewRef.current !== "spiral") return;
      e.preventDefault();
      st.target += e.deltaY * 0.0024;
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("wheel", onWheel, { passive: false });

    const enter: Array<(() => void) | undefined> = [];
    const leave: Array<(() => void) | undefined> = [];
    cards.forEach((card, i) => {
      if (!card) return;
      const en = () => {
        st.thov[i] = 1;
        const c = caps[i];
        if (c) c.style.opacity = "1";
      };
      const lv = () => {
        st.thov[i] = 0;
        const c = caps[i];
        if (c) c.style.opacity = "0";
      };
      enter[i] = en;
      leave[i] = lv;
      card.addEventListener("pointerenter", en);
      card.addEventListener("pointerleave", lv);
    });

    let raf = 0;
    let lastT = 0;
    const loop = (now: number) => {
      const prev = lastT || now;
      let dt = now - prev;
      lastT = now;
      if (dt > 50) dt = 50;
      const fr = dt / 16.667;
      const sp = reduce ? 0 : SPEED;
      const par = reduce ? 0 : PARALLAX;
      const auto = reduce ? false : AUTOPLAY;

      const v = viewRef.current;
      const fadeTarget = v === "spiral" ? 1 : 0;
      st.fade += (fadeTarget - st.fade) * (1 - Math.pow(1 - 0.08, fr));
      stage.style.opacity = st.fade.toFixed(3);
      stage.style.pointerEvents = v === "spiral" ? "auto" : "none";

      if (v === "spiral") {
        if (auto) st.target += DRIFT * dt * sp;
        st.offset += (st.target - st.offset) * (1 - Math.pow(1 - 0.12, fr));
        st.px += (st.tpx - st.px) * (1 - Math.pow(1 - 0.08, fr));
        st.py += (st.tpy - st.py) * (1 - Math.pow(1 - 0.08, fr));
        world.style.transform =
          `translate3d(${(-st.px * 16 * par).toFixed(2)}px,${(-st.py * 16 * par).toFixed(2)}px,0)` +
          ` rotateX(${(-st.py * 7 * par).toFixed(2)}deg) rotateY(${(st.px * 7 * par).toFixed(2)}deg)`;

        for (let i = 0; i < N; i++) {
          const card = cards[i];
          if (!card) continue;
          st.hov[i] += (st.thov[i] - st.hov[i]) * (1 - Math.pow(1 - 0.2, fr));
          const p = (((i - st.offset) % L) + L) % L;
          const lay = ribbonLayout(p, L);
          const fy = reduce ? 0 : Math.sin(now * 0.0011 + st.phase[i]) * 7;
          const frz = reduce ? 0 : Math.sin(now * 0.0009 + st.phase[i]) * 1.2;
          const hv = st.hov[i];
          const z = lay.z + hv * 150;
          const sc = 1 + hv * 0.07;
          card.style.transform =
            `translate3d(${lay.x.toFixed(2)}px,${(lay.y + fy).toFixed(2)}px,${z.toFixed(2)}px)` +
            ` rotateX(${lay.rx.toFixed(2)}deg) rotateY(${lay.ry.toFixed(2)}deg)` +
            ` rotateZ(${(lay.rz + frz).toFixed(2)}deg) scale(${sc.toFixed(3)})`;
          card.style.opacity = Math.max(lay.op, hv).toFixed(3);
          card.style.zIndex = String(2000 + Math.round(z) + (hv > 0.5 ? 8000 : 0));
          card.style.filter = hv > 0.002 ? `brightness(${(1 + hv * 0.12).toFixed(3)})` : "";
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", endDrag);
      stage.removeEventListener("pointercancel", endDrag);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("wheel", onWheel);
      cards.forEach((card, i) => {
        if (!card) return;
        if (enter[i]) card.removeEventListener("pointerenter", enter[i]!);
        if (leave[i]) card.removeEventListener("pointerleave", leave[i]!);
      });
    };
  }, []);

  return (
    <div className="sg-page">
      <div ref={stageRef} className="sg-stage" aria-hidden>
        <div ref={worldRef} className="sg-world">
          {PROJECTS.map((p, i) => (
            <div
              key={p.slug}
              ref={(el) => {
                cardEls.current[i] = el;
              }}
              className="sg-card"
              data-hover
              data-slug={p.slug}
            >
              <div className="sg-media" style={{ background: gradient(p) }}>
                {p.name}
              </div>
              <div
                ref={(el) => {
                  capEls.current[i] = el;
                }}
                className="sg-cap"
              >
                <span>{p.tag}</span>
                <span className="x">✲</span>
                <span className="yr">{p.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {view === "list" && (
        <div className="sg-list">
          <div className="sg-list-head">
            <span>Index</span>
            <span>
              {PROJECTS.length} projects ✲ {YEAR_RANGE}
            </span>
          </div>
          {PROJECTS.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              className="sg-row"
              data-hover
              onClick={() => go(`/works/${p.slug}`)}
            >
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <span className="sw" style={{ background: gradient(p) }} />
              <span className="ti">{p.name}</span>
              <span className="ca">{p.tag}</span>
              <span className="yr">{p.year}</span>
            </button>
          ))}
        </div>
      )}

      <div className="sg-toggle" role="group" aria-label="View mode">
        <button
          type="button"
          data-view="spiral"
          className={view === "spiral" ? "active" : ""}
          aria-pressed={view === "spiral"}
          data-hover
          onClick={() => setOverride("spiral")}
        >
          spiral
        </button>
        <span className="sg-dot" aria-hidden />
        <button
          type="button"
          data-view="list"
          className={view === "list" ? "active" : ""}
          aria-pressed={view === "list"}
          data-hover
          onClick={() => setOverride("list")}
        >
          list
        </button>
      </div>

      <div className="sg-hint" aria-hidden>
        drag or scroll to travel
      </div>
    </div>
  );
}
