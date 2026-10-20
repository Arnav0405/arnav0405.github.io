import Link from "next/link";
import { site } from "@/content/site";
import { chapters } from "@/content/chapters";
import { Spread, ChapterPagination } from "@/components/Notebook";
import { BotanicalGarden } from "@/components/BotanicalGarden";
export default function Cover() {
  return <>
    <Spread cover chapter="A PERSONAL NOTEBOOK" page={1} left={<>
      <BotanicalGarden />
    </>} right={<>
      <p className="cover-kicker micro">A WORK IN PROGRESS, BY DESIGN</p>
      <h1 className="cover-title">Arnav<br /><em>Waghdhare.</em></h1>
      <p className="cover-role">{site.role}</p>
      <p className="availability">Open for work</p>
      <nav className="contents" aria-label="Table of contents"><p className="micro">CHAPTERS</p><ol>{chapters.slice(1).map(c => <li key={c.href}><Link href={c.href}><span className="micro" style={{ color: "var(--accent)" }}>{c.numeral}</span><span>{c.label}</span><span className="dots" /><span aria-hidden="true">↗</span></Link></li>)}</ol></nav>
      <div className="contact-links"><a href={`mailto:${site.email}`} target="_blank" rel="noopener">Email ↗</a><a href={site.github} target="_blank" rel="noopener">GitHub ↗</a><a href={site.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a><a href={site.resume}>Resume ↓</a></div>
      <p className="hand-note" style={{ marginTop: 32 }}>a record of things I make.</p>
    </>} />
    <ChapterPagination href="/" />
  </>;
}
