"use client";

import Link from "next/link";
import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import HuntSticker from "@/components/hunt/HuntSticker";
import { getFoundServerSnapshot, getFoundSnapshot, subscribeHunt } from "@/lib/hunt";

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

/* The liquid cycles through these when you stir a vessel */
const LIQUIDS = ["#4a6fa5", "#3147e8", "#8ba8cf", "#1c2533"];

const TICKER = [
  "fermenting the lore",
  "embracing scope creep",
  "adding one (1) more easter egg",
  "renaming things until it’s funny",
  "taste test №47 — needs more chaos",
  "shipping when it makes me laugh",
];

/* Stir-count tease lines while the hidden sticker is still brewing */
const TEASE: Record<number, string> = {
  1: "hm — something’s loose in there",
  2: "one more stir ought to do it",
};

/* Tiny sticker bits that pop out when you stir */
const BURST_SVGS = [
  `<svg viewBox="0 0 100 100"><path d="M50 2 L60 40 L98 50 L60 60 L50 98 L40 60 L2 50 L40 40 Z" fill="#1c2533"/></svg>`,
  `<svg viewBox="0 0 100 100"><path d="M50 4 C54 34 66 46 96 50 C66 54 54 66 50 96 C46 66 34 54 4 50 C34 46 46 34 50 4 Z" fill="#B8C5D6"/></svg>`,
  `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#4A6FA5"/><circle cx="36" cy="42" r="7" fill="#F0EDE5"/><circle cx="64" cy="42" r="7" fill="#F0EDE5"/><path d="M32 60 Q50 78 68 60" fill="none" stroke="#F0EDE5" stroke-width="8" stroke-linecap="round"/></svg>`,
  `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#3147e8" stroke-width="10"/></svg>`,
];

const bub = (d: string, dl: string, rise: string) =>
  ({ "--d": d, "--dl": dl, "--rise": rise }) as CSSProperties;

/* ── Vessel 1: Erlenmeyer flask ── */
function Erlenmeyer({ liq }: { liq: string }) {
  return (
    <svg viewBox="0 0 124 152" aria-hidden style={{ "--liq": liq } as CSSProperties}>
      <defs>
        <clipPath id="lab-erlen-clip">
          <path d="M52 8 L52 52 L23 127 Q18 141 32 141 L92 141 Q106 141 101 127 L72 52 L72 8 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#lab-erlen-clip)">
        <path
          className="lab-liq"
          d="M6 102 Q20 96 34 102 T62 102 T90 102 T120 102 V160 H2 Z"
          fill="var(--liq)"
        />
        <circle className="lab-bubble" cx="48" cy="132" r="3" fill="rgba(255,255,255,.85)" style={bub("2.4s", "0s", "-28px")} />
        <circle className="lab-bubble" cx="62" cy="136" r="2.2" fill="rgba(255,255,255,.8)" style={bub("2.9s", ".8s", "-32px")} />
        <circle className="lab-bubble" cx="74" cy="130" r="3.4" fill="rgba(255,255,255,.85)" style={bub("2.1s", "1.5s", "-26px")} />
        <circle className="lab-bubble" cx="56" cy="128" r="1.8" fill="rgba(255,255,255,.75)" style={bub("3.3s", ".4s", "-24px")} />
      </g>
      <path
        d="M52 8 L52 52 L23 127 Q18 141 32 141 L92 141 Q106 141 101 127 L72 52 L72 8 Z"
        fill="rgba(255,255,255,.45)"
        stroke="var(--ink)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <line x1="46" y1="8" x2="78" y2="8" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="88" y1="112" x2="96" y2="112" stroke="var(--ink)" strokeWidth="2" opacity=".4" />
      <line x1="84" y1="100" x2="92" y2="100" stroke="var(--ink)" strokeWidth="2" opacity=".4" />
      <path d="M36 116 Q33 124 38 131" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".8" />
    </svg>
  );
}

