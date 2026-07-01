"use client";

import { useEffect, useRef } from "react";

/**
 * Lerped follower ring. Grows over any [data-hover] element. On touch / coarse
 * pointers it hides itself and restores the native cursor.
 */
export default function Cursor() {
  const curRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = curRef.current;
    if (!cur) return;

    if (window.matchMedia("(pointer: coarse)").matches) {
      cur.style.display = "none";
      document.body.style.cursor = "auto";
      return;
    }

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx;
    let ty = cy;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    function loop() {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      cur!.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    }

    // Delegated so it works for elements mounted after this effect runs
    // (e.g. the spiral cards / list rows that toggle in and out on /works).
    const hovered = (node: EventTarget | null) =>
      node instanceof Element ? node.closest("[data-hover]") : null;
    const onOver = (e: MouseEvent) => {
      if (hovered(e.target)) cur.classList.add("grow");
    };
    const onOut = (e: MouseEvent) => {
      const from = hovered(e.target);
      if (from && hovered(e.relatedTarget) !== from) cur.classList.remove("grow");
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return <div ref={curRef} aria-hidden className="cursor" />;
}
