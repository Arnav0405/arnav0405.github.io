"use client";
import { useEffect, useState } from "react";
import useSound from "use-sound";
export function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [play, { stop, pause, sound }] = useSound("/audio/bluerose.m4a", {
    loop: true, volume: .35,
    onloaderror: () => { setFailed(true); setPlaying(false); },
    onplayerror: () => { setFailed(true); setPlaying(false); },
  });
  useEffect(() => {
    if (playing) play();
    else stop();
    return () => stop();
  }, [playing, play, stop]);
  useEffect(() => {
    const visibility = () => { if (document.hidden) pause(); else if (playing) play(); };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, [playing, play, pause]);
  const label = failed ? "Music is unavailable" : !sound ? "Music is loading" : playing ? "Stop the music" : "Play some music";
  return <><button className="tool-button" onClick={() => setPlaying(p => !p)} aria-label={label} title={label} aria-pressed={playing} disabled={!sound || failed}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true"><circle cx="11" cy="12" r="9" /><circle cx="11" cy="12" r="6" opacity=".45" /><circle cx="11" cy="12" r="2" fill={playing ? "var(--accent)" : "none"} /><path d="M20 3v10l-4 5" /><path d="m15 17 2 2" strokeWidth="2" /></svg>
  </button><span role="status" className="sr-only">{failed ? "Music could not be loaded. The notebook is still available." : ""}</span></>;
}
