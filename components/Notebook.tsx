import Link from "next/link";
import { chapters } from "@/content/chapters";
type SpreadProps = { left: React.ReactNode; right: React.ReactNode; chapter: string; page?: number; cover?: boolean; };
export function Spread({ left, right, chapter, page = 1, cover = false }: SpreadProps) {
  return <section className={`spread${cover ? " cover-spread" : " reading-spread"}`} aria-label={`${chapter}, notebook spread ${Math.ceil(page / 2)}`}>
    {[left, right].map((body, i) => <div className="leaf" key={i}>
      <div className="folio-top micro"><span>{i === 0 ? "A. W. / FIELD NOTES" : chapter}</span><span>{i === 0 ? "VOL. 01" : "2026 EDITION"}</span></div>
      <div className="leaf-body">{body}</div>
      <div className="folio-bottom micro"><span>{i === 0 ? "OBSERVE. BUILD. REPEAT." : "MUMBAI, INDIA"}</span><span>{String(page + i).padStart(2, "0")}</span></div>
    </div>)}
  </section>;
}
export function ChapterTitle({ href, subtitle }: { href: string; subtitle: string }) {
  const chapter = chapters.find(c => c.href === href)!;
  return <header className="chapter-heading"><p className="micro">CHAPTER {chapter.numeral} / {subtitle}</p><h1>{chapter.label}</h1></header>;
}
export function ChapterPagination({ href }: { href: string }) {
  const index = chapters.findIndex(c => c.href === href);
  return <nav className="chapter-pagination" aria-label="Previous and next chapters">
    <span>{index > 0 && <Link href={chapters[index - 1].href}>← {chapters[index - 1].label}</Link>}</span>
    <span className="micro">A NOTEBOOK, STILL IN PROGRESS</span>
    <span>{index < chapters.length - 1 && <Link href={chapters[index + 1].href}>{chapters[index + 1].label} →</Link>}</span>
  </nav>;
}
