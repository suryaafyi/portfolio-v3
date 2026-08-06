"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const A = "/projects/splash"; // extracted collage assets
const WORD_CX = 54; // wordmark center, % of composition (pieces converge from here)
const WORD_CY = 30;

/* ── collage pieces, transcribed from the Splash v3 design ──
   pos = final rect (Figma geometry); tf = resting rotate/flip;
   d/dl = converge duration/delay(s); bob = resting float; hov = hover. */
type Piece = {
  name: string;
  a: string;
  pos: { l: number; t: number; w: number; h: number };
  tf?: string;
  d: number;
  dl: number;
  bob?: [number, number];
  hov?: string;
  img?: string; // custom source (e.g. an animated .gif) — overrides the webp
};

const PIECES: Piece[] = [
  { name: "Scuba", a: "ae0599609f8536b6", pos: { l: 43.04, t: 59.12, w: 10.75, h: 14.35 }, d: 0.9, dl: 2.55, hov: "rotate(-3deg) scale(1.08)", img: "/projects/splash/scuba.gif" },
  { name: "UFO", a: "48d702e8a08dd7fc", pos: { l: 4.06, t: 15.97, w: 5.82, h: 11.8 }, d: 0.9, dl: 1.6, bob: [6.2, 4.55], hov: "rotate(4deg) scale(1.08)" },
  { name: "Pagoda", a: "f82ec8a1d51ed395", pos: { l: -3.21, t: 22.47, w: 20.5, h: 49.7 }, d: 1, dl: 0.9, bob: [6.4, 3.55], hov: "rotate(-1deg) scale(1.03)" },
  { name: "Statue", a: "cb561d3fee67a899", pos: { l: 14.88, t: 17.36, w: 20.13, h: 45.99 }, tf: "rotate(8.86deg)", d: 1, dl: 1.05, bob: [6.6, 3.7], hov: "rotate(-1.5deg) scale(1.03)" },
  { name: "Eiffel", a: "0a1f0c0612b5fb0d", pos: { l: -5.08, t: 27.61, w: 14.09, h: 46.36 }, tf: "rotate(-9.9deg)", d: 1, dl: 0.6, bob: [6, 3.25], hov: "rotate(1.5deg) scale(1.03)" },
  { name: "Round tower", a: "8ce6d60f9349a052", pos: { l: 22.08, t: 25.68, w: 14.59, h: 46.33 }, tf: "scaleX(-1)", d: 1, dl: 0.75, bob: [6.3, 3.4], hov: "rotate(-1.5deg) scale(1.03)" },
  { name: "Palm", a: "983a3f3f890e6fc2", pos: { l: 81.52, t: 9.65, w: 17.94, h: 57.55 }, d: 1, dl: 0.9, bob: [6.8, 3.55], hov: "rotate(1deg) scale(1.02)" },
  { name: "Palm small", a: "983a3f3f890e6fc2", pos: { l: 79.88, t: 36.1, w: 10.45, h: 33.51 }, tf: "rotate(-35.1deg)", d: 0.9, dl: 1.1, bob: [6.1, 3.65], hov: "rotate(-2deg) scale(1.03)" },
  { name: "Grass hill", a: "ec9f46625d440321", pos: { l: -1.18, t: 56.55, w: 67.11, h: 88.6 }, d: 1.1, dl: 0.4, hov: "scale(1.01)" },
  { name: "Tentacle L", a: "0ab003cb4ec722b5", pos: { l: 63.17, t: 49.88, w: 9.2, h: 29.29 }, tf: "rotate(-40deg) scaleX(-1)", d: 1, dl: 1.7, bob: [5.6, 4.35], hov: "rotate(4deg) scale(1.06)" },
  { name: "Tentacle R", a: "0ab003cb4ec722b5", pos: { l: 75.52, t: 51.02, w: 7.73, h: 24.61 }, tf: "rotate(1.15deg) scaleX(-1)", d: 1, dl: 1.85, bob: [5.9, 4.5], hov: "rotate(-4deg) scale(1.06)" },
  { name: "Tentacle C", a: "0ab003cb4ec722b5", pos: { l: 56.01, t: 60.59, w: 8.41, h: 26.78 }, tf: "rotate(-61deg) scaleX(-1)", d: 1, dl: 2, bob: [5.3, 4.65], hov: "rotate(4deg) scale(1.06)" },
  { name: "Wave", a: "258f6354b2fefa55", pos: { l: 103.08, t: 35.17, w: 32.88, h: 88.99 }, tf: "rotate(68.13deg)", d: 1.1, dl: 1.3, hov: "scale(1.02)" },
  { name: "Paint tools", a: "89d7e38240f2cdf5", pos: { l: -0.41, t: 61.32, w: 10.76, h: 21.85 }, tf: "rotate(22.71deg)", d: 0.9, dl: 2, bob: [5.2, 4.95], hov: "rotate(-4deg) scale(1.08)" },
  { name: "Spiderman", a: "7f3bd701415ad558", pos: { l: 13.38, t: 50.51, w: 9.89, h: 18.29 }, tf: "rotate(-13.77deg) scaleX(-1)", d: 0.9, dl: 1.9, bob: [5.5, 4.85], hov: "rotate(5deg) scale(1.08)" },
  { name: "Sunflower", a: "c96c033b832d59bb", pos: { l: -7.45, t: 53.4, w: 26.37, h: 40.17 }, d: 1, dl: 1.5, bob: [6.2, 4.55], hov: "rotate(2deg) scale(1.04)" },
  { name: "The Weeknd", a: "8b19bdba52e5337d", pos: { l: 13.67, t: 67.79, w: 13.08, h: 25.36 }, tf: "rotate(-9.79deg)", d: 0.9, dl: 1.7, bob: [6, 4.65], hov: "rotate(-3deg) scale(1.05)" },
  { name: "SpongeBob", a: "45958da8ce99616f", pos: { l: 77.28, t: 83.62, w: 6.34, h: 17.19 }, tf: "rotate(-52.56deg)", d: 0.95, dl: 3, bob: [4.8, 6], hov: "rotate(6deg) scale(1.09)" },
  { name: "Balloon", a: "8f71bed2e9b50916", pos: { l: 74.84, t: 28.9, w: 5.1, h: 7.77 }, d: 1.1, dl: 2.6, bob: [4.6, 5.75], hov: "rotate(-5deg) scale(1.1)" },
  { name: "Coconut", a: "33b075be3afbb3e7", pos: { l: 53.94, t: 69.14, w: 11.03, h: 16.81 }, d: 0.9, dl: 2.95, bob: [5.4, 5.9], hov: "rotate(-4deg) scale(1.08)" },
  { name: "Scooter cats", a: "d48c7920f93098ee", pos: { l: 31.16, t: 47.39, w: 14.82, h: 31.33 }, d: 1, dl: 2, bob: [5.8, 5.05], hov: "rotate(-3deg) scale(1.06)" },
  { name: "Headphones cat", a: "6f8be25cd62114a3", pos: { l: 11.25, t: 64.8, w: 12.73, h: 23.94 }, tf: "scaleX(-1)", d: 0.9, dl: 2.15, bob: [5.1, 5.1], hov: "rotate(4deg) scale(1.07)" },
  { name: "Mario star", a: "d5ddb7c70ddf37f7", pos: { l: 20.28, t: 17.29, w: 4.19, h: 4.14 }, tf: "rotate(7.93deg)", d: 0.5, dl: 1.4, bob: [4.7, 3.95], hov: "rotate(-8deg) scale(1.15)" },
  { name: "Cap cat", a: "5c8a45f28bb9e43a", pos: { l: 18.43, t: 57.67, w: 8.59, h: 13.09 }, d: 0.9, dl: 2.3, bob: [5.3, 5.25], hov: "rotate(4deg) scale(1.08)" },
  { name: "Disco ball", a: "7a1af520d2490dc1", pos: { l: 29.81, t: 31.62, w: 5.23, h: 7.96 }, tf: "rotate(11.07deg)", d: 0.5, dl: 2.1, bob: [4.9, 4.65], hov: "rotate(-8deg) scale(1.12)" },
  { name: "Singer", a: "f9c0ed42f55ffc13", pos: { l: 26.24, t: 38.35, w: 5.58, h: 28.83 }, d: 1, dl: 1.8, bob: [6.1, 4.85], hov: "rotate(-2deg) scale(1.05)" },
  { name: "Cactus", a: "8ffd82b694cf786d", pos: { l: 25.53, t: 74.49, w: 9.41, h: 13.68 }, d: 0.9, dl: 2.5, bob: [5.7, 5.45], hov: "rotate(3deg) scale(1.06)" },
  { name: "Chick-hat cat", a: "6d68cd8492b4ce9a", pos: { l: 27.68, t: 66.12, w: 7.37, h: 10.28 }, d: 0.9, dl: 2.45, bob: [5.2, 5.4], hov: "rotate(-4deg) scale(1.08)" },
  { name: "Kitten", a: "d82ee2ccc88dc87d", pos: { l: 42.07, t: 75.3, w: 7.69, h: 11.71 }, d: 0.9, dl: 2.7, bob: [4.8, 5.65], hov: "rotate(-5deg) scale(1.09)" },
  { name: "Adobe icons", a: "8458426e089646db", pos: { l: 35.1, t: 59.49, w: 6.31, h: 9.61 }, d: 0.5, dl: 2.6, bob: [5, 5.15], hov: "rotate(5deg) scale(1.1)" },
  { name: "Arts note", a: "33e72429e3f985a7", pos: { l: 51.61, t: 44.48, w: 5.89, h: 9.06 }, d: 0.5, dl: 3.15, bob: [5.5, 5.7], hov: "rotate(-4deg) scale(1.08)" },
  { name: "Cassette", a: "1b19f1613d17ea61", pos: { l: 22.97, t: 89.08, w: 10.55, h: 16.07 }, d: 0.9, dl: 2.8, bob: [5.6, 5.75], hov: "rotate(4deg) scale(1.08)" },
  { name: "Temple", a: "876c602ff79f6521", pos: { l: 80.77, t: 49.87, w: 19.77, h: 39 }, d: 1, dl: 1.1, bob: [6.5, 4.15], hov: "rotate(-1.5deg) scale(1.03)" },
  { name: "Iced coffee", a: "1aa6eb64c1f073d2", pos: { l: 29.92, t: 89.01, w: 9.52, h: 14.5 }, tf: "rotate(-3.55deg)", d: 0.9, dl: 2.9, bob: [5.1, 5.85], hov: "rotate(-4deg) scale(1.08)" },
];

