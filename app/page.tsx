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
