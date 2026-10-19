"use client";
import { createContext, useContext, useEffect, useState } from "react";
const MotionContext = createContext({ reduced: false, hidden: false });
export const useNotebookMotion = () => useContext(MotionContext);
export function NotebookMotion({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    const visibility = () => setHidden(document.hidden);
    update(); visibility();
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    return () => { media.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  return <MotionContext.Provider value={{ reduced, hidden }}><div data-motion-paused={reduced || hidden}>{children}</div></MotionContext.Provider>;
}
