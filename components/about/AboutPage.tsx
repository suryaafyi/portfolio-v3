"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Ransom-note cover title (multi-font), ported from the prototype.
const RANSOM: { ch: string; font: string; size: number; color: string; bg: string; rot: number }[] = [
  { ch: "A", font: "var(--font-anton), sans-serif", size: 34, color: "#fff", bg: "#cf5666", rot: -5 },
  { ch: "R", font: "var(--font-abril), serif", size: 33, color: "#3f8f86", bg: "#fff", rot: 4 },
  { ch: "T", font: "var(--font-archivo), sans-serif", size: 30, color: "#4a6fae", bg: "#ffe9c2", rot: -2 },
  { ch: "\n", font: "", size: 0, color: "", bg: "", rot: 0 },
  { ch: "S", font: "var(--font-archivo), sans-serif", size: 28, color: "#fff", bg: "#3f8f86", rot: 3 },
  { ch: "C", font: "var(--font-anton), sans-serif", size: 30, color: "#d6485a", bg: "#fff", rot: -4 },
  { ch: "R", font: "var(--font-abril), serif", size: 29, color: "#fff", bg: "#d98f3d", rot: 2 },
  { ch: "A", font: "var(--font-archivo), sans-serif", size: 27, color: "#8c4a73", bg: "#fff", rot: -3 },
  { ch: "P", font: "var(--font-anton), sans-serif", size: 30, color: "#fff", bg: "#4a6fae", rot: 5 },
  { ch: "S", font: "var(--font-abril), serif", size: 29, color: "#d6485a", bg: "#ffe9c2", rot: -2 },
];

