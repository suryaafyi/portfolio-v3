"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { HUNT_STICKERS, getFound, isComplete } from "@/lib/hunt";

export type PetSpawn = { x: number; alt: number };

/**
 * The site pet — a gooey blob that escaped from the Lab ("Batch №000").
 * Ported from the old portfolio's pet engine and upgraded: blob squash &
 * stretch, splat landings, goo drips, sleep mode, sticker-hunt awareness,
 * and ledges tuned to this site (dock, postcard, wall cards, lab bench…).
 * `spawn`/`hatch` position the very first appearance: bursting out of the
 * Lab's erlenmeyer flask.
 */
export const useSitePet = (spawn?: PetSpawn | null, hatch?: boolean) => {
  const petRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // first-render options only — the engine effect runs once on mount
  const spawnRef = useRef(spawn);
  const hatchRef = useRef(hatch);

  useEffect(() => {
    // Invalidate ledge cache on route change
    window.dispatchEvent(new CustomEvent("site-pet-invalidate-ledges"));
  }, [pathname]);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    function el(): HTMLElement | null {
      return petRef.current;
    }

    const PET_W = 44;
    const PET_H = 56;
    const SPEED = 34; // px / sec

    /* ── quips ── */
    const BUMP_PHRASES = ["ow!", "oof", "ouch!", "bonk", "hey!"];
    const CLICK_PHRASES_MILD = ["heya!", "hi there", "sup", "blub", "oh hi"];
    const CLICK_PHRASES_MEH = ["still here", "again?", "hi again", "yes?"];
    const CLICK_PHRASES_ANNOYED = [
      "why do you keep\npoking me?",
      "stop that",
      "okay okay",
      "quit it",
      "i'm 92% liquid\nyou know",
    ];
    const CLICK_PHRASES_DONE = ["rude.", "really?", "ow.", "i'm not a button", "stop!"];

    function clickPool(count: number): string[] {
      if (count <= 2) return CLICK_PHRASES_MILD;
      if (count <= 4) return CLICK_PHRASES_MEH;
      if (count <= 7) return CLICK_PHRASES_ANNOYED;
      return CLICK_PHRASES_DONE;
    }

    let globalPokes = 0;
    let pokeQuipUsed = false;
    try {
      globalPokes = parseInt(localStorage.getItem("sitepet:pokes") ?? "0", 10);
    } catch {}

    const HOVER_PHRASES = ["what's up?", "hi!", "oh hey", "howdy", "blub blub", "hello"];
    const DRAG_PHRASES = [
      "where are you\ntaking me?",
      "put me down!",
      "wheeee",
      "careful, i'm goo",
      "oh no",
    ];
    const DROP_PHRASES = ["phew", "back to it", "thanks i guess", "*wobbles*"];
    const DIZZY_PHRASES = ["whoaa....", "ugh.", "...stars", "brain sloshing"];
    const SPLAT_PHRASES = ["splat.", "i'm okay!", "*re-forms*", "goo everywhere"];
    const WAKE_PHRASES = ["!! oh hi", "i wasn't sleeping", "five more minutes", "*yawn* hm?"];
    const IDLE_PHRASES = [
      "hi there",
      "just oozing around",
      "dum de dum",
      "anyone there?",
      "blub",
      "psst",
      "i escaped batch №000",
      "surya thinks i'm\nstill in the flask",
      "try dropping me\non something!",
      "i bet i could stand\non that dock...",
    ];
    const WORKS_PHRASES = [
      "ooh the spiral",
      "drag it! spin it!",
      "surya made these??",
      "i get dizzy just\nlooking at it",
      "so many projects",
    ];
    const CASE_STUDY_PHRASES = [
      "ooh interesting",
      "i'm learning things",
      "tell me more",
      "fascinating",
      "i love this project",
      "surya worked hard\non this one",
    ];
    const CASE_STUDY_PAGE_PHRASES: Record<string, string[]> = {
      "/works/shift": ["career transitions\nare tough huh", "i could use this app"],
      "/works/knot": ["family memories!\nsweet", "knot. i get it. clever."],
      "/works/zendo": ["very zen in here", "i feel calmer already"],
    };
    const ABOUT_PHRASES = [
      "an engineer AND designer??\nwild",
      "the scrapbook is cute",
      "drag that slider thing",
      "figma at 2am again",
      "i'm in the timeline\n(i'm not)",
    ];
    const LAB_PHRASES = [
      "i was born here!!",
      "don't bottle me again",
      "the brew smells... alive",
      "batch №001 is my sibling",
      "stir the flasks!\ntrust me",
      "70%?? it said 70%\nlast week too",
    ];
    const CONTACT_PHRASES = [
      "write him a letter!",
      "i licked the stamp",
      "par avion!!",
      "mail me somewhere nice",
      "he really does\nreply fast",
    ];
    const GUESTBOOK_PHRASES = [
      "pin a card!! pin one!!",
      "i'd doodle a self portrait",
      "the wall is my\nfavorite place",
      "everyone seems nice",
      "put ME on your card",
    ];
    const HUNT_HINT_PHRASES = [
      "psst... stickers are\nhiding around here",
      "shiny things are\ncollectible, fyi",
      "did you check the\nflasks? just saying",
      "the pocket down there\nisn't decorative",
    ];
    const HUNT_DONE_PHRASES = [
      "certified lore\narchaeologist!",
      "you found them ALL",
      "the hat? earned it.",
      "5/5. legend.",
    ];
    const LEDGE_LAND_PHRASES = [
      "nice view up here",
      "i can see everything!",
      "ooh a perch",
      "cozy spot",
      "i live here now",
      "higher ground!",
      "king of the hill",
      "don't look down",
    ];
    const LEDGE_IDLE_PHRASES = [
      "kinda high up huh",
      "wonder what's below",
      "living on the edge",
      "i'm supervising",
      "overseeing operations",
      "this is my domain now",
      "surya can't reach me\nup here",
      "contemplating existence",
    ];

    /* perch context tuned to this portfolio */
    const PERCH_CONTEXT: { match: string; phrases: string[] }[] = [
      {
        match: ".pill",
        phrases: [
          "i'm the navigation now",
          "which page next?",
          "dock life",
          "beep boop, menu duty",
          "surya's face is\nright there lol",
        ],
      },
      {
        match: ".postcard",
        phrases: ["special delivery!", "par avion!", "i count as postage", "stamp me and\nsend me"],
      },
      {
        match: ".gb-pin",
        phrases: ["nice card, visitor", "i'll guard this one", "great doodle tbh", "wall duty"],
      },
      {
        match: ".lab-bench",
        phrases: [
          "home sweet bench",
          "i came from one\nof these!!",
          "still brewing down there",
          "don't tell the flask\ni'm up here",
        ],
      },
      {
        match: ".work-card, .cs-card, .cs-persona, .detail-hero",
        phrases: [
          "this one looks cool",
          "i'm guarding this one",
          "click it! click it!",
          "i helped (i didn't)",
        ],
      },
      {
        match: ".sbk-book",
        phrases: ["scrapbook!! memories!", "open it open it", "i'm on page 4\n(i wish)"],
      },
    ];

    const LEDGE_FALL_PHRASES = [
      "AHHH",
      "woah woah woah—",
      "not again!",
      "gravity why",
      "i slipped!!",
      "mayday mayday",
      "aaand down we go",
    ];

    const HATCH_PHRASES = [
      "i'm free!!",
      "*bursts out of\nthe flask*",
      "hello, world!",
      "born at 70% brewed",
      "don't tell the\nother batches",
    ];

    /* ── state ── */
    const spawnAt = spawnRef.current;
    const hatching = Boolean(hatchRef.current && spawnAt && !reduced);
    let x = spawnAt ? spawnAt.x : 40;
    let y = hatching && spawnAt ? Math.max(0, spawnAt.alt) : 0;
    let yVel = hatching ? 400 : 0; // pop out of the flask mouth
    let xVel = hatching ? (Math.random() < 0.5 ? -1 : 1) * 130 : 0;
    let groundOffset = 0;
    let dir: 1 | -1 = 1;
    let lastT = performance.now();
    let hovered = false;
    let dragging = false;
    let pressActive = false;
    let pressStart: { x: number; y: number; t: number } | null = null;
    let dragPointerId: number | null = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let leftWall = 8;
    let rightWall = 200;
    let lastBumpAt = 0;
    let bubbleTimer = 0;
    let blinkTimeoutId = 0;
    let idleTimeoutId = 0;
    let idleFirstTimeoutId = 0;
    let lastPointerX = -9999;
    let lastPointerY = -9999;
    let hoverTimer = 0;
    let dizzy = false;
    let dizzyUntil = 0;
    let clickCount = 0;
    let lastClickAt = 0;
    const shakeSamples: number[] = [];
    let lastShakeDx = 0;
    const ptrHistory: { t: number; x: number; y: number }[] = [];
    let sleeping = false;
    let lastActivityAt = performance.now();
    let dripFrame = 0;
    let lastSplatAt = 0;

    /* ── ledges (this site's perchable surfaces) ── */
    const LEDGE_SELECTORS = [
      ".pill",
      ".postcard",
      ".gb-pin",
      ".work-card",
      ".cs-card",
      ".cs-persona",
      ".detail-hero",
      ".lab-bench",
      ".sbk-book",
    ].join(", ");

    let ledgeCache: HTMLElement[] = [];
    let ledgeCacheDirty = true;
    let ledgeScanFrame = 0;
    const LEDGE_SCAN_INTERVAL = 4;

    function refreshLedgeCache() {
      ledgeCache = Array.from(document.querySelectorAll<HTMLElement>(LEDGE_SELECTORS));
      ledgeCacheDirty = false;
    }
    function invalidateLedgeCache() {
      ledgeCacheDirty = true;
    }
    window.addEventListener("site-pet-invalidate-ledges", invalidateLedgeCache);

    function getLedgeCandidates(): HTMLElement[] {
      if (ledgeCacheDirty) refreshLedgeCache();
      return ledgeCache;
    }

    let currentLedge: HTMLElement | null = null;
    let ledgeGroundY = 0;
    let ledgeLeftWall = 0;
    let ledgeRightWall = 0;
    const LEDGE_FALL_CHANCE = 0.03;
    let isScrolling = false;
    let lastLedgeTop = 0;
    let ledgeWobbleAccum = 0;
    let lastWobbleQuipAt = 0;

    const LEDGE_WOBBLE_PHRASES = [
      "w-woah!",
      "hey! steady!",
      "earthquake!!",
      "whoaaa",
      "i'm gonna fall!",
      "hold on hold on",
      "the ground is moving!",
      "stop scrolling!",
    ];

    const JUMP_GAP_MAX = 120;
    const JUMP_HEIGHT_MAX = 80;
    let lastJumpAt = 0;
    const JUMP_COOLDOWN = 2000;

    function findAdjacentLedge(direction: 1 | -1): HTMLElement | null {
      if (!currentLedge) return null;
      if (performance.now() - lastJumpAt < JUMP_COOLDOWN) return null;
      const cur = currentLedge.getBoundingClientRect();
      const candidates = getLedgeCandidates();
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      for (const cand of candidates) {
        if (cand === currentLedge) continue;
        const r = cand.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const vDiff = Math.abs(r.top - cur.top);
        if (vDiff > JUMP_HEIGHT_MAX) continue;
        const gap = direction === 1 ? r.left - cur.right : cur.left - r.right;
        if (gap < -10 || gap > JUMP_GAP_MAX) continue;
        if (gap < bestDist) {
          best = cand;
          bestDist = gap;
        }
      }
      return best;
    }

    const JUMP_PHRASES = ["wheee!", "parkour!", "boing!", "hop hop", "watch this!", "nailed it", "comin through!"];

    function jumpToLedge(target: HTMLElement, direction: 1 | -1) {
      const cur = currentLedge!.getBoundingClientRect();
      const dest = target.getBoundingClientRect();
      const hDist =
        direction === 1
          ? dest.left + dest.width / 2 - (cur.right - PET_W / 2)
          : cur.left + PET_W / 2 - (dest.right - dest.width / 2);
      const vDiff = cur.top - dest.top;
      const ledgeAltitude = groundOffset;
      currentLedge = null;
      ledgeGroundY = 0;
      groundOffset = 0;
      y = Math.max(0, ledgeAltitude);
      const tFlight = 0.45;
      xVel = (hDist / tFlight) * direction;
      const peakExtra = 40 + Math.max(0, vDiff);
      yVel = Math.sqrt(2 * 3200 * peakExtra);
      fallSuspended = false;
      lastJumpAt = performance.now();
      measureWalls();
      const pet = el();
      if (pet) saySomething(pet, JUMP_PHRASES, 1400);
    }

    function findLedgeAtPosition(px: number, py: number): HTMLElement | null {
      const candidates = getLedgeCandidates();
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      for (const cand of candidates) {
        const r = cand.getBoundingClientRect();
        const petCenter = px + PET_W / 2;
        if (petCenter < r.left - 10 || petCenter > r.right + 10) continue;
        if (Math.abs(r.top - py) > 50) continue;
        const distToTop = Math.abs(py - r.top);
        if (distToTop < 30 && distToTop < bestDist) {
          best = cand;
          bestDist = distToTop;
        }
      }
      return best;
    }

    function mountLedge(ledge: HTMLElement) {
      currentLedge = ledge;
      lastLedgeTop = ledge.getBoundingClientRect().top;
      ledgeWobbleAccum = 0;
      updateLedgeBounds();
    }

    function updateLedgeBounds() {
      if (!currentLedge) return;
      const r = currentLedge.getBoundingClientRect();
      const newTop = r.top;
      if (lastLedgeTop !== 0) {
        const delta = Math.abs(newTop - lastLedgeTop);
        if (delta > 1) {
          ledgeWobbleAccum += delta;
          const now = performance.now();
          if (ledgeWobbleAccum > 40 && now - lastWobbleQuipAt > 3000) {
            const pet = el();
            if (pet && !dragging && !dizzy) {
              saySomething(pet, LEDGE_WOBBLE_PHRASES, 1600);
              lastWobbleQuipAt = now;
            }
            ledgeWobbleAccum = 0;
          }
        }
      }
      lastLedgeTop = newTop;
      ledgeGroundY = window.innerHeight - r.top;
      ledgeLeftWall = Math.max(0, r.left + 4);
      ledgeRightWall = Math.max(ledgeLeftWall + 4, r.right - PET_W - 4);
    }

    let fallSuspended = false;
    let fallResumeAt = 0;
    let lastDismountAt = 0;
    let lastLedgeFallSpokenAt = 0;

    function dismountLedge() {
      const oldGroundOffset = ledgeGroundY;
      currentLedge = null;
      ledgeGroundY = 0;
      lastDismountAt = performance.now();
      const rawY = Math.max(0, oldGroundOffset + y);
      const viewportTop = window.innerHeight - PET_H;
      if (rawY > viewportTop) {
        y = rawY;
        const distAbove = rawY - viewportTop;
        fallSuspended = false;
        yVel = -Math.sqrt(2 * 9000 * distAbove);
      } else {
        y = rawY;
        fallSuspended = true;
        fallResumeAt = performance.now() + 350;
        yVel = 0;
      }
      groundOffset = 0;
      measureWalls();
    }

    function measureWalls() {
      leftWall = 8;
      rightWall = window.innerWidth - PET_W - 8;
    }
    measureWalls();
    window.addEventListener("resize", measureWalls, { passive: true });

    function clamp(v: number, lo: number, hi: number) {
      return Math.max(lo, Math.min(hi, v));
    }

    function dizzyOr(pool: string[]): string[] {
      return dizzy ? DIZZY_PHRASES : pool;
    }

    function saySomething(pet: HTMLElement, pool: string[], ms = 1800) {
      const bubble = pet.querySelector<HTMLElement>("[data-pet-bubble]");
      if (!bubble) return;
      const phrase = pool[Math.floor(Math.random() * pool.length)];
      if (phrase.includes("\n")) {
        bubble.innerHTML = phrase.replace(/\n/g, "<br>");
      } else {
        bubble.textContent = phrase;
      }
      bubble.setAttribute("data-show", "");
      if (bubbleTimer) window.clearTimeout(bubbleTimer);
      bubbleTimer = window.setTimeout(() => bubble.removeAttribute("data-show"), ms);
    }

    /* ── hunt awareness: party hat once the sticker hunt is complete ── */
    function syncHat() {
      const pet = el();
      if (!pet) return;
      if (isComplete(getFound())) pet.setAttribute("data-hat", "party");
      else pet.removeAttribute("data-hat");
    }
    syncHat();
    window.addEventListener("hunt:update", syncHat);

    /* ── goo drips + splat ── */
    function spawnDrip(pet: HTMLElement, dx: number) {
      const emotes = pet.querySelector<HTMLElement>("[data-pet-emotes]");
      if (!emotes || reduced || emotes.childElementCount > 10) return;
      const drip = document.createElement("span");
      drip.className = "site-pet-drip";
      drip.style.setProperty("--drip-dx", `${dx}px`);
      emotes.appendChild(drip);
      window.setTimeout(() => drip.remove(), 700);
    }

    function splat(pet: HTMLElement) {
      const now = performance.now();
      if (now - lastSplatAt < 900 || reduced) return;
      lastSplatAt = now;
      pet.setAttribute("data-splat", "");
      window.setTimeout(() => pet.removeAttribute("data-splat"), 420);
      for (let i = 0; i < 4; i++) spawnDrip(pet, (Math.random() - 0.5) * 46);
      if (Math.random() < 0.6) saySomething(pet, dizzyOr(SPLAT_PHRASES), 1400);
    }

    /* ── sleep ── */
    function wake(pet: HTMLElement, chatty: boolean) {
      if (!sleeping) return;
      sleeping = false;
      pet.removeAttribute("data-sleep");
      if (chatty) saySomething(pet, WAKE_PHRASES, 1500);
    }
    function noteActivity(chatty = false) {
      lastActivityAt = performance.now();
      const pet = el();
      if (pet && sleeping) wake(pet, chatty);
    }

    let bumpedLeft = false;
    let bumpedRight = false;

    function bump(pet: HTMLElement, direction: 1 | -1) {
      if (currentLedge) return;
      const now = performance.now();
      if (now - lastBumpAt < 600) return;
      lastBumpAt = now;
      pet.style.setProperty("--pet-bump-dir", direction === 1 ? "1" : "-1");
      pet.setAttribute("data-bump", "");
      window.setTimeout(() => pet.removeAttribute("data-bump"), 420);

      const side = direction === 1 ? "left" : "right";
      const firstTime = side === "left" ? !bumpedLeft : !bumpedRight;
      if (firstTime) {
        if (side === "left") bumpedLeft = true;
        else bumpedRight = true;
      }
      if (firstTime || Math.random() < 0.05) {
        saySomething(pet, BUMP_PHRASES, 1400);
      }
    }

    function measureGround() {
      if (currentLedge) {
        updateLedgeBounds();
        const r = currentLedge.getBoundingClientRect();
        const petTopVP = r.top - PET_H;
        const offScreen =
          petTopVP < -20 || r.top > window.innerHeight + 10 || r.width === 0 || r.height === 0;
        if (!dragging && offScreen && !isScrolling) {
          const pet = el();
          if (pet && performance.now() - lastLedgeFallSpokenAt > 4000) {
            saySomething(pet, dizzyOr(LEDGE_FALL_PHRASES), 1800);
            lastLedgeFallSpokenAt = performance.now();
          }
          dismountLedge();
          return;
        }
        groundOffset = ledgeGroundY;
      } else {
        groundOffset = 0;
      }
    }

    let petRafId = 0;

    function tick(now: number) {
      const dt = Math.min(48, now - lastT);
      lastT = now;
      const pet = el();
      if (!pet) {
        petRafId = requestAnimationFrame(tick);
        return;
      }
      measureGround();
      pet.style.setProperty("--pet-ground", `${groundOffset}px`);
      const inDizzy = dizzy && now < dizzyUntil;
      if (dizzy && now >= dizzyUntil) {
        dizzy = false;
        pet.removeAttribute("data-dizzy");
        const emotesLayer = pet.querySelector<HTMLElement>("[data-pet-emotes]");
        emotesLayer?.querySelectorAll(".site-pet-spin-star").forEach((s) => s.remove());
      }

      // sleep after ~45s without pointer/scroll activity
      if (!sleeping && !dragging && !inDizzy && y <= 0.5 && now - lastActivityAt > 45000) {
        sleeping = true;
        pet.setAttribute("data-sleep", "");
        saySomething(pet, ["z z z ...", "*snores in goo*", "zzz..."], 2600);
      }

      if (!hovered && !dragging && !reduced && !inDizzy && !sleeping) {
        const step = SPEED * (dt / 1000);
        const wL = currentLedge ? ledgeLeftWall : leftWall;
        const wR = currentLedge ? ledgeRightWall : rightWall;
        if (x < wL) {
          x = Math.min(wL, x + step);
          dir = 1;
        } else if (x > wR) {
          x = Math.max(wR, x - step);
          dir = -1;
        } else {
          if (Math.abs(xVel) > 8) {
            x += xVel * (dt / 1000);
            xVel *= Math.pow(0.04, dt / 1000);
            dir = xVel >= 0 ? 1 : -1;
          } else {
            xVel = 0;
            x += dir * step;
          }
          if (x <= wL) {
            x = wL;
            if (dir === -1) {
              if (currentLedge) {
                const neighbor = findAdjacentLedge(-1);
                if (neighbor) {
                  jumpToLedge(neighbor, -1);
                } else if (Math.random() < LEDGE_FALL_CHANCE) {
                  if (performance.now() - lastLedgeFallSpokenAt > 4000) {
                    saySomething(pet, dizzyOr(LEDGE_FALL_PHRASES), 1800);
                    lastLedgeFallSpokenAt = performance.now();
                  }
                  dismountLedge();
                }
              } else {
                bump(pet, 1);
              }
            }
            dir = 1;
          } else if (x >= wR) {
            x = wR;
            if (dir === 1) {
              if (currentLedge) {
                const neighbor = findAdjacentLedge(1);
                if (neighbor) {
                  jumpToLedge(neighbor, 1);
                } else if (Math.random() < LEDGE_FALL_CHANCE) {
                  if (performance.now() - lastLedgeFallSpokenAt > 4000) {
                    saySomething(pet, dizzyOr(LEDGE_FALL_PHRASES), 1800);
                    lastLedgeFallSpokenAt = performance.now();
                  }
                  dismountLedge();
                }
              } else {
                bump(pet, -1);
              }
            }
            dir = -1;
          }
        }
      }

      if (!dragging) {
        if (fallSuspended) {
          if (now >= fallResumeAt) {
            fallSuspended = false;
            yVel = 0;
          }
        } else {
          const dtSec = dt / 1000;
          const isFallingFromLedge = !currentLedge && yVel <= 0 && y > 40;
          const g = yVel > 0 ? 2000 : isFallingFromLedge ? 9000 : 3200;
          yVel -= g * dtSec;
          y += yVel * dtSec;

          // goo drips while flying fast
          dripFrame = (dripFrame + 1) % 7;
          if (dripFrame === 0 && y > 6 && Math.abs(yVel) > 260) {
            spawnDrip(pet, (Math.random() - 0.5) * 22);
          }

          ledgeScanFrame = (ledgeScanFrame + 1) % LEDGE_SCAN_INTERVAL;
          const recentDismount = performance.now() - lastDismountAt < 700;
          if (!currentLedge && yVel < 0 && !dizzy && !recentDismount && ledgeScanFrame === 0) {
            const petFeetVP = window.innerHeight - groundOffset - y;
            const ledge = findLedgeAtPosition(x, petFeetVP);
            if (ledge) {
              const r = ledge.getBoundingClientRect();
              const ledgeTopFromBottom = window.innerHeight - r.top;
              const petAltitude = groundOffset + y;
              if (Math.abs(petAltitude - ledgeTopFromBottom) < 20) {
                mountLedge(ledge);
                y = 0;
                xVel *= 0.3;
                yVel = 0;
                lastJumpAt = performance.now();
                saySomething(pet, dizzyOr(LEDGE_LAND_PHRASES), 2200);
              }
            }
          }

          if (y <= 0) {
            if (dizzy && yVel < -100) dizzyUntil = performance.now() + 2200;
            if (yVel < -360) splat(pet);
            y = 0;
            if (yVel < -160) {
              yVel = -yVel * 0.1;
            } else {
              yVel = 0;
            }
          }
        }
      }

      // blob squash & stretch from vertical velocity
      if (!reduced) {
        if (!dragging && y > 2) {
          const sy = 1 + Math.min(0.22, Math.abs(yVel) / 2400);
          pet.style.setProperty("--pet-sy", sy.toFixed(3));
          pet.style.setProperty("--pet-sx", (1 - (sy - 1) * 0.8).toFixed(3));
        } else {
          pet.style.setProperty("--pet-sy", "1");
          pet.style.setProperty("--pet-sx", "1");
        }
      }

      pet.style.setProperty("--pet-x", `${x}px`);
      pet.style.setProperty("--pet-y", `${y}px`);
      pet.style.setProperty("--pet-flip", dir === 1 ? "1" : "-1");

      const eyes = pet.querySelector<SVGGElement>(".site-pet__eyes");
      if (eyes && lastPointerX > -9999 && !sleeping) {
        const cx = x + PET_W / 2;
        const cy = window.innerHeight - groundOffset - y - PET_H / 2;
        const dx = lastPointerX - cx;
        const dy = lastPointerY - cy;
        const d = Math.hypot(dx, dy) || 1;
        const ex = clamp((dx / d) * 1.4, -1.4, 1.4);
        const ey = clamp((dy / d) * 1, -1, 1);
        eyes.style.transform = `translate(${ex.toFixed(2)}px, ${ey.toFixed(2)}px)`;
      }

      petRafId = requestAnimationFrame(tick);
    }

    petRafId = requestAnimationFrame(tick);

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(petRafId);
        petRafId = 0;
      } else if (!petRafId) {
        lastT = performance.now();
        petRafId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onPointerMove = (e: PointerEvent) => {
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      noteActivity();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let lastScrollY = window.scrollY;
    let scrollIdleTimer = 0;

    const onScroll = () => {
      isScrolling = true;
      noteActivity();
      if (scrollIdleTimer) window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        isScrolling = false;
      }, 150);

      if (reduced || dragging || currentLedge) {
        lastScrollY = window.scrollY;
        return;
      }
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      const mag = Math.min(400, Math.abs(dy));
      if (mag < 2) return;
      if (y > 6) return;
      const impulse = Math.min(520, Math.sqrt(mag) * 26);
      yVel = Math.min(560, Math.max(yVel, impulse));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let unbindListeners = () => {};

    function wire(pet: HTMLElement) {
      const hit = pet.querySelector<HTMLButtonElement>("[data-pet-hit]");
      const emotes = pet.querySelector<HTMLElement>("[data-pet-emotes]");
      if (!hit) return;

      const DRAG_THRESHOLD = 6;

      function triggerHop() {
        if (reduced) return;
        pet.setAttribute("data-hopping", "");
        pet.setAttribute("data-blink", "");
        window.setTimeout(() => pet.removeAttribute("data-hopping"), 520);
        window.setTimeout(() => pet.removeAttribute("data-blink"), 180);
      }

      function triggerDizzy() {
        if (dizzy) return;
        dizzy = true;
        dizzyUntil = performance.now() + 2200;
        pet.setAttribute("data-dizzy", "");
        saySomething(pet, DIZZY_PHRASES, 2000);
        if (emotes) {
          for (let i = 0; i < 3; i++) {
            const star = document.createElement("span");
            star.className = "site-pet-spin-star";
            star.style.animationDelay = `${-i * 0.3}s`;
            emotes.appendChild(star);
          }
        }
      }

      const SWIRL_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 10 A4 4 0 1 0 2 6"/></svg>`;
      function spawnSwirl() {
        if (!emotes || reduced) return;
        const swirl = document.createElement("span");
        swirl.className = "site-pet-swirl";
        swirl.innerHTML = SWIRL_SVG;
        swirl.style.setProperty("--swirl-dx", `${(Math.random() - 0.5) * 32}px`);
        emotes.appendChild(swirl);
        window.setTimeout(() => swirl.remove(), 1000);
      }

      const onHitEnter = () => {
        if (dragging) return;
        noteActivity(true);
        hovered = true;
        pet.setAttribute("data-paused", "");
        const r = pet.getBoundingClientRect();
        dir = lastPointerX < r.left + r.width / 2 ? -1 : 1;
        window.clearTimeout(hoverTimer);
        hoverTimer = window.setTimeout(() => {
          if (hovered && !dragging && !dizzy) {
            saySomething(pet, HOVER_PHRASES, 1600);
          }
        }, 260);
      };

      const onHitLeave = () => {
        if (dragging) return;
        hovered = false;
        pet.removeAttribute("data-paused");
        window.clearTimeout(hoverTimer);
      };

      const onHitDown = (e: PointerEvent) => {
        if (e.button !== undefined && e.button !== 0) return;
        noteActivity(true);
        pressActive = true;
        pressStart = { x: e.clientX, y: e.clientY, t: performance.now() };
        dragPointerId = e.pointerId;
        try {
          hit.setPointerCapture(e.pointerId);
        } catch {}
        ptrHistory.length = 0;
        ptrHistory.push({ t: pressStart.t, x: e.clientX, y: e.clientY });
        shakeSamples.length = 0;
        lastShakeDx = 0;
      };

      const onHitMove = (e: PointerEvent) => {
        if (!pressActive || e.pointerId !== dragPointerId) return;
        const nowT = performance.now();
        ptrHistory.push({ t: nowT, x: e.clientX, y: e.clientY });
        while (ptrHistory.length > 2 && nowT - ptrHistory[0].t > 140) {
          ptrHistory.shift();
        }
        if (!dragging) {
          const ds = pressStart!;
          const dx = e.clientX - ds.x;
          const dy = e.clientY - ds.y;
          if (dy < -DRAG_THRESHOLD || Math.abs(dx) > DRAG_THRESHOLD * 2) {
            dragging = true;
            if (currentLedge) {
              const oldGround = groundOffset;
              currentLedge = null;
              ledgeGroundY = 0;
              y = y + oldGround;
              groundOffset = 0;
            }
            const r = pet.getBoundingClientRect();
            dragOffsetX = ds.x - r.left;
            dragOffsetY = ds.y - r.top;
            pet.setAttribute("data-dragging", "");
            pet.setAttribute("data-paused", "");
            saySomething(pet, DRAG_PHRASES, 2200);
          } else {
            return;
          }
        }

        const newLeft = e.clientX - dragOffsetX;
        const newTop = e.clientY - dragOffsetY;
        x = clamp(newLeft, 4, window.innerWidth - PET_W - 4);
        const yFromGround = window.innerHeight - newTop - PET_H - groundOffset;
        y = clamp(yFromGround, 0, Math.max(0, window.innerHeight - PET_H - groundOffset - 4));

        const rawDx = e.movementX ?? 0;
        const dirNow = Math.sign(rawDx);
        if (Math.abs(rawDx) > 2 && dirNow !== 0) {
          if (lastShakeDx !== 0 && dirNow !== lastShakeDx) {
            shakeSamples.push(nowT);
            while (shakeSamples.length && nowT - shakeSamples[0] > 600) {
              shakeSamples.shift();
            }
            if (!dizzy) spawnSwirl();
            if (shakeSamples.length >= 4) {
              triggerDizzy();
              shakeSamples.length = 0;
            }
          }
          lastShakeDx = dirNow;
        }
      };

      const settleAfterDrop = () => {
        const petFeetY = window.innerHeight - groundOffset - y;
        const ledge = findLedgeAtPosition(x, petFeetY);
        if (ledge && !dizzy) {
          xVel = 0;
          yVel = 0;
          mountLedge(ledge);
          y = 0;
          saySomething(pet, dizzyOr(LEDGE_LAND_PHRASES), 2200);
          return true;
        }
        return false;
      };

      const endPress = (e: PointerEvent) => {
        if (!pressActive || e.pointerId !== dragPointerId) return;
        pressActive = false;
        dragPointerId = null;

        if (dragging) {
          dragging = false;
          pet.removeAttribute("data-dragging");
          pet.removeAttribute("data-paused");

          if (ptrHistory.length >= 2) {
            const first = ptrHistory[0];
            const last = ptrHistory[ptrHistory.length - 1];
            const dtMs = Math.max(8, last.t - first.t);
            const vx = ((last.x - first.x) / dtMs) * 1000 * 0.55;
            const vy = ((last.y - first.y) / dtMs) * 1000 * 0.55;
            xVel = clamp(vx, -500, 500);
            yVel = clamp(-vy, -420, 420);
          } else {
            xVel = 0;
            yVel = 0;
          }

          if (!settleAfterDrop()) {
            if (currentLedge) dismountLedge();
            saySomething(pet, dizzyOr(DROP_PHRASES), 1400);
          }
        } else {
          const nowT = performance.now();
          if (nowT - lastClickAt > 5000) clickCount = 0;
          clickCount += 1;
          globalPokes += 1;
          lastClickAt = nowT;
          triggerHop();

          if (!pokeQuipUsed && globalPokes > 0) {
            pokeQuipUsed = true;
            saySomething(
              pet,
              [
                `this is the ${globalPokes}${globalPokes === 1 ? "st" : globalPokes === 2 ? "nd" : globalPokes === 3 ? "rd" : "th"} time\nsomeone has poked me :(`,
              ],
              2400
            );
          } else {
            saySomething(pet, clickPool(clickCount), 1400);
          }

          try {
            const p = parseInt(localStorage.getItem("sitepet:pokes") ?? "0", 10);
            localStorage.setItem("sitepet:pokes", String(p + 1));
          } catch {}
        }
        pressStart = null;
      };

      const onSafetyUp = () => {
        if (!pressActive && !dragging) return;
        pressActive = false;
        dragPointerId = null;
        if (dragging) {
          dragging = false;
          pet.removeAttribute("data-dragging");
          pet.removeAttribute("data-paused");
          if (!settleAfterDrop()) {
            yVel = 0;
            saySomething(pet, dizzyOr(DROP_PHRASES), 1200);
          }
        }
      };

      hit.addEventListener("pointerenter", onHitEnter);
      hit.addEventListener("pointerleave", onHitLeave);
      hit.addEventListener("pointerdown", onHitDown);
      hit.addEventListener("pointermove", onHitMove);
      hit.addEventListener("pointerup", endPress);
      hit.addEventListener("pointercancel", endPress);
      window.addEventListener("pointerup", onSafetyUp);

      unbindListeners = () => {
        hit.removeEventListener("pointerenter", onHitEnter);
        hit.removeEventListener("pointerleave", onHitLeave);
        hit.removeEventListener("pointerdown", onHitDown);
        hit.removeEventListener("pointermove", onHitMove);
        hit.removeEventListener("pointerup", endPress);
        hit.removeEventListener("pointercancel", endPress);
        window.removeEventListener("pointerup", onSafetyUp);
      };

      function scheduleBlink() {
        if (blinkTimeoutId) window.clearTimeout(blinkTimeoutId);
        const delay = 3000 + Math.random() * 4000;
        blinkTimeoutId = window.setTimeout(() => {
          if (!dizzy && !sleeping && !pet.hasAttribute("data-blink")) {
            pet.setAttribute("data-blink", "");
            window.setTimeout(() => pet.removeAttribute("data-blink"), 160);
          }
          scheduleBlink();
        }, delay);
      }
      scheduleBlink();

      function perchPool(): string[] {
        if (!currentLedge) return LEDGE_IDLE_PHRASES;
        for (const ctx of PERCH_CONTEXT) {
          if (currentLedge.matches(ctx.match)) {
            return Math.random() < 0.5 ? ctx.phrases : LEDGE_IDLE_PHRASES;
          }
        }
        return LEDGE_IDLE_PHRASES;
      }

      function huntFlavor(): string[] | null {
        const found = getFound();
        if (isComplete(found)) {
          return Math.random() < 0.2 ? HUNT_DONE_PHRASES : null;
        }
        // gentle nudge toward the hunt, more likely the fewer they've found
        const remaining = HUNT_STICKERS.length - found.length;
        return Math.random() < 0.14 + remaining * 0.03 ? HUNT_HINT_PHRASES : null;
      }

      function idlePool(): string[] {
        if (sleeping) return ["z z z ...", "zzz...", "*bubbling softly*"];
        if (currentLedge) return perchPool();
        const flavored = huntFlavor();
        if (flavored) return flavored;
        const path = window.location.pathname;
        if (path.startsWith("/works/")) {
          const extras = CASE_STUDY_PAGE_PHRASES[path] ?? [];
          return extras.length ? [...CASE_STUDY_PHRASES, ...extras] : CASE_STUDY_PHRASES;
        }
        if (path.startsWith("/works")) return WORKS_PHRASES;
        if (path.startsWith("/about")) return ABOUT_PHRASES;
        if (path.startsWith("/lab")) return LAB_PHRASES;
        if (path.startsWith("/contact")) return CONTACT_PHRASES;
        if (path.startsWith("/guestbook")) return GUESTBOOK_PHRASES;
        return IDLE_PHRASES;
      }

      let lastIdleQuipAt = 0;
      function scheduleIdle() {
        if (idleTimeoutId) window.clearTimeout(idleTimeoutId);
        const delay = 18000 + Math.random() * 16000;
        idleTimeoutId = window.setTimeout(() => {
          const now = Date.now();
          if (!hovered && !dragging && !dizzy && now - lastIdleQuipAt >= 15_000) {
            saySomething(pet, idlePool(), 2200);
            lastIdleQuipAt = now;
          }
          scheduleIdle();
        }, delay);
      }
      if (idleFirstTimeoutId) window.clearTimeout(idleFirstTimeoutId);
      idleFirstTimeoutId = window.setTimeout(() => {
        if (!hovered && !dragging && !dizzy) {
          saySomething(pet, idlePool(), 2200);
          lastIdleQuipAt = Date.now();
        }
        scheduleIdle();
      }, 12000);
    }

    if (petRef.current) {
      wire(petRef.current);
      if (hatchRef.current) {
        const pet = petRef.current;
        window.setTimeout(() => {
          saySomething(pet, HATCH_PHRASES, 2600);
          for (let i = 0; i < 6; i++) spawnDrip(pet, (Math.random() - 0.5) * 40);
        }, 120);
      }
    }

    return () => {
      cancelAnimationFrame(petRafId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureWalls);
      window.removeEventListener("site-pet-invalidate-ledges", invalidateLedgeCache);
      window.removeEventListener("hunt:update", syncHat);
      unbindListeners();
      if (bubbleTimer) clearTimeout(bubbleTimer);
      if (blinkTimeoutId) clearTimeout(blinkTimeoutId);
      if (idleTimeoutId) clearTimeout(idleTimeoutId);
      if (idleFirstTimeoutId) clearTimeout(idleFirstTimeoutId);
    };
  }, []); // Run once on mount

  return { petRef };
};
