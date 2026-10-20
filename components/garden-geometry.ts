// Normalized print coordinates keep each planting intact across screen sizes.
export type GardenInk = "stem" | "teal" | "sage" | "coral" | "apricot" | "violet" | "gold";
export type GardenStroke = { d: string; ink: GardenInk; alpha: number; width: number };
export type GardenPlant = { x: number; y: number; height: number; phase: number; strokes: GardenStroke[] };
export const GARDEN_SEED = 10405;
export const FLOWER_COUNTS = [2, 3, 4, 8] as const;
export type FlowerCount = typeof FLOWER_COUNTS[number];
const TAU = Math.PI * 2;

export function gardenGeometry(seed: number, flowerCount: FlowerCount = 8): GardenPlant[] {
  let state = seed >>> 0;
  const random = (low = 0, high = 1) => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return low + (state / 4294967296) * (high - low);
  };
  const n = (v: number) => v.toFixed(2);
  const plants: GardenPlant[] = [];
  function plant(x: number, height: number, bend: number): GardenPlant {
    const p = { x: x + random(-9, 9), y: 506 + random(-8, 9), height, phase: random(0, TAU), strokes: [] as GardenStroke[] };
    p.strokes.push({ d: `M0 0Q${n(bend * .2)} ${n(-height * .5)} ${n(bend)} ${n(-height)}`, ink: "stem", alpha: .65, width: .95 });
    plants.push(p);
    return p;
  }
  function mark(p: GardenPlant, d: string, ink: GardenInk, alpha = .6, width = .65) {
    p.strokes.push({ d, ink, alpha, width });
  }
  function fern(x: number, height: number, bend: number, ink: GardenInk) {
    const p = plant(x, height, bend);
    for (let row = 1; row < 26; row++) {
      const t = row / 27;
      const bx = bend * t * t, by = -height * t;
      const reach = Math.sin(Math.PI * t) * height * .24;
      for (const side of [-1, 1]) {
        const ex = bx + side * reach, ey = by - 20 - reach * .38;
        mark(p, `M${n(bx)} ${n(by)}Q${n(bx + side * reach * .65)} ${n(by - 5)} ${n(ex)} ${n(ey)}`, ink, .8, .8);
        for (let k = 1; k < 9; k++) {
          const u = k / 10, lx = bx + side * reach * u, ly = by - (20 + reach * .38) * u * u;
          const length = Math.sin(u * Math.PI) * reach * .29;
          mark(p, `M${n(lx)} ${n(ly)}q${n(side * length * .6)} ${n(-length)} ${n(side * length)} ${n(-length * 1.5)}M${n(lx)} ${n(ly)}q${n(side * length)} 1 ${n(side * length * 1.4)} ${n(-length * .25)}`, ink, random(.32, .7), .55);
        }
      }
    }
  }
  fern(190, random(340, 370), -63, "teal");
  fern(319, random(245, 270), 71, "sage");
  fern(137, random(165, 185), -52, "teal");

  function bloom(x: number, height: number, bend: number, radius: number, ink: GardenInk, kind: number) {
    const p = plant(x, height, bend);
    const cx = bend, cy = -height;
    // Filament petals overlap like successive passes of colored ink.
    for (let i = 0; i < 115; i++) {
      const a = i / 115 * TAU;
      // Cosmos, daisies, poppies, and asters each have a distinct silhouette.
      const lobes = [8, 13, 4, 21][kind];
      const depth = [.23, .48, .16, .35][kind];
      const r = radius * (1 - depth + depth * Math.pow((1 + Math.cos(a * lobes)) / 2, .65)) * random(.95, 1.05);
      const ex = cx + Math.cos(a) * r, ey = cy + Math.sin(a) * r * (kind === 2 ? .65 : .88);
      const twist = .34 + Math.sin(a * 5) * .12;
      mark(p, `M${n(cx + Math.cos(a) * 5)} ${n(cy + Math.sin(a) * 5)}C${n(cx + Math.cos(a - twist) * r * .8)} ${n(cy + Math.sin(a - twist) * r * .65)} ${n(ex + Math.cos(a + 1.5) * 16)} ${n(ey + Math.sin(a + 1.5) * 13)} ${n(ex)} ${n(ey)}Q${n(cx + Math.cos(a + .15) * r * .65)} ${n(cy + Math.sin(a + .15) * r * .5)} ${n(cx + Math.cos(a + .4) * 7)} ${n(cy + Math.sin(a + .4) * 7)}`, i % 7 === 0 ? "gold" : ink, random(.3, .65), .65);
    }
    for (let i = 0; i < 23; i++) {
      const a = i * 2.4, r = Math.sqrt(i) * 1.4;
      const dx = cx + Math.cos(a) * r, dy = cy + Math.sin(a) * r;
      mark(p, `M${n(dx)} ${n(dy)}h.6`, "gold", .95, 2);
    }
    for (const t of [.28, .49]) {
      const bx = bend * t * t, by = -height * t, side = t < .4 ? -1 : 1;
      mark(p, `M${n(bx)} ${n(by)}q${side * 42} -53 ${side * 47} -78Q${n(bx - side * 4)} ${n(by - 58)} ${n(bx)} ${n(by)}`, "sage", .7, .8);
      for (let j = 1; j < 8; j++) mark(p, `M${n(bx)} ${n(by)}q${side * j * 5} -45 ${side * 47} -78`, "teal", .22, .5);
    }
  }
  // Separate tiers leave breathing room even in the fullest planting.
  const beds: [number, number, number, number, GardenInk, number][] = [
    [205, 314, 10, 40, "coral", 0],
    [302, 392, 12, 34, "apricot", 1],
    [346, 230, 30, 33, "violet", 3],
    [115, 260, -24, 32, "coral", 2],
    [395, 327, 5, 29, "gold", 1],
    [239, 190, -12, 31, "apricot", 2],
    [145, 397, -24, 29, "violet", 3],
    [286, 276, 8, 28, "coral", 0],
  ];
  for (const [x, height, bend, radius, ink, kind] of beds.slice(0, flowerCount)) {
    bloom(x, height + random(-10, 10), bend + random(-5, 5), radius * random(.92, 1.08), ink, kind);
  }

  for (let i = 0; i < 5; i++) {
    const h = random(140, 285), bend = random(-55, 55), p = plant(120 + i * 53, h, bend);
    let d = `M0 0Q${n(-bend)} ${n(-h * .8)} ${n(bend)} ${n(-h)}`;
    for (let k = 0; k < 65; k++) {
      const a = k / 64 * TAU * 1.4, r = 16 * (1 - k / 75);
      d += `L${n(bend + Math.sin(a) * r)} ${n(-h - 16 + Math.cos(a) * r)}`;
    }
    mark(p, d, i % 2 ? "violet" : "gold", .58, .7);
  }
  const seeds = plant(240, 0, 0);
  for (let i = 0; i < 70; i++) {
    const x = random(-158, 169), y = random(-45, 23);
    mark(seeds, `M${n(x)} ${n(y)}h.2`, i % 3 ? "gold" : "sage", random(.2, .65), random(1, 2.5));
  }
  return plants;
}
