// Sticker Hunt — 5 collectible stickers hidden across the site. Found ids are
// persisted in localStorage; components sync via the "hunt:update" event.

export type HuntSticker = { id: string; page: string; hint: string };

export const HUNT_STICKERS: HuntSticker[] = [
  { id: "home", page: "Home", hint: "hiding in plain sight" },
  { id: "works", page: "Works", hint: "orbiting the spiral" },
  { id: "about", page: "About", hint: "at the end of the story" },
  { id: "lab", page: "Lab", hint: "needs a few stirs to surface" },
  { id: "contact", page: "Contact", hint: "stuck to the postcard" },
];

const KEY = "surya-hunt-v1";
const CELEBRATED_KEY = "surya-hunt-celebrated-v1";

export function getFound(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/* useSyncExternalStore adapters — snapshot is cached by raw string so the
   reference stays stable between renders. */
const EMPTY: string[] = [];
let snapCache: string[] = EMPTY;
let snapRaw: string | null = null;

export function subscribeHunt(cb: () => void) {
  window.addEventListener("hunt:update", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("hunt:update", cb);
    window.removeEventListener("storage", cb);
  };
}

export function getFoundSnapshot(): string[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY) ?? "[]";
  } catch {
    raw = "[]";
  }
  if (raw !== snapRaw) {
    snapRaw = raw;
    snapCache = getFound();
  }
  return snapCache;
}

export function getFoundServerSnapshot(): string[] {
  return EMPTY;
}

export function markFound(id: string) {
  const found = getFound();
  if (!found.includes(id)) {
    found.push(id);
    try {
      localStorage.setItem(KEY, JSON.stringify(found));
    } catch {}
  }
  window.dispatchEvent(new CustomEvent("hunt:update", { detail: { found } }));
}

export function isComplete(found = getFound()) {
  return HUNT_STICKERS.every((s) => found.includes(s.id));
}

export function wasCelebrated() {
  try {
    return localStorage.getItem(CELEBRATED_KEY) === "1";
  } catch {
    return true;
  }
}

export function markCelebrated() {
  try {
    localStorage.setItem(CELEBRATED_KEY, "1");
  } catch {}
}
