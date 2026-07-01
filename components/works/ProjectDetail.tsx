"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/hooks/useLenis";
import DockNav from "@/components/DockNav";
import Block from "./Block";
import { useFlashNav } from "./WorksTransition";
import type { CaseStudy } from "@/lib/case-studies";

type Props = {
  study: CaseStudy;
  name: string;
  next: { slug: string; name: string; accent: string };
};

export default function ProjectDetail({ study, name, next }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const { go } = useFlashNav();
  const full = study.kind === "full";
  const [active, setActive] = useState(study.sections[0]?.num ?? "");

  useLenis(true);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 20,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });
      }
      if (full) {
        study.sections.forEach((s) => {
          ScrollTrigger.create({
            trigger: `#sec-${s.num}`,
            start: "top 45%",
            end: "bottom 45%",
            onToggle: (self) => self.isActive && setActive(s.num),
          });
        });
      }
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [study.slug]);

  const dockItems = [
    { label: "← Works", onClick: () => go("/works") },
    { label: "Next →", onClick: () => go(`/works/${next.slug}`) },
  ];

  const toSection = (num: string) => {
    document.getElementById(`sec-${num}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={root} className="detail-page">
      <div className="detail-grid" aria-hidden />

      <header className="detail-bar">
        <Link
          href="/works"
          className="detail-back"
          data-hover
          onClick={(e) => {
            e.preventDefault();
            go("/works");
          }}
        >
          ← works
        </Link>
        <span className="detail-bar-name">{name}</span>
      </header>

      <section className="detail-hero" style={{ background: study.heroBg ?? study.accent }}>
        <span className="sticker keep">keep scrolling !</span>
        <h1
          className="detail-title"
          style={study.heroText === "dark" ? { color: "var(--ink)", textShadow: "none" } : undefined}
        >
          {study.title}
        </h1>
      </section>

      <div className="detail-metabar reveal">
        <div className="meta-row">
          <div className="meta-cell">
            <span className="k">Role</span>
            <span className="v">{study.meta.role}</span>
          </div>
          <div className="meta-cell">
            <span className="k">Team</span>
            <span className="v">{study.meta.team}</span>
          </div>
          <div className="meta-cell">
            <span className="k">Timeline</span>
            <span className="v">{study.meta.timeline}</span>
          </div>
          <div className="meta-cell">
            <span className="k">Skills</span>
            <span className="v">{study.meta.skills}</span>
          </div>
        </div>
        <div className="detail-tags">
          {study.tags.map((t) => (
            <span key={t} className="cs-chip">
              {t}
            </span>
          ))}
        </div>
        {study.links && study.links.length > 0 && (
          <div className="detail-links">
            {study.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="detail-cta" data-hover>
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>

      {full ? (
        <div className="detail-body">
          <nav className="detail-toc" aria-label="Sections">
            <ol>
              {study.sections.map((s) => (
                <li key={s.num}>
                  <a
                    href={`#sec-${s.num}`}
                    className={active === s.num ? "active" : ""}
                    data-hover
                    onClick={(e) => {
                      e.preventDefault();
                      toSection(s.num);
                    }}
                  >
                    <span className="n">{s.num}</span>
                    <span className="lbl">{s.eyebrow}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="detail-read">
            {study.sections.map((s) => (
              <section key={s.num} id={`sec-${s.num}`} className="cs-section">
                <p className="cs-eyebrow reveal">
                  {s.num} · {s.eyebrow}
                </p>
                <h2 className="cs-heading reveal">{s.heading}</h2>
                {s.blocks.map((b, i) => (
                  <div key={i} className="cs-block reveal">
                    <Block block={b} accent={study.accent} />
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>
      ) : (
        <div className="detail-read detail-read-single">
          {study.sections.map((s) => (
            <section key={s.num} className="cs-section">
              <p className="cs-eyebrow reveal">{s.eyebrow}</p>
              <h2 className="cs-heading reveal">{s.heading}</h2>
              {s.blocks.map((b, i) => (
                <div key={i} className="cs-block reveal">
                  <Block block={b} accent={study.accent} />
                </div>
              ))}
            </section>
          ))}
        </div>
      )}

      <footer className="detail-next">
        <span className="sticker nextup reveal">next up...</span>
        <button
          type="button"
          className="next-card reveal"
          data-hover
          onClick={() => go(`/works/${next.slug}`)}
          aria-label={`Next project: ${next.name}`}
        >
          <span className="thumb" style={{ background: next.accent }} aria-hidden />
          <span className="next-name">{next.name}</span>
        </button>
        <Link href="/" className="detail-home" data-hover>
          ↩ back to home
        </Link>
      </footer>

      <DockNav items={dockItems} />
    </div>
  );
}
