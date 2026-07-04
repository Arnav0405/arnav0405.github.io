import type { Metadata } from "next";
import { ChapterHeading } from "@/components/ChapterHeading";
import { MarginNote } from "@/components/MarginNote";
import { Asterism } from "@/components/Asterism";
import { projects, papers } from "@/content/projects";

export const metadata: Metadata = { title: "Works" };

export default function Projects() {
  return (
    <article>
      <ChapterHeading numeral="II" title="Works" />

      {projects.length === 0 ? (
        <p className="text-center font-hand text-2xl text-note">
          the next four stories are still being written — check back soon.
        </p>
      ) : (
        <div className="space-y-10">
          {projects.map((p) => (
            <section key={p.title}>
              {p.note && <MarginNote>{p.note}</MarginNote>}
              <h2 className="text-2xl">
                {p.link ? (
                  <a
                    href={p.link}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
              </h2>
              <p className="mt-2 text-lg leading-8">{p.summary}</p>
              <p className="mt-2 text-sm italic text-ink-faded">
                {p.tech.join(" · ")}
              </p>
            </section>
          ))}
        </div>
      )}

      <Asterism />

      <section>
        <h2 className="mb-6 text-center text-sm uppercase tracking-[0.3em] text-ink-faded">
          In Print
        </h2>
        <ol className="space-y-6">
          {papers.map((p) => (
            <li key={p.title} className="pl-6 -indent-6 text-lg leading-8">
              {p.link ? (
                <a
                  href={p.link}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  &ldquo;{p.title}&rdquo;
                </a>
              ) : (
                <>&ldquo;{p.title}&rdquo;</>
              )}{" "}
              <span className="italic text-ink-faded">— {p.venue}.</span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
