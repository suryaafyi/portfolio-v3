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
};

/** Placeholder media until real covers land — `linear-gradient` from the stops. */
export const gradient = (p: Project) => `linear-gradient(135deg, ${p.from}, ${p.to})`;

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
  },
];
