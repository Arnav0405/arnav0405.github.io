import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Erratum" };

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-ink-faded">
        Erratum
      </p>
      <h1 className="mt-4 text-3xl">This page is missing from the book.</h1>
      <p className="mt-4 font-hand text-2xl text-note">
        perhaps it was torn out.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-accent underline-offset-4 hover:underline"
      >
        ← back to the cover
      </Link>
    </div>
  );
}
