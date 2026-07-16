"use client";

import { useEffect, useRef } from "react";

/**
 * Per-word liquid smear. Words inside are wrapped in `.liq-w` spans (see
 * <Words/>); hovering a word applies the shared displacement filter to that
 * word only — the smear follows the cursor from word to word. The scale ramps
 * up on enter and self-stops after easing back to zero, so idle text is crisp
 * and no rAF runs when nothing is hovered.
 */
export default function LiquidText({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const turb = turbRef.current;
    const disp = dispRef.current;
    if (!wrap || !turb || !disp) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let dS = 0;
    let dT = 0;
    let ph = 0;
    let raf = 0;
    let cur: Element | null = null; // the word currently being smeared

    function liq() {
      dS += (dT - dS) * 0.12;
      ph += 0.012;
      const bf = 0.009 + Math.sin(ph) * 0.004;
      turb!.setAttribute("baseFrequency", bf.toFixed(4) + " " + (bf * 1.5).toFixed(4));
      disp!.setAttribute("scale", dS.toFixed(2));
      if (dS > 0.06 || dT > 0) {
        raf = requestAnimationFrame(liq);
      } else {
        disp!.setAttribute("scale", "0");
        cur?.classList.remove("distort");
        cur = null;
        raf = 0;
      }
    }

    const wordOf = (t: EventTarget | null) =>
      t instanceof Element ? t.closest(".liq-w") : null;

    const onOver = (e: MouseEvent) => {
      const w = wordOf(e.target);
      if (!w || w === cur) return;
      cur?.classList.remove("distort");
      cur = w;
      w.classList.add("distort");
      dT = 14;
      if (!raf) liq();
    };

    const onOut = (e: MouseEvent) => {
      const w = wordOf(e.target);
      if (!w || w !== cur) return;
      // still inside the same word (e.g. entering the scribble em)? keep going
      if (wordOf(e.relatedTarget) === w) return;
      dT = 0;
      if (!raf) liq();
    };

    wrap.addEventListener("mouseover", onOver);
    wrap.addEventListener("mouseout", onOut);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("mouseover", onOver);
      wrap.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      <svg aria-hidden focusable={false} style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="liquid" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.009 0.013"
              numOctaves={2}
              seed={3}
              result="n"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="n"
              scale={0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div ref={wrapRef} className="heroText">
        {children}
      </div>
    </>
  );
}

/** Splits plain text into hoverable `.liq-w` word spans. */
export function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          {i > 0 ? " " : ""}
          <span className="liq-w">{w}</span>
        </span>
      ))}
    </>
  );
}