/* ── Vessel 2: round-bottom flask on a stand, over a blue flame ── */
function Boiler({ liq }: { liq: string }) {
  return (
    <svg viewBox="0 0 120 168" aria-hidden style={{ "--liq": liq } as CSSProperties}>
      <defs>
        <clipPath id="lab-boiler-clip">
          <circle cx="60" cy="78" r="32" />
        </clipPath>
      </defs>
      <path d="M26 158 L60 52 M94 158 L60 52" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" opacity=".85" />
      <g clipPath="url(#lab-boiler-clip)">
        <path className="lab-liq" d="M22 76 Q36 70 50 76 T78 76 T106 76 V115 H18 Z" fill="var(--liq)" />
        <circle className="lab-bubble" cx="52" cy="100" r="2.6" fill="rgba(255,255,255,.85)" style={bub("2s", ".2s", "-22px")} />
        <circle className="lab-bubble" cx="66" cy="103" r="3.2" fill="rgba(255,255,255,.8)" style={bub("2.5s", "1.1s", "-24px")} />
        <circle className="lab-bubble" cx="60" cy="98" r="1.9" fill="rgba(255,255,255,.75)" style={bub("1.7s", ".6s", "-18px")} />
      </g>
      <circle cx="60" cy="78" r="32" fill="rgba(255,255,255,.45)" stroke="var(--ink)" strokeWidth="3.5" />
      <path d="M52 12 L52 50 M68 12 L68 50" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="46" y1="12" x2="74" y2="12" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M40 66 Q36 76 40 86" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      <g className="lab-flame">
        <path d="M60 152 C50 144 52 132 60 118 C68 132 70 144 60 152 Z" fill="var(--flash)" />
        <path d="M60 150 C55 145 56 138 60 130 C64 138 65 145 60 150 Z" fill="#fff" opacity=".85" />
      </g>
      <rect x="42" y="152" width="36" height="7" rx="2.5" fill="var(--ink)" />
    </svg>
  );
}

