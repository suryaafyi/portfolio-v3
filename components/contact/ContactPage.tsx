"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SiteFooter from "@/components/v4/SiteFooter";
import ContraMark from "@/components/v4/ContraMark";

const EMAIL = "suryaarunachalam2001@gmail.com";
const SUBJECT = encodeURIComponent("Let's build something");
const BODY = encodeURIComponent("Hi Surya,\n\nI've got an idea -");

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
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);
  return time;
}

const CHANNELS = [
  { k: "Contra", v: "contra.com/suryafyi", href: "https://contra.com/suryafyi/" },
  { k: "Instagram", v: "@surya.fyi", href: "https://www.instagram.com/surya.fyi/" },
  { k: "LinkedIn", v: "in/surya-ux", href: "https://www.linkedin.com/in/surya-ux/" },
  { k: "Behance", v: "be/suryaa-fyi", href: "https://www.behance.net/suryaa-fyi" },
];

const STEPS = [
  { n: "01", t: "You send a line", d: "An idea, a brief, or just a hello. However rough, that's fine — I'd honestly rather see the messy version." },
  { n: "02", t: "I reply within a day", d: "Straight from me, personally. No bots, no account manager, no telephone game." },
  { n: "03", t: "We map it out", d: "If it's a fit, a quick call to scope it — then I design the thing and build it." },
];

