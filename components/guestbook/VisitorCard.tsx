import type { ReactNode } from "react";
import { cardBg, penColor, type VisitorCardData } from "@/lib/guestbook";

/* Sticker shapes visitors can slap on their card (keys stored in the DB) */
export const STICKER_ART: Record<string, ReactNode> = {
  smiley: (
    <svg viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r="46" fill="#4A6FA5" />
      <circle cx="36" cy="42" r="6" fill="#F0EDE5" />
      <circle cx="64" cy="42" r="6" fill="#F0EDE5" />
      <path d="M32 58 Q50 76 68 58" fill="none" stroke="#F0EDE5" strokeWidth="7" strokeLinecap="round" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path d="M50 4 L61 39 L97 50 L61 61 L50 96 L39 61 L3 50 L39 39 Z" fill="#1c2533" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path d="M50 4 C54 34 66 46 96 50 C66 54 54 66 50 96 C46 66 34 54 4 50 C34 46 46 34 50 4 Z" fill="#B8C5D6" />
    </svg>
  ),
  flower: (
    <svg viewBox="0 0 100 100" aria-hidden>
      <g fill="#3147e8">
        <ellipse cx="50" cy="28" rx="11" ry="19" />
        <ellipse cx="50" cy="28" rx="11" ry="19" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="28" rx="11" ry="19" transform="rotate(120 50 50)" />
        <ellipse cx="50" cy="28" rx="11" ry="19" transform="rotate(180 50 50)" />
        <ellipse cx="50" cy="28" rx="11" ry="19" transform="rotate(240 50 50)" />
        <ellipse cx="50" cy="28" rx="11" ry="19" transform="rotate(300 50 50)" />
      </g>
      <circle cx="50" cy="50" r="12" fill="#F0EDE5" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path d="M50 88 C20 66 8 48 12 32 C15 20 26 14 36 17 C43 19 48 25 50 30 C52 25 57 19 64 17 C74 14 85 20 88 32 C92 48 80 66 50 88 Z" fill="#cf5666" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 100 100" fill="none" stroke="#4A6FA5" strokeWidth="5" aria-hidden>
      <circle cx="50" cy="50" r="42" />
      <ellipse cx="50" cy="50" rx="19" ry="42" />
      <line x1="8" y1="50" x2="92" y2="50" />
    </svg>
  ),
  flask: (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path d="M42 14 L42 40 L28 72 Q25 80 34 80 L66 80 Q75 80 72 72 L58 40 L58 14" fill="#fff" stroke="#1c2533" strokeWidth="5" strokeLinejoin="round" />
      <path d="M33 62 Q42 57 50 62 T67 62 L70 72 Q71 76 66 76 L34 76 Q29 76 30 72 Z" fill="#4A6FA5" />
      <line x1="37" y1="14" x2="63" y2="14" stroke="#1c2533" strokeWidth="5" strokeLinecap="round" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path d="M56 6 L26 56 L46 56 L40 94 L74 40 L52 40 Z" fill="#e8b23d" stroke="#1c2533" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  ),
};

export const STICKER_KEYS = Object.keys(STICKER_ART);

const fmtDate = (iso?: string) => {
  const d = iso ? new Date(iso) : new Date();
  return d
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })
    .toUpperCase()
    .replace(/ /g, " ");
};

/**
 * The visitor pass. Text sizes are in em so `baseFont` scales the whole card
 * (16px in the editor, ~7.5px on the wall). `body` swaps the static text for
 * live inputs in the editor; `overlay` hosts the editor's draw surface.
 */
export default function VisitorCard({
  data,
  baseFont = 16,
  body,
  overlay,
  stickerLayer,
}: {
  data: VisitorCardData;
  baseFont?: number;
  body?: ReactNode;
  overlay?: ReactNode;
  stickerLayer?: ReactNode;
}) {
  return (
    <div className="vc-card" style={{ background: cardBg(data.color), fontSize: baseFont }}>
      <header className="vc-head" aria-hidden>
        <span className="vc-pass">Visitor pass</span>
        <span className="vc-num">№{data.num ? String(data.num).padStart(3, "0") : "···"}</span>
      </header>

      {body ?? (
        <div className="vc-body">
          <p className="vc-name">{data.name || "anonymous"}</p>
          <p className="vc-role">{data.role || "passing through"}</p>
          {data.email ? <p className="vc-mail">{data.email}</p> : null}
        </div>
      )}

      <footer className="vc-foot" aria-hidden>
        <span>{fmtDate(data.created_at)}</span>
        <span>surya’s lab · visitor log</span>
      </footer>

      {/* doodle layer (aspect matches the 8:5 card, so no stroke distortion) */}
      <svg className="vc-doodle" viewBox="0 0 800 500" preserveAspectRatio="none" aria-hidden>
        {data.doodle.map((s, i) => {
          const pts: string[] = [];
          for (let p = 0; p + 1 < s.pts.length; p += 2) {
            pts.push(`${(s.pts[p] * 800).toFixed(1)},${(s.pts[p + 1] * 500).toFixed(1)}`);
          }
          return (
            <polyline
              key={i}
              points={pts.join(" ")}
              fill="none"
              stroke={penColor(s.c)}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </svg>

      {stickerLayer ?? (
        <div className="vc-stickers" aria-hidden>
          {data.stickers.map((s, i) => (
            <span
              key={i}
              className="vc-sticker"
              style={{
                left: `${s.x * 100}%`,
                top: `${s.y * 100}%`,
                transform: `translate(-50%, -50%) rotate(${s.r}deg)`,
              }}
            >
              {STICKER_ART[s.k]}
            </span>
          ))}
        </div>
      )}

      {overlay}
    </div>
  );
}
