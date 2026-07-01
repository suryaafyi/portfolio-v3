"use client";

import { createContext, useCallback, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Cursor from "@/components/Cursor";

type FlashNav = { go: (href: string) => void };
const FlashNavContext = createContext<FlashNav>({ go: () => {} });
export const useFlashNav = () => useContext(FlashNavContext);

/**
 * Wraps the whole /works route group (mounted in app/works/layout.tsx, so it
 * persists across spiral ↔ detail navigation). Provides the vivid-blue grain
 * "flash" transition: cover the screen, push the route at the peak, then lift.
 * Also hosts the shared custom cursor so it survives navigations.
 */
export default function WorksTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const curtain = useRef<HTMLDivElement>(null);
  const square = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (href: string) => {
      const el = curtain.current;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !el) {
        router.push(href);
        return;
      }
      gsap.killTweensOf([el, square.current]);
      gsap.set(el, { display: "block", pointerEvents: "auto", opacity: 0, scale: 1.04 });
      gsap.fromTo(
        square.current,
        { scale: 0.5, opacity: 0.15 },
        { scale: 1, opacity: 0.9, duration: 0.3, ease: "power1.inOut", yoyo: true, repeat: 1 }
      );
      gsap
        .timeline()
        .to(el, { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" })
        .add(() => router.push(href))
        .to(el, { opacity: 0, duration: 0.4, ease: "power2.in", delay: 0.06 })
        .set(el, { display: "none", pointerEvents: "none" });
    },
    [router]
  );

  return (
    <FlashNavContext.Provider value={{ go }}>
      {children}
      <div ref={curtain} className="flash-curtain" aria-hidden>
        <div className="flash-grain" />
        <div ref={square} className="flash-square" />
      </div>
      <Cursor />
    </FlashNavContext.Provider>
  );
}
