"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import SiteFooter from "./SiteFooter";

/**
 * Home — brandappart-direction editorial page mapped onto Surya's content.
 * Fixed site chrome (cursor, badge, rail, CTA, progress, wordmark, clock,
 * dock) lives in components/v4/SiteChrome (mounted in the root layout);
 * this component is just the home content: hero, featured-work masonry,
 * see-more-work wheel (with the page-bg cream→ink dip), services deck,
 * trusted-by fan, one-person section, ink footer with a hover-spotlight
 * headline.
 */

/* featured-work cards — img for a still cover, video for an autoplay/muted/loop
   clip (both sourced from /assets-src/hero, lazy-played once on screen) */
const FEATURED: {
  slug: string;
  name: string;
  cat: string;
  year: string;
  img?: string;
  video?: string;
  bg: string;
  /** Defaults to /works/{slug} — override for cards that live elsewhere (e.g. Lab). */
  href?: string;
  cursor?: string;
}[] = [
  { slug: "fero", name: "Fero", cat: "Branding", year: "2026", video: "/projects/fero/hero.mp4", bg: "#171412" },
  { slug: "fwc", name: "We Are 26", cat: "Live dashboard", year: "2026", video: "/projects/fwc/hero.mp4", bg: "#E8002D" },
  { slug: "shift", name: "Shift", cat: "Career platform", year: "2025", img: "/projects/shift/hero.webp", bg: "#27344A" },
  {
    slug: "jamly",
    name: "Jamly",
    cat: "Browser instruments",
    year: "2026",
    img: "/projects/jamly/hero.webp",
    bg: "#0e1330",
    href: "/lab",
    cursor: "Try it in the Lab",
  },
];

/* services deck — ba's exact service-card palette (purple/orange/red/brown).
   Each card: title, tinted copy, a proof note bottom-left, thumb tiles
   bleeding off the right edge. */
const SERVICES: {
  n: string;
  t: string;
  d: string;
  bg: string;
  label: string;
  note: string;
  thumbs: { name?: string; img?: string; bg: string; fg?: string }[];
}[] = [
  {
    n: "01",
    t: "Product design that survives contact with users.",
    d: "Research-led UX, built for real behavior, not best-case demos. Journeys mapped, flows tested, then iterated until people actually adopt them — not just admire them.",
    bg: "#ff7722",
    label: "Receipts",
    note: "Knot: a 21.1% misclick rate documented in usability testing, then designed away with a rebuilt navigation.",
    thumbs: [
      { img: "/projects/shift/hero.webp", bg: "#27344a" },
      { img: "/projects/zendo/cover.webp", bg: "#e8a87c" },
      { img: "/projects/knot/cover.webp", bg: "#4a6fa5" },
    ],
  },
  {
    n: "02",
    t: "Brand systems with actual bite.",
    d: "Identities built to survive contact with the real world — packaging, motion, product, merch, all pulling the same direction. Positioning, tone, wordmark, guidelines: the whole kit, built to launch fast. Ask the tiger.",
    bg: "#3d2fa9",
    label: "Proof",
    note: "FERO: one tiger stretched across wordmark, packaging, posters, merch and a full motion ad — all unmistakably FERO.",
    thumbs: [
      { img: "/projects/fero/package.webp", bg: "#2b2118" },
      { img: "/projects/fero/stickers.webp", bg: "#f0ede5" },
      { img: "/projects/fero/tote-bag.webp", bg: "#d8b48c" },
      { img: "/projects/fero/wordmark.webp", bg: "#ef8632" },
    ],
  },
  {
    n: "03",
    t: "Front-end that feels designed, because it is.",
    d: "The person who drew the screen is the person who ships it — nothing gets lost in a handoff, because there isn't one. Fast, accessible, and animated on purpose, not by accident.",
    bg: "#ff3c34",
    label: "Exhibit A",
    note: "This site is the demo — GSAP, Lenis, a designed cursor and a scroll-spun wheel, shipped by the hands that drew them.",
    thumbs: [
      { img: "/projects/fwc/fwc-hero.webp", bg: "#e8002d" },
      { img: "/projects/afterword/cover.webp", bg: "#7f9bbf" },
      { img: "/projects/portfolio/portfolio-hero.webp", bg: "#a07850" },
    ],
  },
  {
    n: "04",
    t: "Prototypes in days, not sprints.",
    d: "AI-native workflow, hand-finished results. Ideas go clickable before the meeting even ends — then get hardened into something you can actually ship.",
    bg: "#785f47",
    label: "Speedrun",
    note: "We Are 26: a 6-page broadcast-grade FIFA dashboard generated in days — winner of the Google Stitch Challenge.",
    thumbs: [],
  },
];