export default function ContactPage() {
  const time = useISTTime();
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLElement>(null);

  /* postcard message + mailer animation */
  const [msg, setMsg] = useState("");
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "sending" | "sent">("idle");
  const [formErr, setFormErr] = useState<string | null>(null);
  const postRef = useRef<HTMLDivElement>(null);
  const mailTl = useRef<gsap.core.Timeline | null>(null);

  const sendPostcard = () => {
    if (phase !== "idle") return;
    if (!msg.trim()) {
      setFormErr("write a little something first :)");
      return;
    }
    setFormErr(null);
    const href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      `A postcard from ${fromName.trim() || "a visitor"}`
    )}&body=${encodeURIComponent(
      `${msg.trim()}\n\n— ${fromName.trim() || "a visitor"}${fromEmail.trim() ? ` (${fromEmail.trim()})` : ""}`
    )}`;
    const finish = () => {
      setPhase("sent");
      window.location.href = href; // hand off to their mail app
    };
    setPhase("sending");
    setFlipped(false); // show the pretty cover as it gets mailed

    const root = postRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      tl.set(".pc-box", { autoAlpha: 1 })
        .set(".pc-stamp2", { autoAlpha: 0, scale: 1.6, rotate: 6 })
        .set(".pc-postmark", { autoAlpha: 0, scale: 1.6, rotate: -9 })
        .set(".pc-ink", { autoAlpha: 0 })
        // stamp lands
        .to(".pc-stamp2", { autoAlpha: 1, scale: 1, rotate: 6, duration: 0.32, ease: "back.out(2.2)" })
        // postmark cancels it with an inky bloom + elastic settle
        .to(".pc-postmark", { autoAlpha: 1, scale: 1.06, rotate: -9, duration: 0.16, ease: "power4.out" }, "+=0.18")
        .set(".pc-ink", { autoAlpha: 1 }, "<")
        .to(".pc-postmark", { scale: 1, duration: 0.34, ease: "elastic.out(1, 0.55)" })
        // card whisks down into the slot
        .to(".pc-mailer", { yPercent: -4, duration: 0.2, ease: "power2.out" }, "+=0.4")
        .to(".pc-mailer", { yPercent: 30, scale: 0.92, duration: 0.34, ease: "power2.in" })
        .to(".pc-mailer", { yPercent: 78, scaleY: 0.3, scaleX: 0.84, autoAlpha: 0, duration: 0.42, ease: "power3.in" })
        // flag drops
        .to(".pc-box-flag", { rotate: 130, duration: 0.55, ease: "bounce.out" }, "-=0.14");
      mailTl.current = tl;
    }, root);
    void ctx;
  };

  const resetPostcard = () => {
    if (postRef.current) {
      gsap.set(postRef.current.querySelectorAll(".pc-mailer, .pc-flip"), { clearProps: "all" });
      gsap.set(postRef.current.querySelectorAll(".pc-box, .pc-stamp2, .pc-postmark, .pc-ink, .pc-box-flag"), { clearProps: "all" });
    }
    mailTl.current = null;
    setMsg("");
    setFromName("");
    setFromEmail("");
    setPhase("idle");
    setFlipped(true); // land them back on the writing side
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".cx-hline", {
        yPercent: 115,
        duration: 0.9,
        stagger: 0.09,
        ease: "expo.out",
        delay: 0.1,
      });
      gsap.from(".cx-top, .cx-lede", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.5,
        ease: "power3.out",
      });
      gsap.utils.toArray<HTMLElement>(".cx-reveal").forEach((el) => {
        gsap.from(el, {
          y: 34,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="cx" ref={rootRef}>
      {/* hero */}
      <section className="cx-hero">
        <div className="cx-top">
          <span className="cx-eyebrow">Contact — Chennai, IN</span>
          <span className="cx-clock">
            <span className="cx-ping" aria-hidden />
            <strong>{time}</strong> IST · usually awake
          </span>
        </div>
        <h1 className="cx-title">
          <span className="cx-mask">
            <span className="cx-hline">Let&rsquo;s make</span>
          </span>
          <span className="cx-mask">
            <span className="cx-hline">
              something real<span className="cx-c">©</span>
            </span>
          </span>
        </h1>
        <p className="cx-lede">
          A product to build, a prototype to rescue, or just a half-formed
          hunch — I read every single one. Replies within a day, promise.
        </p>
      </section>

      {/* the giant, click-to-copy email */}
      <section className="cx-mailsec">
        <span className="cx-eyebrow cx-reveal">Drop me a line</span>
        <button
          type="button"
          className={`cx-mail cx-reveal ${copied ? "is-copied" : ""}`}
          onClick={copyEmail}
          data-cursor={copied ? "Copied!" : "Copy"}
          aria-live="polite"
        >
          <span className="cx-mail-txt">{EMAIL}</span>
          <span className="cx-mail-hint">
            {copied ? "copied to clipboard ✓" : "click to copy"}
          </span>
        </button>
        <div className="cx-actions cx-reveal">
          <a
            className="cx-cta"
            data-hover
            href={`mailto:${EMAIL}?subject=${SUBJECT}&body=${BODY}`}
          >
            Write me a letter
            <i aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22 11 13 2 9Z" />
              </svg>
            </i>
          </a>
          <a
            className="v4-contra"
            href="https://contra.com/suryafyi/"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Hire me"
          >
            <ContraMark />
            <span>Hire me on Contra</span>
            <i aria-hidden>↗</i>
          </a>
        </div>
      </section>

      {/* vintage postcard — front: greetings-from-Chennai art; back: a message
          you can actually write + send, which seals into an envelope (GSAP) */}
      <section className="cx-sec cx-postsec">
        <span className="cx-eyebrow cx-reveal">Send me a postcard</span>
        <div className={`pc cx-reveal ${phase === "sent" ? "is-sent" : ""}`} ref={postRef}>
          <div className="pc-mailer">
            <div className={`pc-flip-wrap ${flipped ? "is-flipped" : ""}`}>
              <div className="pc-flip">
                {/* ── FRONT: the cover art ── */}
                <button
                  type="button"
                  className="pc-face pc-front"
                  aria-hidden={flipped}
                  tabIndex={flipped ? -1 : 0}
                  onClick={() => setFlipped(true)}
                  data-hover
                  data-cursor="Write on it"
                  aria-label="Flip the postcard to write a message"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="pc-cover" src="/postcard-chennai.webp" alt="Greetings from Chennai — vintage postcard" />
                  <span className="pc-fliphint" aria-hidden>flip to write ✎</span>
                </button>

                {/* ── BACK: the writable message ── */}
                <div className="pc-face pc-back" aria-hidden={!flipped}>
                  <span className="pc-bhead" aria-hidden>
                    <span className="pc-postcard">Postcard</span>
                    <span className="pc-sub">The Surya Mail</span>
                  </span>
                  <span className="pc-divider" aria-hidden />

                  <label className="pc-sronly" htmlFor="pc-msg">Your message</label>
                  <textarea
                    id="pc-msg"
                    className="pc-msg"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Write me a note…&#10;an idea, a brief, or just hello."
                    maxLength={600}
                    tabIndex={flipped ? 0 : -1}
                    aria-label="Your message"
                  />

                  <span className="pc-stampwrap" aria-hidden>
                    <span className="pc-stamp">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/Avatar.png" alt="" />
                    </span>
                    <svg className="pc-cardmark" viewBox="0 0 120 120" aria-hidden>
                      <circle cx="60" cy="60" r="40" fill="none" stroke="#171412" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.7" />
                      <path id="pcRing" d="M60 60 m-28 0 a28 28 0 1 1 56 0 a28 28 0 1 1 -56 0" fill="none" />
                      <text fontSize="9" letterSpacing="2" fill="#171412" opacity="0.75">
                        <textPath href="#pcRing" startOffset="4%">SURYA · POST · CHENNAI · IN ·</textPath>
                      </text>
                      <g stroke="#171412" strokeWidth="2.5" opacity="0.55" strokeLinecap="round">
                        <path d="M96 44 q14 8 0 16" />
                        <path d="M100 40 q20 12 0 24" />
                      </g>
                    </svg>
                  </span>

                  <div className="pc-addr">
                    <span className="pc-addr-k">to · Surya</span>
                    <input
                      className="pc-in"
                      value={fromName}
                      onChange={(e) => setFromName(e.target.value)}
                      placeholder="your name"
                      maxLength={40}
                      tabIndex={flipped ? 0 : -1}
                      aria-label="Your name"
                    />
                    <input
                      className="pc-in"
                      type="email"
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      placeholder="your email (so I can reply)"
                      maxLength={80}
                      tabIndex={flipped ? 0 : -1}
                      aria-label="Your email"
                    />
                  </div>

                  <button
                    type="button"
                    className="pc-send"
                    onClick={sendPostcard}
                    disabled={phase !== "idle"}
                    tabIndex={flipped ? 0 : -1}
                    data-hover
                    data-cursor="Seal it"
                  >
                    {phase === "sending" ? "sealing…" : "Send it"}
                    <i aria-hidden>✦</i>
                  </button>
                  {formErr && (
                    <span className="pc-err" role="alert">{formErr}</span>
                  )}
                </div>
              </div>
            </div>

            {/* stamp + postmark that cancel the card, then it posts into the box (GSAP) */}
            <span className="pc-stamp2" aria-hidden />
            <svg className="pc-postmark" viewBox="0 0 150 120" aria-hidden>
              <g className="pc-ink">
                <circle cx="52" cy="60" r="33" fill="#1c2a44" opacity="0.06" />
                <circle cx="112" cy="58" r="8" fill="#1c2a44" opacity="0.05" />
              </g>
              <circle cx="52" cy="60" r="31" fill="none" stroke="#1c2a44" strokeWidth="3.4" opacity="0.78" />
              <circle cx="52" cy="60" r="24" fill="none" stroke="#1c2a44" strokeWidth="1.6" opacity="0.55" />
              <text x="52" y="51" textAnchor="middle" fontFamily="var(--font-space-mono), monospace" fontSize="9" letterSpacing="1" fill="#1c2a44" opacity="0.82">CHENNAI</text>
              <text x="52" y="66" textAnchor="middle" fontFamily="var(--font-space-mono), monospace" fontWeight="700" fontSize="12" fill="#1c2a44" opacity="0.9">26·07</text>
              <text x="52" y="79" textAnchor="middle" fontFamily="var(--font-space-mono), monospace" fontSize="8" letterSpacing="1" fill="#1c2a44" opacity="0.72">· IN ·</text>
              <g stroke="#1c2a44" strokeWidth="3.4" opacity="0.62" strokeLinecap="round" fill="none">
                <path d="M86 44 q18 16 0 32" /><path d="M96 40 q24 20 0 40" /><path d="M106 38 q28 22 0 44" />
              </g>
            </svg>
          </div>

          <div className="pc-box" aria-hidden>
            <span className="pc-box-body" />
            <span className="pc-box-slot" />
            <span className="pc-box-label">SURYA · POST</span>
            <span className="pc-box-flag"><span className="pc-box-flagcloth" /></span>
          </div>

          {phase === "sent" ? (
            <div className="pc-sent" role="status">
              <span className="pc-sent-mark">✦</span>
              <p>Sealed &amp; sent. Your mail app should be popping open — hit send there and it lands straight in my inbox.</p>
              <button type="button" className="pc-again" onClick={resetPostcard} data-hover>
                write another →
              </button>
            </div>
          ) : (
            <span className="pc-hint" aria-hidden>
              {flipped ? "write your note, then seal it ✦" : "tap the card to write on it ✎"}
            </span>
          )}
        </div>
      </section>

      {/* what happens next */}
      <section className="cx-sec">
        <h2 className="cx-h2 cx-reveal">
          What happens
          <br />
          next
        </h2>
        <ol className="cx-steps">
          {STEPS.map((s) => (
            <li key={s.n} className="cx-reveal">
              <span className="cx-n">({s.n})</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* find me elsewhere — social cards that invert on hover */}
      <section className="cx-sec">
        <h2 className="cx-h2 cx-reveal">
          Find me
          <br />
          elsewhere
        </h2>
        <div className="cx-social cx-reveal">
          {CHANNELS.map((c) => (
            <a
              key={c.k}
              className="cx-scard"
              href={c.href}
              data-hover
              data-cursor="Open"
              target={c.href.startsWith("#") ? undefined : "_blank"}
              rel="noopener noreferrer"
            >
              <span className="cx-scard-go" aria-hidden>↗</span>
              <span className="cx-scard-plat">{c.k}</span>
              <span className="cx-scard-handle">{c.v}</span>
            </a>
          ))}
        </div>
        <p className="cx-foot cx-reveal">
          no stamps required · postage covered by the internet
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
