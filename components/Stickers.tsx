// Decorative inline-SVG accents scattered in the margins. Pointer-events are on
// so the custom cursor grows over them; hidden < 820px; float paused under
// reduced-motion (handled in globals.css). aria-hidden — purely decorative.
export default function Stickers() {
  return (
    <div className="stickers" aria-hidden>
      {/* s1 — asterisk in circle (blue) */}
      <div className="sticker s1" data-hover>
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="#4A6FA5" />
          <g stroke="#F0EDE5" strokeWidth="9" strokeLinecap="round">
            <line x1="50" y1="24" x2="50" y2="76" />
            <line x1="27.5" y1="37" x2="72.5" y2="63" />
            <line x1="27.5" y1="63" x2="72.5" y2="37" />
          </g>
        </svg>
      </div>

      {/* s2 — 4-point sparkle (blueSoft) */}
      <div className="sticker s2" data-hover>
        <svg viewBox="0 0 100 100">
          <path
            d="M50 4 C54 34 66 46 96 50 C66 54 54 66 50 96 C46 66 34 54 4 50 C34 46 46 34 50 4 Z"
            fill="#B8C5D6"
          />
        </svg>
      </div>

      {/* s3 — 6-petal flower (navy petals + beige center) */}
      <div className="sticker s3" data-hover>
        <svg viewBox="0 0 100 100">
          <g fill="#1c2533">
            <ellipse cx="50" cy="26" rx="12" ry="20" />
            <ellipse cx="50" cy="26" rx="12" ry="20" transform="rotate(60 50 50)" />
            <ellipse cx="50" cy="26" rx="12" ry="20" transform="rotate(120 50 50)" />
            <ellipse cx="50" cy="26" rx="12" ry="20" transform="rotate(180 50 50)" />
            <ellipse cx="50" cy="26" rx="12" ry="20" transform="rotate(240 50 50)" />
            <ellipse cx="50" cy="26" rx="12" ry="20" transform="rotate(300 50 50)" />
          </g>
          <circle cx="50" cy="50" r="13" fill="#F0EDE5" />
        </svg>
      </div>

      {/* s4 — smiley (blue) */}
      <div className="sticker s4" data-hover>
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="#4A6FA5" />
          <circle cx="36" cy="42" r="6" fill="#F0EDE5" />
          <circle cx="64" cy="42" r="6" fill="#F0EDE5" />
          <path d="M32 60 Q50 78 68 60" fill="none" stroke="#F0EDE5" strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>

      {/* s5 — globe grid (blue stroke) */}
      <div className="sticker s5" data-hover>
        <svg viewBox="0 0 100 100" fill="none" stroke="#4A6FA5" strokeWidth="4">
          <circle cx="50" cy="50" r="44" />
          <ellipse cx="50" cy="50" rx="20" ry="44" />
          <line x1="6" y1="50" x2="94" y2="50" />
          <line x1="13" y1="28" x2="87" y2="28" />
          <line x1="13" y1="72" x2="87" y2="72" />
        </svg>
      </div>

      {/* s6 — sharp 4-point star (navy) */}
      <div className="sticker s6" data-hover>
        <svg viewBox="0 0 100 100">
          <path d="M50 2 L60 40 L98 50 L60 60 L50 98 L40 60 L2 50 L40 40 Z" fill="#1c2533" />
        </svg>
      </div>
    </div>
  );
}
