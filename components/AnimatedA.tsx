"use client";

import { motion, useReducedMotion } from "motion/react";

export function AnimatedA() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="inline-block align-middle"
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
    >
      <motion.path
        d="M12 3 L4 21 M12 3 L20 21 M7 15 H17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1.1, ease: "easeInOut" },
          },
        }}
      />
    </motion.svg>
  );
}
