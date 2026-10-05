"use client";

import { motion, useReducedMotion } from "motion/react";

// Hand-drawn signature "A", traced as pen strokes in real writing order:
// 1. tall downstroke, 2. upward check arm from the bottom vertex,
// 3. downward curve peeling off the top, 4. loop + swoosh.
const STROKES = [
  { d: "M545 333 C450 440 335 615 298 720", duration: 0.3 },
  { d: "M298 722 C297 550 300 300 302 95", duration: 0.4 },
  { d: "M302 95 C302 300 375 505 558 552", duration: 0.35 },
  {
    d: "M530 515 C420 545 295 525 250 615 C210 695 245 772 330 766 C440 758 630 545 758 405",
    duration: 0.5,
  },
];

// Cumulative start time per stroke, so each one begins where the last ended.
// Derived once at module scope rather than accumulated inside render.
const TIMED_STROKES = STROKES.map(({ d, duration }, i) => ({
  d,
  duration,
  delay: STROKES.slice(0, i).reduce((sum, s) => sum + s.duration, 0),
}));

const TOTAL = STROKES.reduce((sum, s) => sum + s.duration, 0);
const PAUSE = 1.8; // hold the finished signature before redrawing
const CYCLE = TOTAL + PAUSE;

const strokeProps = {
  stroke: "currentColor",
  strokeWidth: 48,
  strokeLinecap: "round",
} as const;

export function AnimatedA({ loop = false }: { loop?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 880 820"
      fill="none"
      className="inline-block align-middle"
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
    >
      {TIMED_STROKES.map(({ d, duration, delay }) => {
        if (reduceMotion) {
          return <path key={d} d={d} {...strokeProps} />;
        }

        if (loop) {
          const start = delay / CYCLE;
          const end = (delay + duration) / CYCLE;
          return (
            <motion.path
              key={d}
              d={d}
              {...strokeProps}
              animate={{ pathLength: [0, 0, 1, 1], opacity: [0, 0, 1, 1] }}
              transition={{
                duration: CYCLE,
                times: [0, start, end, 1],
                repeat: Infinity,
                ease: ["linear", "easeInOut", "linear"],
              }}
            />
          );
        }

        return (
          <motion.path
            key={d}
            d={d}
            {...strokeProps}
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: {
                  pathLength: { duration, delay, ease: "easeInOut" },
                  opacity: { duration: 0.01, delay },
                },
              },
            }}
          />
        );
      })}
    </motion.svg>
  );
}
