import { AnimatedA } from "@/components/AnimatedA";
import { site } from "@/content/site";

export function Colophon() {
  return (
    <footer className="relative z-10 mx-auto max-w-3xl px-4 pb-10 pt-6 text-center text-sm text-ink-faded">
      <div className="mb-3 text-accent" aria-hidden>
        <AnimatedA loop />
      </div>
      <p>
        Set in Lora &amp; Caveat. Bound with Next.js. {site.location},{" "}
        {site.edition}.
      </p>
      <p className="mt-2 flex justify-center gap-4">
        <a
          className="text-accent underline-offset-4 hover:underline"
          href={`mailto:${site.email}`}
        >
          Email
        </a>
        <a
          className="text-accent underline-offset-4 hover:underline"
          href={site.github}
        >
          GitHub
        </a>
        <a
          className="text-accent underline-offset-4 hover:underline"
          href={site.linkedin}
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
