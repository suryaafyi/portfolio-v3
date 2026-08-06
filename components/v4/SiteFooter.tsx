"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Shared site footer (home + the Works list view): social row, the
 * cursor-spotlight headline, reply CTA and the copyright line.
 *
 * It also owns its own dark zone — the page bg scrub-tweens cream→ink as the
 * footer comes in (same logic as the home wheel) and the fixed chrome inverts
 * via `.v4-dark`. The bg tween MUST stay a `fromTo` with an explicit cream
 * `from`: a plain `.to()` captures its start at first render (which can be a
 * *different* section's ink) and, because this trigger sits lowest on the
 * page, that stale value then wins at progress 0 and strands the cream
 * sections above on black.
 */

const SOCIALS = [
  { label: "IG", href: "https://www.instagram.com/surya.fyi/" },
  { label: "X", href: "https://x.com/suryaafyi" },
  { label: "LK", href: "https://www.linkedin.com/in/surya-ux/" },
  { label: "BE", href: "https://www.behance.net/suryaa-fyi" },
];

/** Per-route footer copy — every page signs off differently, like the
 *  reference (home "…pay for itself!", works "…unlock the door…"). */
const COPY: Record<string, { headline: string; cta: string }> = {
  "/": { headline: "Make every pixel earn its keep.", cta: "Replies within 24h" },
  "/works": { headline: "Let's unlock the door to your success", cta: "Get your quote in 24h" },
  "/about": { headline: "Now you know me. Let's build something.", cta: "Say hi — I reply fast" },
  "/lab": { headline: "There's always something brewing in here.", cta: "Peek at the next batch" },
  "/guestbook": { headline: "Leave your mark. Make it weird.", cta: "Sign the guestbook" },
  "/contact": { headline: "Your idea deserves more than a maybe.", cta: "Replies within 24h" },
};
const FALLBACK = COPY["/"];

export default function SiteFooter() {
  const pathname = usePathname();
  const copy =
    COPY[pathname] ??
    (pathname.startsWith("/works/")
      ? { headline: "Like what you see? Let's talk.", cta: "Start a project" }
      : FALLBACK);
  const footerRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);

  /* headline spotlight — the orange copy is revealed by a radial mask that
     follows the cursor ANYWHERE in the footer (listener on the whole section,
     coords relative to the headline). Opacity is plain CSS :hover. */
  useEffect(() => {
    const footer = footerRef.current;
    const head = headRef.current;
    if (!footer || !head) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = head.getBoundingClientRect();
      head.style.setProperty("--mx", `${e.clientX - r.left}px`);
      head.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    footer.addEventListener("pointermove", move);
    return () => footer.removeEventListener("pointermove", move);
  }, []);

  /* page bg dips cream→ink as the footer arrives; chrome inverts with it */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const footer = footerRef.current;
    if (!footer) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        document.body,
        { backgroundColor: "#fbf9ef" },
        {
          backgroundColor: "#171412",
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: footer,
            start: "top 85%",
            end: "top 30%",
            scrub: 0.4,
          },
        }
      );
      ScrollTrigger.create({
        trigger: footer,
        start: "top 40%",
        end: "bottom top",
        onToggle: (self) =>
          document.body.classList.toggle("v4-dark", self.isActive),
      });
    });
    return () => {
      ctx.revert();
      document.body.classList.remove("v4-dark");
      // leaving the page (e.g. spiral view) must not keep the canvas dark
      gsap.set(document.body, { backgroundColor: "#fbf9ef" });
    };
  }, []);

  return (
    <footer className="v4-footer" ref={footerRef}>
      <div className="v4-footer-main">
        <div className="v4-footer-social" aria-label="Social">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="v4-fsocial"
              data-cursor={s.label}
            >
              {s.label}
            </a>
          ))}
        </div>

        <h2 className="v4-footer-headline" ref={headRef} key={copy.headline}>
          <span className="v4-fh-base">{copy.headline}</span>
          <span className="v4-fh-glow" aria-hidden>
            {copy.headline}
          </span>
        </h2>

        <Link href="/contact" className="v4-footer-cta">
          <span>{copy.cta}</span>
          <i>
            <svg viewBox="0 0 24 24">
              <path d="M6.6 3.6c.6-.2 1.24.05 1.56.6l1.5 2.6c.3.5.24 1.14-.15 1.58l-1.1 1.25a12.4 12.4 0 0 0 5.4 5.4l1.24-1.1c.44-.4 1.08-.45 1.59-.16l2.6 1.5c.55.32.8.97.6 1.57l-.66 1.95a1.6 1.6 0 0 1-1.7 1.08C10.4 19.9 4.1 13.6 3.16 6.5a1.6 1.6 0 0 1 1.08-1.7l2.36-.8Z" />
            </svg>
          </i>
        </Link>
      </div>

      <div className="v4-footer-row">
        <span>©2026 Surya</span>
      </div>
    </footer>
  );
}
