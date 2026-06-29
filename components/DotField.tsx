"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive dot-grid canvas background. The grid distorts away from the
 * pointer (with lag, for a liquid feel) over a gentle ambient wave.
 * Constants preserved verbatim from the prototype.
 */
export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduce = mq.matches;

    const SPACING = 38;
    const R = 220;
    const PUSH = 24;
    const BASE_R = 1.3;
    const BASE_A = 0.14;
    const HOT_A = 0.85;
    const baseCol = [28, 37, 51];
    const hotCol = [74, 111, 165];

    let w = 0;
    let h = 0;
    let pts: { ox: number; oy: number }[] = [];
    let mX = -1000;
    let mY = -1000;
    let lX = -1000;
    let lY = -1000;
    let raf = 0;
    const t0 = performance.now();

    function build() {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;
      const offX = (w - (cols - 1) * SPACING) / 2;
      const offY = (h - (rows - 1) * SPACING) / 2;
      pts = [];
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          pts.push({ ox: offX + i * SPACING, oy: offY + j * SPACING });
        }
      }
    }

    function paint(now: number) {
      ctx!.clearRect(0, 0, w, h);
      lX += (mX - lX) * 0.1;
      lY += (mY - lY) * 0.1;
      const time = now - t0;
      for (const p of pts) {
        let x = p.ox;
        let y = p.oy;
        if (!reduce) {
          x += Math.sin(time * 0.0008 + p.oy * 0.012) * 1.6;
          y += Math.cos(time * 0.0008 + p.ox * 0.012) * 1.6;
        }
        let r = BASE_R;
        let a = BASE_A;
        let cr = baseCol[0];
        let cg = baseCol[1];
        let cb = baseCol[2];
        if (!reduce) {
          const dx = x - lX;
          const dy = y - lY;
          const dist = Math.hypot(dx, dy);
          if (dist < R) {
            const f = (1 - dist / R) ** 2;
            const ang = Math.atan2(dy, dx);
            x += Math.cos(ang) * f * PUSH;
            y += Math.sin(ang) * f * PUSH;
            r = BASE_R + f * 1.8;
            a = BASE_A + f * (HOT_A - BASE_A);
            cr = baseCol[0] + (hotCol[0] - baseCol[0]) * f;
            cg = baseCol[1] + (hotCol[1] - baseCol[1]) * f;
            cb = baseCol[2] + (hotCol[2] - baseCol[2]) * f;
          }
        }
        ctx!.beginPath();
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${a})`;
        ctx!.fill();
      }
    }

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      paint(now);
    }

    const onMove = (e: MouseEvent) => {
      mX = e.clientX;
      mY = e.clientY;
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        mX = -1000;
        mY = -1000;
      }
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mX = e.touches[0].clientX;
        mY = e.touches[0].clientY;
      }
    };
    const onResize = () => {
      build();
      if (reduce) paint(performance.now());
    };
    const onReduceChange = () => {
      reduce = mq.matches;
      if (reduce) {
        cancelAnimationFrame(raf);
        raf = 0;
        build();
        paint(performance.now());
      } else if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    };

    build();
    if (reduce) {
      paint(performance.now());
    } else {
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onOut);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", onReduceChange);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onReduceChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="fixed inset-0 z-0 pointer-events-none" />;
}
