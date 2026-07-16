"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * /v4 — brandappart.com replica mapped onto Surya's content.
 * Hero matches the reference exactly: circular avatar badge top-left (their
 * ba logo spot), BOOK A CALL NOW top-right, fixed left icon rail with hover
 * label chips, centered 3-line display headline with the orange ©, faded
 * client/tool logo row, centered lede, bottom row = stacked wordmark /
 * BOOK AN INTRO CALL + phone / Chennai live clock, right scroll progress.
 * Self-contained — the current site is untouched.
 */

const FEATURED = [
  {
    slug: "fero",
    name: "Fero",
    cat: "Branding",
    year: "2026",
    img: "/projects/fero/editorial.webp",
    bg: "#171412",
  },
  { slug: "fwc", name: "We Are 26", cat: "Live dashboard", year: "2026", bg: "#E8002D" },
  { slug: "shift", name: "Shift", cat: "Career platform", year: "2025", bg: "#27344A" },
  { slug: "afterword", name: "Afterword", cat: "Digital legacy", year: "2026", bg: "#785F47" },
];

const SERVICES = [
  {
    n: "01",
    t: "Product design that survives contact with users.",
    d: "Research-led UX and interfaces that hold up after launch day — tested, iterated, adopted.",
  },
  {
    n: "02",
    t: "Front-end that feels designed, because it is.",
    d: "The same person who drew the screen builds it. Nothing gets lost in the handoff, because there isn't one.",
  },
  {
    n: "03",
    t: "Brand systems with actual bite.",
    d: "Identities that stretch across packaging, motion and product without falling apart — ask the tiger.",
  },
  {
    n: "04",
    t: "Prototypes in days, not sprints.",
    d: "AI-native workflow, hand-finished results. Ideas become clickable before the meeting ends.",
  },
];

const PROOF = [
  "WINNER — GOOGLE STITCH CHALLENGE",
  "#2 ON THE LEADERBOARD — WAAAH",
  "8 PROJECTS SHIPPED",
  "FIGMA CONFIG MAKEATHON 2026",
  "DESIGN + CODE, ONE PAIR OF HANDS",
];

/* see-more-work wheel — a ring of project tiles spun by scroll.
   t = individual tilt (deg), s = size multiplier. */
const WHEEL: {
  name?: string;
  img?: string;
  bg: string;
  fg?: string;
  t: number;
  s: number;
}[] = [
  { img: "/projects/fero/mascot.webp", bg: "#ef8632", t: -14, s: 1.12 },
  { name: "We Are 26", bg: "#e8002d", fg: "#fbf9ef", t: 11, s: 0.88 },
  { img: "/projects/fero/package.webp", bg: "#2b2118", t: -8, s: 1 },
  { name: "Shift", bg: "#27344a", fg: "#fbf9ef", t: 16, s: 0.86 },
  { img: "/projects/fero/stickers.webp", bg: "#f0ede5", t: -18, s: 1.08 },
  { name: "Afterword", bg: "#7f9bbf", fg: "#171412", t: 8, s: 0.94 },
  { img: "/projects/fero/tote-bag.webp", bg: "#d8b48c", t: -11, s: 1 },
  { name: "Zendo", bg: "#e8a87c", fg: "#171412", t: 14, s: 0.88 },
  { name: "Knot", bg: "#4a6fa5", fg: "#fbf9ef", t: -9, s: 1.02 },
  { name: "Waaah", bg: "#f0c8a8", fg: "#171412", t: 12, s: 0.9 },
];

