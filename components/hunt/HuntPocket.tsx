"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  HUNT_STICKERS,
  getFoundServerSnapshot,
  getFoundSnapshot,
  isComplete,
  markCelebrated,
  subscribeHunt,
  wasCelebrated,
} from "@/lib/hunt";

const RAIN_SVGS = [
  `<svg viewBox="0 0 100 100"><path d="M50 2 L60 40 L98 50 L60 60 L50 98 L40 60 L2 50 L40 40 Z" fill="#1c2533"/></svg>`,
  `<svg viewBox="0 0 100 100"><path d="M50 4 C54 34 66 46 96 50 C66 54 54 66 50 96 C46 66 34 54 4 50 C34 46 46 34 50 4 Z" fill="#B8C5D6"/></svg>`,
  `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#4A6FA5"/><circle cx="36" cy="42" r="7" fill="#F0EDE5"/><circle cx="64" cy="42" r="7" fill="#F0EDE5"/><path d="M32 60 Q50 78 68 60" fill="none" stroke="#F0EDE5" stroke-width="8" stroke-linecap="round"/></svg>`,
  `<svg viewBox="0 0 100 100"><rect x="12" y="12" width="76" height="76" rx="16" fill="#3147e8"/></svg>`,
  `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#4A6FA5" stroke-width="12"/></svg>`,
];

const EMAIL = "suryaarunachalam2001@gmail.com";
const BRAG = `mailto:${EMAIL}?subject=${encodeURIComponent("I found all 5 stickers")}&body=${encodeURIComponent(
  "Certified lore archaeologist reporting in — the whole batch is mine.\n\n(also, nice site)"
)}`;

export default function HuntPocket() {
  const pathname = usePathname();
  const found = useSyncExternalStore(subscribeHunt, getFoundSnapshot, getFoundServerSnapshot);
  const [open, setOpen] = useState(false);
  const [party, setParty] = useState(false);
  const chipRef = useRef<HTMLButtonElement>(null);
  const rainRef = useRef<HTMLDivElement>(null);

  // bump the chip + fire the celebration when a sticker lands
  useEffect(() => {
    const onUpdate = () => {
      const chip = chipRef.current;
      if (chip && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        chip.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.25) rotate(-6deg)" },
            { transform: "scale(1)" },
          ],
          { duration: 420, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
        );
      }
      if (isComplete() && !wasCelebrated()) {
        markCelebrated();
        setParty(true);
      }
    };
    window.addEventListener("hunt:update", onUpdate);
    return () => window.removeEventListener("hunt:update", onUpdate);
  }, []);

  // sticker rain while the celebration is up
  useEffect(() => {
    if (!party) return;
    const host = rainRef.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    const spawn = () => {
      if (!alive || !host.isConnected) return;
      const bit = document.createElement("span");
      bit.className = "hunt-rain-bit";
      bit.innerHTML = RAIN_SVGS[(Math.random() * RAIN_SVGS.length) | 0];
      const s = 16 + Math.random() * 26;
      bit.style.width = bit.style.height = `${s}px`;
      bit.style.left = `${Math.random() * 100}%`;
      host.appendChild(bit);
      bit
        .animate(
          [
            { transform: "translateY(-60px) rotate(0deg)", opacity: 1 },
            {
              transform: `translateY(${window.innerHeight + 80}px) rotate(${(Math.random() - 0.5) * 720}deg)`,
              opacity: 0.9,
            },
          ],
          { duration: 2600 + Math.random() * 2400, easing: "cubic-bezier(0.3, 0, 0.6, 1)" }
        )
        .finished.then(() => bit.remove());
    };
    for (let i = 0; i < 18; i++) setTimeout(spawn, Math.random() * 1200);
    const id = setInterval(spawn, 260);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [party]);

  // close popover on Escape
  useEffect(() => {
    if (!open && !party) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setParty(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, party]);

  // the scrapbook route is a full-bleed iframe experience — stay out of it;
  // /v4 is a clean design-direction prototype
  if (pathname === "/about/scrapbook" || pathname.startsWith("/v4")) return null;

  const n = found.length;
  const total = HUNT_STICKERS.length;

  return (
    <>
      <button
        ref={chipRef}
        type="button"
        className={`hunt-pocket ${n > 0 ? "has-some" : ""}`}
        data-hunt-pocket
        data-hover
        aria-label={`Sticker hunt — ${n} of ${total} found`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          {/* little sticker book */}
          <rect x="3" y="4" width="18" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M3 9 H21" stroke="currentColor" strokeWidth="2" />
          <circle cx="8.5" cy="14.5" r="2" fill="currentColor" />
          <path d="M13 13 l1 1.6 1.9 .3 -1.4 1.3 .3 1.9 -1.8 -.9 -1.8 .9 .3 -1.9 -1.4 -1.3 1.9 -.3 Z" fill="currentColor" transform="scale(.9) translate(2.4 .4)" />
        </svg>
        <span className="hunt-count">
          {n}/{total}
        </span>
      </button>

      {open && (
        <div className="hunt-pop" role="dialog" aria-label="Sticker hunt progress">
          <p className="hunt-pop-title">Sticker hunt</p>
          <p className="hunt-pop-sub">
            5 stickers are hiding around the site. Tap them to collect.
          </p>
          <ul>
            {HUNT_STICKERS.map((s) => {
              const got = found.includes(s.id);
              return (
                <li key={s.id} className={got ? "got" : ""}>
                  <span className="pg">{s.page}</span>
                  <span className="st">{got ? "✓ collected" : s.hint}</span>
                </li>
              );
            })}
          </ul>
          <button type="button" className="hunt-pop-close" data-hover onClick={() => setOpen(false)}>
            keep hunting →
          </button>
        </div>
      )}

      {party && (
        <div className="hunt-party" role="dialog" aria-modal="true" aria-label="Sticker hunt complete">
          <div ref={rainRef} className="hunt-rain" aria-hidden />
          <div className="hunt-card">
            <span className="hunt-card-stamp" aria-hidden>HUNT COMPLETE · 5/5</span>
            <p className="hunt-card-hand">you found the whole batch :)</p>
            <p className="hunt-card-sub">
              Certified lore archaeologist. There will be more to dig up when
              the Lab starts shipping.
            </p>
            <div className="hunt-card-btns">
              <a className="hunt-card-cta" data-hover href={BRAG}>
                brag about it
              </a>
              <button type="button" className="hunt-card-alt" data-hover onClick={() => setParty(false)}>
                keep exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
