# Book-Themed Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Arnav's book-themed portfolio — paper aesthetic, chapters, candle-lit dark mode, ambient music — per the approved spec at `docs/superpowers/specs/2026-07-04-book-portfolio-design.md`.

**Architecture:** Next.js App Router static site. All content in typed TS files under `content/`. Shared chrome (theme toggle, music toggle, chapter nav, colophon) in `app/layout.tsx`; the paper "sheet" and page-turn transition live in `app/template.tsx` so every route change re-animates. No backend, no CMS.

**Tech Stack:** Next.js 16.2.10, React 19, Tailwind 4 (CSS-first config), `motion` (framer-motion), `next-themes`, `use-sound`, `usehooks-ts`, `next/font` (Lora + Caveat).

## Global Constraints

- Next.js `16.2.10`, React `19.2.4`, Tailwind `4` — already installed. Tailwind 4 is configured **in CSS** (`@theme` in `app/globals.css`); there is NO `tailwind.config.*` and none must be created.
- New deps (user explicitly wants deps that keep code small): `motion`, `next-themes`, `use-sound`, `usehooks-ts`.
- Import motion APIs from `"motion/react"` (the `motion` package), not `"framer-motion"`.
- Palette (exact values, defined once as CSS vars): light — desk `#e6dcc8`, paper `#f7f1e3`, ink `#2b2620`, ink-faded `#6b6154`, accent (navy) `#1f3a5f`, note `#7a7265`. Dark ("candle-lit") — desk `#16110b`, paper `#241c12`, ink `#e8dcc8`, ink-faded `#a89878`, accent (amber) `#d9a05b`, note `#b3a184`.
- Fonts: Lora (body serif, CSS var `--font-lora`) and Caveat (handwriting, CSS var `--font-caveat`) via `next/font/google`.
- Resume facts must stay exactly as in the spec (numbers, dates, names, links). Tone may be book-like; facts may not change.
- All animation must respect `prefers-reduced-motion` (use `useReducedMotion()` from `motion/react` → fall back to opacity-only fades).
- This repo has no test framework; the verification gate per task is `npm run build` (expect "Compiled successfully" and no type errors) plus `npm run lint` (expect no errors). Do not add a test framework.
- Commit after every task. End commit messages with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

## User-Supplied Assets (not blockers, swap points)

- `public/audio/ambient.m4a` — Task 9 generates a soft brown-noise loop with ffmpeg as a working stand-in; user replaces with a preferred CC0 cozy track later (same path, no code change). (keep the .m4a filename, or update the path in components/MusicToggle.tsx)
- `public/resume.pdf` — user drops in their real resume; until then the "printed copy" link 404s (acceptable pre-launch).
- 4 projects — user provides later; `content/projects.ts` ships with an empty typed array and the Works page renders a handwritten "still being written" note when empty. Adding projects is a data-file edit only.

## Deliberate simplifications (approved deviations)

- Cover's "open the book" interaction → staggered fade-in of the table of contents (a real flip can be added later; typography carries the cover).
- Page-turn transition animates the **incoming** page only (App Router templates remount on navigation; exit animations fight the router — entry settle at 400ms reads as a page turn).
- Margin notes are floated asides inside the text column (true outside-margin notes need a wider fixed canvas; float degrades gracefully on mobile).

---

### Task 1: Dependencies, fonts, theme tokens, paper CSS

**Files:**
- Modify: `app/globals.css` (full replace)
- Modify: `app/layout.tsx` (full replace)
- Modify: `package.json` (via npm install)

**Interfaces:**
- Produces: CSS vars + Tailwind color utilities `bg-desk`, `bg-paper`, `text-ink`, `text-ink-faded`, `text-accent`, `text-note`, `border-ink-faded`; font utilities `font-serif` (Lora) and `font-hand` (Caveat); helper classes `.drop-cap`, `.sheet-shadow`; dark mode via `.dark` class on `<html>` (next-themes). Later tasks rely on all of these names.

- [ ] **Step 1: Install dependencies**

```bash
npm install motion next-themes use-sound usehooks-ts
```

Expected: all four added to `package.json` dependencies, no peer-dep errors (all support React 19).

