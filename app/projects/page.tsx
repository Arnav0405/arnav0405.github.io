import type { Metadata } from "next";
import { Spread, ChapterTitle, ChapterPagination } from "@/components/Notebook";
import { projects, papers, type Paper } from "@/content/projects";
import { worksPage, papersPage } from "@/content/folios";
import { techLinks } from "@/content/tech";
import { ResearchArtwork } from "@/components/ResearchArtwork";

export const metadata: Metadata = { title: "Works" };

function ProjectEntry({ index }: { index: number }) {
  const p = projects[index];
  if (!p) return null;
  return <article>
    {index === 0 ? <ChapterTitle href="/projects" subtitle="THINGS I'VE MADE" /> : <p className="micro entry-kicker">FROM THE WORKBENCH / {String(index + 1).padStart(2, "0")}</p>}
    <h2 className="project-title">{p.link ? <a href={p.link}>{p.title}</a> : p.title}</h2>
    <p className="project-summary">{p.summary}</p>
    <ul className="tech-list">{p.tech.map(t => <li key={t}>{techLinks[t] ? <a className="tech-chip" href={techLinks[t]}>{t}</a> : <span className="tech-chip">{t}</span>}</li>)}</ul>
    {p.note && <p className="hand-note project-note">{p.note}</p>}
  </article>;
}

function PaperEntry({ paper, index }: { paper: Paper; index: number }) {
  return <article>
    <p className="micro entry-kicker">RESEARCH / PAPER {String(index + 1).padStart(2, "0")}</p>
    <h3 className="paper-title">{paper.link ? <a className="underline-center" href={paper.link}>{paper.title} ↗</a> : paper.title}</h3>
    <p className="paper-venue">{paper.venue}</p>
  </article>;
}

export default function Projects() {
  return <>
    <Spread chapter="IN PRINT" page={papersPage} left={<>
      <p className="micro entry-kicker">RESEARCH / PUBLISHED WORKS</p>
      <h1 className="project-title">In print.</h1>
      <div className="research-papers">{papers.map((paper, index) => <PaperEntry key={paper.title} paper={paper} index={index} />)}</div>
    </>} right={<ResearchArtwork />} />
    {projects.filter((_, i) => i % 2 === 0).map((p, pair) => <Spread key={p.title} chapter="SELECTED WORKS" page={worksPage + pair * 2} left={<ProjectEntry index={pair * 2} />} right={<ProjectEntry index={pair * 2 + 1} />} />)}
    <ChapterPagination href="/projects" />
  </>;
}
