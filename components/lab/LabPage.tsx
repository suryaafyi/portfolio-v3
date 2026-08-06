"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import SiteFooter from "@/components/v4/SiteFooter";

/* Live prefers-reduced-motion flag (CSS handles its own; this gates JS) */
function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduce;
}

/* Ambient status line — cycles the lore */
const TICKER = [
  "fermenting the lore",
  "embracing scope creep",
  "adding one (1) more easter egg",
  "renaming things until it's funny",
  "taste test №47 — needs more chaos",
  "shipping when it makes me laugh",
];

/* Per-word mask-rise wrapper for the hero title */
function W({ children }: { children: React.ReactNode }) {
  return (
    <span className="lbv-lw">
      <span className="lbv-lwi">{children}</span>
    </span>
  );
}

/* Shipped experiments — the stars of the shelf */
const SHIPPED: {
  n: string;
  name: string;
  tagline: string;
  blurb: string;
  chips: string[];
  live: string;
  contra?: string;
  bg: string;
  tag: string;
}[] = [
  {
    n: "01",
    name: "Air Sculpt",
    tagline: "Sculpt 3D form with your bare hands",
    blurb:
      "Webcam hand-tracking turns the space in front of you into clay. Pinch, pull and shape a mesh in real time — no mouse, no software, just your fingers moving through thin air.",
    chips: ["Hand tracking", "WebGL", "Three.js", "Vercel"],
    live: "https://airsculpt.vercel.app/",
    contra: "https://on.contra.com/jw7zfB",
    bg: "linear-gradient(140deg, #6d5bd0 0%, #2a2350 55%, #17141f 100%)",
    tag: "◔",
  },
  {
    n: "02",
    name: "Jamly",
    tagline: "Everyone deserves an instrument",
    blurb:
      "A guitar, a drum kit and a set of keys — all rendered live in the browser, played straight off the keyboard you already have. No download, no login, no excuse not to jam.",
    chips: ["Web Audio API", "3D rendering", "Keyboard input", "Vercel"],
    live: "https://jamly-muxic.vercel.app/",
    contra: "https://on.contra.com/gMbb8r",
    bg: "linear-gradient(140deg, #3147e8 0%, #1b2a8a 55%, #0e1330 100%)",
    tag: "♪",
  },
];

export default function LabPage() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(0);
  const [pct, setPct] = useState<number | null>(null);

  // never-finishing brew %, derived from the date so it drifts but never ships
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const d = new Date();
      setPct(58 + ((d.getDate() * 7 + d.getMonth() * 3) % 27));
    });
    if (reduce) return () => cancelAnimationFrame(raf);
    const id = setInterval(() => setTick((t) => (t + 1) % TICKER.length), 2800);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [reduce]);

  // entrance + scroll reveals
  useEffect(() => {
    if (reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".lbv-lwi", {
        yPercent: 115,
        duration: 0.85,
        stagger: 0.07,
        ease: "expo.out",
        delay: 0.1,
      });
      gsap.fromTo(
        ".lbv-scr path",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut", delay: 0.5 }
      );
      gsap.from(".lbv-lede, .lbv-status", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.5,
        ease: "power3.out",
      });
      gsap.utils.toArray<HTMLElement>(".lbv-reveal").forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduce]);

  const CELLS = 14;
  const filled = pct === null ? 0 : Math.round((pct / 100) * CELLS);

  return (
    <div className="lbv" ref={rootRef}>
      {/* hero */}
      <section className="lbv-hero">
        <span className="lbv-eyebrow">The Lab — vibe-coded side quests</span>
        <h1 className="lbv-title">
          <W>Cookin&rsquo;</W> <W>something</W> <br />
          <W>for</W> <W>the</W>{" "}
          <W>
            <em className="lbv-lore">
              lore
              <svg className="lbv-scr" viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden>
                <path d="M4 15 C 38 6 70 20 104 12 C 138 5 168 19 196 12" pathLength={1} />
              </svg>
            </em>
            <span className="lbv-c">©</span>
          </W>
        </h1>
        <p className="lbv-lede">
          The shelf for unhinged, over-engineered ideas I build purely because
          I can. One&rsquo;s already escaped the lab — the next batch is still
          on the workbench.
        </p>

        <div className="lbv-status" aria-live="polite">
          <span className="lbv-ping" aria-hidden />
          <span className="lbv-k">status</span>
          <span key={tick} className="lbv-tick">
            {TICKER[tick]}
          </span>
        </div>
      </section>

      {/* featured / shipped experiments */}
      <section className="lbv-sec">
        <h2 className="lbv-h2 lbv-reveal">
          Out of
          <br />
          the lab
        </h2>

        {SHIPPED.map((p) => (
          <a
            key={p.name}
            className="lbv-exp lbv-reveal"
            href={p.live}
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            data-cursor="Try it live"
          >
            <div className="lbv-exp-media" style={{ background: p.bg }}>
              <span className="lbv-exp-tag" aria-hidden>
                {p.tag}
              </span>
              <span className="lbv-exp-big">{p.name}</span>
              <span className="lbv-exp-live" aria-hidden>
                ● Live
              </span>
            </div>
            <div className="lbv-exp-body">
              <span className="lbv-n">({p.n})</span>
              <h3>{p.tagline}</h3>
              <p>{p.blurb}</p>
              <div className="lbv-chips">
                {p.chips.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
              <div className="lbv-exp-links">
                <span className="lbv-exp-cta">
                  Try it live
                  <i aria-hidden>↗</i>
                </span>
                {p.contra && (
                  <span
                    className="lbv-secondary"
                    role="link"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(p.contra, "_blank", "noopener");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(p.contra, "_blank", "noopener");
                      }
                    }}
                  >
                    See it on Contra →
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* next batch — the never-finishing teaser */}
      <section className="lbv-sec">
        <div className="lbv-next lbv-reveal">
          <div className="lbv-next-head">
            <span className="lbv-eyebrow">On the workbench</span>
            <h2 className="lbv-h2">Batch №002</h2>
          </div>
          <div className="lbv-next-body">
            <div
              className="lbv-brew"
              role="img"
              aria-label={
                pct === null
                  ? "Progress loading"
                  : `About ${pct}% — refuses to be rushed`
              }
            >
              <span className="lbv-brew-k" aria-hidden>
                brewing
              </span>
              <span className="lbv-cells" aria-hidden>
                {Array.from({ length: CELLS }, (_, i) => (
                  <span
                    key={i}
                    className={`lbv-cell ${i < filled ? "on" : ""} ${
                      i === filled - 1 ? "head" : ""
                    }`}
                  />
                ))}
              </span>
              <span className="lbv-brew-v" aria-hidden>
                {pct === null ? "…" : `${pct}%`}
              </span>
            </div>
            <p className="lbv-note">
              No launch date. It ships the moment it makes me laugh. This bar
              will keep insisting it&rsquo;s almost done — that&rsquo;s the whole
              joke.
            </p>
            <div className="lbv-ctas">
              <Link href="/contact" className="lbv-cta" data-hover>
                Get pinged when it drops
              </Link>
              <Link href="/works" className="lbv-alt" data-hover>
                Meanwhile, the shipped stuff →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