- [ ] **Step 2: Verify the `@/*` path alias exists**

Run: `grep -A3 '"paths"' tsconfig.json`
Expected: `"@/*": ["./*"]`. If missing, add inside `compilerOptions`:

```json
"paths": { "@/*": ["./*"] }
```

- [ ] **Step 3: Replace `app/globals.css`**

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --desk: #e6dcc8;
  --paper: #f7f1e3;
  --ink: #2b2620;
  --ink-faded: #6b6154;
  --accent: #1f3a5f;
  --note: #7a7265;
  --sheet-shadow: rgba(43, 38, 32, 0.18);
  --grain-opacity: 0.05;
}

.dark {
  --desk: #16110b;
  --paper: #241c12;
  --ink: #e8dcc8;
  --ink-faded: #a89878;
  --accent: #d9a05b;
  --note: #b3a184;
  --sheet-shadow: rgba(0, 0, 0, 0.55);
  --grain-opacity: 0.08;
}

@theme inline {
  --color-desk: var(--desk);
  --color-paper: var(--paper);
  --color-ink: var(--ink);
  --color-ink-faded: var(--ink-faded);
  --color-accent: var(--accent);
  --color-note: var(--note);
  --font-serif: var(--font-lora), Georgia, serif;
  --font-hand: var(--font-caveat), cursive;
}

body {
  background: var(--desk);
  color: var(--ink);
}

/* paper grain over everything, click-through */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  opacity: var(--grain-opacity);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* candlelight glow, dark theme only */
.dark body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 60% 40% at 50% 0%,
    rgba(217, 160, 91, 0.13),
    transparent 70%
  );
}

.drop-cap::first-letter {
  float: left;
  font-size: 3.1em;
  line-height: 0.85;
  padding-right: 0.09em;
  font-weight: 600;
  color: var(--accent);
}

.sheet-shadow {
  box-shadow:
    0 1px 3px var(--sheet-shadow),
    0 14px 40px var(--sheet-shadow);
}
```

- [ ] **Step 4: Replace `app/layout.tsx`**

(Chrome components arrive in Tasks 2 and 9; this compiles standalone now.)

```tsx
import type { Metadata } from "next";
import { Lora, Caveat } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: { default: "Arnav Waghdhare", template: "%s · Arnav Waghdhare" },
  description:
    "The collected works of Arnav Waghdhare — computer engineer, machine learning and full stack.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${caveat.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-desk font-serif text-ink">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="relative z-10 mx-auto w-full max-w-3xl px-4 py-10 sm:py-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Note: `suppressHydrationWarning` on `<html>` is required by next-themes (it mutates the class before hydration).

- [ ] **Step 5: Verify build**

Run: `npm run build && npm run lint`
Expected: "Compiled successfully", routes `/` listed; lint clean.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json app/globals.css app/layout.tsx tsconfig.json
git commit -m "feat: paper palette, fonts, theme provider, deps

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Site content data + chrome (theme toggle, chapter nav, colophon)

**Files:**
- Create: `content/site.ts`
- Create: `components/ThemeToggle.tsx`
- Create: `components/BookmarkNav.tsx`
- Create: `components/Colophon.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: color/font utilities from Task 1.
- Produces: `site` object `{ name, role, location, edition, email, github, linkedin }` from `@/content/site`; components `<ThemeToggle />`, `<BookmarkNav />`, `<Colophon />` (all prop-less). The chapter list lives in `BookmarkNav` and the cover page duplicates its routes deliberately (different presentation).

- [ ] **Step 1: Create `content/site.ts`**

```ts
export const site = {
  name: "Arnav Waghdhare",
  role: "Computer Engineer — Machine Learning & Full Stack",
  location: "Mumbai",
  edition: "First Edition · MMXXVII",
  email: "arnavwaghdhare@gmail.com",
  github: "https://github.com/arnav0405",
  linkedin: "https://www.linkedin.com/in/arnav-waghdhare-a6888b2aa",
};
```

- [ ] **Step 2: Create `components/ThemeToggle.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