/* hover sound per piece → /public/sounds/<name>.mp3 (add the files there).
   Palms share one file, tentacles share one — the rest are unique. */
const SOUND: Record<string, string> = {
  Scuba: "scuba",
  UFO: "ufo",
  Pagoda: "pagoda",
  Statue: "statue",
  Eiffel: "eiffel",
  "Round tower": "tower",
  Palm: "palm",
  "Palm small": "palm",
  "Grass hill": "grass",
  "Tentacle L": "tentacle",
  "Tentacle R": "tentacle",
  "Tentacle C": "tentacle",
  Wave: "wave",
  "Paint tools": "paint",
  Spiderman: "spiderman",
  Sunflower: "sunflower",
  "The Weeknd": "weeknd",
  SpongeBob: "coconut",
  Balloon: "balloon",
  Coconut: "spongebob",
  "Scooter cats": "scooter",
  "Headphones cat": "headphones",
  "Mario star": "mario",
  "Cap cat": "cap-cat",
  "Disco ball": "disco",
  Singer: "singer",
  Cactus: "cactus",
  "Chick-hat cat": "chick-cat",
  Kitten: "kitten",
  "Adobe icons": "adobe",
  "Arts note": "note",
  Cassette: "cassette",
  Temple: "temple",
  "Iced coffee": "coffee",
};

