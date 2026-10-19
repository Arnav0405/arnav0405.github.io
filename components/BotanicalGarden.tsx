"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useNotebookMotion } from "./NotebookMotion";
import { GARDEN_SEED, gardenGeometry, type GardenInk } from "./garden-geometry";

const fallbackPlants = gardenGeometry(GARDEN_SEED);
const palettes: Record<"light" | "dark", Record<GardenInk, string>> = {
  light: { stem: "#314f5b", teal: "#247f7b", sage: "#738746", coral: "#ce594e", apricot: "#ca813b", violet: "#8760a7", gold: "#b58b35" },
  dark: { stem: "#b4cbc4", teal: "#79cfc1", sage: "#b5c68b", coral: "#ff9a8b", apricot: "#f3bf7c", violet: "#c1a1e6", gold: "#e7c67d" },
};

export function BotanicalGarden() {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<{ refresh: () => void; planting: () => void } | null>(null);
  const { reduced, hidden } = useNotebookMotion();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const state = useRef<{ reduced: boolean; hidden: boolean; theme: "light" | "dark" }>({ reduced, hidden, theme });
  const [ready, setReady] = useState(false);
  const [edition, setEdition] = useState(1);

  useEffect(() => {
    state.current = { reduced, hidden, theme };
    controls.current?.refresh();
  }, [reduced, hidden, theme]);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let disposed = false;
    let destroy: (() => void) | undefined;
    import("p5").then(({ default: P5 }) => {
      if (disposed) return;
      let visible = false;
      let seed = GARDEN_SEED;
      let time = 0;
      let pointer: { x: number; y: number } | null = null;
      let observer: IntersectionObserver | undefined;
      let resize: ResizeObserver | undefined;
      const geometry = () => gardenGeometry(seed).map(plant => ({ ...plant, strokes: plant.strokes.map(stroke => ({ ...stroke, path: new Path2D(stroke.d) })) }));
      let plants = geometry();
      let bends = plants.map(() => 0);
      const running = () => visible && !state.current.reduced && !state.current.hidden;
      const instance = new P5(p => {
        let initialized = false;
        const refresh = () => {
          if (!initialized || disposed) return;
          container.dataset.theme = state.current.theme;
          container.dataset.motion = running() ? "running" : "still";
          if (running()) p.loop();
          else { pointer = null; p.noLoop(); p.redraw(); }
        };
        p.setup = () => {
          if (disposed) { p.remove(); return; }
          const width = Math.max(1, container.clientWidth);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 1.5));
          const canvas = p.createCanvas(width, width * 1.16);
          canvas.elt.setAttribute("aria-hidden", "true");
          p.frameRate(30);
          initialized = true;
          controls.current = {
            refresh,
            planting: () => {
              seed += 997;
              plants = geometry();
              bends = plants.map(() => 0);
              container.dataset.seed = String(seed);
              time = 0;
              p.redraw();
            },
          };
          container.dataset.seed = String(seed);
          observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; refresh(); });
          observer.observe(container);
          resize = new ResizeObserver(() => {
            const w = Math.max(1, container.clientWidth);
            p.resizeCanvas(w, w * 1.16, true);
            p.redraw();
          });
          resize.observe(container);
          refresh();
          setReady(true);
        };
        p.draw = () => {
          if (disposed) return;
          const ctx = p.drawingContext as CanvasRenderingContext2D;
          p.clear();
          const ink = palettes[state.current.theme];
          const animate = running();
          if (animate) time += Math.min(p.deltaTime, 80) / 1000;
          p.push();
          p.scale(p.width / 500);
          for (const [index, plant] of plants.entries()) {
            const distance = pointer ? Math.hypot(pointer.x - plant.x, pointer.y - (plant.y - plant.height * .65)) : 999;
            const breeze = animate && pointer ? Math.max(0, 1 - distance / 150) * (pointer.x - plant.x) * .00024 : 0;
            bends[index] = animate ? bends[index] + (breeze - bends[index]) * .09 : 0;
            p.push();
            p.translate(plant.x, plant.y);
            p.rotate(animate ? Math.sin(time * .55 + plant.phase) * .006 + bends[index] : 0);
            for (const stroke of plant.strokes) {
              ctx.strokeStyle = ink[stroke.ink];
              ctx.lineWidth = stroke.width;
              ctx.globalAlpha = stroke.alpha;
              ctx.lineCap = "round";
              ctx.shadowColor = ink[stroke.ink];
              ctx.shadowBlur = state.current.theme === "dark" && ["coral", "apricot", "violet"].includes(stroke.ink) ? 1.6 : 0;
              ctx.stroke(stroke.path);
            }
            p.pop();
          }
          p.pop();
        };
      }, container);
      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch" || !running()) return;
        const rect = container.getBoundingClientRect();
        pointer = { x: (event.clientX - rect.left) / rect.width * 500, y: (event.clientY - rect.top) / rect.width * 500 };
      };
      const leave = () => { pointer = null; };
      container.addEventListener("pointermove", move, { passive: true });
      container.addEventListener("pointerleave", leave);
      destroy = () => {
        controls.current = null;
        observer?.disconnect();
        resize?.disconnect();
        container.removeEventListener("pointermove", move);
        container.removeEventListener("pointerleave", leave);
        instance.remove();
      };
    }).catch(() => {
      destroy?.();
      if (!disposed) setReady(false);
    });
    return () => { disposed = true; destroy?.(); };
  }, []);

  return <figure className="garden" aria-label="A botanical garden drawn in colored filaments: ferns, curled tendrils, and three flowers.">
    <div className="garden-plate">
      <div className="garden-imprint micro"><span>BOTANICAL STUDIES</span><span>FIG. 01</span></div>
      <div className="garden-surface" ref={host} data-ready={ready}>
        <svg className="garden-fallback" viewBox="0 0 500 580" fill="none" aria-hidden="true">
          {fallbackPlants.map((plant, i) => <g key={i} transform={`translate(${plant.x} ${plant.y})`}>{plant.strokes.filter((_, j) => j === 0 || j % 3 === 0).map((stroke, j) => <path key={j} d={stroke.d} className={`garden-ink-${stroke.ink}`} opacity={stroke.alpha} strokeWidth={stroke.width} strokeLinecap="round" />)}</g>)}
        </svg>
      </div>
    </div>
    <figcaption>
      <div className="garden-caption"><span className="hand-note">a few things, still growing.</span><span className="micro" aria-live="polite">PLANTING {String(edition).padStart(2, "0")}</span></div>
      <div className="garden-tools"><span className="micro">CULTIVATED WITH CODE</span><button type="button" disabled={!ready} onClick={() => { controls.current?.planting(); setEdition(e => e + 1); }}>Another planting <span aria-hidden="true">↻</span></button></div>
    </figcaption>
  </figure>;
}