/* hero award marquee — faded strip like the reference's client-logo band */
const AWARDS = [
  "Google Stitch Challenge - Winner",
  "Best AI Product - Waaah (Winner)",
  "#1 in Voting for Best AI Product",
];

/* trusted-by fan — client testimonials. PLACEHOLDER quotes with fictional
   names/startups (user-approved "fake it till you make it") — swap these for
   real reviews as they land. v: cream | taupe, rot: resting tilt. */
const FAN: {
  v: "cream" | "taupe";
  rot: number;
  q: string;
  n: string;
  r: string;
  tag: string;
  bg: string;
  fg: string;
}[] = [
  {
    v: "cream",
    rot: -12,
    q: "Working with Surya felt like hiring an entire studio. One person, full pipeline — brand, site, launch assets, all pulling the same direction.",
    n: "Avantika",
    r: "Founder, seed-stage startup (NDA)",
    tag: "M",
    bg: "#e8002d",
    fg: "#fbf9ef",
  },
  {
    v: "taupe",
    rot: -6,
    q: "He found the exact spot where users were getting lost, showed us the data, and designed it away. Support tickets dropped by half — almost overnight.",
    n: "Daniel Osei",
    r: "Product Manager, B2B SaaS company (NDA)",
    tag: "D",
    bg: "#f0c8a8",
    fg: "#171412",
  },
  {
    v: "cream",
    rot: 2,
    q: "The site he shipped feels like a product reveal, not a website. Fast, smooth, pixel-faithful to the design — because he built both halves himself.",
    n: "Sofia Marchetti",
    r: "CMO, early-stage startup (NDA)",
    tag: "S",
    bg: "#4a6fa5",
    fg: "#fbf9ef",
  },
  {
    v: "taupe",
    rot: 7,
    q: "We asked for a prototype by Friday. He shipped a working build by Wednesday — animations included, unprompted.",
    n: "Niklas",
    r: "CEO, early-stage startup (NDA)",
    tag: "A",
    bg: "#ef8632",
    fg: "#171412",
  },
  {
    v: "cream",
    rot: 13,
    q: "Surya built us an amazing site — and the AI chatbot he added has been huge. It handles session bookings and answers customer questions on its own now. That was a massive problem for us before, and it's basically solved",
    n: "Guhan",
    r: "Manager, SK Fitness Studio",
    tag: "E",
    bg: "#3d2fa9",
    fg: "#fbf9ef",
  },
];

/* see-more-work wheel — a ring of project tiles spun by scroll. Bold gradient
   cards + name only (no real photos here — those are reserved for the /works
   list view and the case studies themselves). t = individual tilt (deg),
   s = size multiplier. */
const WHEEL: {
  name: string;
  bg: string;
  fg: string;
  t: number;
  s: number;
}[] = [
  { name: "Fero", bg: "linear-gradient(135deg, #ef8632, #2b2118)", fg: "#fbf9ef", t: -14, s: 1.12 },
  { name: "We Are 26", bg: "linear-gradient(135deg, #e8002d, #8a0b2b)", fg: "#fbf9ef", t: 11, s: 0.88 },
  { name: "SK Fitness", bg: "linear-gradient(135deg, #e8462a, #171412)", fg: "#fbf9ef", t: -8, s: 0.96 },
  { name: "Shift", bg: "linear-gradient(135deg, #27344a, #4a6fa5)", fg: "#fbf9ef", t: 16, s: 0.86 },
  { name: "Cinematic", bg: "linear-gradient(135deg, #d8b48c, #a07850)", fg: "#fbf9ef", t: -18, s: 0.92 },
  { name: "Afterword", bg: "linear-gradient(135deg, #7f9bbf, #f0edef)", fg: "#171412", t: 8, s: 0.94 },
  { name: "Zendo", bg: "linear-gradient(135deg, #e8a87c, #f0ede5)", fg: "#171412", t: 14, s: 0.88 },
  { name: "Knot", bg: "linear-gradient(135deg, #4a6fa5, #b8c5d6)", fg: "#fbf9ef", t: -9, s: 1.02 },
  { name: "Waaah", bg: "linear-gradient(135deg, #f0c8a8, #e8a87c)", fg: "#171412", t: 12, s: 0.9 },
];

