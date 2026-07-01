import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scrapbook — Surya",
  description: "ARTSCRAPS — a messy little archive of things I made & unmade. A 3D, flip-through art zine.",
};

// Surya's own self-contained 3D scrapbook export, served from /public and
// embedded full-bleed. A back control is layered on top (the export has no nav).
export default function Scrapbook() {
  return (
    <div className="scrapbook-route">
      <Link href="/about" className="scrapbook-back" data-hover>
        ← Back to About
      </Link>
      <iframe src="/scrapbook.html" title="Surya's scrapbook" className="scrapbook-frame" />
    </div>
  );
}
