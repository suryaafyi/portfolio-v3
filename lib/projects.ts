export type Project = {
  slug: string;
  name: string;
  tag: string; // discipline, shown in meta + list
  year: string;
  role: string;
  blurb: string;
  body: string[]; // seed case-study copy — refine later
  /** Placeholder gradient stops. Swap for real thumb/video paths in /public. */
  from: string;
  to: string;
  /** Real cover image (public path) — layered over the gradient when set. */
  cover?: string;
};

/** Card media — the cover image when present, else the gradient stops. Used
 *  by the /works list view and case-study covers — real photos belong there. */
export const gradient = (p: Project) =>
  p.cover
    ? `url(${p.cover}) center / cover no-repeat, linear-gradient(135deg, ${p.from}, ${p.to})`
    : `linear-gradient(135deg, ${p.from}, ${p.to})`;

/** Gradient only, never the cover photo — for decorative spots (the /works
 *  spiral, the home wheel) that should stay bold color, not real screenshots. */
export const gradientOnly = (p: Project) => `linear-gradient(135deg, ${p.from}, ${p.to})`;

export const PROJECTS: Project[] = [
  {
    slug: "knot",
    name: "Knot",
    tag: "Genealogy · UX research",
    year: "2025",
    role: "Product Design, Research",
    blurb:
      "Documented a 21.1% misclick rate in usability testing, then redesigned the navigation to fix it.",
    body: [
      "Knot started with a question hiding in the data: people kept getting lost building out their family tree. Moderated usability sessions surfaced a 21.1% misclick rate concentrated on the navigation.",
      "The redesign reorganised the information architecture around how people actually think about relationships, then validated the new flow with a fresh round of testing.",
    ],
    from: "#4A6FA5",
    to: "#B8C5D6",
    cover: "/projects/knot/cover.webp",
  },
  {
    slug: "zendo",
    name: "Zendo",
    tag: "Productivity · Onboarding",
    year: "2025",
    role: "Product Design",
    blurb:
      "An onboarding flow built on progressive disclosure, so new users are guided instead of overwhelmed.",
    body: [
      "Most onboarding throws everything at a new user at once. Zendo takes the opposite stance — reveal each capability at the moment it becomes useful.",
      "Progressive disclosure keeps the first session calm, while a lightweight progress model gives returning users a sense of momentum.",
    ],
    from: "#E8A87C",
    to: "#F0EDE5",
    cover: "/projects/zendo/cover.webp",
  },
  {
    slug: "shift",
    name: "Shift",
    tag: "Career platform",
    year: "2025",
    role: "Design + Front-end",
    blurb:
      "A cross-platform product helping people navigate a career transition, end to end.",
    body: [
      "Shift helps people in the middle of a career transition see the whole path — from where they are to where they want to be — in one coherent product.",
      "Spanning web and mobile, the work paired research-led design with a front-end build focused on speed and clarity.",
    ],
    from: "#27344a",
    to: "#4A6FA5",
    cover: "/projects/shift/hero.webp",
  },
  {
    slug: "afterword",
    name: "Afterword",
    tag: "Digital legacy",
    year: "2026",
    role: "Solo full-stack",
    blurb:
      "A warm, literary place to leave your stories, voice and wishes — delivered to the people you love at exactly the right moment. Solo design + build for Figma Config Makeathon 2026; won the Google Stitch Challenge.",
    body: [
      "Afterword is a place to preserve a digital legacy: the messages, files, and memories worth keeping. Built solo, full-stack, for the Figma Config Makeathon 2026.",
      "Every decision balanced emotional weight with technical constraint — encryption, access, and a tone that respects the subject.",
    ],
    from: "#7f9bbf",
    to: "#F0EDE5",
    cover: "/projects/afterword/cover.webp",
  },
  {
    slug: "waaah",
    name: "Waaah",
    tag: "Baby cry interpreter · AI",
    year: "2026",
    role: "Design + Build",
    blurb:
      "An AI app that interprets a baby's cry. Reached #2 on the leaderboard on real votes.",
    body: [
      "Waaah listens to a baby's cry and offers a best-guess interpretation, pairing an audio model with a calm, reassuring interface for exhausted parents.",
      "It reached #2 on the leaderboard on real community votes — a validation that the idea resonated.",
    ],
    from: "#F0C8A8",
    to: "#E8A87C",
    cover: "/projects/waaah/waaah-hero.webp",
  },
  {
    slug: "fwc",
    name: "We Are 26",
    tag: "FIFA 2026 · Live Dashboard",
    year: "2026",
    role: "Design + Build (AI-native)",
    blurb:
      "A broadcast-grade, 6-page FIFA World Cup 2026 live dashboard built entirely with Google Stitch — 104 fixtures, animated Panini-style player cards, a CSS knockout bracket, and a workflow automated by driving Stitch through MCP. Winner, Google Stitch Challenge.",
    body: [
      "A broadcast-grade FIFA World Cup 2026 live dashboard — six pages, 104 fixtures, animated Panini-style player cards and a CSS knockout bracket — generated entirely in Google Stitch and shipped on Netlify.",
      "The standout was the workflow: driving Stitch programmatically through MCP to batch-edit every screen at once. Winner of the Google Stitch Challenge.",
    ],
    from: "#E8002D",
    to: "#8a0b2b",
    cover: "/projects/fwc/fwc-hero.webp",
  },
  {
    slug: "fero",
    name: "Fero",
    tag: "Energy bar branding · AI",
    year: "2026",
    role: "Brand Design (AI-native)",
    blurb:
      "FERO — untamed energy. A fictional energy-bar brand carried by one mascot: the chill-est predator alive. One tiger, one attitude, a complete identity system — built end-to-end in Recraft.",
    body: [
      "Most energy brands scream at you. FERO doesn't have to. The brand is built on one idea — real energy doesn't need to prove itself — and carried by a designer-toy tiger with a permanent half-lidded stare.",
      "One character, one attitude, stretched across a complete identity: fur-built wordmark, packaging, posters, merch, a street vending machine and a full motion ad. Every asset unmistakably FERO.",
    ],
    from: "#ef8632",
    to: "#2b2118",
    cover: "/projects/fero/wordmark.webp",
  },
  {
    slug: "sk-fitness",
    name: "SK Fitness Studio",
    tag: "Gym website · Client work",
    year: "2026",
    role: "Design + Build (AI-native)",
    blurb:
      "A conversion-first website for a unisex strength & cardio studio in Chinnadharapuram, Karur — built to turn local searches into booked free trials.",
    body: [
      "SK Fitness Studio needed more than a listing: a real storefront that answers what a walk-in actually asks — what does it cost, when is it open, and can I try it first. The site leads with a free-trial offer and a WhatsApp tap, then backs it up with programs, zones, schedule and transparent pricing.",
      "Built AI-native on Base44 and shipped live: a bold gym-poster identity, marquee energy strips, program cards, a two-session daily schedule, four clean pricing tiers, a floor gallery and member stories — all tuned for a phone-first local audience.",
    ],
    from: "#e8462a",
    to: "#171412",
    cover: "/projects/sk-fitness/skfitness-hero.webp",
  },
  {
    slug: "portfolio",
    name: "Cinematic portfolio",
    tag: "Cinematic editor portfolio",
    year: "2026",
    role: "Design + Build",
    blurb:
      "A cinematic portfolio for a video editor, built with GSAP and Framer Motion.",
    body: [
      "A cinematic portfolio for a video editor — the kind of site where the motion is the message. Built with GSAP and Framer Motion.",
      "Scroll-driven sequences and considered pacing let the work breathe, with performance guarded the whole way.",
    ],
    from: "#d8b48c",
    to: "#a07850",
    cover: "/projects/portfolio/portfolio-hero.webp",
  },
];
