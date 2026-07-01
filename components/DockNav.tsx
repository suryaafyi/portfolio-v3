"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getNav, type NavItem } from "@/lib/nav";

// ── Avatar ────────────────────────────────────────────────────────────────
// Hand-drawn portrait lives at public/Avatar.png. Casing must match exactly —
// Vercel builds on Linux (case-sensitive). Set to null to show the monogram.
const AVATAR_SRC: string | null = "/Avatar.png";

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

export default function DockNav({ items: override }: { items?: NavItem[] } = {}) {
  const pathname = usePathname();
  const items = override ?? getNav(pathname);
  const [open, setOpen] = useState(false);

  // Active = the item whose route matches the current page (dynamic, not a
  // hard-coded CTA). `.active` wins over `.cta` in CSS.
  const isActive = (it: NavItem) => !!it.href && it.href === pathname;
  const cls = (it: NavItem) =>
    [it.cta ? "cta" : "", isActive(it) ? "active" : ""].filter(Boolean).join(" ");

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
        {items.map((it) =>
          it.onClick ? (
            <button
              key={it.label}
              type="button"
              data-hover
              className={cls(it)}
              onClick={() => {
                it.onClick?.();
                setOpen(false);
              }}
            >
              {it.label}
            </button>
          ) : (
            <Link
              key={it.label}
              href={it.href ?? "#"}
              data-hover
              className={cls(it)}
              aria-current={isActive(it) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {it.label}
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