function CandleIcon({ lit }: { lit: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <rect x="9" y="11" width="6" height="9" rx="1" />
      <line x1="12" y1="11" x2="12" y2="8.5" />
      {lit && (
        <path
          d="M12 3c1.3 1.5 1.9 2.7 0 4.8-1.9-2.1-1.3-3.3 0-4.8z"
          fill="currentColor"
          stroke="none"
          className="animate-pulse"
        />
      )}
    </svg>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <span className="inline-block size-9" />;

  const dark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Blow out the candle" : "Light a candle"}
      title={dark ? "Blow out the candle" : "Light a candle"}
      className="grid size-9 place-items-center rounded-full bg-paper text-ink-faded shadow-sm transition hover:scale-110 hover:text-accent"
    >
      <CandleIcon lit={dark} />
    </button>
  );
}
```

- [ ] **Step 3: Create `components/BookmarkNav.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const chapters = [
  { href: "/", label: "Cover" },
  { href: "/about", label: "Prologue" },
  { href: "/projects", label: "Works" },
  { href: "/experience", label: "Experience" },
];

export function BookmarkNav() {
  const pathname = usePathname();
  const link = (c: (typeof chapters)[number]) => (
    <Link
      key={c.href}
      href={c.href}
      aria-current={pathname === c.href ? "page" : undefined}
      className={`font-hand text-xl leading-none transition hover:text-accent ${
        pathname === c.href ? "text-accent" : "text-note"
      }`}
    >
      {c.label}
    </Link>
  );

  return (
    <>
      {/* bookmark ribbon, desktop */}
      <nav
        aria-label="Chapters"
        className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex"
      >
        {chapters.map(link)}
      </nav>
      {/* compact top nav, mobile/tablet */}
      <nav
        aria-label="Chapters"
        className="relative z-40 mx-auto flex max-w-3xl justify-center gap-5 px-4 pt-4 lg:hidden"
      >
        {chapters.map(link)}
      </nav>
    </>
  );
}
```

- [ ] **Step 4: Create `components/Colophon.tsx`**

```tsx
import { site } from "@/content/site";

export function Colophon() {
  return (
    <footer className="relative z-10 mx-auto max-w-3xl px-4 pb-10 pt-6 text-center text-sm text-ink-faded">
      <div className="mb-3 text-accent" aria-hidden>
        ❦
      </div>
      <p>
        Set in Lora &amp; Caveat. Bound with Next.js. {site.location},{" "}
        {site.edition}.
      </p>
      <p className="mt-2 flex justify-center gap-4">
        <a
          className="text-accent underline-offset-4 hover:underline"
          href={`mailto:${site.email}`}
        >
          Email
        </a>
        <a
          className="text-accent underline-offset-4 hover:underline"
          href={site.github}
        >
          GitHub
        </a>
        <a
          className="text-accent underline-offset-4 hover:underline"
          href={site.linkedin}
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
```

- [ ] **Step 5: Wire chrome into `app/layout.tsx`**

Add imports after the `"./globals.css"` import:

```tsx
import { ThemeToggle } from "@/components/ThemeToggle";
import { BookmarkNav } from "@/components/BookmarkNav";
import { Colophon } from "@/components/Colophon";
```

Replace the `<ThemeProvider …>` block's children so the body reads:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <div className="fixed right-4 top-4 z-40 flex gap-2">
    <ThemeToggle />
  </div>
  <BookmarkNav />
  <main className="relative z-10 mx-auto w-full max-w-3xl px-4 py-10 sm:py-16">
    {children}
  </main>
  <Colophon />
</ThemeProvider>
```

(The `fixed` toggle container gains the MusicToggle in Task 9.)

- [ ] **Step 6: Verify**

Run: `npm run build && npm run lint`
Expected: clean. Then `npm run dev`, open http://localhost:3000 — candle toggle switches cream/candle-lit themes with no flash on reload; nav + colophon render.

- [ ] **Step 7: Commit**

```bash
git add content/site.ts components/ app/layout.tsx
git commit -m "feat: theme toggle, chapter nav, colophon chrome

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Paper sheet + page-turn transition (`template.tsx`)

**Files:**
- Create: `app/template.tsx`

**Interfaces:**
- Consumes: `bg-paper`, `.sheet-shadow` from Task 1.
- Produces: every `page.tsx` renders inside the animated paper sheet automatically — pages must NOT add their own paper background.

- [ ] **Step 1: Create `app/template.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, rotateX: 5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200, transformOrigin: "center top" }}
      className="sheet-shadow rounded-sm bg-paper px-6 py-10 sm:px-12 sm:py-14"
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build && npm run lint` — clean. In dev, navigating between routes (only `/` exists yet; re-check after Task 5) replays the settle animation. With macOS "Reduce motion" on, it's a plain fade.

- [ ] **Step 3: Commit**

```bash
git add app/template.tsx
git commit -m "feat: paper sheet with page-turn entry transition

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Shared book components (ChapterHeading, MarginNote, Asterism)