/* the wordmark cycles through "Surya" written in different scripts, all set in
   the matching Noto Serif family — [text, family, sizeFactor]. sizeFactor
   normalises visual size across scripts so every one sits the same. */
type Name = { t: string; f: string; s: number };
const NAMES: Name[] = [
  { t: "surya", f: "Noto Serif", s: 1 }, // English / Latin
  { t: "சூர்யா", f: "Noto Serif Tamil", s: 0.9 }, // Tamil
  { t: "सूर्य", f: "Noto Serif Devanagari", s: 0.94 }, // Hindi / Sanskrit
  { t: "スーリヤ", f: "Noto Serif JP", s: 0.86 }, // Japanese
  { t: "苏利耶", f: "Noto Serif SC", s: 0.84 }, // Chinese
  { t: "수리야", f: "Noto Serif KR", s: 0.9 }, // Korean
  { t: "สุริยา", f: "Noto Serif Thai", s: 0.82 }, // Thai
  { t: "সূর্য", f: "Noto Serif Bengali", s: 0.94 }, // Bengali
  { t: "సూర్య", f: "Noto Serif Telugu", s: 0.94 }, // Telugu
  { t: "ಸೂರ್ಯ", f: "Noto Serif Kannada", s: 0.94 }, // Kannada
  { t: "സൂര്യ", f: "Noto Serif Malayalam", s: 0.9 }, // Malayalam
  { t: "સૂર્ય", f: "Noto Serif Gujarati", s: 0.94 }, // Gujarati
  { t: "ਸੂਰਜ", f: "Noto Serif Gurmukhi", s: 0.94 }, // Punjabi / Gurmukhi
  { t: "ସୂର୍ଯ୍ୟ", f: "Noto Serif Oriya", s: 0.9 }, // Odia
  { t: "සූර්ය", f: "Noto Serif Sinhala", s: 0.88 }, // Sinhala
  { t: "Сурья", f: "Noto Serif", s: 1 }, // Russian / Cyrillic
  { t: "Σούρια", f: "Noto Serif", s: 1 }, // Greek
  { t: "სურია", f: "Noto Serif Georgian", s: 1 }, // Georgian
  { t: "Սուրյա", f: "Noto Serif Armenian", s: 0.96 }, // Armenian
];

