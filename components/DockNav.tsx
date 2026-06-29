"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getNav } from "@/lib/nav";

// ── Avatar ────────────────────────────────────────────────────────────────
// Drop your hand-drawn portrait at public/avatar.png and set AVATAR_SRC to
// "/avatar.png" — the placeholder monogram below is shown until then.
const AVATAR_SRC: string | null = null;

function Avatar() {
  if (AVATAR_SRC) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={AVATAR_SRC} alt="Surya — home" />;
  }
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden>
      <rect width="42" height="42" fill="#F0EDE5" />
      <text
        x="21"
        y="30"
        textAnchor="middle"
        fontFamily="var(--font-display-stack)"
        fontWeight="700"
        fontSize="24"
        fill="#4A6FA5"
      >
        s
      </text>
    </svg>
  );
}

export default function DockNav() {
  const pathname = usePathname();
  const items = getNav(pathname);
  const [open, setOpen] = useState(false);

  return (
    <nav className={`pill ${open ? "open" : ""}`} aria-label="Primary">
      <Link href="/" className="home" data-hover aria-label="Surya — home">
        <Avatar />
      </Link>

      <button
        type="button"
        className="burger"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        ☰
      </button>

      <div className="items">
        {items.map((it) => (
          <Link
            key={it.label}
            href={it.href}
            data-hover
            className={it.cta ? "cta" : ""}
            onClick={() => setOpen(false)}
          >
            {it.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
