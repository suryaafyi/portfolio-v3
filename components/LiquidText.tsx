"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps the hero text and applies an SVG displacement filter ONLY while hovered.
 * The displacement scale ramps up on enter and self-stops after ramping back to
 * zero on leave, so idle text is crisp and no rAF runs when not hovering.
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
        wrap!.classList.remove("distort");
        raf = 0;
      }
    }

    const onEnter = () => {
      wrap!.classList.add("distort");
      dT = 14;
      if (!raf) liq();
    };
    const onLeave = () => {
      dT = 0;
      if (!raf) liq();
    };

    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
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
