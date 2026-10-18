"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react";
import { chapters, chapterIndex } from "@/content/chapters";

// Only on laptops/desktops — matches the lg breakpoint the desktop nav uses at,
// and skips touch-only tablets where swiping is the expected gesture.
const DESKTOP_NAV = "(min-width: 1024px) and (pointer: fine)";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();

  const idx = chapterIndex(pathname);
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

    const flip = useCallback(
      (dir: 1 | -1) => {
        if (dir === 1 && canForward) setLeaving(1);
        else if (dir === -1 && canBack) setLeaving(-1);
      },
      [canForward, canBack],
    );

    useEffect(() => {
      if (!window.matchMedia(DESKTOP_NAV).matches) return;

      const onKeyDown = (e: KeyboardEvent) => {
        if (leaving || e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.repeat || isTypingTarget(e.target)) return;

        if (e.key === "ArrowRight") flip(1);
        else if (e.key === "ArrowLeft") flip(-1);
        else return;

        e.preventDefault();
      };

      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [flip, leaving]);

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
        if (leaving) router.push(chapters[idx + leaving].href);
      }}
      style={{
        x,
        rotate,
        transformPerspective: 1200,
        transformOrigin: "center top",
        touchAction: "pan-y",
      }}
      className="page-sheet rounded-sm px-6 py-10 sm:px-12 sm:py-14"
    >
      {children}
    </motion.div>
  );
}
