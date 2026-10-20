"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useNotebookMotion } from "./NotebookMotion";
import { FLOWER_COUNTS, GARDEN_SEED, gardenGeometry, type FlowerCount, type GardenInk } from "./garden-geometry";

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
  const [flowerCount, setFlowerCount] = useState<FlowerCount>(8);
  const [fallbackSeed, setFallbackSeed] = useState(GARDEN_SEED);
  const fallbackPlants = gardenGeometry(fallbackSeed, flowerCount);

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
      const randomCount = () => FLOWER_COUNTS[Math.floor(Math.random() * FLOWER_COUNTS.length)];
      let count = randomCount();
      let time = 0;
      let pointer: { x: number; y: number } | null = null;
      let observer: IntersectionObserver | undefined;
      let resize: ResizeObserver | undefined;
      const geometry = () => gardenGeometry(seed, count).map(plant => ({ ...plant, strokes: plant.strokes.map(stroke => ({ ...stroke, path: new Path2D(stroke.d) })) }));
      let plants = geometry();
      let bends = plants.map(() => 0);
      let bendVelocities = plants.map(() => 0);
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
              count = randomCount();
              setFlowerCount(count);
              seed += 997;
              setFallbackSeed(seed);
              plants = geometry();
              bends = plants.map(() => 0);
              bendVelocities = plants.map(() => 0);
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
          setFlowerCount(count);
          setReady(true);
        };
        p.draw = () => {
          if (disposed) return;
          const ctx = p.drawingContext as CanvasRenderingContext2D;
          p.clear();
          const ink = palettes[state.current.theme];
          const animate = running();
          const elapsed = Math.min(p.deltaTime, 50) / 1000;
          if (animate) time += Math.min(p.deltaTime, 80) / 1000;
          p.push();
          p.scale(p.width / 500);
          for (const [index, plant] of plants.entries()) {
            const distance = pointer ? Math.hypot(pointer.x - plant.x, pointer.y - Math.max(plant.y - plant.height, Math.min(plant.y - plant.height * .3, pointer.y))) : 999;
            const breeze = animate && pointer ? Math.max(-.18, Math.min(.18, Math.max(0, 1 - distance / 220) * (pointer.x - plant.x) * .003)) : 0;
            if (animate) {
              // Small time steps keep the spring smooth when the frame rate varies.
              const steps = Math.max(1, Math.ceil(elapsed * 120));
              const dt = elapsed / steps;
              for (let step = 0; step < steps; step++) {
                bendVelocities[index] += ((breeze - bends[index]) * 95 - bendVelocities[index] * 7) * dt;
                bends[index] += bendVelocities[index] * dt;
              }
            } else {
              bends[index] = 0;
              bendVelocities[index] = 0;
            }
            p.push();
            p.translate(plant.x, plant.y);
            p.rotate(animate ? (Math.sin(time * .85 + plant.phase) * .022 + Math.sin(time * 1.7 + plant.phase * 2) * .008) * Math.min(1, plant.height / 180) + bends[index] : 0);
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

  return <figure className="garden" aria-label={`A botanical garden drawn in colored filaments: ferns, curled tendrils, and ${flowerCount} flowers inspired by cosmos, daisies, poppies, and asters.`}>
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
