"use client";

import { useEffect, useRef, useState } from "react";
import HuntSticker from "@/components/hunt/HuntSticker";

const EMAIL = "suryaarunachalam2001@gmail.com";
const SUBJECT = encodeURIComponent("Let's build something");
const BODY = encodeURIComponent("Hi Surya,\n\nI've got an idea —");

/** Live clock in my timezone (IST), ticking once a second. */
function useISTTime() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/** Rotating rubber-stamp postmark with circular text + cancel waves. */
function Postmark() {
  return (
    <svg className="pc-postmark" viewBox="0 0 130 130" aria-hidden>
      <defs>
        <path
          id="pc-pm-circle"
          d="M65,65 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
        />
      </defs>
      <circle cx="65" cy="65" r="60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="2 5" />
      <circle cx="65" cy="65" r="33" fill="none" stroke="currentColor" strokeWidth="2" />
      <text fontSize="11.5" letterSpacing="2.6" fill="currentColor" fontFamily="var(--font-space-mono), monospace">
        <textPath href="#pc-pm-circle">CHENNAI · 13.08°N 80.27°E · PAR AVION ·</textPath>
      </text>
      <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M48 57 q 8 -5 17 0 t 17 0" />
        <path d="M48 65 q 8 -5 17 0 t 17 0" />
        <path d="M48 73 q 8 -5 17 0 t 17 0" />
      </g>
    </svg>
  );
}

function PlaneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22 11 13 2 9Z" />
    </svg>
  );
}

export default function ContactPage() {
  const time = useISTTime();
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // Clipboard API can be unavailable (http, permissions) — fall back.
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  return (
    <main className="pc-page">
      <section className="postcard" aria-label="Contact — a postcard from Surya">
        <div className="pc-inner">
          {/* Left: the message side */}
          <div className="pc-left">
            <p className="pc-eyebrow">Airmail — from Chennai, IN</p>
            <h1 className="pc-title">
              Got an idea? <br />
              Post it my way.
            </h1>
            <p className="pc-sub">
              A product to build, a prototype to rescue, or a half-formed hunch
              — I read every letter that lands here.
            </p>
            <p className="pc-hand" aria-hidden>
              — replies within a day, promise :)
            </p>

            <div className="pc-actions">
              <a
                className="pc-cta"
                data-hover
                href={`mailto:${EMAIL}?subject=${SUBJECT}&body=${BODY}`}
              >
                Write me a letter <PlaneIcon />
              </a>
              <button
                type="button"
                className={`pc-copy ${copied ? "is-copied" : ""}`}
                data-hover
                onClick={copyEmail}
                aria-live="polite"
              >
                {copied ? "Copied to clipboard ✓" : EMAIL}
              </button>
            </div>
          </div>

          <div className="pc-divider" aria-hidden />

          {/* Right: the address side */}
          <div className="pc-right">
            <div className="pc-stampzone">
              <div className="pc-stamp" data-hover>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Avatar.png" alt="Hand-drawn portrait of Surya on a postage stamp" />
                <span className="pc-stamp-val" aria-hidden>₹5</span>
              </div>
              <Postmark />
            </div>

            <dl className="pc-address">
              <div className="pc-row">
                <dt>To</dt>
                <dd>You, anywhere on Earth</dd>
              </div>
              <div className="pc-row">
                <dt>From</dt>
                <dd>Surya — designer who codes</dd>
              </div>
              <div className="pc-row">
                <dt>Re</dt>
                <dd>Your next product</dd>
              </div>
            </dl>

            <p className="pc-clock">
              <span className="ping" aria-hidden />
              <span className="pc-clock-t">{time}</span> IST — usually awake
            </p>
          </div>
        </div>
        <HuntSticker id="contact" className="hunt-spot-contact" />
      </section>

      <p className="pc-foot" aria-hidden>
        no stamps required · postage covered by the internet
      </p>
    </main>
  );
}
