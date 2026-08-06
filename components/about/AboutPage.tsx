"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import SiteFooter from "@/components/v4/SiteFooter";

/**
 * About — same story as before, rebuilt in the v4 (brandappart) language:
 * cream canvas, Gabarito display type, hairline-ruled numbered rows and
 * mono eyebrows. The hand-drawn scrapbook lives on at /about/scrapbook.
 */

const TIMELINE = [
  {
    yr: "2022 — 2025",
    role: "Software Engineer",
    desc: "POS platform at retail scale. Real products, real constraints.",
  },
  {
    yr: "2025",
    role: "Product Designer",
    desc: "A deliberate move to own feel + function, not just ship features.",
  },
  {
    yr: "2026",
    role: "Product Designer @ Contra Labs",
    desc: "Accepted into the Contra Labs Network — application bypassed on prior work — now helping shape AI models and tools.",
    current: true,
  },
  {
    yr: "Now",
    role: "Designer + Developer",
    desc: "Shipping real products solo - from Figma to deploy.",
  },
];

const HOW = [
  { n: "01", t: "Fast & instinct-led", d: "I'd rather make ten quick versions than overthink a single one." },
  { n: "02", t: "Iterative", d: "Ship it, look at it, refine it. Repeat until it actually feels right." },
  { n: "03", t: "Visually precise", d: "Spacing, type and motion aren't details — they're the work itself." },
  { n: "04", t: "AI-accelerated", d: "I vibe-code real, shipped products with AI riding shotgun." },
  { n: "05", t: "Built for constraints", d: "My best work happens under a countdown — hackathons, contests, deadlines." },
];

const TOOLS = [
  {
    head: "Design",
    items: ["Figma", "Framer", "Prototyping", "Design systems", "Interaction & motion", "UX research"],
  },
  {
    head: "Build",
    items: ["React", "Next.js", "TypeScript", "Tailwind", "Supabase", "GSAP", "Three.js", "Framer Motion", "Vite"],
  },
  {
    head: "AI & tools",
    items: ["Claude Code", "Claude Design", "ChatGPT", "Antigravity", "Google Stitch"],
  },
];

