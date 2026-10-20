import type { CSSProperties } from "react";

type Filament = { d: string; color: string; opacity: number; width: number };
const tau = Math.PI * 2;
const fixed = (n: number) => n.toFixed(2);
const point = (angle: number, radius: number) => [230 + Math.cos(angle) * radius, 265 + Math.sin(angle) * radius];
const xy = ([x, y]: number[]) => `${fixed(x)} ${fixed(y)}`;

// Dispersal: an independent radial drawing, with branching plumes and a
// phyllotactic seed core. It shares only the book's ink palette with the cover.
function dispersal() {
  const filaments: Filament[] = [];
  for (let i = 0; i < 246; i++) {
    const angle = i / 246 * tau;
    const radius = 150 + 15 * Math.sin(angle * 5) + 9 * Math.sin(i * 1.73);
    const color = ['teal', 'violet', 'coral', 'apricot'][Math.floor(i / 62) % 4];
    const start = point(angle - .34, 35);
    const end = point(angle + .16, radius);
    filaments.push({ d: `M${xy(start)}C${xy(point(angle - .55, 83))} ${xy(point(angle + .4, radius * .85))} ${xy(end)}`, color, opacity: .55, width: .7 });
    // Each plume opens into a fan of hair-fine branches, rather than petals.
    for (let j = -2; j <= 2; j++) {
      const tipAngle = angle + .16 + j * .018;
      filaments.push({ d: `M${xy(point(angle + .04, radius * .73))}Q${xy(point(tipAngle + .12, radius * .96))} ${xy(point(tipAngle, radius + 12 + Math.sin(i * .7) * 7))}`, color, opacity: .24 + (j + 2) * .04, width: .5 });
    }
  }
  return filaments;
}
const filaments = dispersal();
const seeds = Array.from({ length: 233 }, (_, i) => {
  const angle = i * Math.PI * (3 - Math.sqrt(5));
  const radius = Math.sqrt(i) * 2.08;
  return { x: 230 + Math.cos(angle) * radius, y: 265 + Math.sin(angle) * radius, r: .75 + (i % 4) * .14 };
});
const drifting = [
  { x: 372, y: 81, angle: 29, size: 1 },
  { x: 411, y: 145, angle: 54, size: .65 },
  { x: 315, y: 42, angle: 12, size: .55 },
  { x: 106, y: 459, angle: 210, size: .7 },
];

export function ResearchArtwork() {
  return <figure className="research-artwork" aria-label="Dispersal: a circular seed head of teal, violet, and coral branching filaments, with a golden spiral core and drifting parachute seeds">
    <div className="garden-imprint micro"><span>DISPERSAL / A SEED STUDY</span><span>FIG. 02</span></div>
    <svg viewBox="0 0 460 520" fill="none" aria-hidden="true">
      <circle cx="230" cy="265" r="198" stroke="var(--rule)" strokeWidth=".6" strokeDasharray="1 7" />
      <path d="M230 54v12m-6-6h12M230 464v12m-6-6h12M19 265h12m-6-6v12M429 265h12m-6-6v12" stroke="var(--ink-faded)" strokeWidth=".6" opacity=".5" />
      <g className="research-flower-rotation">
        {filaments.map((line, i) => <path key={i} d={line.d} className={`garden-ink-${line.color}`} opacity={line.opacity} strokeWidth={line.width} strokeLinecap="round" />)}
        {seeds.map((seed, i) => <ellipse key={i} cx={seed.x} cy={seed.y} rx={seed.r} ry={seed.r * 1.45} transform={`rotate(${i * 137.508} ${seed.x} ${seed.y})`} stroke="var(--ochre)" strokeWidth=".65" opacity=".85" />)}
      </g>
      {drifting.map((seed, i) => <g key={i} transform={`translate(${seed.x} ${seed.y})`}>
        <g className="research-seed-drift" style={{
          "--drift-x": `${i % 2 ? -22 : 24}px`,
          "--drift-y": `${i === 2 ? -15 : -28}px`,
          "--flight-duration": `${9 + i * 1.7}s`,
          "--flight-delay": `${-i * 3.1}s`,
        } as CSSProperties}>
          <g transform={`rotate(${seed.angle}) scale(${seed.size})`}>
            <g>
              <path d="M0 0q6 18 0 36" className="garden-ink-stem" strokeWidth=".8" />
              <ellipse cx="0" cy="37" rx="1.6" ry="4" fill="var(--ochre)" />
              <g className="research-seed-plume">
                {Array.from({ length: 19 }, (_, j) => {
                  const a = Math.PI + j / 18 * Math.PI;
                  const x = Math.cos(a) * 19, y = Math.sin(a) * 14;
                  return <path key={j} d={`M0 0Q${fixed(x * .3)} ${fixed(y - 3)} ${fixed(x)} ${fixed(y)}`} strokeWidth=".65" opacity={.6 + (j % 4) * .1} />;
                })}
              </g>
            </g>
          </g>
        </g>
      </g>)}
      <path d="M272 443q22 9 48 5" stroke="var(--ink-faded)" opacity=".45" strokeWidth=".6" />
      <text x="325" y="451" fill="var(--ink-faded)" fontFamily="ui-monospace, monospace" fontSize="7" letterSpacing="1.3">233 SEEDS</text>
    </svg>
    <figcaption><p className="hand-note">an idea, carried a little further.</p><p className="micro">PATTERNS OF GROWTH / NO. 02</p></figcaption>
  </figure>;
}

