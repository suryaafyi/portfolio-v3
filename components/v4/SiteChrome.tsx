"use client";

import Link from "next/link";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { setLenis } from "@/lib/lenis";

/**
 * Site-wide chrome for the v4 design language (mounted once in the root
 * layout): designed cursor, avatar badge, BOOK A CALL CTA, left icon rail
 * with hover label chips + magnetic pull, right scroll progress, fixed
 * wordmark + Chennai clock, the discovery-call dock, and the Lenis smooth
 * scroll loop. Pages only render their own content.
 */

/* left rail — solid glyphs (house / tag / smiley / flask / book / mail) */
const RAIL: { href: string; label: string; icon: ReactNode }[] = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path
          fillRule="evenodd"
          d="M11.03 3.3a1.6 1.6 0 0 1 1.94 0l7.4 5.63c.4.3.63.77.63 1.27V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8.8c0-.5.23-.97.63-1.27l7.4-5.63ZM12 16.4a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z"
        />
      </svg>
    ),
  },
  {
    href: "/works",
    label: "Works",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path
          fillRule="evenodd"
          d="M12.6 3.2h6.1c1.2 0 2.1 1 2.1 2.1v6.1c0 .56-.22 1.1-.62 1.5l-7.3 7.3a2.1 2.1 0 0 1-3 0l-6.1-6.1a2.1 2.1 0 0 1 0-3l7.3-7.3c.4-.4.94-.62 1.5-.62Zm4 5.8a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z"
        />
      </svg>
    ),
  },
  {
    href: "/about",
    label: "About",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path
          fillRule="evenodd"
          d="M12 21.2a9.2 9.2 0 1 0 0-18.4 9.2 9.2 0 0 0 0 18.4ZM8.9 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm6.2 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-6.5 3.1a.9.9 0 0 0-.3 1.25c.77 1.24 2.17 2.05 3.7 2.05s2.93-.8 3.7-2.05a.9.9 0 0 0-1.53-.95c-.45.72-1.27 1.2-2.17 1.2-.9 0-1.72-.48-2.17-1.2a.9.9 0 0 0-1.23-.3Z"
        />
      </svg>
    ),
  },
  {
    href: "/lab",
    label: "Lab",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M9.2 2.8h5.6a1 1 0 0 1 0 2h-.3v3.44l4.9 8.62A2.4 2.4 0 0 1 17.31 20H6.69a2.4 2.4 0 0 1-2.09-3.14l4.9-8.62V4.8h-.3a1 1 0 0 1 0-2Zm2.3 2v4a1 1 0 0 1-.13.5L9.1 13.3h5.8l-2.27-4a1 1 0 0 1-.13-.5v-4h-1Z" />
      </svg>
    ),
  },
  // {
  //   href: "/guestbook",
  //   label: "Guestbook",
  //   icon: (
  //     <svg viewBox="0 0 24 24" aria-hidden>
  //       <path
  //         fillRule="evenodd"
  //         d="M5.6 3.4h11.2a2 2 0 0 1 2 2v13.2a2 2 0 0 1-2 2H5.6a2 2 0 0 1-2-2V5.4a2 2 0 0 1 2-2Zm2.2 4.5a.95.95 0 0 0 0 1.9h6.8a.95.95 0 0 0 0-1.9H7.8Zm0 3.8a.95.95 0 0 0 0 1.9h6.8a.95.95 0 0 0 0-1.9H7.8Zm0 3.8a.95.95 0 0 0 0 1.9h4a.95.95 0 0 0 0-1.9h-4Z"
  //       />
  //     </svg>
  //   ),
  // },
  {
    href: "/contact",
    label: "Contact",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path
          fillRule="evenodd"
          d="M4.4 4.9h15.2a2 2 0 0 1 2 2v10.2a2 2 0 0 1-2 2H4.4a2 2 0 0 1-2-2V6.9a2 2 0 0 1 2-2Zm.83 3.06a.95.95 0 0 1 1.33-.2L12 11.6l5.44-3.85a.95.95 0 1 1 1.12 1.54l-6 4.25a.95.95 0 0 1-1.12 0l-6-4.25a.95.95 0 0 1-.2-1.33Z"
        />
      </svg>
    ),
  },
];

/** External booking link — cal.com discovery call */
const CAL = "https://cal.com/surya.fyi/discovery-call";

const PHONE_PATH =
  "M6.6 3.6c.6-.2 1.24.05 1.56.6l1.5 2.6c.3.5.24 1.14-.15 1.58l-1.1 1.25a12.4 12.4 0 0 0 5.4 5.4l1.24-1.1c.44-.4 1.08-.45 1.59-.16l2.6 1.5c.55.32.8.97.6 1.57l-.66 1.95a1.6 1.6 0 0 1-1.7 1.08C10.4 19.9 4.1 13.6 3.16 6.5a1.6 1.6 0 0 1 1.08-1.7l2.36-.8Z";

