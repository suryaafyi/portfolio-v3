"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSitePet, type PetSpawn } from "./useSitePet";

const HATCH_KEY = "sitepet:hatched";

/**
 * Batch №000 — the blob that escaped the Lab and now lives on the site.
 * It doesn't exist until the visitor's first trip to /lab: there it hatches
 * out of the erlenmeyer flask (origin story), and from then on it roams
 * every page. Walks the bottom edge, perches on ledges (including the
 * dock), answers pokes, gets dizzy when shaken, naps when ignored, and
 * earns a party hat when the sticker hunt is completed. Purely decorative
 * → aria-hidden.
 */
function PetBody({ spawn, hatch }: { spawn: PetSpawn | null; hatch: boolean }) {
  const { petRef } = useSitePet(spawn, hatch);

  return (
    <div ref={petRef} data-site-pet aria-hidden="true" className="site-pet">
      <div className="site-pet__bubble" data-pet-bubble aria-hidden="true"></div>
      <div className="site-pet__emotes" data-pet-emotes aria-hidden="true"></div>
      <button type="button" data-pet-hit data-hover className="site-pet__hit" aria-label="The site pet — a small escaped lab blob. Poke gently." tabIndex={-1}>
        <span className="site-pet__bob">
          <span className="site-pet__squish">
            <svg width="44" height="56" viewBox="0 0 44 56" className="site-pet__svg" fill="none">
              {/* contact shadow */}
              <ellipse className="site-pet__shadow" cx="22" cy="53.5" rx="14" ry="1.8" fill="#1c2533" opacity="0.16" />

              {/* droplet antenna — a drip of the brew, wobbles as it walks */}
              <g className="site-pet__drop">
                <path d="M22 8 C21.7 5.6 22.3 4.4 23.2 3.2" stroke="#4a6fa5" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="23.6" cy="2.6" r="2.5" fill="#4a6fa5" />
                <circle cx="24.4" cy="1.9" r="0.7" fill="#F0EDE5" opacity="0.7" />
              </g>

              {/* gooey body */}
              <path
                d="M22 7 C33 7 39.5 15 39.5 26.5 C39.5 37.5 35 44 22 44 C9 44 4.5 37.5 4.5 26.5 C4.5 15 11 7 22 7 Z"
                fill="#4a6fa5"
              />
              {/* gloss */}
              <ellipse cx="13.5" cy="14.5" rx="4.2" ry="6" fill="#ffffff" opacity="0.2" transform="rotate(-24 13.5 14.5)" />

              {/* face — the site smiley, alive */}
              <g className="site-pet__eyes">
                <circle className="site-pet__eye" cx="15" cy="25" r="3" fill="#F0EDE5" />
                <circle className="site-pet__eye" cx="29" cy="25" r="3" fill="#F0EDE5" />
              </g>
              <path className="site-pet__mouth" d="M16.5 32 Q22 37.5 27.5 32" stroke="#F0EDE5" strokeWidth="2.6" strokeLinecap="round" fill="none" />
              <circle cx="10.2" cy="30" r="2" fill="#b8c5d6" opacity="0.55" />
              <circle cx="33.8" cy="30" r="2" fill="#b8c5d6" opacity="0.55" />

              {/* stubby goo feet */}
              <rect className="site-pet__leg site-pet__leg--left" x="11" y="42" width="7.5" height="10" rx="3.5" fill="#3d5c8a" />
              <rect className="site-pet__leg site-pet__leg--right" x="25.5" y="42" width="7.5" height="10" rx="3.5" fill="#3d5c8a" />

              {/* party hat — earned by completing the sticker hunt */}
              <g className="pet-hat" data-hat-variant="party">
                <polygon points="22,-9 14.5,5.5 29.5,5.5" fill="#3147e8" />
                <path d="M17.5 -0.5 L26 1.5" stroke="#F0EDE5" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
                <circle cx="22" cy="-9" r="2.4" fill="#F0EDE5" />
              </g>
            </svg>
          </span>
        </span>
      </button>
    </div>
  );
}

export default function SitePet() {
  const pathname = usePathname();
  // unknown → dormant (never hatched) → alive; hatching happens on /lab
  const [mode, setMode] = useState<"unknown" | "dormant" | "alive">("unknown");
  const [spawn, setSpawn] = useState<PetSpawn | null>(null);
  const [hatch, setHatch] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setMode(localStorage.getItem(HATCH_KEY) === "1" ? "alive" : "dormant");
      } catch {
        setMode("alive");
      }
    });
  }, []);

  useEffect(() => {
    if (mode !== "dormant" || !pathname.startsWith("/lab")) return;
    // let the bench entrance choreography land, then hatch from the flask
    const t = setTimeout(() => {
      const flask = document.querySelector(".lab-vessel");
      if (flask) {
        const r = flask.getBoundingClientRect();
        setSpawn({
          x: r.left + r.width / 2 - 22,
          alt: Math.max(0, window.innerHeight - r.top - 40),
        });
      }
      try {
        localStorage.setItem(HATCH_KEY, "1");
      } catch {}
      setHatch(true);
      setMode("alive");
    }, 3400);
    return () => clearTimeout(t);
  }, [mode, pathname]);

  if (mode !== "alive" || pathname === "/about/scrapbook") return null;
  return <PetBody spawn={spawn} hatch={hatch} />;
}