/* ── Vessel 3: test-tube rack (side quests) ── */
function Tubes({ liq }: { liq: string }) {
  const tube = (x: number, fillH: number, bubbles: boolean) => (
    <g>
      <path
        d={`M${x} ${112 - fillH} V112 a9 9 0 0 0 18 0 V${112 - fillH} Z`}
        fill="var(--liq)"
        opacity=".92"
      />
      {bubbles && (
        <>
          <circle className="lab-bubble" cx={x + 9} cy="108" r="2.2" fill="rgba(255,255,255,.85)" style={bub("2.2s", ".3s", "-20px")} />
          <circle className="lab-bubble" cx={x + 12} cy="104" r="1.6" fill="rgba(255,255,255,.75)" style={bub("2.8s", "1.2s", "-16px")} />
        </>
      )}
      <path
        d={`M${x} 34 V112 a9 9 0 0 0 18 0 V34`}
        fill="rgba(255,255,255,.45)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line x1={x - 3} y1="34" x2={x + 21} y2="34" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
  return (
    <svg viewBox="0 0 140 152" aria-hidden style={{ "--liq": liq } as CSSProperties}>
      {tube(25, 42, false)}
      {tube(61, 64, true)}
      {tube(97, 28, false)}
      <rect x="12" y="58" width="116" height="9" rx="3" fill="var(--beige)" stroke="var(--ink)" strokeWidth="2.5" />
      <path d="M20 67 L20 144 M120 67 L120 144" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M10 144 L30 144 M110 144 L130 144" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ── A stirable vessel: click → glug wobble + sticker burst + new liquid ── */
function Vessel({
  label,
  tape,
  steam,
  reduce,
  onStir,
  children,
}: {
  label: string;
  tape: string;
  steam?: boolean;
  reduce: boolean;
  onStir?: () => void;
  children: (liq: string) => React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [liqIdx, setLiqIdx] = useState(0);
  const glugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stir = () => {
    setLiqIdx((i) => (i + 1) % LIQUIDS.length);
    onStir?.();
    const el = ref.current;
    if (!el || reduce) return;

    el.classList.remove("is-glug");
    void el.offsetWidth;
    el.classList.add("is-glug");
    if (glugTimer.current) clearTimeout(glugTimer.current);
    glugTimer.current = setTimeout(() => el.classList.remove("is-glug"), 550);

    for (let i = 0; i < 8; i++) {
      const bit = document.createElement("span");
      bit.className = "lab-bit";
      bit.innerHTML = BURST_SVGS[(Math.random() * BURST_SVGS.length) | 0];
      const s = 9 + Math.random() * 12;
      bit.style.width = bit.style.height = `${s}px`;
      el.appendChild(bit);
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
      const dist = 46 + Math.random() * 74;
      bit
        .animate(
          [
            { transform: "translate(-50%, -50%) rotate(0deg)", opacity: 1 },
            {
              transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist}px)) rotate(${(Math.random() - 0.5) * 480}deg)`,
              opacity: 0,
            },
          ],
          { duration: 650 + Math.random() * 450, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        )
        .finished.then(() => bit.remove());
    }
  };

  useEffect(() => {
    return () => {
      if (glugTimer.current) clearTimeout(glugTimer.current);
    };
  }, []);

  return (
    <button ref={ref} type="button" className="lab-vessel" data-hover onClick={stir} aria-label={label}>
      {steam && (
        <span className="lab-steam" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      )}
      {children(LIQUIDS[liqIdx])}
      <span className="lab-tape" aria-hidden>{tape}</span>
    </button>
  );
}

/* Split-word helper for the choreographed headline */
function W({ children }: { children: React.ReactNode }) {
  return (
    <span className="lab-lw">
      <span className="lab-lwi">{children}</span>
    </span>
  );
}

export default function LabPage() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const [tick, setTick] = useState(0);
  const [pct, setPct] = useState<number | null>(null);
  const [stirs, setStirs] = useState(0);
  const found = useSyncExternalStore(subscribeHunt, getFoundSnapshot, getFoundServerSnapshot);
  const labFound = found.includes("lab");
  const animRan = useRef(false);

  useEffect(() => {
    // deferred so the date-derived value never runs during SSR/hydration
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

  /* Entrance choreography + cursor parallax + magnetic CTA (GSAP) */
  useEffect(() => {
    if (reduce || animRan.current || !rootRef.current) return;
    animRan.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".lab-eyebrow", { y: 14, opacity: 0, duration: 0.5 })
        .from(".lab-lwi", { yPercent: 115, duration: 0.8, stagger: 0.07, ease: "expo.out" }, "-=0.25")
        .fromTo(".lab-scr path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" }, "-=0.3")
        .from(".lab-sub", { y: 16, opacity: 0, duration: 0.5 }, "-=0.35")
        .from(".lab-vessel", { y: -60, opacity: 0, stagger: 0.12, duration: 0.7, ease: "back.out(1.7)" }, "-=0.25")
        .from(".lab-tape", { scale: 1.7, opacity: 0, rotate: 10, stagger: 0.09, duration: 0.4, ease: "back.out(2.2)" }, "-=0.35")
        .from(".lab-stamp", { scale: 2.3, opacity: 0, rotate: -22, duration: 0.4, ease: "power4.in" }, "-=0.05")
        .to(".lab-benchwrap", { x: 4, duration: 0.05, yoyo: true, repeat: 3, ease: "none" })
        .from([".lab-status", ".lab-brew", ".lab-ctas"], { y: 18, opacity: 0, stagger: 0.1, duration: 0.5 }, "-=0.05");

      if (window.matchMedia("(pointer: fine)").matches) {
        // ambient parallax: bench drifts with the cursor, stamp counter-drifts
        const benchX = gsap.quickTo(".lab-bench", "x", { duration: 0.7, ease: "power3.out" });
        const benchY = gsap.quickTo(".lab-bench", "y", { duration: 0.7, ease: "power3.out" });
        const stampX = gsap.quickTo(".lab-stamp", "x", { duration: 0.9, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          benchX(nx * 14);
          benchY(ny * 8);
          stampX(nx * -18);
        };
        window.addEventListener("mousemove", onMove);

        // magnetic CTA (clamped pull, elastic return)
        const cta = rootRef.current!.querySelector<HTMLElement>(".lab-cta");
        if (cta) {
          const xTo = gsap.quickTo(cta, "x", { duration: 0.4, ease: "elastic.out(1,0.4)" });
          const yTo = gsap.quickTo(cta, "y", { duration: 0.4, ease: "elastic.out(1,0.4)" });
          const pull = (e: MouseEvent) => {
            const r = cta.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * 0.3);
            yTo((e.clientY - r.top - r.height / 2) * 0.3);
          };
          const release = () => {
            xTo(0);
            yTo(0);
          };
          cta.addEventListener("mousemove", pull);
          cta.addEventListener("mouseleave", release);
        }

        return () => window.removeEventListener("mousemove", onMove);
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reduce]);

  const onStir = useCallback(() => setStirs((s) => s + 1), []);

  const CELLS = 12;
  const filled = pct === null ? 0 : Math.round((pct / 100) * CELLS);

  // status line: tease while the hidden sticker brews, lore ticker otherwise
  const teasing = !labFound && stirs > 0 && stirs < 3;
  const surfaced = !labFound && stirs >= 3;
  const statusText = teasing
    ? TEASE[Math.min(stirs, 2)]
    : surfaced
      ? "!! take it before it dissolves"
      : TICKER[tick];

  return (
    <main className="lab-page" ref={rootRef}>
      <p className="lab-eyebrow">The Lab — vibe-coded side quests</p>
      <h1 className="lab-title">
        <W>Cookin’</W> <W>something</W> <br />
        <W>for</W> <W>the</W>{" "}
        <W>
          <em className="lab-lore">
            lore
            <svg className="lab-scr" viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden>
              <path d="M4 15 C 38 6 70 20 104 12 C 138 5 168 19 196 12" pathLength={1} />
            </svg>
          </em>
          .
        </W>
      </h1>
      <p className="lab-sub">
        This shelf is reserved for the unhinged, over-engineered projects I
        build purely for fun. Batch №001 is on the burner — check back before
        it boils over.
      </p>

      <div className="lab-benchwrap">
        <div className="lab-stamp" aria-hidden>
          <span>first batch</span>
          <strong>coming soon</strong>
          <span>eta · when it’s fun</span>
        </div>

        {surfaced && <HuntSticker id="lab" className="hunt-spot-lab" />}

        <div className="lab-bench">
          <Vessel label="Stir the flask — cycles the brew" tape="BATCH №001 · DO NOT RUSH" steam reduce={reduce} onStir={onStir}>
            {(liq) => <Erlenmeyer liq={liq} />}
          </Vessel>
          <Vessel label="Stir the boiling flask — cycles the brew" tape="VIBE CATALYST" steam reduce={reduce} onStir={onStir}>
            {(liq) => <Boiler liq={liq} />}
          </Vessel>
          <Vessel label="Stir the test tubes — cycles the brew" tape="SIDE QUESTS ×3" reduce={reduce} onStir={onStir}>
            {(liq) => <Tubes liq={liq} />}
          </Vessel>
        </div>
      </div>

      <div className="lab-status">
        <span className="ping" aria-hidden />
        <span className="lab-status-k">status:</span>
        <span key={statusText} className="lab-tick" aria-live="polite">
          {statusText}
        </span>
      </div>

      <div className="lab-brew" role="img" aria-label={pct === null ? "Brew progress loading" : `Brew progress ${pct} percent — refuses to be rushed`}>
        <span className="lab-brew-k" aria-hidden>brewing</span>
        <span className="lab-cells" aria-hidden>
          {Array.from({ length: CELLS }, (_, i) => (
            <span key={i} className={`lab-cell ${i < filled ? "on" : ""} ${i === filled - 1 ? "head" : ""}`} />
          ))}
        </span>
        <span className="lab-brew-v" aria-hidden>{pct === null ? "…" : `${pct}%`}</span>
      </div>

      <div className="lab-ctas">
        <Link href="/contact" className="lab-cta" data-hover>
          get pinged when it drops
        </Link>
        <Link href="/works" className="lab-alt" data-hover>
          meanwhile, the shipped stuff →
        </Link>
      </div>
    </main>
  );
}