export default function SiteChrome() {
  const pathname = usePathname();
  const curRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const [clock, setClock] = useState("");
  const hidden = pathname === "/about/scrapbook";

  /* Chennai clock, 12h like the reference ("9:03 PM") */
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const tick = () => setClock(fmt.format(new Date()));
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 15000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  /* Lenis smooth scroll — one instance for the whole site */
  useEffect(() => {
    if (hidden) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis();
    setLenis(lenis);
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, [hidden]);

  /* right-edge scroll progress dot + discovery-call dock (past one screen) */
  useEffect(() => {
    if (hidden) return;
    const onScroll = () => {
      const dot = dotRef.current;
      const line = lineRef.current;
      if (dot && line) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        dot.style.top = `${p * (line.clientHeight - 9)}px`;
      }
      const dock = dockRef.current;
      if (dock) {
        // visible once past the first screen, but hides again the moment the
        // home "What I ship" card deck scrolls into view (dock is a discovery
        // CTA for the top of the page). On pages without a deck it just stays.
        const past = window.scrollY > window.innerHeight * 0.7;
        const deck = document.querySelector(".v4-deck-outer");
        const reachedDeck = deck
          ? deck.getBoundingClientRect().top < window.innerHeight
          : false;
        dock.classList.toggle("is-on", past && !reachedDeck);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden, pathname]);

  /* designed cursor: ink dot → glass lens over links → glass label pill over
     [data-cursor] elements. Fine pointers only. */
  useEffect(() => {
    if (hidden) return;
    const el = curRef.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const label = el.querySelector<HTMLElement>(".v4-cursor-label");
    if (!label) return;
    document.body.classList.add("v4-has-cursor");
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target instanceof Element ? e.target : null;
      const card = t?.closest("[data-cursor]");
      if (card) {
        const txt = card.getAttribute("data-cursor") ?? "";
        if (label.textContent !== txt) label.textContent = txt;
        el.dataset.state = "pill";
      } else if (t?.closest("a, button")) {
        el.dataset.state = "lens";
      } else {
        el.dataset.state = "dot";
      }
      el.style.opacity = "1";
    };
    const down = () => el.classList.add("is-down");
    const up = () => el.classList.remove("is-down");
    const hide = () => {
      el.style.opacity = "0";
    };
    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", hide);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.body.classList.remove("v4-has-cursor");
    };
  }, [hidden]);

  /* magnetic rail buttons */
  useEffect(() => {
    if (hidden) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const btns = Array.from(
      railRef.current?.querySelectorAll<HTMLElement>(".v4-rbtn") ?? []
    );
    const cleanups = btns.map((b) => {
      const move = (e: PointerEvent) => {
        const bb = b.getBoundingClientRect();
        const dx = e.clientX - (bb.left + bb.width / 2);
        const dy = e.clientY - (bb.top + bb.height / 2);
        b.style.translate = `${dx * 0.22}px ${dy * 0.22}px`;
      };
      const reset = () => {
        b.style.translate = "0px 0px";
      };
      b.addEventListener("pointermove", move);
      b.addEventListener("pointerleave", reset);
      return () => {
        b.removeEventListener("pointermove", move);
        b.removeEventListener("pointerleave", reset);
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, [hidden]);

  if (hidden) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* designed cursor — follows the pointer, morphs by context */}
      <div className="v4-cursor" ref={curRef} aria-hidden>
        <span className="v4-cursor-label" />
      </div>

      <Link href="/" className="v4-badge" aria-label="Surya — home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Avatar.png" alt="" />
      </Link>

      <a href={CAL} target="_blank" rel="noopener noreferrer" className="v4-cta-top">
        Book a call now
      </a>

      <nav className="v4-rail" aria-label="Primary" ref={railRef}>
        {RAIL.map((r) => (
          <Link
            key={r.label}
            href={r.href}
            className={`v4-rbtn ${isActive(r.href) ? "is-active" : ""}`}
          >
            {r.icon}
            <span className="v4-chip">{r.label}</span>
          </Link>
        ))}
      </nav>

      <div className="v4-progress" ref={lineRef} aria-hidden>
        <span ref={dotRef} />
      </div>

      {/* fixed bottom chrome — wordmark + location persist while scrolling */}
      <div className="v4-wordmark" aria-hidden>
        Surya
        <br />
        Arunachalam
      </div>
      <div className="v4-loc">
        Chennai, India <strong>{clock}</strong>
      </div>

      {/* discovery-call dock — floats in once you scroll past the first screen.
          Skipped on /works: that page has its own bottom-centre view switch. */}
      <div
        className="v4-dock"
        ref={dockRef}
        hidden={pathname === "/works"}
      >
        <span>Book a free discovery call</span>
        <a href={CAL} target="_blank" rel="noopener noreferrer" className="v4-dock-btn">
          Book a call
          <span className="v4-callfaces v4-callfaces-sm" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/portrait.webp" alt="" />
            <i>
              <svg viewBox="0 0 24 24">
                <path d={PHONE_PATH} />
              </svg>
            </i>
          </span>
        </a>
      </div>
    </>
  );
}