export default function V4Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);

  /* ── align mode: visit /?chipalign to drag the hero chips + copy offsets ── */
  const [align] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("chipalign")
  );
  const [copied, setCopied] = useState(false);
  const offsetsRef = useRef<Record<string, { x: number; y: number }>>({});

  /* hero aurora shader — live WebGL ribbons + cursor light + 3D headline tilt */
  useEffect(() => {
    const cv = heroCanvasRef.current, hero = heroRef.current;
    if (!cv || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cv.style.background = "radial-gradient(120% 90% at 50% 40%, #fdfbf3, #f6e3c4 60%, #f6c79a 100%)";
      return;
    }
    const gl = cv.getContext("webgl");
    if (!gl) { cv.style.background = "radial-gradient(120% 90% at 50% 40%, #fdfbf3, #f6e3c4 60%, #f6c79a 100%)"; return; }

    const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
    const fs = `
      precision highp float;
      uniform float u_time; uniform vec2 u_res; uniform vec2 u_mouse;
      const vec3 cream=vec3(0.984,0.976,0.937);
      const vec3 taupe=vec3(0.847,0.769,0.596);
      const vec3 orange=vec3(1.0,0.466,0.133);
      float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
      float noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.-2.*f);
        float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
        return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }
      float fbm(vec2 p){ float v=0.,a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6);
        for(int i=0;i<5;i++){ v+=a*noise(p); p=m*p; a*=.5; } return v; }
      void main(){
        vec2 uv=gl_FragCoord.xy/u_res; vec2 p=uv; p.x*=u_res.x/u_res.y;
        float t=u_time*0.09;                                   // ← flow speed
        float w=fbm(p*1.8+vec2(t,t*0.3))*1.1;
        float ribbon=sin((p.y*3.4 - p.x*1.1 + w*2.2 + t)*3.14159);
        float m=smoothstep(-0.2,1.0,ribbon*0.5+0.5);
        float w2=fbm(p*2.6+vec2(-t*0.7,w));
        vec3 col=mix(cream,taupe,m*0.9);
        col=mix(col,orange,smoothstep(0.55,0.98,m)*0.92);      // ← orange intensity (last mult)
        col=mix(col,cream,smoothstep(0.4,0.9,w2)*0.35);
        vec2 mo=u_mouse; mo.x*=u_res.x/u_res.y;
        float d=distance(p,mo); col+=orange*0.12*smoothstep(0.55,0.,d);
        float cd=distance(uv,vec2(0.5)); col=mix(col,cream,smoothstep(0.44,0.04,cd)*0.5); // center calm
        float gr=hash(uv*u_res*0.5+t)*0.05-0.025; col+=gr;     // ← grain amount
        col*=1.0-smoothstep(0.5,1.15,length(uv-0.5))*0.16;
        gl_FragColor=vec4(col,1.0);
      }`;
    const mk = (ty: number, src: string) => { const s = gl.createShader(ty)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(prog, "u_time");
    const uR = gl.getUniformLocation(prog, "u_res");
    const uM = gl.getUniformLocation(prog, "u_mouse");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    const resize = () => { const w = hero.clientWidth, h = hero.clientHeight; cv.width = w*dpr; cv.height = h*dpr; gl.viewport(0,0,cv.width,cv.height); gl.uniform2f(uR, cv.width, cv.height); };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(hero);

    let mx=0.5,my=0.55,tmx=0.5,tmy=0.55,raf=0,running=false;
    const start = performance.now();
    const loop = () => { mx+=(tmx-mx)*0.06; my+=(tmy-my)*0.06; gl.uniform1f(uT,(performance.now()-start)/1000); gl.uniform2f(uM,mx,my); gl.drawArrays(gl.TRIANGLES,0,3); raf=requestAnimationFrame(loop); };
    // the shader only needs to render while the hero is actually on screen —
    // without this it keeps drawing every frame forever, even scrolled away
    const startLoop = () => { if (!running) { running = true; loop(); } };
    const stopLoop = () => { running = false; cancelAnimationFrame(raf); };
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startLoop() : stopLoop()),
      { threshold: 0 }
    );
    io.observe(hero);

    const display = hero.querySelector<HTMLElement>(".v4-display");
    const rotX = display ? gsap.quickTo(display,"rotationX",{duration:0.6,ease:"power2.out"}) : null;
    const rotY = display ? gsap.quickTo(display,"rotationY",{duration:0.6,ease:"power2.out"}) : null;
    const move = (e: PointerEvent) => { const b=hero.getBoundingClientRect(); const nx=(e.clientX-b.left)/b.width, ny=(e.clientY-b.top)/b.height; tmx=nx; tmy=1-ny; rotY?.((nx-0.5)*6); rotX?.(-(ny-0.5)*6); };
    const leave = () => { tmx=0.5; tmy=0.55; rotY?.(0); rotX?.(0); };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => { stopLoop(); io.disconnect(); ro.disconnect(); hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave); };
  }, []);

  /* featured-work videos: don't touch the network until a card is actually on
     screen (the source clips are large), then autoplay muted/looped; pause +
     drop the source again once it scrolls away so it isn't decoding offscreen */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>(".v4-card-video"));
    if (!videos.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            const src = v.dataset.src;
            if (src && v.getAttribute("src") !== src) v.setAttribute("src", src);
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!align) return;
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("v4-aligning");
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-align]"));
    const offs = offsetsRef.current;
    const cleanups: Array<() => void> = [];

    els.forEach((el) => {
      const key = el.dataset.align as string;
      // pull off-screen elements into view so they can be grabbed
      const r = el.getBoundingClientRect();
      let iy = 0;
      if (r.bottom > window.innerHeight - 24) iy = -(r.bottom - window.innerHeight + 90);
      else if (r.top < 24) iy = 24 - r.top;
      offs[key] = { x: 0, y: Math.round(iy) };

      const badge = document.createElement("div");
      badge.className = "v4-align-badge";
      el.appendChild(badge);
      const apply = () => {
        el.style.transform = `translate(${offs[key].x}px, ${offs[key].y}px)`;
        badge.textContent = `${key}  Δ ${Math.round(offs[key].x)}, ${Math.round(offs[key].y)}`;
      };
      apply();

      let drag = false, sx = 0, sy = 0, ox = 0, oy = 0;
      const down = (e: PointerEvent) => {
        if ((e.target as HTMLElement)?.closest("[data-align]") !== el) return;
        drag = true;
        sx = e.clientX; sy = e.clientY;
        ox = offs[key].x; oy = offs[key].y;
        try { el.setPointerCapture(e.pointerId); } catch {}
        el.style.cursor = "grabbing";
        e.preventDefault();
        e.stopPropagation();
      };
      const move = (e: PointerEvent) => {
        if (!drag) return;
        offs[key] = { x: ox + (e.clientX - sx), y: oy + (e.clientY - sy) };
        apply();
      };
      const up = (e: PointerEvent) => {
        drag = false;
        el.style.cursor = "grab";
        try { el.releasePointerCapture(e.pointerId); } catch {}
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      cleanups.push(() => {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.style.transform = "";
        el.style.cursor = "";
        badge.remove();
      });
    });

    return () => {
      root.classList.remove("v4-aligning");
      cleanups.forEach((fn) => fn());
    };
  }, [align]);

  const copyAlign = () => {
    const text = Object.entries(offsetsRef.current)
      .map(([k, o]) => `${k}: translate(${Math.round(o.x)}px, ${Math.round(o.y)}px)`)
      .join("\n");
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* entrance + scroll reveals */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // don't run entrance tweens in align mode — they'd fight the drag transforms
    if (new URLSearchParams(window.location.search).has("chipalign")) return;
    gsap.registerPlugin(ScrollTrigger);
    const deckEl = deckRef.current;
    const ctx = gsap.context(() => {
      gsap.from(".v4-hline", {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.09,
        ease: "expo.out",
        delay: 0.15,
      });
      gsap.from(".v4-awards, .v4-lede, .v4-contra, .v4-callrow", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.6,
        ease: "power3.out",
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
         way out. The `.v4` scope (and the tweened background) is <body>,
         so the fixed chrome inverts with it. (The footer does NOT tween the
         body — it carries its own gradient — so these two are the only body
         bg tweens and can't be overwritten by a third.) */
      gsap.to(document.body, {
        backgroundColor: "#171412",
        ease: "none",
        scrollTrigger: {
          trigger: ".v4-wheelwrap",
          start: "top 80%",
          end: "top 40%",
          scrub: 0.4,
        },
      });
      gsap.to(document.body, {
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
        onToggle: (self) =>
          document.body.classList.toggle("v4-dark", self.isActive),
      });
      /* the footer owns its own cream→ink dark zone — see SiteFooter */
      /* services deck (matches the reference recording): one pinned slot;
         upcoming cards wait scaled-down UNDER the active card, poking out
         below its bottom edge; on scroll the top card exits upward with a
         3D tilt-back (perspective rotateX) revealing the next. Cards are
         centered by CSS (inset+margin auto) — GSAP only ever animates
         y/scale/rotation, so alignment can't drift. */
      if (deckEl) {
        deckEl.classList.add("v4-deck-live");
        const cards = gsap.utils.toArray<HTMLElement>(".v4-scard");
        /* keep in sync with --ch on .v4-scard */
        const cardH = () => Math.min(window.innerHeight * 0.66, 700);
        /* depth 0 = active; 1..3 = buried, bottom edge poking 12px per step */
        const peekY = (d: number) => (d <= 0 ? 0 : 12 * d + (cardH() * 0.04 * d) / 2);
        const peekS = (d: number) => (d <= 0 ? 1 : 1 - 0.04 * d);
        cards.forEach((c, i) =>
          gsap.set(c, { y: peekY(i), scale: peekS(i), transformPerspective: 1100 })
        );
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: deckEl,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });
        for (let k = 0; k < cards.length - 1; k++) {
          tl.to(
            cards[k],
            {
              y: () => -(window.innerHeight / 2 + cardH() / 2 + 120),
              rotateX: 32,
              duration: 1,
              ease: "power1.in",
            },
            k + 0.3
          );
          for (let j = k + 1; j < cards.length; j++) {
            tl.to(
              cards[j],
              {
                y: () => peekY(j - k - 1),
                scale: () => peekS(j - k - 1),
                duration: 1,
                ease: "power1.inOut",
              },
              k + 0.3
            );
          }
        }
        /* small hold on the last card before the section releases */
        tl.set({}, {}, "+=0.4");
      }
    }, rootRef);
    return () => {
      ctx.revert();
      document.body.classList.remove("v4-dark");
      deckEl?.classList.remove("v4-deck-live");
    };
  }, []);

  return (
    <div ref={rootRef}>
      {align && (
        <div className="v4-align-panel">
          <strong>ALIGN MODE</strong>
          <p>
            Drag the outlined chips to where you want them. Off-screen ones are
            pulled into view. Then copy the offsets and send them to me.
          </p>
          <div className="v4-align-btns">
            <button type="button" onClick={copyAlign}>
              {copied ? "Copied ✓" : "Copy offsets"}
            </button>
            <button type="button" onClick={() => window.location.reload()}>
              Reset
            </button>
          </div>
        </div>
      )}

      {/* hero — one full viewport, everything centered */}
      <section className="v4-hero" ref={heroRef}>
        <canvas className="v4-hero-shader" ref={heroCanvasRef} aria-hidden />
        <h1 className="v4-display">
          <span className="v4-mask">
            <span className="v4-hline">
              I design it<span className="v4-c">©</span>
            </span>
          </span>
          <span className="v4-mask"><span className="v4-hline">I build it too.</span></span>
          <span className="v4-mask"><span className="v4-hline">Nothing in between.</span></span>
        </h1>

        <div className="v4-awards" aria-label="Recognition">
          <div className="v4-awards-track">
            {[...AWARDS, ...AWARDS].map((a, i) => (
              <span key={i} aria-hidden={i >= AWARDS.length}>
                {a}
              </span>
            ))}
          </div>
        </div>

        <p className="v4-lede">
          Brands that stick. Interfaces that convert. Code that doesn&apos;t cut
          corners — designed and shipped by one person, start to finish.
        </p>

        {/* in-flow, centred: the "Book an intro call" callrow */}
        <div className="v4-herobottom">
          <a
            href="https://cal.com/surya.fyi/discovery-call"
            target="_blank"
            rel="noopener noreferrer"
            className="v4-callrow"
            data-cursor="Book a call"
          >
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
          </a>
        </div>
      </section>

      {/* featured work — full-viewport intro, then the case masonry */}
      <section className="v4-workintro">
        <h2 className="v4-wi-title">
          <span className="v4-reveal">Work</span>
          <em className="v4-reveal">that works</em>
        </h2>
        <svg className="v4-wi-arrow v4-reveal" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 3v16m0 0-6.5-6.5M12 19l6.5-6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="v4-wi-copy v4-reveal">
          Not mockups. Not vaporware. Real products — shipped, converting, and
          still holding up long after launch day.
        </p>
      </section>

      <section className="v4-work" aria-label="Featured case studies">
        <div className="v4-cards">
          {FEATURED.map((p, i) => (
            <Link
              key={p.slug}
              href={p.href ?? `/works/${p.slug}`}
              className={`v4-card v4-reveal ${i === 0 || i === 3 ? "v4-card--wide" : ""} ${i === 2 ? "v4-card--tall" : ""}`}
              data-cursor={p.cursor ?? "Discover case"}
            >
              <div className="v4-card-media" style={{ background: p.bg }}>
                {p.video ? (
                  <video
                    className="v4-card-video"
                    data-src={p.video}
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-label={`${p.name} — ${p.cat}`}
                  />
                ) : p.img ? (
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
              It&apos;s like hiring a designer and a developer — except
              they&apos;re the same person, and they never miss a deadline.
            </blockquote>
            <div className="v4-tcard-foot">
              <span className="v4-tface" aria-hidden>
                P
              </span>
              <div>
                <strong>Priya Raman</strong>
                <small>Co-founder @Fablehouse</small>
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
                      "--a": `${(360 / WHEEL.length) * i}deg`,
                      "--t": `${w.t}deg`,
                      "--s": w.s,
                      background: w.bg,
                    } as CSSProperties
                  }
                >
                  <span style={{ color: w.fg }}>{w.name}</span>
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

      {/* services — scroll-driven card deck in a fixed viewport */}
      <section className="v4-services">
        <h2 className="v4-svc-head">
          <span className="v4-svc-muted v4-reveal">What I ship.</span>
          <span className="v4-reveal">Fast, and built right</span>
        </h2>
        <div className="v4-deck-outer" ref={deckRef}>
          <div className="v4-deck">
            {SERVICES.map((s, i) => (
              <Link
                key={s.n}
                href="/works"
                className="v4-scard"
                style={{ background: s.bg, zIndex: SERVICES.length - i } as CSSProperties}
                data-cursor="See case studies"
              >
                <span className="v4-scard-n">({s.n})</span>
                <h3>{s.t}</h3>
                <p className="v4-scard-copy">{s.d}</p>
                <div className="v4-scard-foot">
                  <div className="v4-scard-note">
                    <span>{s.label}</span>
                    <p>{s.note}</p>
                  </div>
                  <div className="v4-scard-thumbs" aria-hidden>
                    {s.thumbs.map((th, j) => (
                      <span key={j} className="v4-thumb" style={{ background: th.bg }}>
                        {th.img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={th.img} alt="" loading="lazy" />
                        ) : (
                          <b style={{ color: th.fg }}>{th.name}</b>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* trusted by — fanned hand of receipt cards; hovering straightens a
          card while the rest of the hand spreads away */}
      <section className="v4-fan-sec" aria-label="Proof">
        <h2 className="v4-fan-head v4-reveal">
          Trusted by
          <em>5+ founders</em>
        </h2>
        <div className="v4-fan v4-reveal">
          {FAN.map((f, i) => (
            <article
              key={i}
              className={`v4-fcard ${f.v === "taupe" ? "v4-fcard--taupe" : ""}`}
              style={{ "--rot": `${f.rot}deg` } as CSSProperties}
            >
              <header>
                <span className="v4-fstars" aria-hidden>
                  {Array.from({ length: 5 }, (_, s) => (
                    <svg key={s} viewBox="0 0 24 24">
                      <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9L12 2.6z" />
                    </svg>
                  ))}
                </span>
                <Link href="/contact" className="v4-fcontact">
                  Contact
                  <i>
                    <svg viewBox="0 0 24 24">
                      <path d="M6.6 3.6c.6-.2 1.24.05 1.56.6l1.5 2.6c.3.5.24 1.14-.15 1.58l-1.1 1.25a12.4 12.4 0 0 0 5.4 5.4l1.24-1.1c.44-.4 1.08-.45 1.59-.16l2.6 1.5c.55.32.8.97.6 1.57l-.66 1.95a1.6 1.6 0 0 1-1.7 1.08C10.4 19.9 4.1 13.6 3.16 6.5a1.6 1.6 0 0 1 1.08-1.7l2.36-.8Z" />
                    </svg>
                  </i>
                </Link>
              </header>
              <blockquote>{f.q}</blockquote>
              <footer>
                <span className="v4-ftag" style={{ background: f.bg, color: f.fg }}>
                  {f.tag}
                </span>
                <div>
                  <strong>{f.n}</strong>
                  <small>{f.r}</small>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </section>

      {/* shared footer — owns its own cream→ink dark zone (see SiteFooter) */}
      <SiteFooter />
    </div>
  );
}
