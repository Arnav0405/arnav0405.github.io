"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react";

const chapters = ["/", "/about", "/experience", "/projects"];

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();

  const idx = chapters.indexOf(pathname);
  const canForward = idx > -1 && idx < chapters.length - 1;
  const canBack = idx > 0;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-4, 4]);
  const dragControls = useDragControls();
  // 1 = forward (page flies left), -1 = back (page flies right)
  const [leaving, setLeaving] = useState<1 | -1 | null>(null);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const throwX = info.offset.x + info.velocity.x * 0.2;
    if (throwX < -90 && canForward) setLeaving(1);
    else if (throwX > 90 && canBack) setLeaving(-1);
  };

  return (
    <motion.div
      drag={leaving ? false : "x"}
      dragListener={false}
      dragControls={dragControls}
      onPointerDown={(e) => {
        // touch/pen only — mouse drag would fight text selection
        if (e.pointerType !== "mouse") dragControls.start(e);
      }}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{
        left: canForward ? 0.5 : 0.05,
        right: canBack ? 0.5 : 0.05,
      }}
      dragSnapToOrigin
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.005 }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, rotateX: 5 }}
      animate={
        leaving
          ? reduce
            ? { opacity: 0 }
            : { x: -leaving * window.innerWidth, opacity: 0 }
          : { opacity: 1, y: 0, rotateX: 0 }
      }
      transition={
        leaving
          ? { duration: 0.3, ease: [0.4, 0, 1, 1] }
          : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }
      onAnimationComplete={() => {
        if (leaving) router.push(chapters[idx + leaving]);
      }}
      style={{
        x,
        rotate,
        transformPerspective: 1200,
        transformOrigin: "center top",
        touchAction: "pan-y",
      }}
      className="sheet-shadow rounded-sm bg-paper px-6 py-10 sm:px-12 sm:py-14"
    >
      {children}
    </motion.div>
  );
}
