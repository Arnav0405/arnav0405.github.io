import type { Metadata } from "next";
import { ChapterHeading } from "@/components/ChapterHeading";
import { MarginNote } from "@/components/MarginNote";
import { Asterism } from "@/components/Asterism";
import { internships, skills } from "@/content/experience";
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

      <p className="text-center">
        <a
          href="/resume.pdf"
          className="text-accent underline-center"
        >
          Take a printed copy — resume (PDF)
        </a>
      </p>
    </article>
  );
}
