"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const C = 100; // dial center
const NUMERALS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

function polar(radius: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  // rounded so server and client float math can't disagree in the last digit
  return {
    x: +(C + radius * Math.sin(rad)).toFixed(2),
    y: +(C - radius * Math.cos(rad)).toFixed(2),
  };
}

export function DeskClock() {
  const hourRef = useRef<SVGGElement>(null);
  const minuteRef = useRef<SVGGElement>(null);
  const secondRef = useRef<SVGGElement>(null);
  const prefersReduced = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const update = () => {
      const now = new Date();
      const s = now.getSeconds() + now.getMilliseconds() / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;
      secondRef.current?.setAttribute("transform", `rotate(${s * 6} ${C} ${C})`);
      minuteRef.current?.setAttribute("transform", `rotate(${m * 6} ${C} ${C})`);
      hourRef.current?.setAttribute("transform", `rotate(${h * 30} ${C} ${C})`);
    };

    if (prefersReduced) {
      update();
      const id = setInterval(update, 1000);
      return () => clearInterval(id);
    }

    let raf: number;
    const loop = () => {
      update();
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [mounted, prefersReduced]);

  return (
    <div className="desk-clock">
      <div className="desk-clock-dial">
        <svg viewBox="0 0 200 200" className="size-full font-serif">
          {/* minute ticks, hours slightly heavier */}
          {Array.from({ length: 60 }, (_, i) => {
            const deg = i * 6;
            const hour = i % 5 === 0;
            const outer = polar(91, deg);
            const inner = polar(hour ? 85 : 88, deg);
            return (
              <line
                key={i}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={hour ? "var(--ink-faded)" : "var(--note)"}
                strokeWidth={hour ? 1.6 : 0.8}
                strokeLinecap="round"
              />
            );
          })}

          {/* roman numerals, cardinals in ink */}
          {NUMERALS.map((numeral, i) => {
            const n = i + 1;
            const cardinal = n % 3 === 0;
            const pos = polar(72, n * 30);
            return (
              <text
                key={numeral}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={cardinal ? 16 : 12.5}
                fill={cardinal ? "var(--ink)" : "var(--ink-faded)"}
              >
                {numeral}
              </text>
            );
          })}

          {/* hands render client-side only; dial itself is SSR-safe */}
          {mounted && (
            <>
              <g ref={hourRef}>
                <line
                  x1={C}
                  y1={C + 8}
                  x2={C}
                  y2={C - 42}
                  stroke="var(--accent)"
                  strokeWidth={5}
                  strokeLinecap="round"
                />
              </g>
              <g ref={minuteRef}>
                <line
                  x1={C}
                  y1={C + 10}
                  x2={C}
                  y2={C - 62}
                  stroke="var(--accent)"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </g>
              <g ref={secondRef}>
                <line
                  x1={C}
                  y1={C + 16}
                  x2={C}
                  y2={C - 70}
                  stroke="var(--accent)"
                  strokeWidth={1.25}
                  strokeLinecap="round"
                />
              </g>
            </>
          )}

          <circle cx={C} cy={C} r={4} fill="var(--accent)" />
          <circle cx={C} cy={C} r={1.6} fill="var(--paper)" />
        </svg>
      </div>
    </div>
  );
}
