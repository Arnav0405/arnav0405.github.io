export function ChapterHeading({
  numeral,
  title,
}: {
  numeral: string;
  title: string;
}) {
  return (
    <header className="mb-10 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-ink-faded">
        Chapter {numeral}
      </p>
      <h1 className="mt-2 text-4xl">{title}</h1>
      <div className="mt-4 text-accent" aria-hidden>
        ❦
      </div>
    </header>
  );
}