const WINS = [
  { badge: "Winner", name: "We Are 26", ctx: "Google Stitch Challenge · Contra", note: "" },
  { badge: "Best AI Product", name: "Waaah", ctx: "Nori Mother's Day AI Challenge", note: "438 votes" },
];

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".abv-hline", {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.09,
        ease: "expo.out",
        delay: 0.1,
      });
      gsap.from(".abv-lede, .abv-chip", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.5,
        ease: "power3.out",
      });
      gsap.utils.toArray<HTMLElement>(".abv-reveal").forEach((el) => {
        gsap.from(el, {
          y: 34,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      /* animated timeline: the rail's fill draws with scroll (scrubbed), and
         each node slides in + pops its dot as the fill reaches it */
      const time = timeRef.current;
      if (time) {
        gsap.fromTo(
          ".abv-time-fill",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: time,
              start: "top 78%",
              end: "bottom 55%",
              scrub: 0.5,
            },
          }
        );
        gsap.utils.toArray<HTMLElement>(".abv-node").forEach((node) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: node, start: "top 82%" },
          });
          tl.from(node, {
            x: -28,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          }).from(
            node.querySelector(".abv-dot"),
            {
              scale: 0,
              duration: 0.45,
              ease: "back.out(2.4)",
            },
            "-=0.45"
          );
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="abv" ref={rootRef}>
      {/* hero */}
      <section className="abv-hero">
        <span className="abv-eyebrow">About</span>
        <h1 className="abv-title">
          <span className="abv-mask">
            <span className="abv-hline">Engineer first,</span>
          </span>
          <span className="abv-mask">
            <span className="abv-hline">
              designer<span className="abv-c">©</span>
            </span>
          </span>
          <span className="abv-mask">
            <span className="abv-hline">on purpose.</span>
          </span>
        </h1>
        <p className="abv-lede">
          I came to design through code — so I obsess over how a thing{" "}
          <em>feels</em> exactly as much as whether it actually works.
        </p>
        <span className="abv-chip">
          <i aria-hidden /> Available for select work
        </span>
      </section>

      {/* story + timeline */}
      <section className="abv-sec">
        <div className="abv-two">
          <div className="abv-reveal">
            <span className="abv-eyebrow">The story</span>
            <h2 className="abv-h2">
              Engineer first,
              <br />
              designer on purpose.
            </h2>
          </div>
          <div className="abv-body abv-reveal">
            <p>
              Three years as a software engineer, most of it building a
              point-of-sale platform running across hundreds of retail stores.
              I learned how real products behave under load, on deadlines, in
              the actual messy world — not the Figma version of it.
            </p>
            <p>
              In 2025 I moved into product design — on purpose, not by
              accident. Not away from code, but toward owning the whole thing:
              the feel and the function. That engineering background is my
              edge. I design things that are genuinely buildable, then I build
              them myself.
            </p>
            <p>
              Most people pick a lane. I move between Figma and the codebase
              with zero handoff — so nothing gets lost in translation, and
              what ships is exactly what I designed.
            </p>
          </div>
        </div>

        {/* animated timeline — the rail draws itself as you scroll, nodes pop
            in one by one, the current role pulses orange */}
        <ol className="abv-time" ref={timeRef}>
          <span className="abv-time-rail" aria-hidden>
            <span className="abv-time-fill" />
          </span>
          {TIMELINE.map((t) => (
            <li
              key={t.role}
              className={`abv-node ${t.current ? "is-current" : ""}`}
            >
              <span className="abv-dot" aria-hidden />
              <span className="abv-yr">{t.yr}</span>
              <h3>{t.role}</h3>
              <p>{t.desc}</p>
              {t.current && <span className="abv-now-tag">New</span>}
            </li>
          ))}
        </ol>
      </section>

      {/* how I work */}
      <section className="abv-sec">
        <h2 className="abv-h2 abv-reveal">
          How I
          <br />
          work
        </h2>
        <ol className="abv-rows">
          {HOW.map((h) => (
            <li key={h.n} className="abv-reveal">
              <span className="abv-n">({h.n})</span>
              <h3>{h.t}</h3>
              <p>{h.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* toolbox */}
      <section className="abv-sec">
        <h2 className="abv-h2 abv-reveal">Toolbox</h2>
        <div className="abv-tools">
          {TOOLS.map((col) => (
            <div key={col.head} className="abv-reveal">
              <span className="abv-eyebrow">{col.head}</span>
              <div className="abv-pills">
                {col.items.map((p) => (
                  <span key={p} className="abv-pill">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* selected wins */}
      <section className="abv-sec">
        <h2 className="abv-h2 abv-reveal">
          Selected
          <br />
          wins
        </h2>
        <div className="abv-wins">
          {WINS.map((w) => (
            <div key={w.name} className="abv-win abv-reveal">
              <span className="abv-badge">{w.badge}</span>
              <h3>{w.name}</h3>
              <p>{w.ctx}</p>
              {w.note && <small>{w.note}</small>}
            </div>
          ))}
        </div>
      </section>

      {/* scrapbook teaser */}
      <section className="abv-sec">
        <Link
          href="/about/scrapbook"
          className="abv-sketch abv-reveal"
          data-cursor="Open the scrapbook"
        >
          <div>
            <span className="abv-eyebrow">Art / things I draw</span>
            <h2 className="abv-h2">
              From my
              <br />
              sketchbook.
            </h2>
            <p>
              A messy little art-zine of stuff I actually drew by hand — and it
              really flips, like a paper book.
            </p>
            <span className="abv-open">Open the scrapbook →</span>
          </div>
          <span className="abv-sketch-media" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Avatar.png" alt="" />
          </span>
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
