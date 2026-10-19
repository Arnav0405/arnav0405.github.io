"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { chapters, chapterIndex } from "@/content/chapters";
export function BookmarkNav() {
  const current = chapterIndex(usePathname());
  return <nav className="chapter-tabs" aria-label="Chapters">{chapters.map((chapter, i) => <Link key={chapter.href} href={chapter.href} className="chapter-tab" aria-current={i === current ? "page" : undefined}><span className="micro">{chapter.numeral}</span>{chapter.label}</Link>)}</nav>;
}
