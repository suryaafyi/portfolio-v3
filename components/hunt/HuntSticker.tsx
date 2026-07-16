"use client";

import { useEffect, useState } from "react";
import { getFound, markFound } from "@/lib/hunt";

/* Collectible sticker art — distinct from the decorative margin stickers */
const ART: Record<string, React.ReactNode> = {
  home: (
    <svg viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r="47" fill="#4A6FA5" stroke="#fff" strokeWidth="5" />
      <circle cx="36" cy="42" r="6" fill="#F0EDE5" />
      <circle cx="64" cy="42" r="6" fill="#F0EDE5" />
      <path d="M32 58 Q50 78 68 58" fill="none" stroke="#F0EDE5" strokeWidth="7" strokeLinecap="round" />
      <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(28,37,51,.2)" strokeWidth="1" />
    </svg>
  ),
  works: (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path d="M50 4 L61 39 L97 50 L61 61 L50 96 L39 61 L3 50 L39 39 Z" fill="#1c2533" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="8" fill="#F0EDE5" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 100 100" aria-hidden>
      <g fill="#3147e8" stroke="#fff" strokeWidth="4">
        <ellipse cx="50" cy="27" rx="11" ry="18" />
        <ellipse cx="50" cy="27" rx="11" ry="18" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="27" rx="11" ry="18" transform="rotate(120 50 50)" />
        <ellipse cx="50" cy="27" rx="11" ry="18" transform="rotate(180 50 50)" />
        <ellipse cx="50" cy="27" rx="11" ry="18" transform="rotate(240 50 50)" />
        <ellipse cx="50" cy="27" rx="11" ry="18" transform="rotate(300 50 50)" />
      </g>
      <circle cx="50" cy="50" r="12" fill="#F0EDE5" stroke="#fff" strokeWidth="3" />
    </svg>
  ),
  lab: (
    <svg viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r="47" fill="#F0EDE5" stroke="#fff" strokeWidth="5" />
      <path d="M42 24 L42 44 L30 72 Q27 80 35 80 L65 80 Q73 80 70 72 L58 44 L58 24" fill="#fff" stroke="#1c2533" strokeWidth="4" strokeLinejoin="round" />
      <path d="M34 64 Q42 60 50 64 T66 64 L68 72 Q69 76 65 76 L35 76 Q31 76 32 72 Z" fill="#4A6FA5" />
      <line x1="38" y1="24" x2="62" y2="24" stroke="#1c2533" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 100 100" aria-hidden>
      <rect x="10" y="14" width="80" height="72" rx="4" fill="#fff" stroke="#B8C5D6" strokeWidth="4" strokeDasharray="7 5" />
      <rect x="20" y="24" width="60" height="52" rx="2" fill="#4A6FA5" />
      <text x="50" y="58" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="24" fill="#fff">₹5</text>
    </svg>
  ),
};

/**
 * A collectible. Click → flies into the HuntPocket (data-hunt-pocket), gets
 * persisted, leaves a dashed "collected" ghost behind.
 */
export default function HuntSticker({ id, className = "" }: { id: string; className?: string }) {
  // three-state: unknown (SSR/first paint) → live | ghost
  const [state, setState] = useState<"unknown" | "live" | "ghost">("unknown");

  useEffect(() => {
    const sync = () => setState(getFound().includes(id) ? "ghost" : "live");
    sync();
    window.addEventListener("hunt:update", sync);
    return () => window.removeEventListener("hunt:update", sync);
  }, [id]);

  const collect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const pocket = document.querySelector("[data-hunt-pocket]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (pocket && !reduce) {
      const from = btn.getBoundingClientRect();
      const to = pocket.getBoundingClientRect();
      const clone = btn.cloneNode(true) as HTMLElement;
      clone.className = "hunt-fly";
      clone.style.left = `${from.left}px`;
      clone.style.top = `${from.top}px`;
      clone.style.width = `${from.width}px`;
      clone.style.height = `${from.height}px`;
      document.body.appendChild(clone);
      clone
        .animate(
          [
            { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
            {
              transform: `translate(${to.left + to.width / 2 - (from.left + from.width / 2)}px, ${
                to.top + to.height / 2 - (from.top + from.height / 2)
              }px) scale(0.18) rotate(340deg)`,
              opacity: 0.9,
            },
          ],
          { duration: 750, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        )
        .finished.then(() => {
          clone.remove();
          markFound(id);
        });
      setState("ghost"); // hide original immediately; ghost fades in via CSS
    } else {
      markFound(id);
      setState("ghost");
    }
  };

  if (state === "unknown") return <span className={`hunt-slot ${className}`} aria-hidden />;

  if (state === "ghost") {
    return (
      <span className={`hunt-slot hunt-ghost ${className}`} title="collected!">
        <svg viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="8 8" />
          <path d="M33 52 L45 64 L68 38" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`hunt-slot hunt-sticker ${className}`}
      data-hover
      onClick={collect}
      aria-label={`Secret sticker found — take it (${id})`}
    >
      {ART[id]}
      <span className="hunt-glint" aria-hidden>
        <svg viewBox="0 0 24 24">
          <path d="M12 2 C13 8 16 11 22 12 C16 13 13 16 12 22 C11 16 8 13 2 12 C8 11 11 8 12 2 Z" fill="currentColor" />
        </svg>
      </span>
      <span className="hunt-tip" aria-hidden>
        psst — take it
      </span>
    </button>
  );
}
