"use client";

import { useRef, type ReactNode } from "react";

/**
 * Pointer-driven 3D tilt for the wall passes. The card leans toward the cursor
 * on a perspective plane and a soft sheen tracks the pointer, so a flat pass
 * reads as a physical, held object. All motion is written straight to the DOM
 * (no React state) so a wall of 80 cards stays cheap, and it no-ops under
 * reduced-motion or coarse (touch) pointers.
 */
export default function TiltCard({
  children,
  className = "",
  max = 12,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);

  const allow = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !allow()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height;
    const ry = (px - 0.5) * 2 * max; // rotateY
    const rx = -(py - 0.5) * 2 * max; // rotateX
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    });
  };

  const onEnter = () => {
    if (ref.current && allow()) ref.current.classList.add("is-tilting");
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    el.classList.remove("is-tilting");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      className={`tilt3d ${className}`}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <div className="tilt3d-inner">
        {children}
        <span className="tilt3d-glare" aria-hidden />
      </div>
    </div>
  );
}