export default function AboutPage() {
  const [loaded, setLoaded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const dotsRef = useRef<HTMLCanvasElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const gripRef = useRef<HTMLDivElement>(null);

  // Trigger the hero mask reveal on mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Scroll progress bar.
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    let raf = 0;
    const upd = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      bar.style.width = `${Math.min(p, 1) * 100}%`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(upd);
    };
    addEventListener("scroll", onScroll, { passive: true });
    upd();
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // IntersectionObserver reveals (+ staggered timeline / cards / wins).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".ab-reveal, .timeline, .work-grid, .wins");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // Reactive hero dot-field.
  useEffect(() => {
    const cv = dotsRef.current;
    const hero = heroRef.current;
    if (!cv || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    cv.style.display = "block";
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const DPR = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 0, raf = 0;
    let dots: { bx: number; by: number; x: number; y: number }[] = [];
    const mouse = { x: -999, y: -999 };
    const build = () => {
      const r = hero.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * DPR; cv.height = H * DPR;
      cv.style.width = `${W}px`; cv.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      dots = [];
      const gap = 38;
      for (let y = gap / 2; y < H; y += gap) for (let x = gap / 2; x < W; x += gap) dots.push({ bx: x, by: y, x, y });
    };
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -999; mouse.y = -999; };
    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
      for (const d of dots) {
        const dx = d.x - mouse.x, dy = d.y - mouse.y, dist = Math.hypot(dx, dy), R = 120;
        let tx = d.bx, ty = d.by, sc = 1, near = 0;
        if (dist < R) {
          const f = 1 - dist / R; near = f;
          const ang = Math.atan2(dy, dx);
          tx = d.bx + Math.cos(ang) * f * 20; ty = d.by + Math.sin(ang) * f * 20; sc = 1 + f * 1.6;
        }
        d.x += (tx - d.x) * 0.12; d.y += (ty - d.y) * 0.12;
        ctx.fillStyle = near > 0.05 ? `rgba(74,111,165,${0.1 + near * 0.5})` : "rgba(28,37,51,0.10)";
        ctx.beginPath(); ctx.arc(d.x, d.y, 1.1 * sc, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    addEventListener("resize", build);
    build(); frame();
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      removeEventListener("resize", build);
    };
  }, []);

  // Parallax stickers.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const st = root.querySelectorAll<HTMLElement>(".ab-sticker");
    const onMove = (e: MouseEvent) => {
      const mx = e.clientX / innerWidth - 0.5, my = e.clientY / innerHeight - 0.5;
      st.forEach((s, i) => {
        const k = (i + 1) * 14;
        s.style.transform = `translate(${mx * k}px,${my * k}px)`;
      });
    };
    addEventListener("mousemove", onMove);
    return () => removeEventListener("mousemove", onMove);
  }, []);

  // Design ↔ Code slider: drag + keyboard + auto-sweep on first view.
  useEffect(() => {
    const slider = sliderRef.current;
    const grip = gripRef.current;
    if (!slider || !grip) return;
    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dragging = false, swept = false, raf = 0;
    const setPos = (pctIn: number) => {
      const pct = Math.max(2, Math.min(98, pctIn));
      slider.style.setProperty("--pos", `${pct}%`);
      grip.setAttribute("aria-valuenow", String(Math.round(pct)));
    };
    setPos(55);
    const fromX = (cx: number) => {
      const r = slider.getBoundingClientRect();
      return ((cx - r.left) / r.width) * 100;
    };
    const onDown = (e: PointerEvent) => { dragging = true; slider.setPointerCapture(e.pointerId); setPos(fromX(e.clientX)); };
    const onMove = (e: PointerEvent) => { if (dragging) setPos(fromX(e.clientX)); };
    const onUp = () => { dragging = false; };
    const onKey = (e: KeyboardEvent) => {
      const cur = parseFloat(grip.getAttribute("aria-valuenow") || "55") || 55;
      if (e.key === "ArrowLeft") { setPos(cur - 4); e.preventDefault(); }
      if (e.key === "ArrowRight") { setPos(cur + 4); e.preventDefault(); }
    };
    slider.addEventListener("pointerdown", onDown);
    slider.addEventListener("pointermove", onMove);
    slider.addEventListener("pointerup", onUp);
    slider.addEventListener("pointercancel", onUp);
    grip.addEventListener("keydown", onKey);

    let io: IntersectionObserver | null = null;
    if (!RM) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting && !swept) {
              swept = true;
              io?.disconnect();
              const keys = [[0, 55], [400, 84], [900, 20], [1350, 55]];
              let t0 = 0;
              const tw = (ts: number) => {
                if (!t0) t0 = ts;
                const el = ts - t0;
                for (let i = keys.length - 1; i >= 0; i--) {
                  if (el >= keys[i][0]) {
                    if (i === keys.length - 1) { setPos(keys[i][1]); return; }
                    const a = keys[i], b = keys[i + 1];
                    let p = (el - a[0]) / (b[0] - a[0]);
                    p = p < 0 ? 0 : p > 1 ? 1 : p;
                    p = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
                    setPos(a[1] + (b[1] - a[1]) * p);
                    break;
                  }
                }
                raf = requestAnimationFrame(tw);
              };
              raf = requestAnimationFrame(tw);
            }
          });
        },
        { threshold: 0.5 }
      );
      io.observe(slider);
    }
    return () => {
      slider.removeEventListener("pointerdown", onDown);
      slider.removeEventListener("pointermove", onMove);
      slider.removeEventListener("pointerup", onUp);
      slider.removeEventListener("pointercancel", onUp);
      grip.removeEventListener("keydown", onKey);
      io?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className={`about ${loaded ? "ab-loaded" : ""}`}>
      <div ref={progressRef} className="ab-progress" />

      {/* HERO */}
      <header ref={heroRef} className="ab-hero">
        <canvas ref={dotsRef} className="ab-dots" />
        <svg className="ab-sticker ab-s1" width="58" height="58" viewBox="0 0 58 58" fill="none" aria-hidden>
          <path d="M29 4l5 18 18 5-18 5-5 18-5-18-18-5 18-5z" fill="#4A6FA5" opacity=".9" />
        </svg>
        <svg className="ab-sticker ab-s2" width="70" height="36" viewBox="0 0 70 36" fill="none" aria-hidden>
          <path d="M3 18C12 4 22 4 30 18s18 14 26 0" stroke="#3147e8" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <div className="wrap">
          <span className="ab-eyebrow">Product designer + developer · Chennai</span>
          <h1>
            <span className="line"><span className="lineInner">I design products,</span></span>
            <span className="line"><span className="lineInner">then <span className="uline">build them</span> myself.</span></span>
          </h1>
          <p className="lede">
            I&apos;m Surya — a product designer and full-stack developer. I came to design through code, so I care as
            much about how a thing <em>feels</em> as whether it actually works.
          </p>
          <span className="chip"><span className="dot" /> Available for select work</span>
        </div>
        <div className="scrollcue">
          SCROLL
          <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </header>

      {/* SLIDER */}
      <section className="section">
        <div className="wrap ab-reveal">
          <div className="slider-head">
            <h2>Drag it — both sides are me.</h2>
            <span className="ab-eyebrow">Two sides, one person</span>
          </div>
          <div ref={sliderRef} className="slider" data-hover>
            <div className="layer code-layer">
              <pre>
{`function ProjectCard({ title, tag, accent }) {
  return (
    <article className="card"
      style={{ '--accent': accent }}>
      <span className="tag">{tag}</span>
      <h3>{title}</h3>
      <span className="bar" />
      <button>View case study →</button>
    </article>
  );
}`}
              </pre>
            </div>
            <div className="layer design-layer">
              <div className="mock">
                <span className="tag">CASE STUDY</span>
                <h3>Afterword</h3>
                <span className="bar" />
                <span className="btn">View case study →</span>
              </div>
            </div>
            <span className="lbl lbl-design">DESIGN</span>
            <span className="lbl lbl-code">CODE</span>
            <div className="handle">
              <div
                ref={gripRef}
                className="grip"
                role="slider"
                tabIndex={0}
                aria-label="Blend design and code"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={55}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                  <polyline points="9 6 15 12 9 18" transform="translate(6,0)" />
                </svg>
              </div>
            </div>
          </div>
          <p className="slider-cap">
            Most people do one or the other. I move between Figma and the codebase with no handoff — so nothing gets
            lost in translation, and the thing that ships is the thing I designed.
          </p>
        </div>
      </section>

      {/* STORY + TIMELINE */}
      <section className="section">
        <div className="wrap ab-reveal">
          <div className="story-grid">
            <span className="ab-eyebrow">The story</span>
            <h2>Engineer first, designer on purpose.</h2>
            <p>
              I spent about three years as a software engineer — most of it building a point-of-sale platform that ran
              across hundreds of retail stores. I learned how real products behave under load, on deadlines, in the
              messy real world.
            </p>
            <p>
              In 2025 I moved deliberately into product design. Not away from code — toward owning the whole thing: the
              feel and the function. That engineering background is my edge. I design things that are genuinely
              buildable, and then I build them.
            </p>
          </div>
          <div className="timeline">
            <span className="tl-line" />
            <div className="tl-node"><div className="tl-yr">2022 — 2025</div><div className="tl-role">Software Engineer</div><div className="tl-desc">POS platform at retail scale. Real products, real constraints.</div></div>
            <div className="tl-node"><div className="tl-yr">2025</div><div className="tl-role">Product Designer</div><div className="tl-desc">A deliberate move to own feel + function, not just ship features.</div></div>
            <div className="tl-node"><div className="tl-yr">Now</div><div className="tl-role">Designer + Developer</div><div className="tl-desc">Shipping real products solo — from Figma to deploy.</div></div>
          </div>
        </div>
      </section>

      {/* HOW I WORK */}
      <section className="section">
        <div className="wrap ab-reveal">
          <span className="ab-eyebrow">How I work</span>
          <div className="work-grid">
            <div className="work-card" data-hover><div className="n">01</div><h4>Fast &amp; instinct-led</h4><p>I&apos;d rather make ten quick versions than overthink one.</p></div>
            <div className="work-card" data-hover><div className="n">02</div><h4>Iterative</h4><p>Ship it, look at it, refine. Repeat until it feels right.</p></div>
            <div className="work-card" data-hover><div className="n">03</div><h4>Visually precise</h4><p>Spacing, type and motion aren&apos;t details — they&apos;re the work.</p></div>
            <div className="work-card" data-hover><div className="n">04</div><h4>AI-accelerated</h4><p>I vibe-code real, shipped products with AI in the loop.</p></div>
            <div className="work-card" data-hover><div className="n">05</div><h4>Built for constraints</h4><p>My best work happens in hackathons and contests, on the clock.</p></div>
          </div>
        </div>
      </section>

      {/* SKETCHBOOK TEASER → /about/scrapbook */}
      <section className="section sketch">
        <div className="wrap ab-reveal">
          <div className="sketch-head">
            <h2>From my sketchbook.</h2>
            <span className="ab-eyebrow">Art / things I draw</span>
          </div>
          <p className="sketch-sub">
            A messy little art-zine of pieces I actually drew by hand. Take a peek at the cover — then open the whole
            thing up.
          </p>
        </div>
        <div className="wrap">
          <div className="sb-wrap ab-reveal">
            <Link className="scrapbook-teaser" href="/about/scrapbook" data-hover aria-label="Open the full scrapbook">
              <div className="sbk-stage">
                <div className="sbk-book" aria-hidden>
                  <div className="sbk-cover">
                    <div className="sbk-ging" />
                    <div className="sbk-coil">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <span key={i} />
                      ))}
                    </div>
                    <div className="sbk-washi" />
                    <div className="sbk-title">
                      {RANSOM.map((l, i) =>
                        l.ch === "\n" ? (
                          <br key={i} />
                        ) : (
                          <span
                            key={i}
                            style={{
                              fontFamily: l.font,
                              fontSize: l.size,
                              color: l.color,
                              background: l.bg,
                              padding: "1px 6px",
                              transform: `rotate(${l.rot}deg)`,
                            }}
                          >
                            {l.ch}
                          </span>
                        )
                      )}
                    </div>
                    <div className="sbk-subtitle">a messy little archive of things i made &amp; unmade</div>
                    <div className="sbk-polaroid">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/Avatar.png" alt="Surya, mid-mess" />
                      <span className="sbk-washi2" />
                      <span className="sbk-cap">me, mid-mess ✶</span>
                    </div>
                    <div className="sbk-vol">VOL. 01</div>
                    <div className="sbk-by">by Surya</div>
                    <svg className="sbk-star" width="30" height="30" viewBox="0 0 24 24">
                      <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" fill="#d98f3d" stroke="#fff" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              </div>
              <span className="sbk-cta">Click to view my art →</span>
              <span className="sbk-note">psst — it really flips, like a paper book</span>
            </Link>
          </div>
        </div>
      </section>

      {/* TOOLBOX */}
      <section className="section">
        <div className="wrap ab-reveal">
          <span className="ab-eyebrow">Toolbox</span>
          <div className="tools-grid">
            <div className="tools-col design">
              <h3>{"// DESIGN"}</h3>
              <div className="pills">
                {["Figma", "Framer", "Prototyping", "Design systems", "Interaction & motion", "UX research"].map((p) => (
                  <span key={p} className="ab-pill">{p}</span>
                ))}
              </div>
            </div>
            <div className="tools-col build">
              <h3>{"// BUILD"}</h3>
              <div className="pills">
                {["React", "Next.js", "TypeScript", "Tailwind", "Supabase", "GSAP", "Three.js", "Framer Motion", "Vite"].map((p) => (
                  <span key={p} className="ab-pill">{p}</span>
                ))}
              </div>
            </div>
            <div className="tools-col ai">
              <h3>{"// AI & TOOLS"}</h3>
              <div className="pills">
                {["Claude Code", "Claude Design", "ChatGPT", "Antigravity", "Google Stitch"].map((p) => (
                  <span key={p} className="ab-pill">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WINS */}
      <section className="section">
        <div className="wrap ab-reveal">
          <span className="ab-eyebrow">Selected wins</span>
          <div className="wins">
            <div className="win"><span className="badge">WINNER</span><span className="name">We Are 26</span><span className="ctx">Google Stitch Challenge · Contra</span></div>
            <div className="win"><span className="badge">BEST AI PRODUCT</span><span className="name">Waaah</span><span className="ctx">Nori Mother&apos;s Day AI Challenge</span><span className="votes">438 votes</span></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="wrap ab-reveal">
          <h2>Let&apos;s make something that feels alive.</h2>
          <div className="cta-btns">
            <Link className="btn-lg btn-fill" href="/works" data-hover>See the work →</Link>
            <Link className="btn-lg btn-ghost" href="/contact" data-hover>Get in touch →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