**Files:**
- Create: `components/ChapterHeading.tsx`
- Create: `components/MarginNote.tsx`
- Create: `components/Asterism.tsx`

**Interfaces:**
- Produces: `<ChapterHeading numeral="I" title="Prologue" />`; `<MarginNote>{children}</MarginNote>` (floated handwritten aside, scroll-reveal); `<Asterism />` (❦ section divider). Used by all chapter pages.

- [ ] **Step 1: Create `components/ChapterHeading.tsx`**

```tsx
export function ChapterHeading({
  numeral,
  title,
}: {
  numeral: string;
  title: string;
}) {
  return (
    <header className="mb-10 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-ink-faded">
        Chapter {numeral}
      </p>
      <h1 className="mt-2 text-4xl">{title}</h1>
      <div className="mt-4 text-accent" aria-hidden>
        ❦
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create `components/MarginNote.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";

export function MarginNote({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.aside
      initial={reduce ? { opacity: 0 } : { opacity: 0, rotate: -4, y: 8 }}
      whileInView={
        reduce ? { opacity: 1 } : { opacity: 1, rotate: -1.5, y: 0 }
      }
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="float-right clear-right my-2 ml-5 w-40 font-hand text-xl leading-snug text-note"
    >
      ✎ {children}
    </motion.aside>
  );
}
```

- [ ] **Step 3: Create `components/Asterism.tsx`**

```tsx
export function Asterism() {
  return (
    <div className="my-10 text-center text-accent" aria-hidden>
      ❦
    </div>
  );
}
```

- [ ] **Step 4: Verify + commit**

Run: `npm run build && npm run lint` — clean (components unused yet; lint must not flag them as errors — unused *files* are fine, unused imports are not, so don't import them anywhere yet).

```bash
git add components/ChapterHeading.tsx components/MarginNote.tsx components/Asterism.tsx
git commit -m "feat: chapter heading, margin note, asterism components

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Cover page (`/`)

**Files:**
- Modify: `app/page.tsx` (full replace)

**Interfaces:**
- Consumes: `site` from `@/content/site`.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/content/site";

const toc = [
  { href: "/about", numeral: "I", title: "Prologue" },
  { href: "/projects", numeral: "II", title: "Works" },
  { href: "/experience", numeral: "III", title: "Experience" },
];

