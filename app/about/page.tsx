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
