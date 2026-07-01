// Long-form case-study content for the /works/[slug] detail pages.
// Keyed by the same slugs as lib/projects.ts (the spiral cards). Each study is
// a list of sections; each section holds typed content `Block`s rendered by
// components/works/Block.tsx.

export type Block =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "callout"; text: string }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "cards"; items: { title: string; text?: string }[] }
  | {
      type: "persona";
      name: string;
      quote: string;
      background: string;
      goals: string;
      pains: string;
      needs: string[];
    }
  | {
      type: "beforeAfter";
      items: {
        beforeTitle: string;
        before: string;
        afterTitle: string;
        after: string;
        improvements: string;
      }[];
    }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "image"; caption: string }
  | { type: "voiceQuotes"; quotes: string[] }
  | { type: "pullQuote"; text: string }
  | { type: "chips"; items: string[] }
  | { type: "qa"; items: { q: string; a: string }[] }
  | { type: "list"; ordered?: boolean; items: string[] };

export type Section = {
  num: string;
  eyebrow: string;
  heading: string;
  blocks: Block[];
};

export type CaseStudy = {
  slug: string;
  /** Long case-study title — the hero headline. */
  title: string;
  /** Hero / image-placeholder accent. */
  accent: string;
  /** Optional hero background override (defaults to `accent`). */
  heroBg?: string;
  /** Hero title colour — defaults to light/white; "dark" for pale heroes. */
  heroText?: "light" | "dark";
  year: string;
  kind: "full" | "linkout" | "stub";
  meta: { role: string; team: string; timeline: string; skills: string };
  tags: string[];
  /** External links — Behance / live site CTA. */
  links?: { label: string; href: string }[];
  sections: Section[];
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  knot: {
    slug: "knot",
    title: "Designing Knot — Where Moments Become Memories",
    accent: "#f0c060",
    year: "2025",
    kind: "full",
    meta: {
      role: "UI/UX Designer (100%)",
      team: "Solo Project",
      timeline: "4 weeks",
      skills: "UX Research, Interaction Design, Visual Design, Usability Testing",
    },
    tags: ["UX Research", "UI Design", "Mobile App", "Figma"],
    links: [
      {
        label: "View on Behance",
        href: "https://www.behance.net/gallery/247113621/knot-Where-Moments-Became-Memories-UXUI-Case-study",
      },
    ],
    sections: [
      {
        num: "01",
        eyebrow: "Context",
        heading: "A private space for families to keep what matters.",
        blocks: [
          {
            type: "paragraph",
            text: "Meaningful moments are scattered across apps — photos in galleries, conversations in chats, reminders in calendars. Nothing connects them into a single, living memory. Knot was designed to be that space: private, intentional, and built for the people who matter most.",
          },
        ],
      },
      {
        num: "02",
        eyebrow: "The Problem",
        heading: "Memories don't disappear. They just lose their place.",
        blocks: [
          {
            type: "cards",
            items: [
              { title: "Scattered across platforms", text: "Memories live in silos with no unified timeline." },
              { title: "Built for sharing, not remembering", text: "Platforms optimize for engagement, not preserving meaning over time." },
              { title: "No space designed for families", text: "No private, structured space for families to capture and revisit shared moments." },
            ],
          },
          { type: "callout", text: "So the moments that matter most end up unstructured, unseen, or forgotten." },
        ],
      },
      {
        num: "03",
        eyebrow: "Research",
        heading: "Understanding how people hold on to what matters.",
        blocks: [
          {
            type: "stats",
            items: [
              { value: "72%", label: "forget important personal dates" },
              { value: "65%", label: "rely on WhatsApp for sharing" },
              { value: "58%", label: "rarely revisit old photos" },
            ],
          },
          { type: "subheading", text: "Qualitative Insights" },
          {
            type: "list",
            items: [
              "People don't struggle to remember dates — they struggle to act on them",
              "Memories stored across apps but rarely revisited meaningfully",
              "Important moments get buried in chats and notifications",
              "Users feel guilty when they forget meaningful events",
              "Privacy is a strong need",
            ],
          },
        ],
      },
      {
        num: "04",
        eyebrow: "Define",
        heading: "Framing the core challenge.",
        blocks: [
          { type: "callout", text: "People don't forget important moments — they miss them at the wrong time. Existing tools are fragmented, emotionally disconnected, and lack privacy." },
          {
            type: "persona",
            name: "Sugumar, The Family Anchor",
            quote: "Everything is somewhere… but never where I need it.",
            background: "35 years old. The one who organizes family gatherings and keeps track of everyone's birthdays.",
            goals: "Centralize records, stay updated.",
            pains: "Scattered info, app fatigue.",
            needs: ["Private Space", "Emotional Reminders", "Structured Environment"],
          },
          { type: "subheading", text: "How Might We…" },
          {
            type: "list",
            items: [
              "Design a system that feels like a shared home rather than a storage app?",
              "Make digital reminders feel warm and emotionally significant?",
              "Balance high structure with the fluidity of human relationships?",
              "Provide total privacy without creating silos of isolation?",
            ],
          },
        ],
      },
      {
        num: "05",
        eyebrow: "Ideate",
        heading: "Exploring solutions and shaping the family experience.",
        blocks: [
          { type: "image", caption: "USER JOURNEY" },
          { type: "subheading", text: "Strategic Design Decisions" },
          {
            type: "qa",
            items: [
              { q: "Why Timeline?", a: "Linear narratives help families see their growth over time." },
              { q: "Why Smart Prompts?", a: "Life is busy — nudges without guilt." },
              { q: "Why Family Graph?", a: "Relationships aren't flat, they're connected." },
              { q: "Why Vault?", a: "Utility breeds retention." },
            ],
          },
        ],
      },
      {
        num: "06",
        eyebrow: "Wireframes",
        heading: "Starting with pen, not pixels.",
        blocks: [
          { type: "paragraph", text: "Before structure and polish, ideas were explored quickly — focusing on flows, relationships, and how memories should feel." },
          { type: "image", caption: "WIREFRAME FLOWS" },
          { type: "callout", text: "Clarity over complexity. Every screen had a purpose." },
        ],
      },
      {
        num: "07",
        eyebrow: "Visual Design",
        heading: "A system designed to feel calm, personal, and expressive.",
        blocks: [
          { type: "paragraph", text: "Soft tones, thoughtful typography, and subtle depth create an experience that feels intimate — not overwhelming." },
          { type: "image", caption: "UI DESIGN SCREENS" },
        ],
      },
      {
        num: "08",
        eyebrow: "Testing",
        heading: "Validating with real users.",
        blocks: [
          {
            type: "stats",
            items: [
              { value: "10", label: "responses" },
              { value: "9", label: "tasks" },
              { value: "100%", label: "success rate" },
            ],
          },
          { type: "callout", text: "Users struggled to find the Family Graph feature — 21.1% misclick rate. Family Graph was nested under Profile, not visible in primary navigation." },
          { type: "subheading", text: "The Fix" },
          { type: "paragraph", text: "Added contextual coach marks and an onboarding layer highlighting key entry points for first-time users. This improved discoverability, resulted in faster task completion, and reduced misclick behavior." },
        ],
      },
      {
        num: "09",
        eyebrow: "Reflection",
        heading: "What this taught me.",
        blocks: [
          { type: "paragraph", text: "Knot taught me that emotional design isn't a nice-to-have — it's the entire product. The challenge wasn't building features; it was designing interactions that feel like care, not utility. The Family Graph discoverability issue was a reminder that even great features fail without proper onboarding and navigation clarity." },
        ],
      },
    ],
  },

  zendo: {
    slug: "zendo",
    title: "Designing Zen Do — A Mindful Productivity App",
    accent: "#4ade80",
    year: "2025",
    kind: "full",
    meta: {
      role: "UI/UX Designer (100%)",
      team: "Solo Project",
      timeline: "3 weeks",
      skills: "UX Research, Interaction Design, Motion Design, Usability Testing",
    },
    tags: ["UX Research", "UI Design", "Productivity", "Mobile App", "Figma"],
    links: [
      {
        label: "View on Behance",
        href: "https://www.behance.net/gallery/246285297/Zen-do-A-Mindful-Productivity-App-UIUX-Case-Study",
      },
    ],
    sections: [
      {
        num: "01",
        eyebrow: "Context",
        heading: "Designing a calmer way to stay productive.",
        blocks: [
          { type: "paragraph", text: "In today's fast-paced world, staying focused has become increasingly difficult. Constant notifications, multitasking, and overwhelming workloads lead to distraction, inconsistency, and burnout. While many productivity tools aim to help users get more done, they often overlook the user's mental well-being. Zen Do was designed to create a balanced productivity experience through focus, recovery, and reflection." },
          { type: "callout", text: "Productivity isn't just about doing more. It's about doing it sustainably." },
        ],
      },
      {
        num: "02",
        eyebrow: "The Problem",
        heading: "Staying productive shouldn't feel overwhelming.",
        blocks: [
          {
            type: "cards",
            items: [
              { title: "Too many tasks, no clear focus" },
              { title: "Constant distractions break concentration" },
              { title: "No structured system for deep work" },
              { title: "Lack of balance between work and rest" },
            ],
          },
          { type: "callout", text: "Productivity without balance leads to burnout." },
        ],
      },
      {
        num: "03",
        eyebrow: "Research",
        heading: "Understanding users through research.",
        blocks: [
          { type: "paragraph", text: "Both qualitative and quantitative research methods were used to understand user behavior, challenges, and gaps in existing solutions." },
          {
            type: "stats",
            items: [
              { value: "78%", label: "difficulty staying focused" },
              { value: "92%", label: "report weekly digital fatigue" },
              { value: "64%", label: "abandon apps within 14 days" },
              { value: "41%", label: "tasks moved to next day" },
            ],
          },
          { type: "subheading", text: "Voice of the User" },
          {
            type: "voiceQuotes",
            quotes: [
              "It just feels like another job. I want something that helps me breathe.",
              "I love the focus timers, but I always forget to take a break.",
              "The streaks are stressful. If I miss one day, I lose everything.",
              "I need an app that understands I'm human, not a task-processing machine.",
              "Everything is so cluttered. My brain hurts just looking at the dashboard.",
            ],
          },
        ],
      },
      {
        num: "04",
        eyebrow: "Define",
        heading: "Defining the problem with clarity.",
        blocks: [
          { type: "callout", text: "Users struggle to maintain consistent focus due to distractions, lack of structured workflows, and absence of balance between work and rest. Existing tools either overwhelm users with tasks or provide rigid systems that fail to adapt to individual needs." },
          {
            type: "persona",
            name: "Deepak, Overwhelmed Student",
            quote: "I just need something that helps me stay focused and not fall behind.",
            background: "Student balancing internship with MBA.",
            goals: "Stay consistent, minimize context switching.",
            pains: "Information overload, difficulty tracking non-academic goals, lack of mindful breaks.",
            needs: ["Structured Focus", "Mindful Breaks", "Simple Interface"],
          },
          {
            type: "persona",
            name: "Avantika, Inconsistent Planner",
            quote: "I plan a lot… but I don't always follow through.",
            background: "Professional struggling to maintain a routine.",
            goals: "Improve follow-through rate, reduce screen time distractions.",
            pains: "Over-planning leads to burnout, notifications break focus, rigid tools feel suffocating.",
            needs: ["Flexible Planning", "Gentle Nudges", "Distraction Free Mode"],
          },
        ],
      },
      {
        num: "05",
        eyebrow: "Ideate",
        heading: "Transforming insights into structured solutions.",
        blocks: [{ type: "image", caption: "USER JOURNEY MAP" }],
      },
      {
        num: "06",
        eyebrow: "Prototype",
        heading: "From structure to screens.",
        blocks: [
          { type: "paragraph", text: "Low-fidelity wireframes were created to explore layout, structure, and user flows before moving into visual design." },
          { type: "image", caption: "WIREFRAME GRID" },
          { type: "callout", text: "Iterating at low fidelity allowed us to discard heavy UI patterns and focus entirely on the spatial relationship between a user's task and their focus." },
        ],
      },
      {
        num: "07",
        eyebrow: "Visual Design",
        heading: "Designing for calm, clarity, and focus.",
        blocks: [
          { type: "paragraph", text: "The visual system is designed to reduce cognitive load, promote calmness, and support deep focus through minimal and intentional design choices." },
          { type: "image", caption: "UI DESIGN SYSTEM" },
        ],
      },
      {
        num: "08",
        eyebrow: "Testing",
        heading: "Measuring clarity, speed, and friction.",
        blocks: [
          {
            type: "stats",
            items: [
              { value: "5", label: "users tested" },
              { value: "6", label: "tasks" },
              { value: "100%", label: "success rate" },
              { value: "0%", label: "drop-off" },
            ],
          },
        ],
      },
      {
        num: "09",
        eyebrow: "Iterations",
        heading: "From friction to flow.",
        blocks: [
          {
            type: "beforeAfter",
            items: [
              {
                beforeTitle: "Complex Ambient Sound Selection",
                before: "Users had to select ambient sounds from the main screen then confirm again separately. This caused a double interaction and cognitive interruption.",
                afterTitle: "Single Immersive Bottom Sheet",
                after: "Redesigned into a single immersive bottom sheet with direct control and real-time feedback.",
                improvements: "One-tap interaction, integrated playback controls, reduced cognitive load.",
              },
              {
                beforeTitle: "No Post-Task Feedback",
                before: "After marking a task done, users returned to the task list without confirmation. There was no sense of accomplishment.",
                afterTitle: "Completion Reward Screen",
                after: "Completion screen with actual time tracking, streaks, and progress indicators.",
                improvements: "Clear completion confirmation, gamification, strong emotional reward.",
              },
              {
                beforeTitle: "Abrupt Task-to-Focus Transition",
                before: "After creating a task, users were directly redirected without acknowledgment or next step guidance.",
                afterTitle: "Confirmation & Recommendations",
                after: "Confirmation screen added with clear next actions and contextual recommendations.",
                improvements: "Immediate feedback, suggested next step, smooth transition into focus mode.",
              },
            ],
          },
        ],
      },
      {
        num: "10",
        eyebrow: "Reflection",
        heading: "Designing beyond productivity.",
        blocks: [
          { type: "paragraph", text: "Zen Do evolved from a simple task manager into a sanctuary for focus. By stripping away the noise of traditional productivity apps, we discovered that the most powerful tool for achievement is mental clarity." },
          { type: "subheading", text: "What I Learned" },
          {
            type: "list",
            ordered: true,
            items: [
              "Minimalism isn't just about removing elements — it's about prioritizing the right ones to reduce cognitive load.",
              "Tonal hierarchy is more effective than structural borders for creating digital calm.",
              "Asymmetry in layout can guide the eye more naturally than a rigid grid.",
              "Interaction feedback should be felt (weight shifts) not just seen (bright flashes).",
              "Mindfulness in UX requires intentional pauses — spacing is as important as the buttons themselves.",
            ],
          },
          { type: "pullQuote", text: "We don't need more time; we need more space to be present in the time we already have." },
        ],
      },
    ],
  },

  shift: {
    slug: "shift",
    title: "Designing Shift — A Career Transition Platform",
    accent: "#4060ff",
    year: "2025",
    kind: "full",
    meta: {
      role: "UI/UX Designer (100%)",
      team: "Solo Project",
      timeline: "3 weeks",
      skills: "UX Research, Interaction Design, Visual Design, Prototyping",
    },
    tags: ["UX Research", "UI Design", "Career Platform", "Figma"],
    links: [
      {
        label: "View on Behance",
        href: "https://www.behance.net/gallery/245704505/Shift-A-Career-Transition-Platform-UX-Case-Study",
      },
    ],
    sections: [
      {
        num: "01",
        eyebrow: "Context",
        heading: "Helping professionals navigate career change with clarity.",
        blocks: [
          { type: "paragraph", text: "Career transitions are complex and unstructured. Most professionals juggle 5+ platforms — job boards, resume tools, interview prep apps — with no single guide helping them understand where they are, what they're missing, and what to do next. Shift was designed to solve that." },
        ],
      },
      {
        num: "02",
        eyebrow: "The Problem",
        heading: "Career switchers are lost between too many tools.",
        blocks: [
          { type: "paragraph", text: "Users struggle to understand how their existing skills translate to new roles. Job search, resume building, and interview preparation are scattered across different platforms. This creates confusion, decision fatigue, and a lack of confidence throughout the journey." },
          {
            type: "cards",
            items: [
              { title: "Skill translation confusion" },
              { title: "Fragmented platforms" },
              { title: "Resume not tailored for transitions" },
              { title: "No structured guidance" },
            ],
          },
          { type: "callout", text: "Career transition is not a single action — it's a journey. Users need guidance, not just tools." },
        ],
      },
      {
        num: "03",
        eyebrow: "Research",
        heading: "Understanding the real friction points.",
        blocks: [
          { type: "paragraph", text: "Conducted both primary and secondary research to understand existing behaviors and pain points." },
          { type: "subheading", text: "Secondary Research Insights" },
          {
            type: "cards",
            items: [
              { title: "Most platforms only solve one part of the journey" },
              { title: "Constant context switching leads to cognitive overload" },
              { title: "Resume tools prioritize format over career narrative" },
              { title: "Users are left guessing their next step" },
            ],
          },
          {
            type: "stats",
            items: [
              { value: "5+", label: "platforms used per journey" },
              { value: "0", label: "clear step-by-step paths found" },
              { value: "4", label: "core pain points reported" },
            ],
          },
          { type: "subheading", text: "Competitor Analysis" },
          { type: "paragraph", text: "Analyzed LinkedIn, Indeed, Canva Resume, Resume.io. Gap identified: none offered a guided end-to-end transition experience." },
        ],
      },
      {
        num: "04",
        eyebrow: "Define",
        heading: "Framing the problem with a user-centric lens.",
        blocks: [
          { type: "callout", text: "Career switchers lack a structured and guided approach to navigate the transition process. Existing solutions are fragmented, making it difficult for users to understand their path, position themselves effectively, and confidently apply for relevant roles." },
          {
            type: "persona",
            name: "Surya, The Aspiring UX Designer",
            quote: "I don't mind starting fresh, but I don't want to start from zero again.",
            background: "Software engineer transitioning into UX design. Strong technical skills but struggles to position himself for UX roles.",
            goals: "Translate technical skills to UX terminology, build portfolio, land Junior UX role.",
            pains: "Difficulty articulating transferable skills, imposter syndrome, lack of clear career path mapping.",
            needs: ["Skill Gap Analysis", "Tailored Roadmap", "Portfolio Review"],
          },
          { type: "subheading", text: "Key Insights" },
          {
            type: "list",
            ordered: true,
            items: [
              "Career transition is a journey, not a single step.",
              "Users need guidance, not just tools.",
              "Fragmentation leads to confusion and drop-offs.",
              "Confidence plays a key role in decision-making.",
              "Personalized experiences improve trust and engagement.",
            ],
          },
        ],
      },
      {
        num: "05",
        eyebrow: "Ideate",
        heading: "Translating insights into structured solutions.",
        blocks: [
          { type: "image", caption: "USER JOURNEY MAP" },
          { type: "subheading", text: "Key Product Directions" },
          { type: "chips", items: ["Guided Career Path", "Skill Gap Intelligence", "Smart Resume Builder", "Application Tracker", "Interview Preparation"] },
        ],
      },
      {
        num: "06",
        eyebrow: "Prototype",
        heading: "From sketches to screens.",
        blocks: [
          {
            type: "list",
            items: [
              "Paper Sketches — quick explorations of layout and flows",
              "Low-Fidelity Wireframes — structure and hierarchy, reducing friction",
              "High-Fidelity Designs — clean minimal visual system, reduced cognitive load",
            ],
          },
          { type: "image", caption: "SKETCHES → WIREFRAMES → HI-FI" },
        ],
      },
      {
        num: "07",
        eyebrow: "Visual Design",
        heading: "A system built for clarity and calm.",
        blocks: [
          { type: "paragraph", text: "Soft color gradients, rounded cards, and clear visual hierarchy create a calm experience that allows users to focus on career progress without feeling overwhelmed." },
          { type: "image", caption: "DESIGN SYSTEM / UI KIT" },
        ],
      },
      {
        num: "08",
        eyebrow: "Testing",
        heading: "Validating with real users.",
        blocks: [
          {
            type: "stats",
            items: [
              { value: "6", label: "participants" },
              { value: "8", label: "tasks assigned" },
              { value: "100%", label: "success rate" },
            ],
          },
          { type: "callout", text: "The app felt intuitive and polished. Very clear roadmap for career shifting." },
        ],
      },
      {
        num: "09",
        eyebrow: "Reflection",
        heading: "What I'd do differently.",
        blocks: [
          { type: "paragraph", text: "This project taught me that career transition tools need to prioritize emotional confidence as much as functional utility. The biggest lesson — fragmentation isn't just a UX problem, it's an emotional one. Users don't just need tools consolidated; they need to feel guided." },
        ],
      },
    ],
  },

  waaah: {
    slug: "waaah",
    title: "Waaah — AI That Speaks Baby",
    accent: "#FFB347",
    year: "2026",
    kind: "full",
    meta: {
      role: "Founder & Product Designer (100%)",
      team: "Solo Project",
      timeline: "May 2026 · 3 days",
      skills: "UX Research, Product Design, AI Integration, React, Shipped Product",
    },
    tags: ["AI Product", "Mobile App", "UX Research", "Shipped"],
    links: [{ label: "Try out Waaah", href: "https://waaah-ai.vercel.app/" }],
    sections: [
      {
        num: "01",
        eyebrow: "Context",
        heading: "Why I built this.",
        blocks: [
          { type: "paragraph", text: "Every new parent has Googled “why is my baby crying” at 3am. The results are either too vague or too scary. There's no calm, intelligent, instant answer — just panic and guesswork." },
          { type: "paragraph", text: "I built Waaah for the Nori Mother's Day AI Challenge: a community-voted contest where the best AI product for moms wins $1,000. I had 3 days, a free tech stack, and one goal — build something a sleep-deprived mom would actually trust at 3am." },
        ],
      },
      {
        num: "02",
        eyebrow: "The Problem",
        heading: "Parents don't need more information. They need one answer.",
        blocks: [
          { type: "callout", text: "I never know if she's hungry or gassy or just overtired. I've Googled 'baby crying won't stop' at 3am more times than I can count. — Shri, first-time mom, 3-month-old" },
          {
            type: "cards",
            items: [
              { title: "Google is too slow and scary", text: "Search results lead to worst-case scenarios, not useful under stress." },
              { title: "Tracker apps are too complex", text: "Moms need a 5-second answer, not a form to fill out." },
              { title: "No context awareness", text: "Nothing connects feeding, sleeping, and cry sounds all at once." },
            ],
          },
        ],
      },
      {
        num: "03",
        eyebrow: "Research",
        heading: "Who I designed for.",
        blocks: [
          {
            type: "persona",
            name: "Shri, 28 — The First-Time Mom",
            quote: "I just need to know if she's okay.",
            background: "3-month-old, maternity leave, exhausted. Googles everything.",
            goals: "Calm confidence at 3am.",
            pains: "Information overload, anxiety.",
            needs: ["Instant clarity", "One-handed usage", "Dark-mode optimization"],
          },
          {
            type: "persona",
            name: "Priya, 34 — The Second-Time Mom",
            quote: "I don't have time for a setup process.",
            background: "8-month-old + 4-year-old, works remotely.",
            goals: "Instant answer, no friction.",
            pains: "Skeptical of apps, busy schedule.",
            needs: ["Zero sign-ups", "Speed", "Direct actions"],
          },
          { type: "subheading", text: "Key Insights" },
          {
            type: "list",
            items: [
              "The most painful moment is not knowing WHY — parents cycle through everything frantically.",
              "One-handed, dark-room usage is critical. Every extra tap is friction.",
              "Design constraint: open to answer in under 20 seconds.",
            ],
          },
        ],
      },
      {
        num: "04",
        eyebrow: "Define",
        heading: "The core insight.",
        blocks: [
          { type: "callout", text: "The product that wins isn't the most feature-rich — it's the one that feels like a calm, experienced friend." },
          {
            type: "cards",
            items: [
              { title: "Hunger → Feed her now", text: "Red blob, crying, drooling" },
              { title: "Tired → Dark room, rock gently", text: "Orange blob, rubbing eye" },
              { title: "Gas → Bicycle kicks", text: "Teal blob, tummy grip" },
              { title: "Pain → Check temperature", text: "Purple blob, lightning bolts" },
              { title: "Comfort → Hold close", text: "Pink blob, arms out" },
            ],
          },
        ],
      },
      {
        num: "05",
        eyebrow: "Design System",
        heading: "Visual language, warm at 3am.",
        blocks: [
          { type: "paragraph", text: "The result screen IS the answer. Full bleed in the cry reason's color. Blob character fills the top half. One giant word. One action. That's it." },
          { type: "paragraph", text: "Two themes set the tone: soft blush for the girl theme (#FFE4EE) and soft sky for the boy theme (#DFF0FF)." },
          { type: "image", caption: "BLOB CHARACTERS COLLAGE" },
          { type: "paragraph", text: "Blob characters — custom characters created to express the exact emotion of the cry reason. They are the heart of the product, helping parents feel the result instantly." },
        ],
      },
      {
        num: "06",
        eyebrow: "User Flow",
        heading: "6 screens, 20 seconds.",
        blocks: [
          { type: "paragraph", text: "The critical path is just 3 screens: Home (record) → Context (3 chip questions) → Result (full screen blob)." },
          {
            type: "stats",
            items: [
              { value: "3", label: "critical screens" },
              { value: "20s", label: "total time" },
              { value: "0", label: "sign-ups required" },
            ],
          },
          { type: "subheading", text: "The Symptom Fallback" },
          { type: "paragraph", text: "A manual describe-what-you-see flow via chips for when the microphone isn't ideal. This was the most important design decision for accessibility and instant adoption." },
        ],
      },
      {
        num: "07",
        eyebrow: "The AI",
        heading: "Gemini 2.0 Flash as the brain.",
        blocks: [
          { type: "paragraph", text: "The AI prompt needed to think like a pediatric nurse — not a chatbot." },
          {
            type: "qa",
            items: [
              { q: "Audio-first detection", a: "Checks if a baby is actually crying before analysis to prevent false positives." },
              { q: "Context-weighted analysis", a: "Cry pattern + time since last feed + sleep + symptoms = trusted reasoning." },
              { q: "Structured JSON output", a: "Direct mapping to UI components for instant rendering." },
            ],
          },
        ],
      },
      {
        num: "08",
        eyebrow: "Build & Ship",
        heading: "Full stack, 3 days, $0.",
        blocks: [
          {
            type: "table",
            headers: ["Layer", "Tool", "Cost"],
            rows: [
              ["Frontend", "React + Vite", "Free"],
              ["Backend", "Node.js + Express", "Free"],
              ["Database", "Supabase", "Free"],
              ["AI", "Gemini 2.0 Flash", "Free"],
            ],
          },
          { type: "subheading", text: "Technical Challenge" },
          { type: "paragraph", text: "Solving iOS Safari's mic permission cold start via a module-level stream cache that keeps the permission alive across recordings." },
        ],
      },
      {
        num: "09",
        eyebrow: "Reflection",
        heading: "What I learned.",
        blocks: [
          { type: "paragraph", text: "Constraint made it better. By cutting everything that wasn't the core 20-second loop, the product became truly useful. Emotion communicates faster than text — the blob characters land differently with a panicked parent than a simple icon ever could." },
          { type: "subheading", text: "Next Steps" },
          {
            type: "list",
            items: [
              "Pattern learning for specific babies",
              "Pediatrician report export (PDF)",
              "Multi-baby support",
              "Native app via Capacitor",
            ],
          },
        ],
      },
    ],
  },

  portfolio: {
    slug: "portfolio",
    title: "By Bharath — A Cinematic Editor Portfolio",
    accent: "#a07850",
    year: "2025",
    kind: "linkout",
    meta: {
      role: "Design + Front-end",
      team: "Client Work",
      timeline: "~1 week",
      skills: "Next.js, GSAP, TypeScript, Vercel",
    },
    tags: ["Client Work", "Front-end", "Live in Production"],
    links: [{ label: "Visit the site", href: "https://bybharath.vercel.app/" }],
    sections: [
      {
        num: "01",
        eyebrow: "Overview",
        heading: "A portfolio built to feel like a showreel.",
        blocks: [
          { type: "paragraph", text: "A cinematic, immersive portfolio for a video editor — full-screen transitions, scroll-driven video reveals, and motion-heavy storytelling. My first paid client build, shipped and live in production." },
          { type: "chips", items: ["Next.js", "GSAP", "TypeScript", "Vercel"] },
          { type: "callout", text: "finally live and it's actually clean af 🔥 big W — Bharath, Video Editor & Content Creator (verified client)" },
        ],
      },
    ],
  },

  afterword: {
    slug: "afterword",
    title: "Afterword — What Will You Leave Behind?",
    accent: "#4A6FA5",
    heroBg: "#FBFBF8",
    heroText: "dark",
    year: "2026",
    kind: "full",
    meta: {
      role: "Solo: product design + full-stack build",
      team: "Solo project",
      timeline: "2026 · Figma Config Makeathon",
      skills: "Product Design, Design Systems, AI Integration, React, TypeScript, Supabase",
    },
    tags: ["Digital Legacy", "AI Product", "Web App", "Hackathon"],
    links: [{ label: "Visit Afterword", href: "https://afterword-mauve.vercel.app/" }],
    sections: [
      {
        num: "01",
        eyebrow: "Premise",
        heading: "For the conversations you keep putting off.",
        blocks: [
          { type: "paragraph", text: "Afterword is a digital legacy app: a calm, private place to record your stories, your voice, your wisdom and the practical things your family will need — and to deliver them to specific people at exactly the right moment. Not after-the-fact estate admin. The warm, human version of 'there are things I always meant to tell you.'" },
          { type: "callout", text: "Leave them everything. Your stories, your wisdom, your voice — preserved forever for the people who matter most." },
          { type: "image", caption: "Splash — the 'Afterword' serif wordmark over 'Leave them everything.'" },
        ],
      },
      {
        num: "02",
        eyebrow: "The Problem",
        heading: "The most important things go unsaid.",
        blocks: [
          { type: "callout", text: "There are things your family will wish they'd asked you." },
          {
            type: "cards",
            items: [
              { title: "Legacy feels morbid, so we delay it", text: "Estate tools are cold and bureaucratic. Nobody opens an app called 'end-of-life planning' on a Tuesday night." },
              { title: "The meaningful part has no home", text: "Wills cover assets. Nothing holds the stories, the voice, the 'open this on your wedding day.'" },
              { title: "Timing is everything, and it's unsolved", text: "A message means the most when it arrives at the right moment — a birthday, a milestone, after you're gone — not all at once, not too early." },
            ],
          },
          { type: "pullQuote", text: "So the stories, the voice, the small bits of wisdom — the things people would treasure most — quietly disappear." },
        ],
      },
      {
        num: "03",
        eyebrow: "The Concept",
        heading: "Reframe legacy as a keepsake, not paperwork.",
        blocks: [
          { type: "paragraph", text: "Two ideas shaped everything:" },
          {
            type: "cards",
            items: [
              { title: "It should feel like a letter, not a legal form", text: "Warm, literary, unhurried — something you'd want to add to." },
              { title: "It has two sides", text: "The owner builds their legacy over time; the recipient receives it, gently, when the moment arrives. The whole product is designed around that handoff." },
            ],
          },
          { type: "callout", text: "The product had to make planning for the end feel like an act of love — because that's the only way anyone actually does it." },
          { type: "image", caption: "Desktop landing — serif 'What will you leave behind?' over the fanned feature deck" },
        ],
      },
      {
        num: "04",
        eyebrow: "Design System",
        heading: "A warm, literary system that carries feeling.",
        blocks: [
          { type: "paragraph", text: "The system does the emotional heavy lifting. Built it first, in Figma, as a real component library so every screen stayed calm and consistent." },
          { type: "subheading", text: "Palette" },
          { type: "paragraph", text: "Canvas #FBFBF8 · White #FFFFFF · Mist #DBE3E9 · Deep Blue #4A6FA5 · Cornflower #6AA6DA · Pear #E1E5AC · Coral #F4845F · Night #111111 · Mid Grey #6B7280. Warm off-white paper, a calm deep blue, and soft accent tones — nothing clinical." },
          { type: "subheading", text: "Type" },
          { type: "paragraph", text: "Display = 'Scholar' italic serif (Wordmark 48 / Chapter names 32 / Emotional copy 24 / Headings 20) — gives it the feel of a printed book. Body = Helvetica Neue (16 / 15 / 13 / 12) — quiet and legible underneath." },
          { type: "subheading", text: "Components" },
          { type: "paragraph", text: "A full kit: Chapter Cards, Buttons, Input Fields, Person Avatar (four tones), Voice Note Player, Stat Cards, Quick-Add cards, Delivery Badge, Relationship Chip, Progress Bar, Bottom Sheet. Navigation is a dark Night bar with a single Pear center 'add' button — Home · Legacy · Vault · People." },
          { type: "callout", text: "A deliberate rule on the People screen — 'no percentages, no progress bars. Name and relationship only.' People aren't tasks to complete." },
          { type: "image", caption: "Design-system board — colours, the Scholar / Helvetica type scale, and the Night nav bar" },
        ],
      },
      {
        num: "05",
        eyebrow: "The Chapters",
        heading: "Everything you can leave behind.",
        blocks: [
          { type: "paragraph", text: "A legacy is built from chapters, each its own small flow:" },
          {
            type: "cards",
            items: [
              { title: "My Story", text: "Long-form chapters of your life, written or AI-interviewed." },
              { title: "Memories", text: "Photos + the feeling behind a moment ('who was there?')." },
              { title: "Letters to Loved Ones", text: "Written letters, delivered later." },
              { title: "Life Timeline", text: "Your life as a sequence of moments." },
              { title: "Capsules", text: "Sealed messages set to open at the right time." },
              { title: "Vault (Practical)", text: "The essentials family will need: medical, legal, financial, insurance, property, passwords, last wishes, contacts." },
            ],
          },
          { type: "image", caption: "Legacy Home — chapter cards under 'Your legacy · 34 stories · 12 memories'" },
        ],
      },
      {
        num: "06",
        eyebrow: "Signature Moments",
        heading: "Where the product comes alive.",
        blocks: [
          { type: "subheading", text: "AI Story Interviewer" },
          { type: "paragraph", text: "Instead of a blank page, an AI gently interviews you. The prompt opens with 'Tell me about a moment that changed who you are.' You answer (typing or voice), and it composes a finished chapter — 'Your story is ready.'" },
          { type: "subheading", text: "Voice Notes" },
          { type: "paragraph", text: "A full-bleed recorder with a live waveform — 'Your voice, forever.' Some things are better heard than read. Recordings attach to memories, letters and capsules." },
          { type: "subheading", text: "The Letter Composer — the signature screen" },
          { type: "paragraph", text: "A letter rendered as a vintage postage stamp: perforated edges, a header reading 'A LETTER FOR EMMA', TO / FROM lines, a real stamp slot, a deco postmark, ruled writing lines, and a date. It makes writing a letter feel like an occasion." },
          { type: "subheading", text: "Capsules" },
          { type: "paragraph", text: "Sealed messages with a delivery condition — 'Open when: Upon my passing' — or a date like an 18th birthday. Each can hold a letter, a voice note and photos." },
          { type: "subheading", text: "Care Packages" },
          { type: "paragraph", text: "Per-recipient curation. For each person you see what they have vs what they're missing, and toggle exactly what's shared (Memories on, Stories on, Financial overview off…). 'A curated gift for each person.'" },
          { type: "image", caption: "Letter Composer — the perforated postage-stamp card with the AFTERWORD postmark" },
          { type: "image", caption: "Capsule Opening — the envelope, wax seal, 'From Surya, on your wedding day'" },
        ],
      },
      {
        num: "07",
        eyebrow: "The Recipient Side",
        heading: "Designed for the moment it's received.",
        blocks: [
          { type: "paragraph", text: "The hardest, most delicate flow: what a loved one sees. It stays quiet and reassuring." },
          { type: "callout", text: "Surya has something waiting for you. You'll know when it's time." },
          {
            type: "cards",
            items: [
              { title: "Holding screen", text: "Before anything unlocks, just a calm message and the Afterword mark. Nothing morbid, nothing countdown-y." },
              { title: "The opening", text: "An envelope, a wax seal, the letter rising into view: 'My darling Emma,'." },
              { title: "After unlock", text: "A gentle home: 'Everything Margaret left for you,' with the chapters they were given." },
              { title: "Preview as them", text: "The owner can step into any recipient's view ('Previewing as Emma') to see exactly what that person will receive." },
            ],
          },
          { type: "image", caption: "Recipient holding screen — 'Surya has something waiting for you. You'll know when it's time.'" },
        ],
      },
      {
        num: "08",
        eyebrow: "The Quiet Mechanism",
        heading: "A check-in that feels like care.",
        blocks: [
          { type: "paragraph", text: "The delivery trigger is a check-in system ('death switch'), designed to feel caring rather than clinical. In onboarding you set a rhythm (30 / 60 / 90 days or 6 months) and name a trusted person. You periodically tap 'I'm here.' If you go quiet, Afterword escalates gently — 'We haven't heard from you,' a soft countdown, a heads-up — and only contacts your trusted person as a last resort." },
          { type: "callout", text: "You'll always get a heads-up first. Your trusted person only hears from us if we genuinely can't reach you." },
          { type: "paragraph", text: "Notifications match that tone — 'It's been 60 days. A quick tap lets your loved ones know you're here.' — never alarmist." },
          { type: "image", caption: "Onboarding done — 'Vault owner · Surya / Trusted person · Avantika / Check-in every · 60 days'" },
        ],
      },
      {
        num: "09",
        eyebrow: "Build",
        heading: "Designed and shipped solo.",
        blocks: [
          { type: "paragraph", text: "Both the design and the build were mine. The whole thing was made inside Figma Make and deployed to production." },
          { type: "chips", items: ["React 18", "Vite", "TypeScript", "Tailwind", "Supabase", "Gemini 2.5 Flash", "Vercel"] },
          {
            type: "stats",
            items: [
              { value: "1", label: "person (design + build)" },
              { value: "6", label: "legacy chapters" },
              { value: "2", label: "sides (owner + recipient)" },
            ],
          },
          { type: "callout", text: "Built for the Figma Config Makeathon 2026 — and won the Google Stitch Challenge along the way." },
        ],
      },
      {
        num: "10",
        eyebrow: "Reflection",
        heading: "Designing for emotion and mortality.",
        blocks: [
          { type: "paragraph", text: "Afterword taught me that for a subject this heavy, restraint is the design. Every instinct to add a metric, a progress bar, an urgent banner had to be resisted — the warmth lives in the spacing, the serif, and the words. The two-sided handoff (owner → recipient) was the real design problem, and getting the recipient's first moment right — calm, dignified, 'you'll know when it's time' — mattered more than any feature. It also proved I can own a product end to end: shape the system, design every screen, and ship the build myself." },
          { type: "pullQuote", text: "The best thing I designed wasn't a screen — it was permission to finally say the thing." },
        ],
      },
    ],
  },

  fwc: {
    slug: "fwc",
    title: "We Are 26 — A FIFA World Cup 2026 Live Dashboard",
    accent: "#E8002D", // placeholder broadcast red — swap for the official FC26 primary
    heroBg: "#14161c", // dark stadium-night cover
    heroText: "light",
    year: "2026",
    kind: "full",
    meta: {
      role: "Solo: design + build (AI-native workflow)",
      team: "Solo project",
      timeline: "2026 · Google Stitch Challenge (Contra)",
      skills: "AI-Native Design, Google Stitch, MCP Automation, Motion & Interaction, HTML/CSS, Netlify",
    },
    tags: ["AI Workflow", "Live Dashboard", "Sports", "Award-winning"],
    links: [
      { label: "Open the dashboard", href: "https://fwc-weare26.netlify.app/" },
      { label: "Stitch project", href: "https://stitch.withgoogle.com/projects/7889672183129917406" },
    ],
    sections: [
      {
        num: "01",
        eyebrow: "Context",
        heading: "A FIFA+ broadcast, built entirely in an AI design tool.",
        blocks: [
          { type: "paragraph", text: "The FIFA World Cup 2026 Live Dashboard is a broadcast-grade, six-page tournament experience — 104 match fixtures, animated Panini-style player cards, a CSS knockout-bracket visualizer, and live tournament-state logic — designed to feel like a FIFA+ broadcast. Every screen was generated with Google Stitch and shipped on Netlify." },
          { type: "callout", text: "The goal wasn't a pretty mockup — it was a real, deployed, real-time-aware product that looks like it came off a broadcast graphics desk." },
          { type: "image", caption: "Home hero — the broadcast-style landing with the live tournament state" },
        ],
      },
      {
        num: "02",
        eyebrow: "The Brief",
        heading: "Build interfaces that feel alive.",
        blocks: [
          { type: "paragraph", text: "The Google Stitch Challenge (on Contra) wasn't asking for a single hero screen. It rewarded process, iteration, interaction, and how Stitch fits a real workflow — and showcasing Stitch's newest capabilities (streaming generation, in-place AI edits, native motion, imports, MCP)." },
          {
            type: "stats",
            items: [
              { value: "6", label: "pages" },
              { value: "104", label: "fixtures" },
              { value: "1", label: "brand kit as source of truth" },
            ],
          },
          { type: "callout", text: "Winner — Google Stitch Challenge, Contra." },
        ],
      },
      {
        num: "03",
        eyebrow: "The Direction",
        heading: "Broadcast polish, not dashboard defaults.",
        blocks: [
          { type: "paragraph", text: "The angle on 'alive': treat it like live sports television. Real-time awareness, the nostalgia of collectible player cards, and the motion language of a broadcast lower-third — so the interface feels like it's running, not just sitting there." },
          {
            type: "cards",
            items: [
              { title: "Broadcast-grade", text: "FIFA+ visual language: bold, high-contrast, motion-rich." },
              { title: "Real-time-aware", text: "Live tournament-state logic, not static fixtures." },
              { title: "Collectible nostalgia", text: "Animated Panini-style player cards as the signature flourish." },
            ],
          },
          { type: "image", caption: "The cyberpunk → FIFA-broadcast redesign of the home hero (before / after)" },
        ],
      },
      {
        num: "04",
        eyebrow: "The Six Pages",
        heading: "A full tournament, end to end.",
        blocks: [
          { type: "paragraph", text: "Six connected screens make up the experience:" },
          {
            type: "cards",
            items: [
              { title: "Home / Hero", text: "Live tournament state, the broadcast landing." },
              { title: "Group standings", text: "The group stage at a glance." },
              { title: "Fixtures", text: "All 104 matches, as broadcast match cards." },
              { title: "Knockout bracket", text: "A CSS bracket visualizer with animated connector lines." },
              { title: "Teams & players", text: "Animated Panini-style collectible cards." },
              { title: "Live match detail", text: "The single-match broadcast view." },
            ],
          },
          { type: "image", caption: "Fixtures grid — the 104-match cards" },
          { type: "image", caption: "Knockout bracket — the CSS bracket with animated connectors" },
        ],
      },
      {
        num: "05",
        eyebrow: "The Workflow",
        heading: "Where this gets interesting.",
        blocks: [
          { type: "paragraph", text: "The whole thing was designed and generated through Stitch. The process, step by step:" },
          {
            type: "cards",
            items: [
              { title: "Brand kit as design.md", text: "Uploaded the official FIFA 2026 design system as a single source of truth so every generation stayed on-brand." },
              { title: "Streaming generation", text: "Built all six screens iteratively, live on the canvas, watching them stream in." },
              { title: "In-place AI edits", text: "Refined components by prompt and point-and-click — including redesigning the home hero from a cyberpunk look into a clean FIFA broadcast treatment, in place." },
              { title: "Stitch via MCP → Antigravity", text: "Connected Stitch through StitchMCP to Antigravity and drove it programmatically, using edit_screen and get_screen to batch-edit every page at once." },
              { title: "Programmatic design iteration", text: "Kept using edit_screen through MCP to refine match cards, the bracket, and player-card layouts across all screens simultaneously." },
              { title: "Native motion", text: "HTML-canvas + CSS animations for the bracket connector lines and the broadcast motion throughout." },
            ],
          },
          { type: "callout", text: "Uploading the brand kit as design.md meant Stitch generated on-brand from the first screen — the system led, not the other way around." },
        ],
      },
      {
        num: "06",
        eyebrow: "Motion & Interaction",
        heading: "Making it feel live.",
        blocks: [
          { type: "paragraph", text: "The 'alive' requirement, delivered in the details: animated Panini-style player cards, CSS-drawn bracket connectors that animate between rounds, live tournament-state logic driving what each screen shows, and broadcast-style motion and hover states across the pages — all HTML-native, no heavy framework." },
          { type: "image", caption: "Player card — the animated Panini-style collectible in motion" },
        ],
      },
      {
        num: "07",
        eyebrow: "The Unlock",
        heading: "Turning a design tool into an automation layer.",
        blocks: [
          { type: "paragraph", text: "Streaming generation and in-place edits are great for speed — but the real unlock was the MCP integration. Orchestrating Stitch with an AI agent (Antigravity) meant generating and editing many screens programmatically, in parallel." },
          { type: "pullQuote", text: "It turns Stitch from a design tool into an automation layer — a completely different, and far more powerful, way to work." },
        ],
      },
      {
        num: "08",
        eyebrow: "Build & Ship",
        heading: "Generated, then deployed.",
        blocks: [
          { type: "paragraph", text: "Stack: Google Stitch (design + generation) · StitchMCP + Antigravity (programmatic orchestration) · HTML canvas + CSS (motion) · Netlify (deploy). The FIFA 2026 brand kit lived as a design.md driving every generation." },
          {
            type: "stats",
            items: [
              { value: "6", label: "screens, batch-edited via MCP" },
              { value: "104", label: "fixtures" },
              { value: "1", label: "deployed, real-time-aware site" },
            ],
          },
        ],
      },
      {
        num: "09",
        eyebrow: "Reflection & Feedback",
        heading: "What I'd want next.",
        blocks: [
          { type: "paragraph", text: "Stitch's streaming generation and in-place edits are genuinely game-changing for rapid prototyping, but driving it through MCP was the highlight of the whole build. Two things I'd love to see next: design-token syncing across screens, so a global style change propagates everywhere automatically; and a full React export with routing intact, instead of exporting screens individually." },
          { type: "pullQuote", text: "The most interesting part of this project wasn't a screen — it was wiring an AI agent to drive the design tool that drew the screens." },
        ],
      },
    ],
  },
};

export const getCaseStudy = (slug: string): CaseStudy | undefined => CASE_STUDIES[slug];
