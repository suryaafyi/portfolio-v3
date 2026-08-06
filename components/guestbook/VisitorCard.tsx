import type { ReactNode } from "react";
import { AVATAR_PALETTE, cardBg, penColor, seedHash, type VisitorCardData } from "@/lib/guestbook";

/* Blob body silhouettes — one is chosen per visitor for a bit of shape variety */
const BLOB_PATHS = [
  "M50 8c22 0 40 16 40 40 0 26-18 44-40 44S10 74 10 48 28 8 50 8Z",
  "M52 8c24-1 40 17 39 42-1 27-20 42-43 42C24 92 9 72 12 45 15 21 30 9 52 8Z",
  "M50 9c26 0 41 15 41 41 0 25-15 42-41 42-25 0-42-16-42-42C8 24 25 9 50 9Z",
];

/**
 * The generated visitor avatar — a glossy goo-blob creature, deterministic from
 * `seed` (the visitor's name, falling back to their pass number). Purely
 * decorative, so it's aria-hidden; the name is the real identity on the card.
 */
export function CardAvatar({ seed }: { seed: string }) {
  const h = seedHash(seed);
  const [hi, main, deep] = AVATAR_PALETTE[h % AVATAR_PALETTE.length];
  const blob = BLOB_PATHS[(h >>> 3) % BLOB_PATHS.length];
  const gaze = ((h >>> 6) % 3) - 1; // -1 | 0 | 1 → pupils look left / center / right
  const mouth = (h >>> 9) % 4;
  const cheeks = ((h >>> 11) & 1) === 1;
  const gid = `av-${(h % 100000).toString(36)}`;

  return (
    <svg className="vc-av-svg" viewBox="0 0 100 100" aria-hidden>
      <defs>
        <radialGradient id={gid} cx="36%" cy="30%" r="75%">
          <stop offset="0%" stopColor={hi} />
          <stop offset="55%" stopColor={main} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>
      </defs>
      <path d={blob} fill={`url(#${gid})`} />
      {/* glossy top-left highlight for the 3D gel look */}
      <ellipse cx="37" cy="30" rx="20" ry="14" fill="#fff" opacity="0.28" />
      {cheeks && (
        <g fill="#fff" opacity="0.22">
          <circle cx="30" cy="60" r="7" />
          <circle cx="70" cy="60" r="7" />
        </g>
      )}
      {/* eyes */}
      <g fill="#1c1a17">
        <ellipse cx="39" cy="47" rx="6" ry="7.5" />
        <ellipse cx="61" cy="47" rx="6" ry="7.5" />
      </g>
      <g fill="#fff">
        <circle cx={37 + gaze * 1.5} cy="44.5" r="2.1" />
        <circle cx={59 + gaze * 1.5} cy="44.5" r="2.1" />
      </g>
      {/* mouth — four expressions */}
      <g fill="none" stroke="#1c1a17" strokeWidth="3.2" strokeLinecap="round">
        {mouth === 0 && <path d="M41 64 Q50 73 59 64" />}
        {mouth === 1 && <path d="M42 65 Q50 70 58 65" />}
        {mouth === 3 && <path d="M42 66 L58 66" />}
      </g>
      {mouth === 2 && <ellipse cx="50" cy="67" rx="4" ry="5" fill="#1c1a17" />}
    </svg>
  );
}

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

      {/* generated pass photo — a goo-blob unique to this visitor */}
      <span className="vc-av" aria-hidden>
        <CardAvatar seed={data.name || (data.num ? `n${data.num}` : "")} />
      </span>

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
