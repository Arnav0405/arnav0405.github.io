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
        pathname === c.href ? "text-accent" : "text-ink-faded"
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
        className="relative z-40 flex flex-wrap items-center gap-x-5 gap-y-2 px-4 pr-28 pt-5 lg:hidden"
      >
        {chapters.map(link)}
      </nav>
    </>
  );
}
