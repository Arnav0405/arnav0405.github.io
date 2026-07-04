# Book-Themed Portfolio — Design Spec

**Date:** 2026-07-04
**Status:** Approved pending user review

## Purpose

Personal portfolio for Arnav Waghdhare with two goals: job hunting (recruiters can skim projects, experience, resume fast) and a personal home on the internet. The site looks and feels like reading a book — paper texture, serif typography, chapters — with a cozy background-music player.

## Concept

Hybrid book metaphor: paper aesthetic everywhere plus a few book moments (cover landing page, table of contents, chapter-turn transitions), but standard scrolling inside sections. Not a literal page-flip book — stays skimmable on mobile and for recruiters.

## Structure & Routes

| Route | Book role | Content |
|---|---|---|
| `/` | Front cover → table of contents | Name as book title, role subtitle, publisher-style mark ("Mumbai · 2027"), contact links (email, GitHub, LinkedIn) as inked icons. "Open" reveals TOC listing chapters with page-number styling. |
| `/about` | Prologue | Personal story; education as narrative (KJ Somaiya, B.Tech Computer Engineering, 2023–2027, last year); SMLRA Associate Mentor story (ML workshop for 20+ students, SVM/KNN); certificates as handwritten margin notes (DeepLearning.ai Supervised ML Nov '24, Advanced Learning Algorithms Dec '24, IUCEE Multi-Agent AI Dec '24). |
| `/projects` | Chapter: Works | 4 projects (content TBD from user; structure built with placeholders). "In Print" subsection with research papers styled as book citations: IEEE Smart Farming ML + Dual-Node LoRaWAN (https://ieeexplore.ieee.org/document/11507500); Springer CVR 2026 Gesture-Based Assistive Tool for children with speech and hearing impairments. Margin notes for personal asides. |
| `/experience` | Chapter: Experience | Datafuel — Full Stack Developer (May–Aug 2026): web scraping at scale, 15M products in 4 hours, React + async FastAPI + Celery platform, improved business 80%. Evoastra Ventures — Data Scientist Intern (Jul–Aug 2026): led team building/deploying scraper for dynamic sites, car info & pricing database (Selenium, BeautifulSoup), CNN+LSTM image captioning in TensorFlow, BLEU 0.56. Skills as appendix-style index grouped Languages / Web / ML & AI. Resume PDF download styled as "take a printed copy". |

Note: internship dates overlap (Datafuel May–Aug 2026, Evoastra Jul–Aug 2026) — user confirmed content is per resume; listed as-is unless user corrects.

All resume facts stay exact; prose is rewritten in a warm book voice.

### Shared chrome (in `layout.tsx`)

- Music toggle (corner icon, animates while playing)
- Candle theme toggle (next to music toggle)
- Chapter navigation styled as bookmark/book spine
- Colophon footer ("set in Lora, made with Next.js") repeating contact links

### File layout

```
app/
  layout.tsx            fonts, theme provider, chrome (music, candle, nav, footer)
  template.tsx          page-turn transition wrapper (Next.js template convention)
  page.tsx              cover + table of contents
  about/page.tsx
  projects/page.tsx
  experience/page.tsx
  globals.css           palette tokens, paper texture, typography
components/             MusicToggle, ThemeToggle, MarginNote, Chapter, DropCap, ...
content/                projects.ts, experience.ts, about.ts (typed data)
public/                 ambient loop (mp3/ogg), resume.pdf
```

## Stack

| Piece | Choice |
|---|---|
| Framework | Next.js 16 + React 19 (installed) |
| Styling | Tailwind 4 (installed) |
| Animations | `motion` (framer-motion) — route transitions via AnimatePresence in `template.tsx`, scroll-reveal margin notes, cover animation |
| Music | `use-sound` — single ambient loop, on/off toggle |
| Theme | `next-themes` — class strategy, no flash, system default |
| Persistence | `usehooks-ts` `useLocalStorage` for music preference (`next-themes` handles theme persistence itself) |
| Fonts | `next/font` — Lora (serif) + Caveat (handwriting) |
| Content | Typed TS data files in repo. No CMS, no database. |

User preference: use dependencies freely where they make code smaller.

## Visual Design

### Light theme — "daylight reading"

- Page: warm cream (~`#f7f1e3`), darker warm desk tone surrounding centered sheet
- Ink: soft black (~`#2b2620`), never pure black
- Accent: deep navy (~`#1f3a5f`) for links, chapter numerals, cover background
- Margin notes: pencil-gray handwriting

### Dark theme — "candle-lit"

- Desk: deep warm brown (~`#16110b`)
- Page: candle-lit parchment (~`#241c12`)
- Ink: warm off-white (~`#e8dcc8`)
- Accent: amber for glow/highlights, navy-tinted links
- Soft radial candlelight glow near top of page
- Toggle: candle icon — lit candle = dark mode on

### Typography

- Body: Lora, ~65ch measure, generous line-height
- Chapter headings: Lora small-caps with numerals ("Chapter II")
- Drop cap on first paragraph of each chapter (`::first-letter`)
- Margin notes: Caveat
- Section dividers: asterism (❦) / thin ink rules

### Paper feel

- Subtle SVG grain/noise overlay
- Page as centered sheet with soft edge shadows over desk background
- Grain and shadows tuned per theme

### Motion

- Route change: subtle page-turn (~400ms) — outgoing page slides/curls, incoming settles
- Margin notes fade in with slight tilt on scroll into view
- Music toggle icon gently animates while playing
- `prefers-reduced-motion`: all replaced by plain fades

## Music Player

- One royalty-free (CC0) cozy ambient loop bundled in `public/`
- Off by default; starts only on user click (browser autoplay policy)
- Preference persisted in localStorage
- Small corner icon (gramophone/vinyl motif — candle is reserved for the theme toggle), no full player UI

## Error Handling & Testing

- Static site, no forms, no API — error surface is minimal
- `not-found.tsx` styled as "this page is missing from the book"
- Lint + `next build` as the verification gate; manual pass on mobile viewport
- Audio: toggle must not crash when file fails to load (use-sound handles gracefully)

## Out of Scope (explicitly deferred)

- Notes/blog chapter (user deferred)
- Guestbook (needs backend)
- CMS/MDX pipeline
- Multiple music tracks