export default function Cover() {
  const reduce = useReducedMotion();
  const fadeUp = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  });

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center py-8 text-center">
      <motion.p
        {...fadeUp(0.1)}
        className="text-xs uppercase tracking-[0.4em] text-ink-faded"
      >
        {site.edition}
      </motion.p>

      <motion.h1 {...fadeUp(0.25)} className="mt-6 text-5xl sm:text-6xl">
        {site.name}
      </motion.h1>

      <motion.p
        {...fadeUp(0.4)}
        className="mt-4 max-w-md text-lg italic text-ink-faded"
      >
        {site.role}
      </motion.p>

      <motion.div {...fadeUp(0.5)} className="mt-4 text-accent" aria-hidden>
        ❦
      </motion.div>

      <motion.nav
        {...fadeUp(0.7)}
        aria-label="Table of contents"
        className="mt-12 w-full max-w-sm text-left"
      >
        <h2 className="mb-4 text-center text-sm uppercase tracking-[0.3em] text-ink-faded">
          Contents
        </h2>
        <ol className="space-y-3">
          {toc.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="group flex items-baseline gap-2">
                <span className="transition group-hover:text-accent">
                  {c.title}
                </span>
                <span className="flex-1 border-b border-dotted border-ink-faded/50" />
                <span className="text-ink-faded">{c.numeral}</span>
              </Link>
            </li>
          ))}
        </ol>
      </motion.nav>

      <motion.p {...fadeUp(0.85)} className="mt-12 flex gap-5 text-sm">
        <a
          className="text-accent underline-offset-4 hover:underline"
          href={`mailto:${site.email}`}
        >
          Email
        </a>
        <a
          className="text-accent underline-offset-4 hover:underline"
          href={site.github}
        >
          GitHub
        </a>
        <a
          className="text-accent underline-offset-4 hover:underline"
          href={site.linkedin}
        >
          LinkedIn
        </a>
      </motion.p>

      <motion.p
        {...fadeUp(1.0)}
        className="mt-10 text-xs uppercase tracking-[0.3em] text-ink-faded"
      >
        {site.location} · MMXXVII
      </motion.p>

      <motion.p
        {...fadeUp(1.1)}
        className="mt-6 font-hand text-xl text-note"
      >
        pull up a chair, stay a while.
      </motion.p>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build && npm run lint` — clean. In dev: cover elements fade in staggered (feels like the book opening); TOC links navigate (target pages 404 until Tasks 6–8 — expected).

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: book cover landing page with table of contents

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Prologue page (`/about`)

**Files:**
- Create: `content/about.ts`
- Create: `app/about/page.tsx`

**Interfaces:**
- Consumes: `ChapterHeading`, `MarginNote`, `Asterism` from Task 4.
- Produces: `prologue: string[]`, `certificates: string[]`, `mentorship: { title: string; story: string }` from `@/content/about`.

- [ ] **Step 1: Create `content/about.ts`**

```ts
export const prologue = [
  "I'm Arnav — a computer engineering student in my final year at K. J. Somaiya College of Engineering, Mumbai, where I began my B.Tech in 2023 and will finish in 2027.",
  "Most of my time goes into two loves that turned out to be the same love: machine learning and building things for the web. I like systems that do real work — scrapers that gather millions of records, models that learn to describe what they see, tools that make someone's day measurably easier.",
  "This site is my corner of the internet: part portfolio, part reading chair. The chapters ahead hold what I've built, where I've worked, and what I've published.",
];

export const certificates = [
  "Supervised Machine Learning — DeepLearning.AI, Nov 2024",
  "Advanced Learning Algorithms — DeepLearning.AI, Dec 2024",
  "Mastering Multi-Agent AI: Building Intelligent Collaborative Systems — IUCEE, Dec 2024",
];

export const mentorship = {
  title: "Somaiya Machine Learning Research Association — Associate Mentor (Jul 2024 – Apr 2025)",
  story:
    "I delivered a hands-on ML workshop for 20+ students, walking them through Support Vector Machines and K-Nearest Neighbors. The trick was breaking complex ideas into pieces small enough to be fun — by the end, the room was asking the kind of questions that mean it clicked.",
};
```

- [ ] **Step 2: Create `app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import { ChapterHeading } from "@/components/ChapterHeading";
import { MarginNote } from "@/components/MarginNote";
import { Asterism } from "@/components/Asterism";
import { prologue, certificates, mentorship } from "@/content/about";

export const metadata: Metadata = { title: "Prologue" };

