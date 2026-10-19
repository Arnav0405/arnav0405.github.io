import type { Metadata } from "next";
import { Spread, ChapterTitle, ChapterPagination } from "@/components/Notebook";
import { experiencePage, toolboxPage } from "@/content/folios";
import { editions, internships } from "@/content/experience";
import { TechToolbox } from "@/components/TechToolbox";
export const metadata: Metadata = { title: "Experience" };
function Job({ index }: { index: number }) {
  const job = internships[index];
  if (!job) return null;
  return <>
    {index === 0 ? <ChapterTitle href="/experience" subtitle="LEARNING IN THE REAL WORLD" /> : <p className="micro entry-kicker">THE NEXT STOP / {String(index + 1).padStart(2, "0")}</p>}
    <div className="reading"><p className="micro">{job.period}</p><h2>{job.company}</h2><h3 className="job-role">{job.role}</h3>{job.story.map(p => <p key={p}>{p}</p>)}</div>
    {job.note && <p className="hand-note project-note">{job.note}</p>}
  </>;
}
export default function Experience() {
  return <>
    {internships.filter((_, i) => i % 2 === 0).map((job, pair) => <Spread key={job.company} chapter="EXPERIENCE" page={experiencePage + pair * 2} left={<Job index={pair * 2} />} right={<Job index={pair * 2 + 1} />} />)}
    <Spread chapter="THE TOOLBOX" page={toolboxPage} left={<TechToolbox />} right={<>
      <p className="micro" style={{ color: "var(--accent)" }}>APPENDIX B / TAKE A COPY</p>
      <h2 className="project-title">Resume<br /><em>For Employers.</em></h2>
      <p className="reading" style={{ color: "var(--ink-faded)", marginBottom: 12 }}>I am a ML Engineer, but also have published academic papers.</p>
      {editions.map(edition => <a key={edition.href} href={edition.href} className="edition-sheet"><span className="micro" style={{ color: "var(--accent)" }}>{edition.discipline}</span><span style={{ fontSize: 23, margin: "8px 0" }}>{edition.title}</span><span style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink-faded)" }}>{edition.blurb}</span><span className="micro" style={{ marginTop: 15 }}>READ THIS EDITION ↓ PDF</span></a>)}
      <p className="hand-note" style={{ marginTop: 32 }}>a few pages.</p>
    </>} />
    <ChapterPagination href="/experience" />
  </>;
}
