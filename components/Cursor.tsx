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

    const grow = () => cur.classList.add("grow");
    const shrink = () => cur.classList.remove("grow");
    const hovers = Array.from(document.querySelectorAll<HTMLElement>("[data-hover]"));
    hovers.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      hovers.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return <div ref={curRef} aria-hidden className="cursor" />;
}
