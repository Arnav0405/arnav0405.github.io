"use client";

import { useEffect, useState } from "react";
import useSound from "use-sound";
import { useLocalStorage } from "usehooks-ts";

function VinylIcon({ playing }: { playing: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-6 ${
        playing ? "motion-safe:animate-[spin_2.5s_linear_infinite]" : ""
      }`}
    >
      {/* record */}
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      {/* grooves */}
      <circle
        cx="12"
        cy="12"
        r="8.2"
        fill="none"
        stroke="var(--paper)"
        strokeOpacity="0.35"
        strokeWidth="0.6"
      />
      <circle
        cx="12"
        cy="12"
        r="6.6"
        fill="none"
        stroke="var(--paper)"
        strokeOpacity="0.25"
        strokeWidth="0.6"
      />
      {/* light catching the surface — makes the spin visible */}
      <path
        d="M12 4.2a7.8 7.8 0 0 1 5.5 2.3"
        fill="none"
        stroke="var(--paper)"
        strokeOpacity="0.55"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      {/* label */}
      <circle cx="12" cy="12" r="3.4" fill="var(--accent)" />
      <circle cx="12" cy="10.2" r="0.45" fill="var(--paper)" fillOpacity="0.8" />
      {/* spindle hole */}
      <circle cx="12" cy="12" r="0.9" fill="var(--paper)" />
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
      <VinylIcon playing={wantsMusic} />
    </button>
  );
}
