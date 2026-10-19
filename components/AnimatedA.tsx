"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNotebookMotion } from "@/components/NotebookMotion";

// Original signature, traced in its original pen-stroke order.
const STROKES = [
  { d: "M545 333 C450 440 335 615 298 720", duration: .3 },
  { d: "M298 722 C297 550 300 300 302 95", duration: .4 },
  { d: "M302 95 C302 300 375 505 558 552", duration: .35 },
  { d: "M530 515 C420 545 295 525 250 615 C210 695 245 772 330 766 C440 758 630 545 758 405", duration: .5 },
];

export function AnimatedA({ loop = false, size = 24 }: { loop?: boolean; size?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [visible, setVisible] = useState(false);
  const { reduced, hidden } = useNotebookMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      const paths = Array.from(ref.current?.querySelectorAll("path") ?? []);
      const drawing = gsap.timeline({ paused: true, repeat: loop ? -1 : 0, repeatDelay: 1.8 });
      paths.forEach((path, i) => {
        const length = path.getTotalLength();
        drawing.set(path, { strokeDasharray: length, strokeDashoffset: length }, 0);
        drawing.to(path, { strokeDashoffset: 0, duration: STROKES[i].duration, ease: "power1.inOut" });
      });
      timeline.current = drawing;
    }, ref);
    return () => { context.revert(); timeline.current = null; };
  }, [loop, reduced]);

  useEffect(() => {
    timeline.current?.paused(reduced || hidden || !visible);
  }, [reduced, hidden, visible, loop]);

  return <svg ref={ref} width={size} height={size} viewBox="0 0 880 820" fill="none" className="inline-block align-middle" aria-hidden="true">
    {STROKES.map(({ d }) => <path key={d} d={d} stroke="currentColor" strokeWidth={48} strokeLinecap="round" />)}
  </svg>;
}
