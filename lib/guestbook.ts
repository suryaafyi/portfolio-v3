// Guestbook — visitor pass data + Supabase REST helpers. Access is guarded by
// RLS: the publishable key can only insert cards and read visible ones.

export type CardSticker = { k: string; x: number; y: number; r: number }; // x/y normalized 0..1
export type Stroke = { c: string; pts: number[] }; // flattened normalized x,y pairs

export type VisitorCardData = {
  id?: string;
  num?: number;
  created_at?: string;
  name: string;
  role?: string | null;
  email?: string | null;
  color: string;
  stickers: CardSticker[];
  doodle: Stroke[];
};

/* Card base colors (all light so ink text stays readable) */
export const CARD_COLORS: { k: string; bg: string; label: string }[] = [
  { k: "paper", bg: "#ffffff", label: "paper" },
  { k: "beige", bg: "#f0ede5", label: "beige" },
  { k: "sky", bg: "#dde6f2", label: "sky" },
  { k: "pink", bg: "#f9dee6", label: "pink" },
  { k: "mint", bg: "#ddefe3", label: "mint" },
  { k: "butter", bg: "#f9eecb", label: "butter" },
];

/* Doodle pen colors */
export const PEN_COLORS: { k: string; c: string; label: string }[] = [
  { k: "ink", c: "#1c2533", label: "ink" },
  { k: "blue", c: "#4a6fa5", label: "blue" },
  { k: "flash", c: "#3147e8", label: "flash" },
  { k: "rose", c: "#cf5666", label: "rose" },
];

export const cardBg = (k: string) => CARD_COLORS.find((c) => c.k === k)?.bg ?? "#ffffff";
export const penColor = (k: string) => PEN_COLORS.find((p) => p.k === k)?.c ?? "#1c2533";

/* ── custom avatar ──
   Each pass gets a glossy little "goo-blob" creature, generated deterministically
   from the visitor's name (falls back to their pass number). Same name → same
   face, forever — a lightweight identicon in the site's own goo-pet language. */
export function seedHash(s: string): number {
  let h = 2166136261 >>> 0;
  const str = s && s.trim() ? s.trim().toLowerCase() : "anon";
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // avalanche (murmur3 finalizer) so short names spread across the palette
  h ^= h >>> 15;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}

/* [glossy highlight, main body, deep shadow] — all read on cream/light cards */
export const AVATAR_PALETTE: [string, string, string][] = [
  ["#ffd9b0", "#ff7722", "#b8480a"], // orange (site accent)
  ["#bcc8ff", "#3147e8", "#1b2ba8"], // flash blue
  ["#f8bcc4", "#cf5666", "#94293a"], // rose
  ["#a9ecc9", "#2fae7a", "#157049"], // mint
  ["#ffe6a3", "#e0a92f", "#a4740f"], // butter
  ["#d8c9ff", "#7b5cff", "#4a31c0"], // violet
  ["#a0e8e8", "#00a6a6", "#046a6a"], // teal
  ["#c6ced9", "#586780", "#2c3750"], // slate
];

export const MAX_STICKERS = 12;
export const MAX_STROKES = 60;

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const guestbookEnabled = Boolean(URL && KEY);

const REST = `${URL}/rest/v1/visitor_cards`;
const headers = {
  apikey: KEY ?? "",
  "Content-Type": "application/json",
};

export async function fetchCards(limit = 80): Promise<VisitorCardData[]> {
  if (!guestbookEnabled) return [];
  const res = await fetch(
    `${REST}?select=id,num,created_at,name,role,email,color,stickers,doodle&order=created_at.desc&limit=${limit}`,
    { headers }
  );
  if (!res.ok) throw new Error(`wall fetch failed (${res.status})`);
  return res.json();
}

export async function postCard(card: VisitorCardData): Promise<VisitorCardData> {
  if (!guestbookEnabled) throw new Error("guestbook backend not configured");
  const res = await fetch(REST, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify({
      name: card.name.slice(0, 40),
      role: card.role?.slice(0, 60) || null,
      email: card.email?.slice(0, 80) || null,
      color: card.color,
      stickers: card.stickers.slice(0, MAX_STICKERS),
      doodle: card.doodle.slice(0, MAX_STROKES),
    }),
  });
  if (!res.ok) throw new Error(`pin failed (${res.status})`);
  const rows = await res.json();
  return rows[0];
}
