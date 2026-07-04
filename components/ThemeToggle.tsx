"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

function CandleIcon({ lit }: { lit: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <rect x="9" y="11" width="6" height="9" rx="1" />
      <line x1="12" y1="11" x2="12" y2="8.5" />
      {lit && (
        <path
          d="M12 3c1.3 1.5 1.9 2.7 0 4.8-1.9-2.1-1.3-3.3 0-4.8z"
          fill="currentColor"
          stroke="none"
          className="animate-pulse"
        />
      )}
    </svg>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return <span className="inline-block size-9" />;

  const dark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Blow out the candle" : "Light a candle"}
      title={dark ? "Blow out the candle" : "Light a candle"}
      className="grid size-9 place-items-center rounded-full bg-paper text-ink-faded shadow-sm transition hover:scale-110 hover:text-accent"
    >
      <CandleIcon lit={dark} />
    </button>
  );
}