export default function About() {
  return (
    <article>
      <ChapterHeading numeral="I" title="Prologue" />

      <MarginNote>{certificates[0]}</MarginNote>
      <p className="drop-cap text-lg leading-8">{prologue[0]}</p>

      <MarginNote>{certificates[1]}</MarginNote>
      <p className="mt-6 text-lg leading-8">{prologue[1]}</p>

      <MarginNote>{certificates[2]}</MarginNote>
      <p className="mt-6 text-lg leading-8">{prologue[2]}</p>

      <Asterism />

      <section>
        <h2 className="text-sm uppercase tracking-[0.3em] text-ink-faded">
          On Teaching
        </h2>
        <h3 className="mt-3 text-xl">{mentorship.title}</h3>
        <p className="mt-3 text-lg leading-8">{mentorship.story}</p>
      </section>
    </article>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build && npm run lint` — clean, `/about` in route list. In dev: drop cap on first paragraph; certificates float as tilted handwritten notes revealing on scroll.

- [ ] **Step 4: Commit**

```bash
git add content/about.ts app/about/page.tsx
git commit -m "feat: prologue chapter with story, mentorship, certificate margin notes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Works page (`/projects`)

**Files:**
- Create: `content/projects.ts`
- Create: `app/projects/page.tsx`

**Interfaces:**
- Consumes: `ChapterHeading`, `MarginNote`, `Asterism`.
- Produces: types `Project { title, summary, tech: string[], link?, note? }` and `Paper { title, venue, link? }`; exports `projects: Project[]` (empty until user supplies) and `papers: Paper[]`.

- [ ] **Step 1: Create `content/projects.ts`**

```ts
export type Project = {
  title: string;
  summary: string;
  tech: string[];
  link?: string;
  note?: string;
};

export type Paper = {
  title: string;
  venue: string;
  link?: string;
};

// User will supply 4 projects; page shows a "still being written" note while empty.
export const projects: Project[] = [];

export const papers: Paper[] = [
  {
    title:
      "Smart Farming Innovations for Maharashtra Using ML with Dual-Node LoRaWAN Connectivity",
    venue: "IEEE",
    link: "https://ieeexplore.ieee.org/document/11507500",
  },
  {
    title:
      "Gesture-Based Assistive Tool for Children with Speech and Hearing Impairments",
    venue:
      "Springer — presented at the 6th International Conference on Computer Vision and Robotics (CVR 2026)",
  },
];
```

- [ ] **Step 2: Create `app/projects/page.tsx`**

```tsx
import type { Metadata } from "next";
import { ChapterHeading } from "@/components/ChapterHeading";
import { MarginNote } from "@/components/MarginNote";
import { Asterism } from "@/components/Asterism";
import { projects, papers } from "@/content/projects";

export const metadata: Metadata = { title: "Works" };

export default function Projects() {
  return (
    <article>
      <ChapterHeading numeral="II" title="Works" />

      {projects.length === 0 ? (
        <p className="text-center font-hand text-2xl text-note">
          the next four stories are still being written — check back soon.
        </p>
      ) : (
        <div className="space-y-10">
          {projects.map((p) => (
            <section key={p.title}>
              {p.note && <MarginNote>{p.note}</MarginNote>}
              <h2 className="text-2xl">
                {p.link ? (
                  <a
                    href={p.link}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
              </h2>
              <p className="mt-2 text-lg leading-8">{p.summary}</p>
              <p className="mt-2 text-sm italic text-ink-faded">
                {p.tech.join(" · ")}
              </p>
            </section>
          ))}
        </div>
      )}

      <Asterism />

      <section>
        <h2 className="mb-6 text-center text-sm uppercase tracking-[0.3em] text-ink-faded">
          In Print
        </h2>
        <ol className="space-y-6">
          {papers.map((p) => (
            <li key={p.title} className="pl-6 -indent-6 text-lg leading-8">
              {p.link ? (
                <a
                  href={p.link}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  “{p.title}”
                </a>
              ) : (
                <>“{p.title}”</>
              )}{" "}
              <span className="italic text-ink-faded">— {p.venue}.</span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build && npm run lint` — clean, `/projects` listed. In dev: handwritten placeholder note; two citations, IEEE one linked.

- [ ] **Step 4: Commit**

```bash
git add content/projects.ts app/projects/page.tsx
git commit -m "feat: works chapter with publications and project scaffold

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Experience page (`/experience`)

**Files:**
- Create: `content/experience.ts`
- Create: `app/experience/page.tsx`

**Interfaces:**
- Consumes: `ChapterHeading`, `MarginNote`, `Asterism`.
- Produces: `Internship { company, role, period, story: string[], note? }`; exports `internships: Internship[]`, `skills: Record<string, string[]>`.

- [ ] **Step 1: Create `content/experience.ts`**

```ts
export type Internship = {
  company: string;
  role: string;
  period: string;
  story: string[];
  note?: string;
};

export const internships: Internship[] = [
  {
    company: "Datafuel",
    role: "Full Stack Developer",
    period: "May – August 2026",
    story: [
      "Worked on web scraping at serious scale — up to 15 million products collected in 4 hours.",
      "Built the full-stack platform around it: a React front end over an async FastAPI back end with Celery task queues. The platform helped improve the business by 80%.",
    ],
    note: "fifteen million products in four hours.",
  },
  {
    company: "Evoastra Ventures",
    role: "Data Scientist Intern",
    period: "July – August 2026",
    story: [
      "Led my team to build and deploy a web scraper for dynamic sites, handling large-scale data collection with Selenium and BeautifulSoup, and assembled a comprehensive database of car information and pricing.",
      "Developed a CNN+LSTM image-captioning model in TensorFlow, reaching a BLEU score of 0.56.",
    ],
    note: "a model that describes what it sees.",
  },
];

export const skills: Record<string, string[]> = {
  Languages: [
    "Python",
    "C++",
    "TypeScript",
    "JavaScript",
    "Go",
    "Rust",
    "Java",
    "Kotlin",
    "PHP",
    "Bash",
    "Shell",
    "HTML",
    "CSS",
  ],
  Web: ["ReactJS", "TailwindCSS", "PostgreSQL", "AJAX"],
  "Machine Learning & AI": [
    "PyTorch",
    "Lightning",
    "TensorFlow",
    "LangChain",
    "NumPy",
    "Pandas",
    "Scikit-learn",
    "Google-ADK",
    "Ollama",
    "OpenRouter",
  ],
};
```

- [ ] **Step 2: Create `app/experience/page.tsx`**

```tsx
import type { Metadata } from "next";
import { ChapterHeading } from "@/components/ChapterHeading";
import { MarginNote } from "@/components/MarginNote";
import { Asterism } from "@/components/Asterism";
import { internships, skills } from "@/content/experience";

export const metadata: Metadata = { title: "Experience" };

export default function Experience() {
  return (
    <article>
      <ChapterHeading numeral="III" title="Experience" />

      <div className="space-y-12">
        {internships.map((job) => (
          <section key={job.company}>
            {job.note && <MarginNote>{job.note}</MarginNote>}
            <h2 className="text-2xl">
              {job.role} · {job.company}
            </h2>
            <p className="mt-1 text-sm italic text-ink-faded">{job.period}</p>
            {job.story.map((para) => (
              <p key={para} className="mt-3 text-lg leading-8">
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>

      <Asterism />

      <section>
        <h2 className="mb-6 text-center text-sm uppercase tracking-[0.3em] text-ink-faded">
          Appendix — Index of Skills
        </h2>
        <dl className="space-y-4">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group} className="text-lg leading-8">
              <dt className="inline font-semibold">{group}: </dt>
              <dd className="inline text-ink-faded">{items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Asterism />

      <p className="text-center">
        <a
          href="/resume.pdf"
          className="text-accent underline-offset-4 hover:underline"
        >
          Take a printed copy — resume (PDF)
        </a>
      </p>
    </article>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build && npm run lint` — clean, `/experience` listed. In dev: both internships with margin notes; skills appendix; resume link (404 until user drops `public/resume.pdf` — expected).

- [ ] **Step 4: Commit**

```bash
git add content/experience.ts app/experience/page.tsx
git commit -m "feat: experience chapter with internships, skills appendix, resume link

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: Ambient music player

**Files:**
- Create: `public/audio/ambient.mp3` (generated stand-in)
- Create: `components/MusicToggle.tsx`
- Modify: `app/layout.tsx` (add toggle next to ThemeToggle)

**Interfaces:**
- Consumes: fixed toggle container from Task 2's layout.
- Produces: `<MusicToggle />`, prop-less.

- [ ] **Step 1: Generate stand-in ambient loop**

```bash
mkdir -p public/audio
ffmpeg -f lavfi -i "anoisesrc=color=brown:duration=60:amplitude=0.25" \
  -af "lowpass=f=500,afade=t=in:d=3,afade=t=out:st=57:d=3" \
  -c:a libmp3lame -q:a 6 public/audio/ambient.mp3
```

Expected: ~60s soft rain-like loop (~500KB). If `ffmpeg` is missing: `brew install ffmpeg`, or ask the user for any mp3 to place at `public/audio/ambient.mp3`. This file is a swap point — user replaces with a preferred CC0 cozy track anytime.

- [ ] **Step 2: Create `components/MusicToggle.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import useSound from "use-sound";
import { useLocalStorage } from "usehooks-ts";

function GramophoneIcon({ playing }: { playing: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-5 ${playing ? "animate-[spin_4s_linear_infinite]" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 4a8 8 0 0 1 8 8" strokeDasharray="2 3" />
    </svg>
  );
}

export function MusicToggle() {
  const [wantsMusic, setWantsMusic] = useLocalStorage("music-on", false, {
    initializeWithValue: false,
  });
  const [mounted, setMounted] = useState(false);
  const [play, { stop }] = useSound("/audio/ambient.mp3", {
    loop: true,
    volume: 0.35,
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && wantsMusic) play();
    return () => stop();
  }, [mounted, wantsMusic, play, stop]);

  if (!mounted) return <span className="inline-block size-9" />;

  return (
    <button
      onClick={() => setWantsMusic(!wantsMusic)}
      aria-label={wantsMusic ? "Stop the music" : "Play some music"}
      title={wantsMusic ? "Stop the music" : "Play some music"}
      className="grid size-9 place-items-center rounded-full bg-paper text-ink-faded shadow-sm transition hover:scale-110 hover:text-accent"
    >
      <GramophoneIcon playing={wantsMusic} />
    </button>
  );
}
```

Note: browsers block audio before the first user gesture; use-sound/howler auto-unlocks and starts a remembered preference on the visitor's first click. That is acceptable behavior, not a bug.

- [ ] **Step 3: Add to layout**

In `app/layout.tsx`, add import:

```tsx
import { MusicToggle } from "@/components/MusicToggle";
```

and change the fixed container to:

```tsx
<div className="fixed right-4 top-4 z-40 flex gap-2">
  <MusicToggle />
  <ThemeToggle />
</div>
```

- [ ] **Step 4: Verify**

Run: `npm run build && npm run lint` — clean. In dev: click gramophone — soft loop plays, icon spins; reload — preference remembered (plays after first click anywhere); toggle off stops.

- [ ] **Step 5: Commit**

```bash
git add public/audio/ambient.mp3 components/MusicToggle.tsx app/layout.tsx
git commit -m "feat: ambient music toggle with persisted preference

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: Not-found page + final polish pass

**Files:**
- Create: `app/not-found.tsx`
- Verify only: all routes, both themes, mobile viewport

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Create `app/not-found.tsx`**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-ink-faded">
        Erratum
      </p>
      <h1 className="mt-4 text-3xl">This page is missing from the book.</h1>
      <p className="mt-4 font-hand text-2xl text-note">
        perhaps it was torn out.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-accent underline-offset-4 hover:underline"
      >
        ← back to the cover
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Full verification pass**

Run: `npm run build && npm run lint`
Expected: clean; routes `/`, `/about`, `/projects`, `/experience`, `/_not-found` all present.

In dev, check each item:
- Cover → each TOC link → page-turn entry animation plays on every navigation
- Candle toggle on every page, no flash-of-wrong-theme on hard reload
- Dark theme: parchment page, amber accents, candlelight glow at top
- Music toggles on/off, survives reload
- `/nonexistent` → "torn out" page
- Narrow viewport (~375px): top nav shows, margin notes flow inline-ish, no horizontal scroll
- macOS Settings → Accessibility → Reduce Motion: all animations become fades

- [ ] **Step 3: Commit**

```bash
git add app/not-found.tsx
git commit -m "feat: erratum not-found page

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Post-plan follow-ups (user actions, no code)

1. Drop real resume at `public/resume.pdf`.
2. Send the 4 projects — they go into `content/projects.ts` as data.
3. Optionally replace `public/audio/ambient.m4a` with a preferred CC0 track. (keep the .m4a filename, or update the path in components/MusicToggle.tsx)
