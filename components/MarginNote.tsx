"use client";

import { motion, useReducedMotion } from "motion/react";

export function MarginNote({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.aside
      initial={reduce ? { opacity: 0 } : { opacity: 0, rotate: -4, y: 8 }}
      whileInView={
        reduce ? { opacity: 1 } : { opacity: 1, rotate: -1.5, y: 0 }
      }
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="float-right clear-right my-2 ml-5 w-40 font-hand text-xl leading-snug text-note"
    >
      <span aria-hidden>✎ </span>
      {children}
    </motion.aside>
  );
}