/* Google Fonts stylesheet links, one per family, subset to only the glyphs we
   render (text=) so each download is a few KB. React 19 hoists <link>. */
const gf = (family: string, text: string) =>
  `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@500&text=${encodeURIComponent(text)}&display=swap`;
const FONT_LINKS = (() => {
  const byFamily: Record<string, string> = {};
  for (const n of NAMES) byFamily[n.f] = (byFamily[n.f] ?? "") + n.t;
  return Object.entries(byFamily).map(([fam, txt]) => gf(fam, Array.from(new Set(txt)).join("")));
})();

const SQUIGGLE =
  "M 194 84 C 187 76, 172 76, 164 85 C 157 93, 163 101, 174 105 C 186 109, 191 116, 184 121 C 176 126, 161 123, 155 114 M 212 86 C 210 95, 208 107, 211 115 C 214 123, 224 119, 231 108 C 236 100, 240 91, 242 85 C 241 95, 239 109, 243 116 C 247 123, 257 119, 264 109 M 274 84 C 271 94, 269 106, 271 116 M 272 100 C 277 91, 285 83, 293 82 C 299 81, 301 87, 297 91 M 330 85 C 328 94, 326 106, 329 114 C 332 122, 342 118, 349 107 C 354 99, 358 90, 360 85 C 360 100, 358 130, 353 151 C 349 168, 337 173, 331 163 C 326 154, 334 139, 347 128 C 356 120, 366 113, 374 109 M 428 90 C 419 84, 406 87, 399 97 C 393 106, 394 116, 402 119 C 410 122, 420 115, 425 105 C 428 99, 430 92, 431 88 C 430 97, 428 109, 431 116 C 434 123, 444 119, 451 109";