/* left rail — solid glyphs like the reference (house / tag / smiley / flask / book / mail) */
const RAIL: { href: string; label: string; active?: boolean; icon: ReactNode }[] = [
  {
    href: "/v4",
    label: "Home",
    active: true,
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
  {
    href: "/guestbook",
    label: "Guestbook",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path
          fillRule="evenodd"
          d="M5.6 3.4h11.2a2 2 0 0 1 2 2v13.2a2 2 0 0 1-2 2H5.6a2 2 0 0 1-2-2V5.4a2 2 0 0 1 2-2Zm2.2 4.5a.95.95 0 0 0 0 1.9h6.8a.95.95 0 0 0 0-1.9H7.8Zm0 3.8a.95.95 0 0 0 0 1.9h6.8a.95.95 0 0 0 0-1.9H7.8Zm0 3.8a.95.95 0 0 0 0 1.9h4a.95.95 0 0 0 0-1.9h-4Z"
        />
      </svg>
    ),
  },
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

export default function V4Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLElement>(null);
  const [clock, setClock] = useState("");


  /* designed cursor (brandappart-style follower): ink dot → glass lens over
     links → glass label pill over [data-cursor] cards. Fine pointers only;
     native cursor returns untouched on touch / reduced-motion. */
  useEffect(() => {
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
  }, []);

  /* magnetic rail buttons — tiles lean toward the pointer, spring back on
     leave (translate is transitioned in CSS, so writes feel elastic) */
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const btns = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>(".v4-rbtn") ?? []
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
  }, []);

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

  /* right-edge scroll progress dot + discovery-call dock (past the hero) */
  useEffect(() => {
    const onScroll = () => {
      const dot = dotRef.current;
      const line = lineRef.current;
      if (dot && line) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        dot.style.top = `${p * (line.clientHeight - 9)}px`;
      }
      dockRef.current?.classList.toggle(
        "is-on",
        window.scrollY > window.innerHeight * 0.7
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lenis smooth scroll, scoped to this prototype's lifetime */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis();
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  /* entrance + scroll reveals */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const rootEl = rootRef.current;
    const ctx = gsap.context(() => {
      gsap.from(".v4-hline", {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.09,
        ease: "expo.out",
        delay: 0.15,
      });
      gsap.from(".v4-lede, .v4-callrow", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.6,
        ease: "power3.out",
      });
      gsap.from(".v4-badge, .v4-rail, .v4-cta-top, .v4-wordmark, .v4-loc", {
        opacity: 0,
        duration: 0.6,
        delay: 0.9,
        ease: "power2.out",
      });
      gsap.utils.toArray<HTMLElement>(".v4-reveal").forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      /* wheel spin, scrubbed by scroll through its tall wrapper */
      gsap.to(".v4-ring", {
        rotation: 150,
        ease: "none",
        scrollTrigger: {
          trigger: ".v4-wheelwrap",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      /* page bg dips cream→ink approaching the wheel, back to cream on the
         way out (like the reference — the section has no bg of its own) */
      gsap.to(rootEl, {
        backgroundColor: "#171412",
        ease: "none",
        scrollTrigger: {
          trigger: ".v4-wheelwrap",
          start: "top 80%",
          end: "top 40%",
          scrub: 0.4,
        },
      });
      gsap.to(rootEl, {
        backgroundColor: "#fbf9ef",
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: ".v4-wheelwrap",
          start: "bottom 85%",
          end: "bottom 45%",
          scrub: 0.4,
        },
      });
      /* chrome inverts while the page is dark */
      ScrollTrigger.create({
        trigger: ".v4-wheelwrap",
        start: "top 40%",
        end: "bottom 50%",
        onToggle: (self) => rootEl?.classList.toggle("v4-dark", self.isActive),
      });
    }, rootRef);
    return () => {
      ctx.revert();
      rootEl?.classList.remove("v4-dark");
    };
  }, []);

  return (
    <div className="v4" ref={rootRef}>
      {/* designed cursor — follows the pointer, morphs by context */}
      <div className="v4-cursor" ref={curRef} aria-hidden>
        <span className="v4-cursor-label" />
      </div>

      {/* fixed chrome — exactly like the reference */}
      <Link href="/v4" className="v4-badge" aria-label="Surya — home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Avatar.png" alt="" />
      </Link>

      <Link href="/contact" className="v4-cta-top">
        Book a call now
      </Link>

      <nav className="v4-rail" aria-label="Primary">
        {RAIL.map((r) => (
          <Link key={r.label} href={r.href} className={`v4-rbtn ${r.active ? "is-active" : ""}`}>
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

      {/* discovery-call dock — floats in once you scroll past the hero */}
      <div className="v4-dock" ref={dockRef}>
        <span>Book a free discovery call</span>
        <Link href="/contact" className="v4-dock-btn">
          Book a call
          <span className="v4-callfaces v4-callfaces-sm" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/portrait.webp" alt="" />
            <i>
              <svg viewBox="0 0 24 24">
                <path d="M6.6 3.6c.6-.2 1.24.05 1.56.6l1.5 2.6c.3.5.24 1.14-.15 1.58l-1.1 1.25a12.4 12.4 0 0 0 5.4 5.4l1.24-1.1c.44-.4 1.08-.45 1.59-.16l2.6 1.5c.55.32.8.97.6 1.57l-.66 1.95a1.6 1.6 0 0 1-1.7 1.08C10.4 19.9 4.1 13.6 3.16 6.5a1.6 1.6 0 0 1 1.08-1.7l2.36-.8Z" />
              </svg>
            </i>
          </span>
        </Link>
      </div>

      {/* hero — one full viewport, everything centered */}
      <section className="v4-hero">
        <h1 className="v4-display">
          <span className="v4-mask">
            <span className="v4-hline">
              The design<span className="v4-c">©</span>
            </span>
          </span>
          <span className="v4-mask"><span className="v4-hline">partner who ships</span></span>
          <span className="v4-mask"><span className="v4-hline">the code too</span></span>
        </h1>

        <p className="v4-lede">
          I help teams ship iconic brands, conversion-ready sites, and products
          that feel designed — end to end.
        </p>

        <div className="v4-herobottom">
          <Link href="/contact" className="v4-callrow">
            <span>Book an intro call</span>
            <span className="v4-callfaces" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/portrait.webp" alt="" />
              <i>
                <svg viewBox="0 0 24 24">
                  <path d="M6.6 3.6c.6-.2 1.24.05 1.56.6l1.5 2.6c.3.5.24 1.14-.15 1.58l-1.1 1.25a12.4 12.4 0 0 0 5.4 5.4l1.24-1.1c.44-.4 1.08-.45 1.59-.16l2.6 1.5c.55.32.8.97.6 1.57l-.66 1.95a1.6 1.6 0 0 1-1.7 1.08C10.4 19.9 4.1 13.6 3.16 6.5a1.6 1.6 0 0 1 1.08-1.7l2.36-.8Z" />
                </svg>
              </i>
            </span>
          </Link>
        </div>
      </section>

      {/* featured work — full-viewport intro, then the case masonry */}
      <section className="v4-workintro">
        <h2 className="v4-wi-title">
          <span className="v4-reveal">Featured</span>
          <em className="v4-reveal">work</em>
        </h2>
        <svg className="v4-wi-arrow v4-reveal" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 3v16m0 0-6.5-6.5M12 19l6.5-6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="v4-wi-copy v4-reveal">
          I create purposeful brands and products that don&apos;t just capture
          attention — they ship, convert, and hold up in production.
        </p>
      </section>

      <section className="v4-work" aria-label="Featured case studies">
        <div className="v4-cards">
          {FEATURED.map((p, i) => (
            <Link
              key={p.slug}
              href={`/works/${p.slug}`}
              className={`v4-card v4-reveal ${i === 0 || i === 3 ? "v4-card--wide" : ""} ${i === 2 ? "v4-card--tall" : ""}`}
              data-cursor="Discover case"
            >
              <div className="v4-card-media" style={{ background: p.bg }}>
                {p.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.img} alt={`${p.name} — ${p.cat}`} loading="lazy" />
                ) : (
                  <span className="v4-card-big">{p.name}</span>
                )}
                <span className="v4-cardchip">
                  <b>{p.name}</b>
                  <i>
                    {p.cat}
                    <br />
                    {p.year}
                  </i>
                </span>
              </div>
            </Link>
          ))}

          {/* testimonial card — slots into the left column like the reference */}
          <figure className="v4-tcard v4-reveal">
            <figcaption>Testimonial</figcaption>
            <blockquote>
              Working with Surya feels like hiring two people — the designer and
              the developer, and they never argue with each other.
            </blockquote>
            <div className="v4-tcard-foot">
              <span className="v4-tface" aria-hidden>
                <svg viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 21.2a9.2 9.2 0 1 0 0-18.4 9.2 9.2 0 0 0 0 18.4ZM8.9 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm6.2 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-6.5 3.1a.9.9 0 0 0-.3 1.25c.77 1.24 2.17 2.05 3.7 2.05s2.93-.8 3.7-2.05a.9.9 0 0 0-1.53-.95c-.45.72-1.27 1.2-2.17 1.2-.9 0-1.72-.48-2.17-1.2a.9.9 0 0 0-1.23-.3Z"
                  />
                </svg>
              </span>
              <div>
                <strong>This seat is open</strong>
                <small>First client quote goes here — @your startup</small>
              </div>
              <Link href="/contact" className="v4-tcard-cta">
                Contact
                <br />
                sales
              </Link>
            </div>
          </figure>
        </div>
      </section>

      {/* see more work — ink section, tile wheel spun by scroll; hovering the
          center link shrinks the ring and lights the text */}
      <section className="v4-wheelwrap" ref={wheelRef}>
        <div className="v4-wheel-stage">
          <div className="v4-ring-scale" aria-hidden>
            <div className="v4-ring">
              {WHEEL.map((w, i) => (
                <div
                  key={i}
                  className="v4-wcard"
                  style={
                    {
                      "--a": `${i * 36}deg`,
                      "--t": `${w.t}deg`,
                      "--s": w.s,
                      background: w.bg,
                    } as CSSProperties
                  }
                >
                  {w.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={w.img} alt="" loading="lazy" />
                  ) : (
                    <span style={{ color: w.fg }}>{w.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Link href="/works" className="v4-wheel-link">
            See more
            <br />
            work
          </Link>
        </div>
      </section>

      {/* services */}
      <section className="v4-services">
        <h2 className="v4-h2 v4-reveal">
          What I ship.
          <br />
          How I move fast
        </h2>
        <ol>
          {SERVICES.map((s) => (
            <li key={s.n} className="v4-service v4-reveal">
              <span className="v4-service-n">({s.n})</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* proof marquee */}
      <section className="v4-proof" aria-label="Recognition">
        <div className="v4-marquee">
          <div className="v4-marquee-track">
            {[...PROOF, ...PROOF].map((t, i) => (
              <span key={i} aria-hidden={i >= PROOF.length}>
                {t} <em>✦</em>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* small team, big results */}
      <section className="v4-team">
        <h2 className="v4-h2 v4-reveal">
          One person,
          <br />
          full pipeline.
        </h2>
        <div className="v4-team-copy v4-reveal">
          <p>
            No account managers, no handoffs, no telephone game. You talk to the
            person who designs it, and to the person who builds it — they&apos;re
            the same person.
          </p>
          <p>
            Currently brewing <strong>Batch №001</strong> in the lab. Available
            for select projects.
          </p>
          <Link href="/contact" className="v4-pill v4-pill-lg">
            Start a project
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="v4-footer">
        <div className="v4-marquee v4-marquee-big" aria-hidden>
          <div className="v4-marquee-track">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i}>Make every pixel pull its weight!&nbsp;</span>
            ))}
          </div>
        </div>
        <div className="v4-footer-row">
          <span>Replies within 24h — IST</span>
          <nav>
            <Link href="/works">Works</Link>
            <Link href="/lab">Lab</Link>
            <Link href="/guestbook">Guestbook</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <span>©20?? Surya</span>
        </div>
        <Link href="/" className="v4-back">
          ← Back to current site
        </Link>
      </footer>
    </div>
  );
}
