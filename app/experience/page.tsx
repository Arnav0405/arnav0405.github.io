import type { Metadata } from "next";
import { ChapterHeading } from "@/components/ChapterHeading";
import { MarginNote } from "@/components/MarginNote";
import { Asterism } from "@/components/Asterism";
import { editions, internships, skills } from "@/content/experience";
import { techLinks } from "@/content/tech";

export const metadata: Metadata = { title: "Experience" };

export default function Experience() {
  return (
    <article>
      <ChapterHeading numeral="III" title="Experience" />

      <div className="space-y-12">
        {internships.map((job) => (
          <section key={job.company}>
            {job.note && <MarginNote>{job.note}</MarginNote>}
            <h2 className="text-2xl">
              {job.role} · {job.company}
            </h2>
            <p className="mt-1 text-sm italic text-ink-faded">{job.period}</p>
            {job.story.map((para) => (
              <p key={para} className="mt-3 text-lg leading-8">
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>

      <Asterism />

      <section>
        <h2 className="mb-6 text-center text-sm uppercase tracking-[0.3em] text-ink-faded">
          Appendix — Index of Skills
        </h2>
        <dl className="space-y-6">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group}>
              <dt className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-faded">
                {group}
              </dt>
              <dd>
                <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                  {items.map((item) => (
                    <li key={item}>
                      {techLinks[item] ? (
                        <a href={techLinks[item]} className="tech-chip">
                          {item}
                        </a>
                      ) : (
                        <span className="tech-chip">{item}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Asterism />

      <section>
        <h2 className="text-center text-sm uppercase tracking-[0.3em] text-ink-faded">
          Issued in Two Editions
        </h2>
        <p className="mb-7 mt-2 text-center font-hand text-xl text-note">
          <span aria-hidden>✎ </span>same work — take whichever copy you came
          for.
        </p>
        <ul className="grid gap-7 sm:grid-cols-2">
          {editions.map((edition, i) => (
            <li key={edition.href}>
              <a
                href={edition.href}
                className={`edition-sheet${i % 2 ? " edition-sheet-verso" : ""}`}
              >
                <span className="text-xs uppercase tracking-[0.25em] text-ink-faded">
                  {edition.discipline}
                </span>
                <span className="mt-1.5 text-xl leading-snug">
                  {edition.title}
                </span>
                <span className="mb-3.5 mt-2 text-sm leading-6 text-ink-faded">
                  {edition.blurb}
                </span>
                <span className="edition-rule" aria-hidden />
                <span className="text-sm uppercase tracking-[0.15em] text-accent">
                  Read this edition · PDF
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
