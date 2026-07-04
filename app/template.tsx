"use client";

import { motion, useReducedMotion } from "motion/react";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, rotateX: 5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200, transformOrigin: "center top" }}
      className="sheet-shadow rounded-sm bg-paper px-6 py-10 sm:px-12 sm:py-14"
    >
      {children}
    </motion.div>
  );
}
