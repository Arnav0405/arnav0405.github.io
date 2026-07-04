"use client";

import { useEffect, useState } from "react";
import useSound from "use-sound";
import { useLocalStorage } from "usehooks-ts";

function GramophoneIcon({ playing }: { playing: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-5 ${playing ? "animate-[spin_4s_linear_infinite]" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 4a8 8 0 0 1 8 8" strokeDasharray="2 3" />
    </svg>
  );
}

export function MusicToggle() {
  const [wantsMusic, setWantsMusic] = useLocalStorage("music-on", false, {
    initializeWithValue: false,
  });
  const [mounted, setMounted] = useState(false);
  const [play, { stop }] = useSound("/audio/ambient.m4a", {
    loop: true,
    volume: 0.35,
  });

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && wantsMusic) play();
    return () => stop();
  }, [mounted, wantsMusic, play, stop]);

  if (!mounted) return <span className="inline-block size-9" />;

  return (
    <button
      onClick={() => setWantsMusic(!wantsMusic)}
      aria-label={wantsMusic ? "Stop the music" : "Play some music"}
      title={wantsMusic ? "Stop the music" : "Play some music"}
      className="grid size-9 place-items-center rounded-full bg-paper text-ink-faded shadow-sm transition hover:scale-110 hover:text-accent"
    >
      <GramophoneIcon playing={wantsMusic} />
    </button>
  );
}
