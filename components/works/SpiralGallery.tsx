"use client";

import { useEffect, useRef, useState } from "react";
import { PROJECTS, gradient } from "@/lib/projects";
import { ribbonLayout } from "@/lib/ribbon";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useFlashNav } from "./WorksTransition";
import SiteFooter from "@/components/v4/SiteFooter";
import { getLenis } from "@/lib/lenis";

type View = "spiral" | "list";

// Motion tuning. Claude Design's editor defaults were speed 2 / parallax 2;
// dialled to 1 here for a calmer portfolio idle. All live-tunable.
const SPEED = 3;
const PARALLAX = 1;
const AUTOPLAY = true;
const DRIFT = 0.00013; // base auto-travel per ms

/** "Genealogy · UX research" → "Genealogy" (ba shows one short sector word) */
const sectorOf = (tag: string) => tag.split("·")[0].trim();

export default function SpiralGallery() {
  // Dense 3D drag-spiral is rough on small / touch screens — default to list.
  const compact = useMediaQuery("(max-width: 760px), (pointer: coarse)");
  const [override, setOverride] = useState<View | null>(null);
  const view: View = override ?? (compact ? "list" : "spiral");
  const { go } = useFlashNav();

  // list view: the project nearest the middle of the screen is the active one
  const [active, setActive] = useState(0);
  const rowEls = useRef<(HTMLButtonElement | null)[]>([]);
  const switchRef = useRef<HTMLDivElement>(null);

  // SCROLL-driven (not hover): media/mark/meta are pinned to the viewport
  // centre, so whichever name scrolls through the middle becomes active.
  // An IntersectionObserver with a zero-height root (rootMargin -50%/-50%)
  // is a detection LINE across the viewport centre — no scroll listener and
  // no requestAnimationFrame (which browsers pause in background tabs).
  useEffect(() => {
    if (view !== "list") return;
    const rows = rowEls.current.filter(Boolean) as HTMLButtonElement[];
    if (!rows.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = rows.indexOf(e.target as HTMLButtonElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [view]);

  // the switch pill floats over the list too, but shouldn't sit on top of
  // the footer once it scrolls into view — spiral view has no footer, so
  // it just stays visible there.
  useEffect(() => {
    const el = switchRef.current;
    if (!el) return;
    if (view !== "list") {
      el.classList.remove("is-hidden");
      return;
    }
    const footer = document.querySelector(".v4-footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle("is-hidden", entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, [view]);

  // Magnetic pull: when scrolling settles, ease the nearest name to the exact
  // centre. Driven through the shared Lenis instance so it doesn't fight the
  // site's smooth scroll (a native scrollTo would).
  useEffect(() => {
    if (view !== "list") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let snapping = false;
    const settle = () => {
      const lenis = getLenis();
      if (!lenis) return;
      const mid = window.innerHeight / 2;
      let delta = 0;
      let bestD = Infinity;
      rowEls.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = r.top + r.height / 2 - mid;
        if (Math.abs(d) < bestD) {
          bestD = Math.abs(d);
          delta = d;
        }
      });
      if (bestD < 1.5) return; // already centred
      snapping = true;
      lenis.scrollTo(window.scrollY + delta, {
        duration: 0.75,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
          snapping = false;
        },
      });
    };
    const onScroll = () => {
      if (snapping) return; // don't re-trigger off our own snap
      clearTimeout(timer);
      timer = setTimeout(settle, 130);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [view]);

  // switching views resets the scroll (spiral is a locked viewport)
  const setView = (v: View) => {
    setOverride(v);
    window.scrollTo(0, 0);
  };
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
        const nm = card.querySelector<HTMLElement>(".sg-media-name");
        if (nm) nm.style.opacity = "1";
      };
      const lv = () => {
        st.thov[i] = 0;
        const c = caps[i];
        if (c) c.style.opacity = "0";
        const nm = card.querySelector<HTMLElement>(".sg-media-name");
        if (nm) nm.style.opacity = "0";
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
    <div className={`sg-page ${view === "list" ? "sg-page--list" : ""}`}>
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
                <span className="sg-media-name">{p.name}</span>
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

      {/* list view — brandappart-style stacked index: muted names, the hovered
          one inked, with the project media + meta tracking it */}
      {view === "list" && (
        <>
          {/* pinned to the viewport centre — the names scroll past them */}
          <div className="sg-lv-mark" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Avatar.png" alt="" />
            <span>×</span>
          </div>
          <div className="sg-lv-media" aria-hidden>
            {PROJECTS.map((p, i) => (
              <span
                key={p.slug}
                className={i === active ? "is-on" : ""}
                style={{ background: gradient(p) }}
              />
            ))}
          </div>
          <div className="sg-lv-meta">
            <div>
              <small>Year</small>
              <strong>{PROJECTS[active].year}</strong>
            </div>
            <div>
              <small>Sector</small>
              <strong>{sectorOf(PROJECTS[active].tag)}</strong>
            </div>
          </div>

          <div className="sg-lv">
            <div className="sg-lv-inner">
              <ul className="sg-lv-names">
                {PROJECTS.map((p, i) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      ref={(el) => {
                        rowEls.current[i] = el;
                      }}
                      className={`sg-lv-name ${i === active ? "is-active" : ""}`}
                      onClick={() => go(`/works/${p.slug}`)}
                      data-hover
                      data-cursor="View case"
                    >
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <SiteFooter />
        </>
      )}

      {/* bottom pill switch, like the reference */}
      <div className="sg-switch" ref={switchRef} role="group" aria-label="View mode">
        <button
          type="button"
          className={view === "spiral" ? "is-on" : ""}
          aria-pressed={view === "spiral"}
          data-hover
          onClick={() => setView("spiral")}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path
              d="M12 21a9 9 0 1 1 9-9 7 7 0 0 1-7 7 5 5 0 0 1-5-5 3 3 0 0 1 3-3 1.6 1.6 0 0 1 1.6 1.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </svg>
          Spiral View
        </button>
        <button
          type="button"
          className={view === "list" ? "is-on" : ""}
          aria-pressed={view === "list"}
          data-hover
          onClick={() => setView("list")}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M4 6.4h16M4 12h16M4 17.6h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          List view
        </button>
      </div>

      {view === "spiral" && (
        <div className="sg-hint" aria-hidden>
          drag or scroll to travel
        </div>
      )}
    </div>
  );
}
