import type { Metadata } from "next";
import { Spread, ChapterTitle, ChapterPagination } from "@/components/Notebook";
import { BotanicalSprig } from "@/components/BotanicalSprig";
import { prologue, certificates, mentorship } from "@/content/about";
export const metadata: Metadata = { title: "Prologue" };
export default function About() {
  return <>
    <Spread chapter="PROLOGUE" page={3} left={<>
      <ChapterTitle href="/about" subtitle="A LITTLE CONTEXT" />
      <div className="reading">{prologue.map(p => <p key={p}>{p}</p>)}</div>
      <p className="hand-note project-note">Always learning. Usually by making something.</p>
      <BotanicalSprig />
    </>} right={<div className="reading">
      <p className="micro" style={{ color: "var(--accent)" }}>NOTES ON LEARNING</p>
      <h2>On teaching, <br /><em>well in a club.</em></h2>
      <h3>{mentorship.title}</h3><p>{mentorship.story}</p>
      <div className="study-note"><p className="micro">MILESTONES IN THE MARGIN</p>{certificates.map(c => <p className="hand-note" key={c}>{c}</p>)}</div>
    </div>} />
    <ChapterPagination href="/about" />
  </>;
}