const CYCLE_MS = 700; // slower — each script should be legible before it swaps
const CYCLE_START = 3200; // ms until the cursive squiggle morphs into the script cycle
const HINT_KEY = "surya-splash-hint-v2"; // two hint chips: {x%, y%, scale}
type HintCfg = { x: number; y: number; s: number };
type HintKey = "sound" | "enter";
const HINTS_DEFAULT: Record<HintKey, HintCfg> = {
  sound: { x: 52.93, y: 16.21, s: 0.7 }, // hover hint — upper
  enter: { x: 52.53, y: 84.12, s: 0.8 }, // scroll/continue hint — lower
};

/* The splash plays once per full page load. This module-scoped flag survives
   client-side navigations (so returning to Home won't replay it) but resets on
   a real reload / refresh — exactly when the splash should come back. */
let splashPlayed = false;

export default function SplashIntro() {
  // hero-chip align mode (/?chipalign) skips the splash so the hero is reachable
  const [phase, setPhase] = useState<"show" | "out" | "hidden">(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("chipalign")) {
      return "hidden";
    }
    if (splashPlayed) return "hidden"; // already shown this page-load
    return "show";
  });
  const [cycling, setCycling] = useState(false);
  const [fi, setFi] = useState(0);
  const [align, setAlign] = useState(false);
  const [hints, setHints] = useState<Record<HintKey, HintCfg>>(HINTS_DEFAULT);
  const stageRef = useRef<HTMLDivElement>(null);
  const hintDrag = useRef<{ key: HintKey; sx: number; sy: number; x: number; y: number } | null>(null);
  const hintRez = useRef<{ key: HintKey; sx: number; s: number } | null>(null);
  const sounds = useRef<Record<string, HTMLAudioElement>>({});
  const leaving = useRef(false);

  // play a piece's hover sound (cached; silently no-ops if the file is missing)
  const playSound = (name?: string) => {
    if (!name) return;
    try {
      let a = sounds.current[name];
      if (!a) {
        a = new Audio(`/sounds/${name}.mp3`);
        a.volume = 0.55;
        sounds.current[name] = a;
      }
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch {}
  };
  // stop a sound the moment the cursor leaves the image
  const stopSound = (name?: string) => {
    if (!name) return;
    const a = sounds.current[name];
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
  };

  // alpha-accurate hover: only the opaque pixels of a cutout trigger its sound
  // (the cutouts are transparent PNGs in overlapping rectangular boxes, so a
  // plain box-hover fires the wrong piece).
  const alphaRef = useRef<Record<string, { w: number; h: number; a: Uint8ClampedArray } | null>>({});
  const geomRef = useRef<
    Array<{ name: string; asset: string; ol: number; ot: number; ow: number; oh: number; rot: number; flip: number }>
  >([]);
  const hoverRef = useRef<string | null>(null);

  // preload a small alpha mask per unique cutout
  useEffect(() => {
    if (phase !== "show") return;
    Array.from(new Set(PIECES.map((p) => p.a))).forEach((asset) => {
      if (alphaRef.current[asset] !== undefined) return;
      alphaRef.current[asset] = null; // in-flight
      const im = new Image();
      im.src = `${A}/${asset}.webp`;
      im.onload = () => {
        const sc = Math.min(1, 128 / Math.max(im.width, im.height));
        const w = Math.max(1, Math.round(im.width * sc));
        const h = Math.max(1, Math.round(im.height * sc));
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = h;
        const cx = cv.getContext("2d", { willReadFrequently: true });
        if (!cx) return;
        cx.drawImage(im, 0, 0, w, h);
        try {
          const d = cx.getImageData(0, 0, w, h).data;
          const a = new Uint8ClampedArray(w * h);
          for (let i = 0; i < w * h; i++) a[i] = d[i * 4 + 3];
          alphaRef.current[asset] = { w, h, a };
        } catch {}
      };
    });
  }, [phase]);

  // cache each piece's on-screen geometry (outer rect + rotation/flip)
  useEffect(() => {
    if (phase !== "show") return;
    const build = () => {
      const stage = document.querySelector(".sp-stage");
      if (!stage) return;
      geomRef.current = PIECES.map((p) => {
        const el = stage.querySelector<HTMLElement>(`[data-name="${p.name}"]`);
        const r = el?.getBoundingClientRect();
        const rotM = p.tf?.match(/rotate\((-?[\d.]+)deg\)/);
        return {
          name: p.name,
          asset: p.a,
          ol: r?.left ?? 0,
          ot: r?.top ?? 0,
          ow: r?.width ?? 0,
          oh: r?.height ?? 0,
          rot: rotM ? (parseFloat(rotM[1]) * Math.PI) / 180 : 0,
          flip: p.tf?.includes("scaleX(-1)") ? -1 : 1,
        };
      });
    };
    const id = requestAnimationFrame(build);
    window.addEventListener("resize", build);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", build);
    };
  }, [phase]);

  // pick the topmost cutout whose opaque pixel is under the cursor → play sound
  useEffect(() => {
    if (phase !== "show" || align) return;
    const onMove = (e: PointerEvent) => {
      const X = e.clientX;
      const Y = e.clientY;
      const g = geomRef.current;
      let hit: string | null = null;
      for (let i = g.length - 1; i >= 0; i--) {
        const q = g[i];
        if (q.ow <= 0) continue;
        const mask = alphaRef.current[q.asset];
        if (!mask) continue;
        let dx = X - q.ol;
        let dy = Y - q.ot;
        if (q.rot) {
          const c = Math.cos(q.rot);
          const s = Math.sin(q.rot);
          const ex = dx * c + dy * s;
          const ey = -dx * s + dy * c;
          dx = ex;
          dy = ey;
        }
        if (q.flip === -1) dx = -dx;
        if (dx < 0 || dy < 0 || dx > q.ow || dy > q.oh) continue;
        // undo the background "contain" letterboxing
        const imgAR = mask.w / mask.h;
        const boxAR = q.ow / q.oh;
        let dispW: number, dispH: number, offX: number, offY: number;
        if (imgAR > boxAR) {
          dispW = q.ow;
          dispH = q.ow / imgAR;
          offX = 0;
          offY = (q.oh - dispH) / 2;
        } else {
          dispH = q.oh;
          dispW = q.oh * imgAR;
          offY = 0;
          offX = (q.ow - dispW) / 2;
        }
        const bx = dx - offX;
        const by = dy - offY;
        if (bx < 0 || by < 0 || bx > dispW || by > dispH) continue;
        const ix = Math.min(mask.w - 1, Math.floor((bx / dispW) * mask.w));
        const iy = Math.min(mask.h - 1, Math.floor((by / dispH) * mask.h));
        if ((mask.a[iy * mask.w + ix] ?? 0) > 24) {
          hit = q.name;
          break;
        }
      }
      if (hit !== hoverRef.current) {
        if (hoverRef.current) stopSound(SOUND[hoverRef.current]);
        hoverRef.current = hit;
        if (hit) playSound(SOUND[hit]);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (hoverRef.current) stopSound(SOUND[hoverRef.current]);
      hoverRef.current = null;
    };
  }, [phase, align]);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // load saved hint layout + enable align mode from ?align
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const hp = JSON.parse(localStorage.getItem(HINT_KEY) ?? "null");
        if (hp?.sound && hp?.enter) setHints(hp);
      } catch {}
      if (new URLSearchParams(window.location.search).has("align")) setAlign(true);
    });
  }, []);

  const copyPositions = () => {
    navigator.clipboard?.writeText(JSON.stringify(hints, null, 2)).catch(() => {});
  };
  const resetPositions = () => {
    setHints(HINTS_DEFAULT);
    try {
      localStorage.removeItem(HINT_KEY);
    } catch {}
  };

  const saveHints = () =>
    setHints((h) => {
      try {
        localStorage.setItem(HINT_KEY, JSON.stringify(h));
      } catch {}
      return h;
    });

  /* ── align mode: drag each hint chip (viewport %) and resize (scale) ── */
  const onHintDown = (key: HintKey) => (e: React.PointerEvent) => {
    if (!align) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    hintDrag.current = { key, sx: e.clientX, sy: e.clientY, x: hints[key].x, y: hints[key].y };
  };
  const onHintMove = (e: React.PointerEvent) => {
    const d = hintDrag.current;
    if (!d) return;
    const nx = Math.max(0, Math.min(100, d.x + ((e.clientX - d.sx) / window.innerWidth) * 100));
    const ny = Math.max(0, Math.min(100, d.y + ((e.clientY - d.sy) / window.innerHeight) * 100));
    setHints((h) => ({ ...h, [d.key]: { ...h[d.key], x: +nx.toFixed(2), y: +ny.toFixed(2) } }));
  };
  const onHintUp = () => {
    if (!hintDrag.current) return;
    hintDrag.current = null;
    saveHints();
  };
  const onHintRezDown = (key: HintKey) => (e: React.PointerEvent) => {
    if (!align) return;
    e.stopPropagation();
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    hintRez.current = { key, sx: e.clientX, s: hints[key].s };
  };
  const onHintRezMove = (e: React.PointerEvent) => {
    const d = hintRez.current;
    if (!d) return;
    const ns = Math.max(0.5, Math.min(3, +(d.s + (e.clientX - d.sx) / 180).toFixed(2)));
    setHints((h) => ({ ...h, [d.key]: { ...h[d.key], s: ns } }));
  };
  const onHintRezUp = () => {
    if (!hintRez.current) return;
    hintRez.current = null;
    saveHints();
  };

  const leave = () => {
    if (leaving.current || phase !== "show") return;
    leaving.current = true;
    splashPlayed = true; // don't replay when navigating back to Home
    setPhase("out");
    hideTimer.current = setTimeout(() => setPhase("hidden"), 850);
  };

  /* wordmark: squiggle → font cycle */
  useEffect(() => {
    if (phase !== "show") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";
    const t0 = setTimeout(() => setCycling(true), reduced ? 0 : CYCLE_START);
    let iv: ReturnType<typeof setInterval> | null = null;
    const t1 = setTimeout(
      () => {
        iv = setInterval(() => setFi((f) => f + 1), CYCLE_MS);
      },
      reduced ? 0 : CYCLE_START
    );
    return () => {
      document.body.style.overflow = "";
      clearTimeout(t0);
      clearTimeout(t1);
      if (iv) clearInterval(iv);
    };
  }, [phase]);

  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    []
  );

  /* exits: scroll / esc / enter — disabled in align mode so repositioning
     (and stray scrolls) don't dismiss the splash */
  useEffect(() => {
    if (phase !== "show" || align) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") leave();
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 10) leave();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, align]);

  if (phase === "hidden") return null;

  const n = NAMES[fi % NAMES.length];

  return (
    <div className={`splash ${phase === "out" ? "out" : ""} ${align ? "sp-alignmode" : ""}`} aria-label="Welcome to Surya's portfolio">
      {/* preconnect + per-script Noto Serif subsets (hoisted by React 19) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {FONT_LINKS.map((u) => (
        <link key={u} rel="stylesheet" href={u} />
      ))}
      <div className="sp-stage" ref={stageRef}>
        <div className="sp-base" />
        <div className="sp-sky" style={{ background: `url(${A}/sky.webp) center 55% / cover no-repeat` }} />
        <div className="sp-arc" />

        {/* collage pieces — each converges outward from behind the word */}
        {PIECES.map((p, i) => {
          const { l, t, w, h } = p.pos;
          const cx = l + w / 2;
          const cy = t + h / 2;
          const outer: CSSProperties = {
            position: "absolute",
            left: `${l}%`,
            top: `${t}%`,
            width: `${w}%`,
            height: `${h}%`,
          };
          const introStyle = {
            width: "100%",
            height: "100%",
            animation: `converge ${p.d}s cubic-bezier(.22,.8,.3,1) ${p.dl}s backwards`,
            "--sx": `${WORD_CX - cx}cqw`,
            "--sy": `${WORD_CY - cy}cqh`,
          } as CSSProperties;
          const rot: CSSProperties = p.tf
            ? { width: "100%", height: "100%", transform: p.tf, transformOrigin: "0 0" }
            : { width: "100%", height: "100%" };
          // custom img (gif) draws on top of the webp; if the gif is missing,
          // its layer is empty and the webp beneath shows through (graceful fallback)
          const bg = p.img
            ? `url(${p.img}) center / contain no-repeat, url(${A}/${p.a}.webp) center / contain no-repeat`
            : `url(${A}/${p.a}.webp) center / contain no-repeat`;
          const asset = (
            <div
              className="sp-piece"
              style={
                {
                  width: "100%",
                  height: "100%",
                  background: bg,
                  "--hov": p.hov ?? "scale(1.05)",
                } as CSSProperties
              }
            />
          );
          return (
            <div key={i} data-name={p.name} style={outer}>
              <div style={introStyle}>
                <div style={rot}>
                  {p.bob ? (
                    <div style={{ width: "100%", height: "100%", animation: `bob ${p.bob[0]}s ease-in-out ${p.bob[1]}s infinite` }}>
                      {asset}
                    </div>
                  ) : (
                    asset
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* wordmark — a zero-size anchor so every font sits in the exact same spot */}
        <div className="sp-word">
          {!cycling ? (
            <svg className="sp-word-el" viewBox="0 0 620 200" fill="none" style={{ width: "30cqw", overflow: "visible" }} aria-label="surya">
              <path d={SQUIGGLE} stroke="#101014" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="760" className="sp-draw" />
            </svg>
          ) : (
            <div
              key={fi}
              lang={n.f.includes("JP") ? "ja" : n.f.includes("SC") ? "zh" : n.f.includes("KR") ? "ko" : undefined}
              className="sp-word-el sp-wordtext"
              style={{ fontFamily: `'${n.f}', serif`, fontWeight: 500, fontSize: `calc(4.9cqw * ${n.s})` }}
            >
              {n.t}
            </div>
          )}
        </div>

        <div className="sp-note sp-note-1">
          till death,
          <br />
          we do art.
        </div>
        <div className="sp-note sp-note-2">
          make her feel
          <br />
          like art. ♡
        </div>

        {(["sound", "enter"] as HintKey[]).map((key) => {
          const p = hints[key];
          return (
            <div
              key={key}
              className={`sp-hint sp-hint-w-${key} ${align ? "sp-hint-drag" : ""}`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%, -50%) scale(${p.s})` }}
              onPointerDown={align ? onHintDown(key) : undefined}
              onPointerMove={align ? onHintMove : undefined}
              onPointerUp={align ? onHintUp : undefined}
              onPointerCancel={align ? onHintUp : undefined}
            >
              {key === "sound" ? (
                <p className="sp-hint-sound">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                    <path d="M19 5a9 9 0 0 1 0 14" />
                  </svg>
                  hover the collage to hear it
                </p>
              ) : (
                <button type="button" className="sp-hint-enter" data-hover onClick={leave}>
                  scroll or press <kbd>enter</kbd> to continue
                </button>
              )}
              {align && (
                <span
                  className="sp-hint-rez"
                  title="drag to resize"
                  onPointerDown={onHintRezDown(key)}
                  onPointerMove={onHintRezMove}
                  onPointerUp={onHintRezUp}
                  onPointerCancel={onHintRezUp}
                >
                  <svg viewBox="0 0 12 12" aria-hidden>
                    <path d="M2 6 L2 2 L6 2 M10 6 L10 10 L6 10 M2.5 2.5 L9.5 9.5" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {align && (
        <div className="sp-align-panel">
          <p>
            <strong>Align mode</strong> — drag the <strong>two hint chips</strong>{" "}
            to move; drag a corner handle to resize.
          </p>
          <p className="sp-align-read">
            sound: {hints.sound.x}%, {hints.sound.y}% ×{hints.sound.s}
            <br />
            enter: {hints.enter.x}%, {hints.enter.y}% ×{hints.enter.s}
          </p>
          <div className="sp-align-btns">
            <button type="button" onClick={copyPositions}>copy positions</button>
            <button type="button" onClick={resetPositions}>reset all</button>
            <button type="button" onClick={() => setAlign(false)}>done</button>
          </div>
        </div>
      )}
    </div>
  );
}
